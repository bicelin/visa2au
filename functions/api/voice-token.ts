// GET /api/voice-token — mint a short-lived Cartesia agent access token for the
// browser voice widget. The Cartesia API key stays server-side (docs: browsers
// must use access tokens, never API keys).
// Env: CARTESIA_API_KEY (sk_car_...), optional VOICE_WIDGET_ENABLED ("false" = off).
interface Env {
  CARTESIA_API_KEY?: string;
  VOICE_WIDGET_ENABLED?: string;
}

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (env.VOICE_WIDGET_ENABLED === "false") return json({ error: "disabled" }, 403);
  if (!env.CARTESIA_API_KEY) return json({ error: "not configured" }, 503);
  try {
    const r = await fetch("https://api.cartesia.ai/access-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CARTESIA_API_KEY}`,
        "Cartesia-Version": "2026-08-14",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grants: { agent: true }, expires_in: 300 }),
    });
    if (!r.ok) return json({ error: "token mint failed" }, 502);
    const d = (await r.json()) as { token?: string; expires_in?: number };
    return json({ token: d.token, expires_in: d.expires_in ?? 300 });
  } catch {
    return json({ error: "token mint failed" }, 502);
  }
};
