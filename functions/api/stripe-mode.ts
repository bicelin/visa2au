// GET /api/stripe-mode — reports whether the deployed Stripe key is live or test.
//
// Why this exists: /pay must tell payers the truth about whether their card will be
// charged. The notice used to be hardcoded to "test mode", so swapping
// STRIPE_SECRET_KEY to a live key would have made the page lie in the dangerous
// direction — charging real money while claiming no payment is taken. Deriving the
// notice from the key prefix removes that window entirely and needs no coordination.
//
// Only ever returns a boolean; the key itself is never exposed.

interface Env {
  STRIPE_SECRET_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  // Default to false (test) when the key is absent: under-promise rather than
  // tell a payer their card is about to be charged when we cannot confirm it.
  const live = (env.STRIPE_SECRET_KEY || "").startsWith("sk_live_");
  return new Response(JSON.stringify({ live }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Never cache: this flips the instant the key changes.
      "Cache-Control": "no-store",
    },
  });
};
