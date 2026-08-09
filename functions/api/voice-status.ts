// GET /api/voice-status — voice assistant availability flag.
// When the ElevenLabs free-tier quota is exhausted, set the Pages env var
// VOICE_ASSISTANT_ENABLED=false and the site will hide the voice-assistant
// section and skip loading the ElevenLabs widget script entirely.
// Env: VOICE_ASSISTANT_ENABLED (optional, "false" disables; anything else or
//      unset keeps the assistant enabled).
//
// Cached 60s at the edge so the check is free for the site.

interface Env {
  VOICE_ASSISTANT_ENABLED?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const enabled = env.VOICE_ASSISTANT_ENABLED !== "false";
  return new Response(JSON.stringify({ enabled, reason: enabled ? undefined : "disabled" }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
