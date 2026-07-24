// POST /api/video-join — validate lobby passcode → ensure Daily room exists →
// mint a 2h non-owner meeting token → return room URL with token.
// Env: VIDEO_LOBBY_PASSCODE, DAILY_API_KEY, DAILY_DOMAIN

interface Env {
  VIDEO_LOBBY_PASSCODE: string;
  DAILY_API_KEY: string;
  DAILY_DOMAIN: string; // e.g. "visa2au.daily.co"
}

const ROOM_NAME = "v2au-lobby";
const TOKEN_TTL_S = 2 * 3600;

// Constant-time string compare (hex-digest both sides via SHA-256 to
// equalize length, then compare bytes without early exit).
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const ua = new Uint8Array(ha);
  const ub = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

async function daily(env: Env, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`https://api.daily.co/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.DAILY_API_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  let body: { name?: string; passcode?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const passcode = String(body.passcode || "");
  if (!name || !passcode) return json({ ok: false, error: "Name and passcode are required" }, 400);

  if (!env.VIDEO_LOBBY_PASSCODE || !(await safeEqual(passcode, env.VIDEO_LOBBY_PASSCODE))) {
    return json({ ok: false, error: "Incorrect passcode" }, 401);
  }

  // Ensure the lobby room exists (create private room if missing)
  const roomRes = await daily(env, `/rooms/${ROOM_NAME}`);
  if (roomRes.status === 404) {
    const createRes = await daily(env, "/rooms", {
      method: "POST",
      body: JSON.stringify({
        name: ROOM_NAME,
        privacy: "private",
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: "off",
          enable_prejoin_ui: true,
          eject_at_room_exp: true,
          exp: Math.floor(Date.now() / 1000) + 24 * 3600, // room valid 24h, refreshed per day
        },
      }),
    });
    if (!createRes.ok) {
      const detail = await createRes.text();
      return json({ ok: false, error: "Could not create video room", detail: detail.slice(0, 200) }, 502);
    }
  } else if (!roomRes.ok) {
    const detail = await roomRes.text();
    return json({ ok: false, error: "Daily API error", detail: detail.slice(0, 200) }, 502);
  }

  // Mint a short-lived meeting token (non-owner, no recording)
  const tokenRes = await daily(env, "/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        room_name: ROOM_NAME,
        user_name: name,
        is_owner: false,
        enable_recording: "off",
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_S,
      },
    }),
  });
  if (!tokenRes.ok) {
    const detail = await tokenRes.text();
    return json({ ok: false, error: "Could not issue meeting token", detail: detail.slice(0, 200) }, 502);
  }
  const { token } = (await tokenRes.json()) as { token: string };

  return json({ ok: true, url: `https://${env.DAILY_DOMAIN}/${ROOM_NAME}?t=${token}` });
};
