/**
 * GET /api/agora-token?channel=<name>&uid=<number>
 *
 * Server-side Agora RTC token mint (AccessToken2 / "007" format), ported from
 * the official generator:
 *   https://github.com/AgoraIO/Tools · DynamicKey/AgoraDynamicKey/nodejs/src/AccessToken2.js
 *
 * Communication profile: joinChannel + publishAudio + publishVideo + publishData,
 * TTL default 3600 s (Agora max 24 h). Uses WebCrypto (no Buffer / node crypto).
 *
 * Env: AGORA_APP_ID, AGORA_APP_CERTIFICATE, AGORA_TOKEN_TTL_S (optional),
 *      AGORA_CHANNEL_PREFIX (optional, default "v2au-"), AGORA_AGENT_PASSCODE (optional)
 */

import { resolveStaff, validateClientUid } from "../_shared/agora-helpers";

interface Env {
  AGORA_APP_ID?: string;
  AGORA_APP_CERTIFICATE?: string;
  AGORA_TOKEN_TTL_S?: string;
  AGORA_CHANNEL_PREFIX?: string;
  AGORA_AGENT_CODES?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
}

// Turnstile siteverify — bot gate for public token mints. When TURNSTILE_SECRET
// is unset the check is skipped (dev mode); set it to enforce.
async function siteVerify(secret: string, response: string): Promise<{ success: boolean; codes: string[] }> {
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response }),
    });
    const j = await r.json() as { success?: boolean; "error-codes"?: string[] };
    return { success: !!j.success, codes: j["error-codes"] ?? [] };
  } catch (e) { return { success: false, codes: [`fetch-failed:${(e as Error).name}`] }; }
}

// ---------- little-endian byte writer (mirrors ByteBuf in the reference) ----------
class ByteBuf {
  private parts: number[] = [];
  push(...bytes: number[]) { this.parts.push(...bytes); }
  u16(v: number) { this.push(v & 0xff, (v >> 8) & 0xff); return this; }
  u32(v: number) {
    const w = v >>> 0;
    this.push(w & 0xff, (w >>> 8) & 0xff, (w >>> 16) & 0xff, (w >>> 24) & 0xff);
    return this;
  }
  bytes(b: Uint8Array) { this.push(...b); return this; }
  string(s: string) {
    const enc = new TextEncoder().encode(s);
    this.u16(enc.length);
    this.bytes(enc);
    return this;
  }
  out(): Uint8Array { return new Uint8Array(this.parts); }
}

const hexRe = /^[0-9a-fA-F]{32}$/;

// ---------- HMAC-SHA256 ----------
async function hmac(key: Uint8Array, msg: Uint8Array): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, msg));
}

// ---------- zlib deflate (zlib container == node zlib.deflateSync) ----------
async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("deflate");
  const writer = cs.writable.getWriter();
  void writer.write(data);
  void writer.close();
  const buf = await new Response(cs.readable).arrayBuffer();
  return new Uint8Array(buf);
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrays) { out.set(a, off); off += a.length; }
  return out;
}

const b64 = (b: Uint8Array) => {
  let s = "";
  for (const byte of b) s += String.fromCharCode(byte);
  return btoa(s);
};

