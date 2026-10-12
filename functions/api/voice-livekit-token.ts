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
//      LIVEKIT_AGENT_NAME (optional, defaults v2au-secretary),
//      LIVEKIT_TOKEN_TTL (optional, seconds, default 600),
//      VOICE_ASSISTANT_ENABLED (kill switch).
//
// Response: { url, token, room, identity, provider:"livekit", ttl }
// no-store — the token is short-lived and single-use.

import { signJwt, type JwtClaims } from "../lib/jwt";

interface Env {
  LIVEKIT_URL?: string;
  LIVEKIT_API_KEY?: string;
  LIVEKIT_API_SECRET?: string;
  LIVEKIT_AGENT_NAME?: string;
  LIVEKIT_TOKEN_TTL?: string;
  VOICE_ASSISTANT_ENABLED?: string;
}

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (env.VOICE_ASSISTANT_ENABLED === "false") return json({ error: "disabled" }, 403);
  if (!env.LIVEKIT_URL || !env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET)
    return json({ error: "not configured", missing: ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"] }, 503);

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
