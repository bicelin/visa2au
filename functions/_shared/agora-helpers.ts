/**
 * Shared helpers for Pages Functions (imported by api/* via ../_shared/*).
 */

// Constant-time string compare (SHA-256 both sides to equalize length, then
// compare bytes without early exit). Same pattern as functions/api/video-join.ts.
export async function safeEqual(a: string, b: string): Promise<boolean> {
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

/**
 * Agora RTC uid validation for the Visa2AU consultation room.
 * - "0" => wildcard token (empty account): bots / Cloud Recording.
 * - "agent-*" requires agentAuthorized (correct x-agent-passcode header).
 * - otherwise: string account [A-Za-z0-9_-], 1..64 chars.
 *   (Agora allows <=255 ASCII; we keep <=64 to stay well under header/URL limits.
 *    Numeric strings are accepted — they are just accounts, and the channel must
 *    not mix numeric and string UIDs, so v2 clients use "client-<slug>" strings.)
 * Returns the canonical uid string, or null when invalid.
 */
export function validateUid(raw: string, agentAuthorized: boolean): string | null {
  if (raw === "0") return agentAuthorized ? "" : null;
  if (!/^[A-Za-z0-9_\-]{1,64}$/.test(raw)) return null;
  // Booked agent identities: string "agent-*" or numeric reserved range 9000xx
  // (Sergey 900001, Natasha 900002; Cloud Recording needs numeric recorder uid,
  //  so consultation channels use numeric uids + display names via data stream).
  if ((raw.startsWith("agent-") || /^9000\d{2}$/.test(raw)) && !agentAuthorized) return null;
  return raw;
}
