// Exercises the real handlers: webhook signature/parsing/recording/dedupe, and the
// catch-up job against a stubbed Stripe list.
// Run: node scripts/tests/stripe-webhook.test.mts
// fetch is stubbed so nothing leaves the machine and no email is sent.
import { onRequestPost } from "../../functions/api/stripe-webhook.ts";
import { onRequestGet as reconcile } from "../../functions/api/stripe-reconcile.ts";

const SECRET = "whsec_test_secret";
const TOKEN = "reconcile_test_token";

let sent: any[] = [];
let listBody: any = { data: [], has_more: false };
const store = new Map<string, string>();

const ENQUIRIES = {
  get: async (key: string) =>
    store.has(key) ? { json: async () => JSON.parse(store.get(key) as string) } : null,
  put: async (key: string, body: any) => {
    store.set(key, typeof body === "string" ? body : JSON.stringify(body));
  },
};

(globalThis as any).fetch = async (url: string, init: any) => {
  if (String(url).includes("api.stripe.com")) {
    return new Response(JSON.stringify(listBody), { status: 200 });
  }
  sent.push(JSON.parse(init.body));
  return new Response("{}", { status: 200 });
};

async function sign(body: string, ts: number) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${ts}.${body}`));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const env = () => ({
  STRIPE_WEBHOOK_SECRET: SECRET,
  RESEND_API_KEY: "re_test",
  NOTIFY_TO: "info@visa2.au, accounts@visa2.au",
  FROM_EMAIL: "website@visa2.au",
  STRIPE_SECRET_KEY: "sk_test_x",
  RECONCILE_TOKEN: TOKEN,
  ENQUIRIES,
});

async function call(type: string, object: any, opts: { ts?: number; tamper?: boolean } = {}) {
  const ts = opts.ts ?? Math.floor(Date.now() / 1000);
  const body = JSON.stringify({ id: "evt_test", type, data: { object } });
  let header = `t=${ts},v1=${await sign(body, ts)}`;
  if (opts.tamper) header = header.replace(/v1=./, "v1=f");
  const request = new Request("https://visa2.au/api/stripe-webhook", {
    method: "POST", body, headers: { "stripe-signature": header },
  });
  const res = await onRequestPost({ request, env: env() } as any);
  return { status: res.status, body: await res.json() };
}

const donation = {
  id: "cs_test_don", payment_status: "paid", amount_total: 25000, currency: "aud",
  customer_details: { name: "Jane <Donor>", email: "jane@example.com" },
  metadata: { kind: "donation", donation_amount_aud: "250.00" },
};
const invoice = {
  id: "cs_test_inv", payment_status: "paid", amount_total: 47096, currency: "aud",
  customer_details: { name: "John Payer", email: "john@example.com" },
  metadata: { invoice: "INV-1042", invoice_amount_aud: "45000.00", card_fee_aud: "2096.00", payer_name: "John Payer" },
};

let pass = 0, fail = 0;
const check = (name: string, cond: boolean, detail = "") => {
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : " :: " + detail}`);
  cond ? pass++ : fail++;
};

// 1. donation
sent = []; store.clear();
let r = await call("checkout.session.completed", donation);
check("donation: 200", r.status === 200, JSON.stringify(r));
check("donation: one email", sent.length === 1, `sent=${sent.length}`);
check("donation: subject names a donation", /💚 Donation received — AUD 250\.00 — Jane <Donor>/.test(sent[0]?.subject || ""), sent[0]?.subject);
check("donation: no 'no invoice number'", !/no invoice number/.test(JSON.stringify(sent[0] ?? {})), "");
check("donation: no invoice/fee rows", !/Card fee|Invoice amount/.test(sent[0]?.html || ""), "");
check("donation: amount shown", /AUD 250\.00/.test(sent[0]?.html || ""), "");
check("donation: both recipients", JSON.stringify(sent[0]?.to) === JSON.stringify(["info@visa2.au", "accounts@visa2.au"]), JSON.stringify(sent[0]?.to));
check("donation: payer html-escaped", /Jane &lt;Donor&gt;/.test(sent[0]?.html || ""), "not escaped");
check("donation: recorded as notified", JSON.parse(store.get("payments/cs_test_don.json") || "{}").notified === true, store.get("payments/cs_test_don.json") || "no record");

// 2. a repeated delivery must not email twice
r = await call("checkout.session.completed", donation);
check("duplicate: acknowledged", r.status === 200 && r.body.duplicate === true, JSON.stringify(r));
check("duplicate: no second email", sent.length === 1, `sent=${sent.length}`);

