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
 * Agora RTC identity model for the Visa2AU consultation room (Sergey, 2026-10-26):
 * everyone joins with a display name; a STAFF CODE upgrades to a booked admin
 * identity. Codes live ONLY server-side in env AGORA_AGENT_CODES:
 *   "900001=1001:Sergey Vinnichenko,900002=1002:Natasha Arens"
 * The client sends uid="staff" + header x-agent-passcode:<code>; the server
 * resolves the booked uid + canonical name — codes never ship in the bundle.
 */
export interface StaffEntry { uid: string; code: string; name: string; }

export function parseCodes(spec: string): StaffEntry[] {
  return spec.split(",").map((p) => {
    const m = p.match(/^\s*(\d+)\s*=\s*(\w+)\s*:(.+)$/);
    return m ? { uid: m[1], code: m[2], name: m[3].trim() } : null;
  }).filter((x): x is StaffEntry => !!x);
}

export function resolveStaff(spec: string, code: string): StaffEntry | null {
  return parseCodes(spec).find((e) => e.code === code) ?? null;
}

/**
 * Validate a directly-requested uid (guest/client path). Reserved booked uids
 * (9000xx), "agent-*" legacy strings and wildcard "0" are NEVER mintable without
 * a valid staff code. Returns canonical uid or null.
 */
export function validateClientUid(raw: string, anyValidCode: boolean): string | null {
  if (!/^[A-Za-z0-9_\-]{1,64}$/.test(raw)) return null;
  if (raw === "0") return anyValidCode ? "" : null;
  if (raw.startsWith("agent-") || /^9000\d{2}$/.test(raw)) return anyValidCode ? raw : null;
  return raw;
}
