// GET /api/voice-status — voice assistant availability flag + per-language
// Cartesia agent IDs (public IDs; the browser still needs a minted access
// token from /api/voice-token to connect).
// When the assistant should be off, set Pages env VOICE_ASSISTANT_ENABLED=false
// — the injected loader hides the voice section and never loads the widget.
// Env: VOICE_ASSISTANT_ENABLED?, CARTESIA_AGENT_EN?, CARTESIA_AGENT_RU?, CARTESIA_AGENT_FR?
//
// Cached 60s at the edge so the check is free for the site.

interface Env {
  VOICE_ASSISTANT_ENABLED?: string;
  CARTESIA_AGENT_EN?: string;
  CARTESIA_AGENT_RU?: string;
  CARTESIA_AGENT_FR?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const enabled = env.VOICE_ASSISTANT_ENABLED !== "false";
  const agents: Record<string, string> = {};
  if (env.CARTESIA_AGENT_EN) agents.en = env.CARTESIA_AGENT_EN;
  if (env.CARTESIA_AGENT_RU) agents.ru = env.CARTESIA_AGENT_RU;
  if (env.CARTESIA_AGENT_FR) agents.fr = env.CARTESIA_AGENT_FR;
  return new Response(JSON.stringify({ enabled, reason: enabled ? undefined : "disabled", agents }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