// 3. invoice payment unchanged
sent = []; store.clear();
r = await call("checkout.session.completed", invoice);
check("invoice: 200", r.status === 200);
check("invoice: subject keeps invoice no.", /✅ Payment received — INV-1042 — AUD 470\.96/.test(sent[0]?.subject || ""), sent[0]?.subject);
check("invoice: fee row present", /Card fee/.test(sent[0]?.html || ""), "");
check("invoice: taxed amounts present", /A\$45000\.00/.test(sent[0]?.html || ""), "");
check("invoice: no donation wording", !/Donation/.test(sent[0]?.html || ""), "");

// 4. failed payment still notifies
sent = [];
r = await call("checkout.session.async_payment_failed", { ...donation, id: "cs_test_fail", payment_status: "unpaid" });
check("failed donation: 200", r.status === 200);
check("failed donation: warning subject", /⚠️ Donation not completed/.test(sent[0]?.subject || ""), sent[0]?.subject);

// 5. delayed settlement note. A fresh store: for a session already notified, the
// async_payment_succeeded delivery is a duplicate and must NOT email twice.
sent = []; store.clear();
r = await call("checkout.session.async_payment_succeeded", invoice);
check("async settled: note row", /Delayed payment method settled/.test(sent[0]?.html || ""), "");

// 5b. and the duplicate case: same session already notified -> no second email
sent = [];
r = await call("checkout.session.async_payment_succeeded", invoice);
check("async settled after completed: no duplicate email", r.body.duplicate === true && sent.length === 0, JSON.stringify(r));

// 6. security
r = await call("checkout.session.completed", donation, { tamper: true });
check("tampered signature -> 400", r.status === 400, JSON.stringify(r));
r = await call("checkout.session.completed", donation, { ts: Math.floor(Date.now() / 1000) - 3600 });
check("stale timestamp -> 400", r.status === 400, JSON.stringify(r));

// 7. uninteresting events acknowledged, no email
sent = [];
r = await call("customer.created", { id: "cus_1" });
check("other event: 200 ignored", r.status === 200 && r.body.ignored === "customer.created", JSON.stringify(r));
check("other event: no email", sent.length === 0, `sent=${sent.length}`);

// 8. missing secret -> 500 so Stripe retries
const res = await onRequestPost({
  request: new Request("https://x/api/stripe-webhook", { method: "POST", body: "{}" }),
  env: { ...env(), STRIPE_WEBHOOK_SECRET: undefined },
} as any);
check("no secret -> 500", res.status === 500, String(res.status));

// 9. catch-up job: the payment that never got a webhook
sent = []; store.clear();
listBody = {
  has_more: false,
  data: [
    { ...invoice, id: "cs_test_missed", amount_total: 33000 },
    { ...donation, id: "cs_test_seen" },
  ],
};
await ENQUIRIES.put("payments/cs_test_seen.json", JSON.stringify({ session_id: "cs_test_seen", notified: true }));

const rq = (q: string, headers: Record<string, string> = {}) =>
  reconcile({ request: new Request(`https://visa2.au/api/stripe-reconcile${q}`, { headers }), env: env() } as any);

let rr = await rq("?days=7", { "x-reconcile-token": "wrong" });
check("reconcile: bad token -> 401", rr.status === 401, String(rr.status));
rr = await rq("?days=7");
check("reconcile: no token -> 401", rr.status === 401, String(rr.status));

rr = await rq("?days=7&dry=1", { "x-reconcile-token": TOKEN });
let body = await rr.json();
check("reconcile dry: reports without sending", body.would_notify === 1 && sent.length === 0, JSON.stringify(body));
check("reconcile dry: writes nothing", !store.has("payments/cs_test_missed.json"), "record written on a dry run");

rr = await rq("?days=7", { "x-reconcile-token": TOKEN });
body = await rr.json();
check("reconcile: notifies the missed payment", body.notified === 1, JSON.stringify(body));
check("reconcile: one email", sent.length === 1, `sent=${sent.length}`);
check("reconcile: email names the amount", /AUD 330\.00/.test(JSON.stringify(sent[0] ?? {})), sent[0]?.subject);
check("reconcile: email says catch-up", /catch-up job/.test(sent[0]?.html || ""), "");
check("reconcile: skips the already-notified one", body.sessions.some((s: any) => s.session_id === "cs_test_seen" && s.action === "already notified"), JSON.stringify(body.sessions));

sent = [];
rr = await rq("?days=7", { "x-reconcile-token": TOKEN });
body = await rr.json();
check("reconcile is idempotent", sent.length === 0 && body.notified === 0, JSON.stringify(body));

const unconfigured = await reconcile({
  request: new Request("https://x/api/stripe-reconcile?token=x"),
  env: { ...env(), RECONCILE_TOKEN: undefined },
} as any);
check("reconcile unconfigured -> 500", unconfigured.status === 500, String(unconfigured.status));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
