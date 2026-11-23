// Shared abuse controls for the public token-minting and form endpoints.
//
// Two layers, deliberately independent:
//   * Turnstile — proves a browser interaction happened. Verified server-side
//     against TURNSTILE_SECRET. Fails CLOSED: a missing secret or a missing
//     token is a rejection, never a bypass.
//   * Per-isolate rate limiting — cheap and always available, but best effort:
//     each isolate keeps its own Map, so a burst spread across isolates can
//     exceed the nominal limit. The authoritative layer is a Cloudflare WAF
//     rate-limiting rule on /api/*; keep both.
//
// Pages Functions are stateless, so nothing here persists between requests
// beyond the lifetime of one isolate.

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

/** True when `key` has exceeded `limit` events inside `windowMs`. */
export function rateLimited(
  key: string,
  limit: number,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    // Bound the map so an IP-spoofing flood cannot grow it without limit.
    if (buckets.size > MAX_BUCKETS) buckets.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

/** Cloudflare sets CF-Connecting-IP on every request that reaches Pages. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ||
    (request.headers.get("X-Forwarded-For") || "").split(",")[0].trim() ||
    "unknown"
  );
}

/**
 * Verifies a Turnstile response token. Fails closed: no secret or no token is
 * a rejection. Pass the client IP so Cloudflare can cross-check remoteip.
 */
export async function verifyTurnstile(
  secret: string | undefined,
  token: string,
  ip?: string
): Promise<boolean> {
  if (!secret || !token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    if (!r.ok) return false;
    const v = (await r.json()) as { success?: boolean };
    return v.success === true;
  } catch {
    return false;
  }
}

/**
 * Constant-time string comparison. Length is compared first (unavoidable, and
 * not secret — both sides are fixed-length in practice), then every byte is
 * folded into one accumulator with no early exit.
 */
export function timingSafeStr(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ea = enc.encode(a);
  const eb = enc.encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i += 1) diff |= ea[i] ^ eb[i];
  return diff === 0;
}