// ---------- AccessToken2 build (RTC service only) ----------
export async function buildRtcToken(
  appId: string, appCertificate: string, channelName: string, uid: string, ttlSeconds: number,
): Promise<string> {
  const issueTs = Math.floor(Date.now() / 1000);
  const expire = issueTs + ttlSeconds;
  const salt = Math.floor(Math.random() * 99999999) + 1;

  // Reference: encodeHMac(key, message) called as encodeHMac(LE32(issueTs), certString)
  // -> signing = HMAC(key=LE32(issueTs), msg=certBytes); then HMAC(key=LE32(salt), msg=signing)
  const certBytes = new TextEncoder().encode(appCertificate);
  let signing = await hmac(new ByteBuf().u32(issueTs).out(), certBytes);
  signing = await hmac(new ByteBuf().u32(salt).out(), signing);

  // signing_info = putString(appId) + u32(issueTs) + u32(expire) + u32(salt) + u16(serviceCount) + service.pack()
  const uidStr = uid; // already canonical: "" = wildcard (validated upstream)
  const svc = new ByteBuf()
    .u16(1)                                  // kRtcServiceType
    .u16(4)                                 // privilege count
    .u16(1).u32(expire)                      // joinChannel
    .u16(2).u32(expire)                      // publishAudio
    .u16(3).u32(expire)                      // publishVideo
    .u16(4).u32(expire)                      // publishDataStream
    .string(channelName)
    .string(uidStr);
  const signingInfo = concatBytes(
    new ByteBuf().string(appId).u32(issueTs).u32(expire).u32(salt).u16(1).out(), // 1 service
    svc.out(),
  );

  const signature = await hmac(signing, signingInfo);
  const content = concatBytes(new ByteBuf().u16(signature.length).bytes(signature).out(), signingInfo);
  return `007${b64(await deflate(content))}`;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, x-agent-passcode",
      },
    });

  if (request.method === "OPTIONS") return new Response(null, { status: 204 });

  const url = new URL(request.url);
  if (url.searchParams.get("action") === "config") {
    return json({ ok: true, sitekey: env.TURNSTILE_SITE_KEY || "" });
  }

  if (!env.AGORA_APP_ID || !env.AGORA_APP_CERTIFICATE) {
    return json({ ok: false, error: "Token server not configured" }, 500);
  }

  // bot protection (optional until TURNSTILE_SECRET is set)
  if (env.TURNSTILE_SECRET) {
    const cf = url.searchParams.get("cftoken") || "";
    if (!cf) return json({ ok: false, error: "captcha-required" }, 403);
    const v = await siteVerify(env.TURNSTILE_SECRET, cf);
    if (!v.success) return json({ ok: false, error: "captcha-verify-failed", cf: v.codes }, 403);
  }

  const channel = url.searchParams.get("channel") || "";
  const uidRaw = url.searchParams.get("uid") || "";
  const prefix = env.AGORA_CHANNEL_PREFIX || "v2au-";

  if (!new RegExp(`^${prefix}[A-Za-z0-9_\\-]{1,${Math.max(1, 63 - prefix.length)}}$`).test(channel)) {
    return json({ ok: false, error: `Channel must match ${prefix}* (<=63 bytes, [A-Za-z0-9_-])` }, 400);
  }

  const agentPasscode = request.headers.get("x-agent-passcode") || "";
  const staff = uidRaw === "staff" ? resolveStaff(env.AGORA_AGENT_CODES || "", agentPasscode) : null;
  if (uidRaw === "staff" && !staff) {
    return json({ ok: false, error: "Staff code not recognized" }, 403);
  }
  const uid = staff
    ? staff.uid
    : validateClientUid(uidRaw, !!resolveStaff(env.AGORA_AGENT_CODES || "", agentPasscode));
  if (uid === null) {
    return json({ ok: false, error: "uid invalid or reserved" }, 403);
  }

  let ttl = parseInt(env.AGORA_TOKEN_TTL_S || "3600", 10);
  if (!Number.isFinite(ttl) || ttl < 60) ttl = 3600;
  if (ttl > 24 * 3600) ttl = 24 * 3600; // Agora hard maximum

  try {
    const token = await buildRtcToken(env.AGORA_APP_ID, env.AGORA_APP_CERTIFICATE, channel, uid, ttl);
    return json({ ok: true, channel, uid, name: staff?.name ?? "", issuedAt: Math.floor(Date.now() / 1000), expireIn: ttl, token });
  } catch (e) {
    return json({ ok: false, error: `Token build failed: ${(e as Error).message}` }, 500);
  }
};
