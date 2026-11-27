// POST /api/stripe-webhook — Stripe webhook receiver.
//
// This is a server-to-server endpoint, NOT a page: Stripe calls it directly after a
// payment. It never appears in navigation, the sitemap or robots.txt.
//
// Why it exists: /pay?paid=1 is only a redirect — it proves nothing. Without a webhook
// there is no durable record that money arrived, so a client could pay a A$30,000
// invoice and the office would never be told if they closed the browser before the
// redirect. This records every completed payment in R2 and emails the office.
//
// A webhook can also be missed (unset secret, failed delivery), so the record written
// here is what /api/stripe-reconcile reads to find anything that slipped by.
//
// Signature: Stripe sends `Stripe-Signature: t=<unix>,v1=<hex>` where
// v1 = HMAC-SHA256(secret, "<t>.<rawBody>"). This is the same scheme the existing
// ElevenLabs webhook uses, so the helpers below match functions/api/voice-webhook.ts.
//
// Env: STRIPE_WEBHOOK_SECRET (required in production), ENQUIRIES (R2),
//      RESEND_API_KEY?, NOTIFY_TO?, FROM_EMAIL?

import {
  readRecord,
  sendPaymentEmail,
  toRecord,
  writeRecord,
  type SessionObject,
} from "../lib/stripe-notify.ts";

interface Env {
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
  ENQUIRIES: R2Bucket;
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

  // Stripe retries on any non-2xx and can deliver the same event twice. The record is
  // the idempotency key: once a payment is marked notified, a repeat delivery
  // acknowledges without sending a second email.
  const existing = s.id ? await readRecord(env.ENQUIRIES, s.id) : null;
  if (existing?.notified) {
    console.log(
      JSON.stringify({ tag: "stripe_payment", event: type, session_id: s.id, duplicate: true })
    );
    return json({ ok: true, received: type, duplicate: true, paid: existing.paid });
  }

  const rec = toRecord(s, type, event.id);
  // Structured log — visible in `wrangler pages deployment tail`.
  console.log(JSON.stringify({ tag: "stripe_payment", ...rec }));

  // Notify on BOTH outcomes: a failed A$30,000 payment is worth knowing about, and the
  // subject/html already branch on `paid`.
  const mail = s.id ? await sendPaymentEmail(env, s, type) : { ok: false, error: "no session id" };
  if (!mail.ok) {
    console.log(
      JSON.stringify({ tag: "stripe_payment", session_id: s.id, notify_error: mail.error })
    );
  }

  // Record the payment either way: one the office could not be emailed about must still
  // leave a trace, and notified=false lets the catch-up job retry it.
  if (s.id) {
    await writeRecord(env.ENQUIRIES, {
      ...rec,
      notified: mail.ok,
      ...(mail.ok ? {} : { notify_error: mail.error }),
    });
  }

  return json({ ok: true, received: type, paid: rec.paid, notified: mail.ok });
};
