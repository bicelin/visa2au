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

import { safeEqual, validateUid } from "../_shared/agora-helpers";

interface Env {
  AGORA_APP_ID?: string;
  AGORA_APP_CERTIFICATE?: string;
  AGORA_TOKEN_TTL_S?: string;
  AGORA_CHANNEL_PREFIX?: string;
  AGORA_AGENT_PASSCODE?: string;
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
  if (!env.AGORA_APP_ID || !env.AGORA_APP_CERTIFICATE) {
    return json({ ok: false, error: "Token server not configured" }, 500);
  }

  const url = new URL(request.url);
  const channel = url.searchParams.get("channel") || "";
  const uidRaw = url.searchParams.get("uid") || "";
  const prefix = env.AGORA_CHANNEL_PREFIX || "v2au-";

  if (!new RegExp(`^${prefix}[A-Za-z0-9_\\-]{1,${Math.max(1, 63 - prefix.length)}}$`).test(channel)) {
    return json({ ok: false, error: `Channel must match ${prefix}* (<=63 bytes, [A-Za-z0-9_-])` }, 400);
  }

  const agentAuthorized =
    !!env.AGORA_AGENT_PASSCODE &&
    (await safeEqual(request.headers.get("x-agent-passcode") || "", env.AGORA_AGENT_PASSCODE));

  const uid = validateUid(uidRaw, agentAuthorized);
  if (uid === null) {
    return json(
      { ok: false, error: "uid must be 1-64 chars [A-Za-z0-9_-]; agent-* uids and uid=0 require a valid x-agent-passcode header" },
      403,
    );
  }

  let ttl = parseInt(env.AGORA_TOKEN_TTL_S || "3600", 10);
  if (!Number.isFinite(ttl) || ttl < 60) ttl = 3600;
  if (ttl > 24 * 3600) ttl = 24 * 3600; // Agora hard maximum

  try {
    const token = await buildRtcToken(env.AGORA_APP_ID, env.AGORA_APP_CERTIFICATE, channel, uid, ttl);
    return json({ ok: true, channel, uid, issuedAt: Math.floor(Date.now() / 1000), expireIn: ttl, token });
  } catch (e) {
    return json({ ok: false, error: `Token build failed: ${(e as Error).message}` }, 500);
  }
};
