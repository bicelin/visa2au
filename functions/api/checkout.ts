// POST /api/checkout — create a Stripe Checkout Session for invoice payments.
// Env: STRIPE_SECRET_KEY
// Body: JSON { amountAud: number, name?: string, invoice?: string }
//
// amountAud is the INVOICE amount (before the card fee). The server adds the card
// fee, so there is one source of truth for the arithmetic and the cap can never
// collide with it: previously the client sent base+fee while the server capped the
// total at 50000, which silently rejected every invoice above ~A$47,822.

import { issuerFor } from "../lib/origin";

interface Env {
  STRIPE_SECRET_KEY: string;
}

// Business rule: a single card payment may cover an invoice of up to A$30,000.
const MAX_INVOICE_AUD = 30000;
// Card surcharge passed to the payer, itemised on /pay before payment.
const CARD_FEE_RATE = 0.0455;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  let body: { amountAud?: number; name?: string; invoice?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const base = Number(body.amountAud);
  if (!Number.isFinite(base) || base <= 0) {
    return json({ ok: false, error: "Enter a valid invoice amount." }, 400);
  }
  if (base > MAX_INVOICE_AUD) {
    return json(
      {
        ok: false,
        error:
          "Card payments are limited to A$" +
          MAX_INVOICE_AUD.toLocaleString("en-AU") +
          " per invoice. For larger amounts please contact info@visa2.au to arrange a bank transfer.",
      },
      400
    );
  }
  const fee = Math.round(base * CARD_FEE_RATE * 100) / 100;
  const charge = Math.round((base + fee) * 100) / 100;
  const cents = Math.round(charge * 100);

  // Checkout Studio (fixed_by_ui) parameters. ui_mode defaults to hosted_page on this
  // API version; origin_context needs >= basil (2025-07-30) and integration_identifier
  // needs >= dahlia (2026-03-25), so both depend on the account's default API version.
  //
  // Deliberate deviations from the Checkout Studio field intents:
  //  - payment_method_collection is OMITTED (intent says "always") per the spec rule
  //    that it applies only when mode is "subscription"; ours is "payment".
  //  - metadata[*] is KEPT although absent from the field intents. Those are our own
  //    bookkeeping keys for invoice reconciliation, not Checkout Studio settings, so
  //    removing them would lose the invoiced-vs-charged audit trail for no benefit.
  const origin = issuerFor(request);
  const params = new URLSearchParams({
    mode: "payment",
    ui_mode: "hosted_page",
    success_url: `${origin}/pay?paid=1`,
    cancel_url: `${origin}/pay?cancelled=1`,
    billing_address_collection: "auto",
    "phone_number_collection[enabled]": "false",
    "automatic_tax[enabled]": "false",
    allow_promotion_codes: "false",
    submit_type: "auto",
    "name_collection[individual][enabled]": "true",
    "name_collection[individual][optional]": "true",
    integration_identifier: "hosted_web_0001",
    origin_context: "web",
    "line_items[0][price_data][currency]": "aud",
    "line_items[0][price_data][unit_amount]": String(cents),
    "line_items[0][price_data][product_data][name]": body.invoice
      ? `Visa2AU invoice ${body.invoice}`
      : "Visa2AU invoice payment",
    "line_items[0][quantity]": "1",
    "metadata[payer_name]": (body.name || "").slice(0, 200),
    "metadata[invoice]": (body.invoice || "").slice(0, 100),
    "metadata[invoice_amount_aud]": base.toFixed(2),
    "metadata[card_fee_aud]": fee.toFixed(2),
    "metadata[total_charged_aud]": charge.toFixed(2),
  });

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const d = (await r.json()) as { url?: string; error?: { message?: string } };
  if (!r.ok || !d.url) return json({ ok: false, error: d.error?.message || "Stripe error" }, 502);

  return json({ ok: true, url: d.url });
};
