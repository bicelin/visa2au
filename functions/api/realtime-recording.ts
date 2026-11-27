// GET /api/realtime-recording?action=status|list|start|stop|pause|resume
//   status  &meetingId=<id>        → is this meeting recording right now?
//   list    [&meetingId=<id>]      → recordings + download URLs (7-day life)
//   start   &meetingId=<id>        → start now (record_on_start already covers this)
//   stop    &recordingId=<id>       → stop and finalise the file
//
// x-agent-passcode header REQUIRED (booked staff code) — same guard as
// /api/agora-recording. Env: RTK_API_TOKEN, RTK_APP_ID, RTK_AGENT_CODES
// (comma-separated, falls back to VIDEO_LOBBY_PASSCODE), plus the R2 keys that
// /api/realtime-token already uses (RTK_R2_* falling back to AGORA_R2_*).
//
// This exists because a recording is only useful if it leaves RealtimeKit's own
// bucket within seven days — `list` is what proves where the file actually went.

interface Env {
  RTK_API_TOKEN?: string;
  RTK_APP_ID?: string;
  RTK_AGENT_CODES?: string;
  VIDEO_LOBBY_PASSCODE?: string;
  RTK_R2_ACCESS_KEY_ID?: string;
  RTK_R2_SECRET_ACCESS_KEY?: string;
  RTK_R2_BUCKET?: string;
  RTK_R2_PATH?: string;
  AGORA_R2_ACCESS_KEY_ID?: string;
  AGORA_R2_SECRET_ACCESS_KEY?: string;
  AGORA_R2_BUCKET?: string;
}

const API = "https://api.cloudflare.com/client/v4";
const ACCOUNT_ID = "e083bfeb02246c4cdc38abb254675f56";

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

function r2Keys(env: Env) {
  return {
    accessKey: env.RTK_R2_ACCESS_KEY_ID || env.AGORA_R2_ACCESS_KEY_ID || "",
    secret: env.RTK_R2_SECRET_ACCESS_KEY || env.AGORA_R2_SECRET_ACCESS_KEY || "",
    bucket: env.RTK_R2_BUCKET || env.AGORA_R2_BUCKET || "",
  };
}

function storageConfig(env: Env) {
  const k = r2Keys(env);
  if (!k.accessKey || !k.secret || !k.bucket) return undefined;
  return {
    type: "cloudflare",
    access_key: k.accessKey,
    secret: k.secret,
    bucket: k.bucket,
    account_id: ACCOUNT_ID,
    path: env.RTK_R2_PATH || "realtime",
  };
}

async function rtk(env: Env, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}/accounts/${ACCOUNT_ID}/realtime/kit/${env.RTK_APP_ID}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.RTK_API_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

function unwrap<T>(body: unknown): T | undefined {
  const b = body as Record<string, unknown> | null;
  if (!b) return undefined;
  return (b.data ?? b.result ?? b) as T;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  if (!env.RTK_API_TOKEN || !env.RTK_APP_ID) {
    return json({ ok: false, error: "RTK_API_TOKEN or RTK_APP_ID not configured" }, 500);
  }

  const url = new URL(request.url);
  const action = String(url.searchParams.get("action") || "status");

  if (action === "check") {
    const k = r2Keys(env);
    return json({
      ok: true,
      configured: {
        rtk_api_token: Boolean(env.RTK_API_TOKEN),
        rtk_app_id: Boolean(env.RTK_APP_ID),
        agent_codes: Boolean(env.RTK_AGENT_CODES || env.VIDEO_LOBBY_PASSCODE),
        recording_bucket: Boolean(k.accessKey && k.secret && k.bucket),
      },
    });
  }

  const codes = (env.RTK_AGENT_CODES || env.VIDEO_LOBBY_PASSCODE || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const given = request.headers.get("x-agent-passcode") || "";
  let allowed = false;
  for (const c of codes) if (await safeEqual(given, c)) allowed = true;
  if (!allowed) return json({ ok: false, error: "Staff passcode required" }, 401);

  const meetingId = String(url.searchParams.get("meetingId") || "").trim();
  const recordingId = String(url.searchParams.get("recordingId") || "").trim();

  if (action === "list") {
    const qs = meetingId ? `?meeting_id=${encodeURIComponent(meetingId)}` : "";
    const res = await rtk(env, `/recordings${qs}`);
    if (!res.ok) {
      return json({ ok: false, error: "Could not list recordings", detail: (await res.text()).slice(0, 300) }, 500);
    }
    const rows = unwrap<Array<Record<string, unknown>>>(await res.json().catch(() => null)) ?? [];
    return json({
      ok: true,
      count: rows.length,
      recordings: rows.map((r) => ({
        id: r.id,
        status: r.status,
        download: r.download_url,
        audio: r.audio_download_url,
        createdAt: r.created_at,
      })),
    });
  }

  if (!meetingId && action !== "stop") {
    return json({ ok: false, error: "meetingId is required" }, 400);
  }

  if (action === "status") {
    const res = await rtk(env, `/recordings/active-recording/${meetingId}`);
    if (res.status === 404) return json({ ok: true, recording: null, state: "not recording" });
    if (!res.ok) {
      return json({ ok: false, error: "Could not read active recording", detail: (await res.text()).slice(0, 300) }, 500);
    }
    const r = unwrap<Record<string, unknown>>(await res.json().catch(() => null));
    return json({ ok: true, recording: r ?? null });
  }

  if (action === "start") {
    const storage = storageConfig(env);
    const res = await rtk(env, "/recordings", {
      method: "POST",
      body: JSON.stringify({ meeting_id: meetingId, storage_config: storage }),
    });
    if (!res.ok) {
      return json({ ok: false, error: "Could not start recording", detail: (await res.text()).slice(0, 300) }, 500);
    }
    return json({ ok: true, started: unwrap(await res.json().catch(() => null)), landsInOurBucket: Boolean(storage) });
  }

  if (action === "stop" || action === "pause" || action === "resume") {
    if (!recordingId) return json({ ok: false, error: "recordingId is required" }, 400);
    const res = await rtk(env, `/recordings/${recordingId}`, {
      method: "PUT",
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      return json({ ok: false, error: `Could not ${action}`, detail: (await res.text()).slice(0, 300) }, 500);
    }
    return json({ ok: true, action, result: unwrap(await res.json().catch(() => null)) });
  }

  return json({ ok: false, error: "Unknown action" }, 400);
};
