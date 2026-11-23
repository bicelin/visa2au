// POST /api/stripe-webhook — Stripe webhook receiver.
//
// This is a server-to-server endpoint, NOT a page: Stripe calls it directly after a
// payment. It never appears in navigation, the sitemap or robots.txt.
//
// Why it exists: /pay?paid=1 is only a redirect — it proves nothing. Without a webhook
// there is no durable record that money arrived, so a client could pay a A$30,000
// invoice and the office would never be told if they closed the browser before the
// redirect. This records every completed payment and emails the office.
//
// Signature: Stripe sends `Stripe-Signature: t=<unix>,v1=<hex>` where
// v1 = HMAC-SHA256(secret, "<t>.<rawBody>"). This is the same scheme the existing
// ElevenLabs webhook uses, so the helpers below match functions/api/voice-webhook.ts.
//
// Env: STRIPE_WEBHOOK_SECRET (required in production),
//      RESEND_API_KEY?, NOTIFY_TO?, FROM_EMAIL?

interface Env {
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
}

// Stripe's default tolerance is 300s. A wider window would let a captured request be
// replayed for longer; a narrower one breaks on clock skew or a slow retry.
const TOLERANCE_SECONDS = 300;

async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const ua = new Uint8Array(ha);
  const ub = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

async function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string
): Promise<boolean> {
  if (!header) return false;
  const params = new Map<string, string>();
  for (const kv of header.split(",")) {
    const i = kv.indexOf("=");
    if (i > 0) params.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim());
  }
  const ts = params.get("t") || "";
  if (!/^\d+$/.test(ts)) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > TOLERANCE_SECONDS) return false;
  const expected = await hmacHex(secret, `${ts}.${rawBody}`);
  // Stripe may send multiple v1 signatures during secret rotation; accept any match.
  for (const [k, v] of params.entries()) {
    if (k.startsWith("v") && (await safeEqual(expected.toLowerCase(), v.toLowerCase()))) {
      return true;
    }
  }
  return false;
}

interface SessionObject {
  id?: string;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  customer_details?: { email?: string | null; name?: string | null };
  metadata?: Record<string, string> | null;
}

const money = (cents: number | null | undefined, currency: string | null | undefined) => {
  if (typeof cents !== "number") return "unknown";
  const cur = (currency || "aud").toUpperCase();
  return `${cur} ${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  // The raw body MUST be read as text before parsing: the signature covers the exact bytes.
  const rawBody = await request.text();

  if (!env.STRIPE_WEBHOOK_SECRET) {
    // Misconfiguration, not a bad request. 500 makes Stripe retry once the secret is set.
    return json({ ok: false, error: "STRIPE_WEBHOOK_SECRET not configured" }, 500);
  }

  const valid = await verifySignature(
    rawBody,
    request.headers.get("stripe-signature"),
    env.STRIPE_WEBHOOK_SECRET
  );
  if (!valid) return json({ ok: false, error: "invalid signature" }, 400);

  let event: { id?: string; type?: string; data?: { object?: SessionObject } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, error: "invalid JSON" }, 400);
  }

  const type = event.type || "";
  const s = event.data?.object || {};

  // Acknowledge everything we do not act on, so Stripe stops retrying.
  const handled = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
  ];
  if (!handled.includes(type)) return json({ ok: true, ignored: type });

  const paid = s.payment_status === "paid";
  const invoice = s.metadata?.invoice || "(no invoice number)";
  const payer = s.customer_details?.name || s.metadata?.payer_name || "(no name)";
  const email = s.customer_details?.email || "(no email)";
  const total = money(s.amount_total, s.currency);
  const invoiced = s.metadata?.invoice_amount_aud ? `A$${s.metadata.invoice_amount_aud}` : "unknown";
  const fee = s.metadata?.card_fee_aud ? `A$${s.metadata.card_fee_aud}` : "unknown";

  // Structured log — visible in `wrangler pages deployment tail`. This is the durable
  // record in the absence of a database.
  console.log(
    JSON.stringify({
      tag: "stripe_payment",
      event: type,
      event_id: event.id,
      session_id: s.id,
      paid,
      invoice,
      payer,
      email,
      total,
      invoiced,
      fee,
    })
  );

  // Notify the office. Best-effort: a mail failure must not make Stripe retry forever.
  // Notify on BOTH outcomes: a failed A$30,000 payment is worth knowing about, and the
  // subject/html below already branch on `paid`. Guarding on `paid` here made the
  // failure branch unreachable.
  if (env.RESEND_API_KEY && env.NOTIFY_TO) {
    const from = env.FROM_EMAIL || "website@visa2.au";
    // Comma-separated so the office can notify several people (e.g. accounts + the agent).
    const recipients = env.NOTIFY_TO.split(",").map((t) => t.trim()).filter(Boolean);
    const subject = paid
      ? `✅ Payment received — ${invoice} — ${total}`
      : `⚠️ Payment not completed — ${invoice}`;
    const html = `
      <h2>${paid ? "Payment received" : "Payment not completed"}</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
        <tr><td><b>Invoice</b></td><td>${invoice}</td></tr>
        <tr><td><b>Payer</b></td><td>${payer}</td></tr>
        <tr><td><b>Email</b></td><td>${email}</td></tr>
        <tr><td><b>Invoice amount</b></td><td>${invoiced}</td></tr>
        <tr><td><b>Card fee</b></td><td>${fee}</td></tr>
        <tr><td><b>Total charged</b></td><td>${total}</td></tr>
        <tr><td><b>Stripe session</b></td><td><code>${s.id || ""}</code></td></tr>
        <tr><td><b>Status</b></td><td>${s.payment_status || ""}</td></tr>
      </table>
      <p style="font-family:system-ui,sans-serif;font-size:13px;color:#555">
        Reconcile in the Stripe dashboard. This notification is generated from a verified
        Stripe webhook, not from a browser redirect.
      </p>`;
    try {
      const er = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: `Visa2AU Payments <${from}>`, to: recipients, subject, html }),
      });
      if (!er.ok) {
        console.log(JSON.stringify({ tag: "stripe_payment", mail_error: (await er.text()).slice(0, 200) }));
      }
    } catch (e) {
      console.log(JSON.stringify({ tag: "stripe_payment", mail_exception: String(e).slice(0, 200) }));
    }
  }

  return json({ ok: true, received: type, paid });
};
