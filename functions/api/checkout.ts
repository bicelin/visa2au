// POST /api/checkout — create a Stripe Checkout Session for invoice payments (variable amount).
// Env: STRIPE_SECRET_KEY (test key on staging)
// Body: JSON { amountAud: number, name?: string, invoice?: string }

interface Env {
  STRIPE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  let body: { amountAud?: number; name?: string; invoice?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const amount = Number(body.amountAud);
  if (!amount || amount <= 0 || amount > 50000) return json({ ok: false, error: "Invalid amount" }, 400);
  const cents = Math.round(amount * 100);

  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/pay.html?paid=1`,
    cancel_url: `${origin}/pay.html?cancelled=1`,
    "line_items[0][price_data][currency]": "aud",
    "line_items[0][price_data][unit_amount]": String(cents),
    "line_items[0][price_data][product_data][name]": body.invoice
      ? `Visa2AU invoice ${body.invoice}`
      : "Visa2AU invoice payment",
    "line_items[0][quantity]": "1",
    "metadata[payer_name]": (body.name || "").slice(0, 200),
    "metadata[invoice]": (body.invoice || "").slice(0, 100),
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
