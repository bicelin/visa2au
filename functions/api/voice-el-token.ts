// GET /api/voice-el-token?lang=en|ru|fr  (or ?agent=<agent_id>)
//
// Mints a short-lived ElevenLabs conversation signed URL server-side so the
// ELEVENLABS_API_KEY never reaches the browser (ElevenLabs docs: browsers must
// never hold the workspace key). The short-lived URL is what the browser SDK
// opens the WebSocket with.
//
// Env: ELEVENLABS_API_KEY (required), TURNSTILE_SECRET (required),
//      ELEVENLABS_AGENT_EN / _RU / _FR (per-language agent ids),
//      ELEVENLABS_BASE_URL (optional; set to the residency host, e.g.
//        https://api.sg.residency.elevenlabs.io, when the workspace moves),
//      VOICE_PROVIDER (optional echo for the client).
//
// This endpoint mints a PAID credential, so it fails closed:
//   * Turnstile response token verified server-side against TURNSTILE_SECRET.
//   * per-IP rate limit (best effort, per isolate).
//   * `?agent=` is only honoured when it matches one of the configured ids —
//     an arbitrary agent id from the query string is refused, so a caller
//     cannot point the mint at any other agent in the workspace.
//
// Response: { url, agent_id, provider:"elevenlabs", expires_in }
// Cached: no-store — the URL is single-use and short-lived.
import { clientIp, rateLimited, verifyTurnstile } from "../lib/guard";

interface Env {
  ELEVENLABS_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  ELEVENLABS_AGENT_EN?: string;
  ELEVENLABS_AGENT_RU?: string;
  ELEVENLABS_AGENT_FR?: string;
  ELEVENLABS_BASE_URL?: string;
  VOICE_ASSISTANT_ENABLED?: string;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const json = (obj: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (env.VOICE_ASSISTANT_ENABLED === "false") return json({ error: "disabled" }, 403);
  if (!env.ELEVENLABS_API_KEY) return json({ error: "not configured" }, 503);

  const ip = clientIp(request);
  if (rateLimited(`voice-el-token:${ip}`, MAX_PER_WINDOW, WINDOW_MS)) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": "600" });
  }

  const url = new URL(request.url);
  const cfToken = url.searchParams.get("cf_token") || "";
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET, cfToken, ip))) {
    return json({ error: "bot check failed — reload the page and retry" }, 403);
  }

  const lang = (url.searchParams.get("lang") || "en").toLowerCase();
  const explicit = url.searchParams.get("agent");
  const byLang: Record<string, string | undefined> = {
    en: env.ELEVENLABS_AGENT_EN,
    ru: env.ELEVENLABS_AGENT_RU,
    fr: env.ELEVENLABS_AGENT_FR,
  };
  // Only the agents this deployment owns may be addressed. Anything else in
  // `?agent=` is ignored rather than forwarded, so the caller cannot mint a
  // conversation against some other agent in the workspace.
  const configured = Object.values(byLang).filter((v): v is string => !!v);
  const requested = explicit && configured.includes(explicit) ? explicit : undefined;
  const agentId = requested || byLang[lang] || byLang.en;
  if (!agentId) return json({ error: "no agent for language", lang }, 404);

  const base = env.ELEVENLABS_BASE_URL || "https://api.elevenlabs.io";
  try {
    const r = await fetch(
      `${base}/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { "xi-api-key": env.ELEVENLABS_API_KEY } }
    );
    if (!r.ok) {
      // Surface the reason (plan/agent/region) without leaking the key.
      const detail = await r.text();
      return json({ error: "mint failed", status: r.status, detail: detail.slice(0, 300) }, 502);
    }
    const d = (await r.json()) as { signed_url?: string };
    if (!d.signed_url) return json({ error: "mint failed", detail: "no signed_url" }, 502);
    return json({ url: d.signed_url, agent_id: agentId, provider: "elevenlabs", lang, expires_in: 900 });
  } catch {
    return json({ error: "mint failed" }, 502);
  }
};
