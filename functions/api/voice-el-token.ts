// GET /api/voice-el-token?lang=en|ru|fr  (or ?agent=<agent_id>)
//
// Mints a short-lived ElevenLabs conversation signed URL server-side so the
// ELEVENLABS_API_KEY never reaches the browser (ElevenLabs docs: browsers must
// never hold the workspace key). The short-lived URL is what the browser SDK
// opens the WebSocket with.
//
// Env: ELEVENLABS_API_KEY (required),
//      ELEVENLABS_AGENT_EN / _RU / _FR (per-language agent ids),
//      ELEVENLABS_BASE_URL (optional; set to the residency host, e.g.
//        https://api.sg.residency.elevenlabs.io, when the workspace moves),
//      VOICE_PROVIDER (optional echo for the client).
//
// Response: { url, agent_id, provider:"elevenlabs", expires_in }
// Cached: no-store — the URL is single-use and short-lived.

interface Env {
  ELEVENLABS_API_KEY?: string;
  ELEVENLABS_AGENT_EN?: string;
  ELEVENLABS_AGENT_RU?: string;
  ELEVENLABS_AGENT_FR?: string;
  ELEVENLABS_BASE_URL?: string;
  VOICE_ASSISTANT_ENABLED?: string;
}

const json = (obj: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (env.VOICE_ASSISTANT_ENABLED === "false") return json({ error: "disabled" }, 403);
  if (!env.ELEVENLABS_API_KEY) return json({ error: "not configured" }, 503);

  const url = new URL(request.url);
  const lang = (url.searchParams.get("lang") || "en").toLowerCase();
  const explicit = url.searchParams.get("agent");
  const byLang: Record<string, string | undefined> = {
    en: env.ELEVENLABS_AGENT_EN,
    ru: env.ELEVENLABS_AGENT_RU,
    fr: env.ELEVENLABS_AGENT_FR,
  };
  const agentId = explicit || byLang[lang] || byLang.en;
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
