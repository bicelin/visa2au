// POST /api/donate — create a Stripe Checkout Session for a donation of a CHOSEN amount.
//
// Why this exists instead of a Payment Link: the donate page offers $50 / $100 / $250
// buttons plus a custom amount and relabels its button "Donate A$250 ->", but a Payment
// Link charges a fixed amount configured in the dashboard and cannot receive an amount
// through its URL. With a Payment Link the selection was decorative and donors could be
// charged the wrong amount. A Checkout Session carries the exact amount the donor picked.
//
// Deliberate choice: NO card surcharge for donations. The 4.55% fee on /pay is passed to
// the client paying an invoice; absorbing it on a voluntary donation is the normal
// courtesy. Change CARD_FEE_RATE below if that should ever change.
//
// Body: JSON { amountAud: number }
// Env: STRIPE_SECRET_KEY

import { issuerFor } from "../lib/origin";

interface Env {
  STRIPE_SECRET_KEY?: string;
}

const MIN_DONATION_AUD = 1;
// Guards against a fat-fingered amount and caps what a bot can put through checkout.
const MAX_DONATION_AUD = 10000;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  let body: { amountAud?: number };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const amount = Number(body.amountAud);
  if (!Number.isFinite(amount) || amount < MIN_DONATION_AUD) {
    return json({ ok: false, error: "Please enter a donation amount." }, 400);
  }
  if (amount > MAX_DONATION_AUD) {
    return json(
      {
        ok: false,
        error:
          "Online donations are limited to A$" +
          MAX_DONATION_AUD.toLocaleString("en-AU") +
          ". For a larger gift please contact info@visa2.au.",
      },
      400
    );
  }
  if (!env.STRIPE_SECRET_KEY) {
    return json({ ok: false, error: "Payment provider not configured" }, 500);
  }

  const cents = Math.round(amount * 100);
  const origin = issuerFor(request);

  const params = new URLSearchParams({
    mode: "payment",
    ui_mode: "hosted", // pre-dahlia equivalent of hosted_page; see functions/api/checkout.ts
    success_url: `${origin}/donate?thanks=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/donate?cancelled=1`,
    submit_type: "donate",
    billing_address_collection: "auto",
    "phone_number_collection[enabled]": "false",
    "automatic_tax[enabled]": "false",
    allow_promotion_codes: "false",
    "line_items[0][price_data][currency]": "aud",
    "line_items[0][price_data][unit_amount]": String(cents),
    "line_items[0][price_data][product_data][name]": "Donation to Visa2AU",
    "line_items[0][quantity]": "1",
    "metadata[kind]": "donation",
    "metadata[donation_amount_aud]": amount.toFixed(2),
  });

  let r: Response;
  try {
    r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // URLSearchParams percent-encodes braces; Stripe only substitutes the LITERAL token.
      body: params.toString().replace(/%7BCHECKOUT_SESSION_ID%7D/gi, "{CHECKOUT_SESSION_ID}"),
    });
  } catch {
    return json({ ok: false, error: "Could not reach the payment provider." }, 500);
  }

  const d = (await r.json()) as { url?: string; error?: { message?: string } };
  if (!r.ok || !d.url) {
    // 4xx = our parameters were rejected; surface Stripe's reason. Avoid 502: Cloudflare
    // rewrites it into an opaque text/plain body.
    const msg = d.error?.message || "Payment provider error";
    return json({ ok: false, error: msg }, r.status >= 400 && r.status < 500 ? 400 : 500);
  }

  return json({ ok: true, url: d.url });
};
