// GET /api/voice-livekit-token?lang=en|ru|fr   (lane: livekit — option 3)
//
// Mints a LiveKit access token server-side (LiveKit's documented pattern: the API
// secret never reaches the browser). The browser hands the token to the LiveKit
// WebRTC client and joins the room; a LiveKit Agents worker in that room runs the
// V2AU secretary (our own STT/LLM/TTS, our own kb/ retrieval).
//
// Why this lane exists: WebRTC gives real acoustic echo cancellation, so it needs
// none of the hand-rolled half-duplex mic gating the raw-WebSocket lanes require.
//
// Env: LIVEKIT_URL (wss://…), LIVEKIT_API_KEY, LIVEKIT_API_SECRET,
//      TURNSTILE_SECRET (required), LIVEKIT_AGENT_NAME (optional, defaults
//      v2au-secretary), LIVEKIT_TOKEN_TTL (optional, seconds, default 600),
//      VOICE_ASSISTANT_ENABLED (kill switch).
//
// This endpoint mints a PAID credential AND dispatches the agent worker into a
// new room, so it fails closed:
//   * Turnstile response token verified server-side against TURNSTILE_SECRET.
//   * per-IP rate limit (best effort, per isolate).
//
// Response: { url, token, room, identity, provider:"livekit", ttl }
// no-store — the token is short-lived and single-use.

import { signJwt, type JwtClaims } from "../lib/jwt";
import { clientIp, rateLimited, verifyTurnstile } from "../lib/guard";

interface Env {
  LIVEKIT_URL?: string;
  LIVEKIT_API_KEY?: string;
  LIVEKIT_API_SECRET?: string;
  LIVEKIT_AGENT_NAME?: string;
  LIVEKIT_TOKEN_TTL?: string;
  TURNSTILE_SECRET?: string;
  VOICE_ASSISTANT_ENABLED?: string;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;

const json = (obj: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (env.VOICE_ASSISTANT_ENABLED === "false") return json({ error: "disabled" }, 403);
  if (!env.LIVEKIT_URL || !env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET)
    return json({ error: "not configured", missing: ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"] }, 503);

  const ip = clientIp(request);
  if (rateLimited(`voice-livekit-token:${ip}`, MAX_PER_WINDOW, WINDOW_MS)) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": "600" });
  }

  const cfToken = new URL(request.url).searchParams.get("cf_token") || "";
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET, cfToken, ip))) {
    return json({ error: "bot check failed — reload the page and retry" }, 403);
  }

  const lang = (new URL(request.url).searchParams.get("lang") || "en").toLowerCase().slice(0, 8);
  const safeLang = ["en", "ru", "fr"].includes(lang) ? lang : "en";
  const rand = Math.random().toString(36).slice(2, 10);
  const room = `v2au-${safeLang}-${rand}`;
  const identity = `visitor-${rand}`;
  const ttl = Math.min(Math.max(parseInt(env.LIVEKIT_TOKEN_TTL || "600", 10) || 600, 60), 3600);
  const now = Math.floor(Date.now() / 1000);

  const claims: JwtClaims = {
    iss: env.LIVEKIT_API_KEY,
    sub: identity,
    nbf: now - 10,
    iat: now,
    exp: now + ttl,
    name: "Visa2AU website visitor",
    metadata: JSON.stringify({ lang: safeLang, source: "visa2.au", lane: "livekit" }),
    video: {
      room,
      roomJoin: true,
      canPublish: true,      // microphone
      canSubscribe: true,    // agent audio
      canPublishData: true,
      canUpdateOwnMetadata: true,
    },
    // Dispatch the V2AU worker into this room so it joins without a server-side
    // CreateDispatch call. If the worker is instead configured for automatic
    // dispatch, this block is simply ignored.
    roomConfig: {
      agents: [{ agentName: env.LIVEKIT_AGENT_NAME || "v2au-secretary" }],
    },
  };

  const token = await signJwt(claims, env.LIVEKIT_API_SECRET);
  return json({ url: env.LIVEKIT_URL, token, room, identity, provider: "livekit", lang: safeLang, ttl });
};
