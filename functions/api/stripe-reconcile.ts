// GET|POST /api/stripe-reconcile — catch-up for payment notifications that never went out.
//
// The webhook is the normal path, but it can fail: an unset signing secret, an errored
// delivery, or an endpoint added after the payment happened. In those cases a real payment
// exists only inside Stripe, so nothing on our side records it and no email arrives.
//
// This asks Stripe which checkouts are paid, compares them with the R2 records the
// webhook writes, then records and emails any paid session with no notified record. It is
// idempotent: a session already notified is skipped, so running it repeatedly is safe.
//
// Env: STRIPE_SECRET_KEY, RECONCILE_TOKEN (guards this endpoint), ENQUIRIES (R2),
//      RESEND_API_KEY?, NOTIFY_TO?, FROM_EMAIL?
// Query: ?days=7 (default 7, max 30), ?dry=1 to report without sending or writing.

import {
  readRecord,
  sendPaymentEmail,
  toRecord,
  writeRecord,
  type SessionObject,
} from "../lib/stripe-notify.ts";

interface Env {
  STRIPE_SECRET_KEY?: string;
  RECONCILE_TOKEN?: string;
  RESEND_API_KEY?: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
  ENQUIRIES: R2Bucket;
}

const MAX_DAYS = 30;

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
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

interface StripeList {
  data?: SessionObject[];
  has_more?: boolean;
}

const handler = async ({ request, env }: { request: Request; env: Env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  const url = new URL(request.url);
  const token = request.headers.get("x-reconcile-token") || url.searchParams.get("token") || "";
  const dry = url.searchParams.get("dry") === "1";
  const days = Math.min(Math.max(Number(url.searchParams.get("days") || 7) || 7, 1), MAX_DAYS);

  if (!env.STRIPE_SECRET_KEY || !env.RECONCILE_TOKEN) {
    return json(
      { ok: false, error: "STRIPE_SECRET_KEY and RECONCILE_TOKEN must be configured" },
      500
    );
  }
  if (!(await timingSafeEqual(token, env.RECONCILE_TOKEN))) {
    return json({ ok: false, error: "unauthorised" }, 401);
  }

  const since = Math.floor(Date.now() / 1000) - days * 24 * 3600;
  const found: SessionObject[] = [];
  let startingAfter = "";
  // Stripe caps a page at 100; two or three pages cover any realistic week here.
  for (let page = 0; page < 5; page++) {
    const qs = new URLSearchParams({ limit: "100", "created[gte]": String(since) });
    if (startingAfter) qs.set("starting_after", startingAfter);
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
    });
    if (!r.ok) {
      return json({ ok: false, error: "Stripe list failed", detail: (await r.text()).slice(0, 200) }, 502);
    }
    const body = (await r.json()) as StripeList;
    const data = body.data || [];
    found.push(...data);
    if (!body.has_more || data.length === 0) break;
    startingAfter = data[data.length - 1].id || "";
    if (!startingAfter) break;
  }

  const paid = found.filter((s) => s.payment_status === "paid" && s.id);
  const reported: { session_id: string; amount: number | null; currency: string | null; action: string }[] = [];

  for (const s of paid) {
    const id = s.id as string;
    const rec = await readRecord(env.ENQUIRIES, id);
    if (rec?.notified) {
      reported.push({ session_id: id, amount: s.amount_total ?? null, currency: s.currency ?? null, action: "already notified" });
      continue;
    }
    if (dry) {
      reported.push({ session_id: id, amount: s.amount_total ?? null, currency: s.currency ?? null, action: "would notify" });
      continue;
    }
    // No webhook record (or one that never got its email): report it as a catch-up.
    const type = rec ? "checkout.session.completed" : "reconciled";
    const mail = await sendPaymentEmail(env, s, type);
    await writeRecord(env.ENQUIRIES, {
      ...toRecord(s, type, undefined),
      notified: mail.ok,
      ...(mail.ok ? {} : { notify_error: mail.error }),
    });
    console.log(
      JSON.stringify({ tag: "stripe_reconcile", session_id: id, type, ok: mail.ok, error: mail.error })
    );
    reported.push({
      session_id: id,
      amount: s.amount_total ?? null,
      currency: s.currency ?? null,
      action: mail.ok ? "notified" : `notify failed: ${mail.error}`,
    });
  }

  const notified = reported.filter((r) => r.action === "notified").length;
  const wouldNotify = reported.filter((r) => r.action === "would notify").length;
  return json({
    ok: true,
    dry,
    days,
    checked: found.length,
    paid: paid.length,
    notified,
    would_notify: wouldNotify,
    sessions: reported,
  });
};

export const onRequestGet = handler;
export const onRequestPost = handler;
