// Exercises the real handler: signature, parsing, and the donation/invoice branches.
// Run: node scripts/tests/stripe-webhook.test.mts
// fetch is stubbed so nothing leaves the machine and no email is sent.
import { onRequestPost } from "../../functions/api/stripe-webhook.ts";

const SECRET = "whsec_test_secret";
let sent: any[] = [];
(globalThis as any).fetch = async (_url: string, init: any) => {
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

const env = {
  STRIPE_WEBHOOK_SECRET: SECRET,
  RESEND_API_KEY: "re_test",
  NOTIFY_TO: "info@visa2.au, accounts@visa2.au",
  FROM_EMAIL: "website@visa2.au",
};

async function call(type: string, object: any, opts: { ts?: number; tamper?: boolean } = {}) {
  const ts = opts.ts ?? Math.floor(Date.now() / 1000);
  const body = JSON.stringify({ id: "evt_test", type, data: { object } });
  let header = `t=${ts},v1=${await sign(body, ts)}`;
  if (opts.tamper) header = header.replace(/v1=./, "v1=f");
  const request = new Request("https://visa2.au/api/stripe-webhook", {
    method: "POST", body, headers: { "stripe-signature": header },
  });
  const res = await onRequestPost({ request, env } as any);
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
sent = [];
let r = await call("checkout.session.completed", donation);
check("donation: 200", r.status === 200, JSON.stringify(r));
check("donation: one email", sent.length === 1, `sent=${sent.length}`);
check("donation: subject names a donation", /💚 Donation received — AUD 250\.00 — Jane <Donor>/.test(sent[0]?.subject || ""), sent[0]?.subject);
check("donation: no 'no invoice number'", !/no invoice number/.test(JSON.stringify(sent[0] ?? {})), "");
check("donation: no invoice/fee rows", !/Card fee|Invoice amount/.test(sent[0]?.html || ""), "");
check("donation: amount shown", /AUD 250\.00/.test(sent[0]?.html || ""), "");
check("donation: both recipients", JSON.stringify(sent[0]?.to) === JSON.stringify(["info@visa2.au", "accounts@visa2.au"]), JSON.stringify(sent[0]?.to));
check("donation: payer html-escaped", /Jane &lt;Donor&gt;/.test(sent[0]?.html || ""), "not escaped");

// 2. invoice payment unchanged
sent = [];
r = await call("checkout.session.completed", invoice);
check("invoice: 200", r.status === 200);
check("invoice: subject keeps invoice no.", /✅ Payment received — INV-1042 — AUD 470\.96/.test(sent[0]?.subject || ""), sent[0]?.subject);
check("invoice: fee row present", /Card fee/.test(sent[0]?.html || ""), "");
check("invoice: taxed amounts present", /A\$45000\.00/.test(sent[0]?.html || ""), "");
check("invoice: no donation wording", !/Donation/.test(sent[0]?.html || ""), "");

// 3. failed payment still notifies
sent = [];
r = await call("checkout.session.async_payment_failed", { ...donation, payment_status: "unpaid" });
check("failed donation: 200", r.status === 200);
check("failed donation: warning subject", /⚠️ Donation not completed/.test(sent[0]?.subject || ""), sent[0]?.subject);

// 4. delayed settlement note
sent = [];
r = await call("checkout.session.async_payment_succeeded", invoice);
check("async settled: note row", /Delayed payment method settled/.test(sent[0]?.html || ""), "");

// 5. security
r = await call("checkout.session.completed", donation, { tamper: true });
check("tampered signature -> 400", r.status === 400, JSON.stringify(r));
r = await call("checkout.session.completed", donation, { ts: Math.floor(Date.now() / 1000) - 3600 });
check("stale timestamp -> 400", r.status === 400, JSON.stringify(r));

// 6. uninteresting events acknowledged, no email
sent = [];
r = await call("customer.created", { id: "cus_1" });
check("other event: 200 ignored", r.status === 200 && r.body.ignored === "customer.created", JSON.stringify(r));
check("other event: no email", sent.length === 0, `sent=${sent.length}`);

// 7. missing secret -> 500 so Stripe retries
const res = await onRequestPost({
  request: new Request("https://x/api/stripe-webhook", { method: "POST", body: "{}" }),
  env: { ...env, STRIPE_WEBHOOK_SECRET: undefined },
} as any);
check("no secret -> 500", res.status === 500, String(res.status));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
