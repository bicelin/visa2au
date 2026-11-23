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
  const key = env.STRIPE_SECRET_KEY || "";
  // A restricted API key (RAK) starts with rk_live_ / rk_test_, NOT sk_live_ — RAKs are
  // the recommended key type, so testing only for "sk_live_" would report a live
  // restricted key as test mode and the page would claim "no payment is taken" while
  // charging real cards.
  const live = key.startsWith("sk_live_") || key.startsWith("rk_live_");
  return new Response(JSON.stringify({ live }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Never cache: this flips the instant the key changes.
      "Cache-Control": "no-store",
    },
  });
};
