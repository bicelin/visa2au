// Minimal HS256 JWT sign/verify using WebCrypto only (no dependencies).
// Used by /oauth/token (sign) and /api/content (verify).

export function b64url(data: Uint8Array | string): string {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

export interface JwtClaims {
  iss?: string;
  aud?: string;
  scope?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  [k: string]: unknown;
}

export async function signJwt(
  claims: JwtClaims,
  secret: string
): Promise<string> {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify(claims));
  const data = `${header}.${payload}`;
  const key = await hmacKey(secret, "sign");
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

// Constant-time comparison for equal-length byte arrays (length check first).
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Verifies HS256 signature, exp, iss, aud. Returns claims or null.
export async function verifyJwt(
  token: string,
  secret: string,
  expectedIss: string,
  expectedAud: string
): Promise<JwtClaims | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let header: { alg?: string };
  let claims: JwtClaims;
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlDecode(h)));
    claims = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
  } catch {
    return null;
  }
  if (header.alg !== "HS256") return null;

  const key = await hmacKey(secret, "sign");
  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${h}.${p}`))
  );
  let provided: Uint8Array;
  try {
    provided = b64urlDecode(s);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expected, provided)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== "number" || claims.exp <= now) return null;
  if (claims.iss !== expectedIss) return null;
  if (claims.aud !== expectedAud) return null;
  return claims;
}
