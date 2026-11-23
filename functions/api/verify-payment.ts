// GET /api/verify-payment?session_id=cs_... — confirm a Checkout Session was actually paid.
//
// Why this exists: /pay?paid=1 is just a redirect. Anyone can visit it, so until now the
// confirmation banner proved nothing and a client could believe they had paid an invoice
// they had not. The success page now calls this endpoint, which asks Stripe directly.
//
// Only non-sensitive fields are returned. The session ID is unguessable and is already in
// the payer's own URL, so it acts as the bearer token for this one lookup.
//
// Env: STRIPE_SECRET_KEY

interface Env {
  STRIPE_SECRET_KEY?: string;
}

// Stripe Checkout Session IDs: cs_test_… / cs_live_… followed by a long alphanumeric run.
const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

interface StripeSession {
  id?: string;
  payment_status?: string;
  status?: string;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null; name?: string | null };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";

  // Validate the shape before it reaches the network: this value is attacker-controlled.
  if (!SESSION_ID_RE.test(sessionId)) {
    return json({ ok: false, paid: false, error: "invalid session id" }, 400);
  }
  if (!env.STRIPE_SECRET_KEY) {
    return json({ ok: false, paid: false, error: "payment provider not configured" }, 500);
  }

  let r: Response;
  try {
    r = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch {
    return json({ ok: false, paid: false, error: "could not reach payment provider" }, 500);
  }

  const s = (await r.json()) as StripeSession & { error?: { message?: string } };
  if (!r.ok) {
    // Never echo Stripe's raw error: it can reveal key/configuration details.
    console.log(JSON.stringify({ tag: "verify_payment", session_id: sessionId, status: r.status }));
    // Deliberately avoid 502: Cloudflare rewrites a 502 from a Pages Function into an
    // opaque text/plain "error code: 502", hiding the reason. 500/404 keep the body.
    if (r.status === 404) {
      return json({ ok: false, paid: false, error: "payment not found" }, 404);
    }
    return json({ ok: false, paid: false, error: "could not verify payment" }, 500);
  }

  const paid = s.payment_status === "paid";

  return json({
    ok: true,
    paid,
    // Deliberately limited to what the confirmation needs.
    amount_total: typeof s.amount_total === "number" ? s.amount_total : null,
    currency: s.currency || null,
    invoice: s.metadata?.invoice || null,
    payer_name: s.customer_details?.name || s.metadata?.payer_name || null,
    status: s.status || null,
  });
};
