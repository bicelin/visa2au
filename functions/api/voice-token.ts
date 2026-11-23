// GET /api/voice-token?cf_token=… — mint a short-lived Cartesia agent access
// token for the browser voice widget. The Cartesia API key stays server-side
// (docs: browsers must use access tokens, never API keys).
//
// This endpoint mints a PAID credential, so it fails closed:
//   * Turnstile response token verified server-side against TURNSTILE_SECRET.
//     A missing secret or a missing token is a rejection, never a bypass.
//   * per-IP rate limit (best effort, per isolate). The authoritative layer is
//     a Cloudflare WAF rate-limiting rule on /api/voice-*.
//
// Env: CARTESIA_API_KEY (sk_car_...), TURNSTILE_SECRET,
//      optional VOICE_WIDGET_ENABLED ("false" = off).
import { clientIp, rateLimited, verifyTurnstile } from "../lib/guard";

interface Env {
  CARTESIA_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  VOICE_WIDGET_ENABLED?: string;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const json = (obj: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (env.VOICE_WIDGET_ENABLED === "false") return json({ error: "disabled" }, 403);
  if (!env.CARTESIA_API_KEY) return json({ error: "not configured" }, 503);

  const ip = clientIp(request);
  if (rateLimited(`voice-token:${ip}`, MAX_PER_WINDOW, WINDOW_MS)) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": "600" });
  }

  const cfToken = new URL(request.url).searchParams.get("cf_token") || "";
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET, cfToken, ip))) {
    return json({ error: "bot check failed — reload the page and retry" }, 403);
  }
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
