// GET /api/voice-status — provider-neutral voice lane config for the website.
//
// ONE server-side flag decides which vendor the site talks to:
//     VOICE_PROVIDER = el-v4 | cartesia | pipecat-v4      (default: cartesia)
// and VOICE_ASSISTANT_ENABLED=false is the kill switch (hides the section and
// never loads a widget).
//
// The inline loader in every page fetches this endpoint, then loads the file
// named in `adapter` — so swapping vendors never requires touching page HTML.
// Contract (all lanes): window.__v2auVoiceStart/Stop, #voice-cta, #voice-fab,
// #v2au-voice-panel. See voice/lanes.json.
//
// Env: VOICE_PROVIDER, VOICE_ASSISTANT_ENABLED,
//      ELEVENLABS_AGENT_EN/_RU/_FR, CARTESIA_AGENT_EN/_RU/_FR
// Cached 60s at the edge.

interface Env {
  VOICE_PROVIDER?: string;
  VOICE_ASSISTANT_ENABLED?: string;
  ELEVENLABS_AGENT_EN?: string;
  ELEVENLABS_AGENT_RU?: string;
  ELEVENLABS_AGENT_FR?: string;
  CARTESIA_AGENT_EN?: string;
  CARTESIA_AGENT_RU?: string;
  CARTESIA_AGENT_FR?: string;
}

// adapter file + token endpoint + public label per lane (mirrors voice/lanes.json)
const LANES: Record<
  string,
  { adapter: string; token: string; label: string; env: (env: Env) => Record<string, string | undefined> }
> = {
  "el-v4": {
    adapter: "/js/voice-el.js",
    token: "/api/voice-el-token",
    label: "ElevenLabs Agents (Eleven v4 Turbo)",
    env: (env) => ({ en: env.ELEVENLABS_AGENT_EN, ru: env.ELEVENLABS_AGENT_RU, fr: env.ELEVENLABS_AGENT_FR }),
  },
  cartesia: {
    adapter: "/js/voice.js",
    token: "/api/voice-token",
    label: "Cartesia Managed Agents",
    env: (env) => ({ en: env.CARTESIA_AGENT_EN, ru: env.CARTESIA_AGENT_RU, fr: env.CARTESIA_AGENT_FR }),
  },
  "pipecat-v4": {
    adapter: "/js/voice-pipecat.js",
    token: "/api/voice-pipecat-token",
    label: "Pipecat (self-hosted)",
    env: () => ({}),
  },
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const enabled = env.VOICE_ASSISTANT_ENABLED !== "false";
  const wanted = (env.VOICE_PROVIDER || "cartesia").trim();
  const lane = LANES[wanted] || LANES.cartesia;

  const agents: Record<string, string> = {};
  for (const [lang, id] of Object.entries(lane.env(env))) {
    if (id) agents[lang] = id;
  }

  // Honest degradation: an enabled lane with no agent ids configured would
  // render a dead button. Say so instead of pretending to be live.
  const configured = Object.keys(agents).length > 0;
  const body = {
    enabled: enabled && configured,
    provider: wanted in LANES ? wanted : "cartesia",
    label: lane.label,
    adapter: lane.adapter,
    tokenEndpoint: lane.token,
    agents,
    reason: !enabled ? "disabled" : configured ? undefined : "no agents configured for this lane",
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
