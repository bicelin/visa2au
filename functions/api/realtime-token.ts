// POST /api/realtime-token — staff passcode → find-or-create the consult meeting
// (recording on, transcripts on, recordings land in OUR R2 bucket) → add the person
// as a participant → return the token the RealtimeKit UI Kit joins with.
//
// GET /api/realtime-token?check=1 — report which env values EXIST (booleans only,
// never values) so a deployment can be verified before a real call is booked.
//
// Env: VIDEO_LOBBY_PASSCODE (shared with /api/video-join), RTK_API_TOKEN,
//      RTK_APP_ID, RTK_PRESET (host, default "consult"),
//      RTK_PRESET_MEMBER (client, default "consult-member"),
//      RTK_TRANSCRIPTION_LANGUAGE (default "multi"), RTK_TITLE_PREFIX
//      (default "V2AU consult"), and the R2 keys — RTK_R2_* fall back to the
//      AGORA_R2_* pair that already backs /api/agora-recording, so a pilot needs
//      no new credentials: RTK_R2_ACCESS_KEY_ID, RTK_R2_SECRET_ACCESS_KEY,
//      RTK_R2_BUCKET, RTK_R2_PATH.
//
// The token lives 100 days by default; we ask for 6 hours, which is longer than
// any consult and short enough that a leaked URL is worthless tomorrow.

interface Env {
  VIDEO_LOBBY_PASSCODE?: string;
  RTK_API_TOKEN?: string;
  RTK_APP_ID?: string;
  RTK_PRESET?: string;        // host role — default "consult"
  RTK_PRESET_MEMBER?: string; // client role — default "consult-member"
  RTK_TRANSCRIPTION_LANGUAGE?: string;
  RTK_TITLE_PREFIX?: string;
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
const TOKEN_TTL_S = 6 * 3600;

// Constant-time compare (hex-digest both sides via SHA-256 to equalize length,
// then compare bytes without early exit) — same guard as /api/video-join.
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

function storageConfig(env: Env, path: string) {
  const k = r2Keys(env);
  if (!k.accessKey || !k.secret || !k.bucket) return undefined;
  return {
    type: "cloudflare",
    access_key: k.accessKey,
    secret: k.secret,
    bucket: k.bucket,
    account_id: ACCOUNT_ID,
    path,
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

// The API wraps payloads in { success, data, paging }; tolerate either shape.
function unwrap<T>(body: unknown): T | undefined {
  const b = body as Record<string, unknown> | null;
  if (!b) return undefined;
  return (b.data ?? b.result ?? b) as T;
}

interface Meeting {
  id?: string;
  title?: string;
  status?: string;
}

// One meeting per channel: two people must land in the SAME room, so look for a
// live meeting already carrying this title before creating another one.
async function findOrCreateMeeting(
  env: Env,
  json: (o: unknown, s?: number) => Response,
  title: string,
): Promise<{ meetingId: string } | { error: Response }> {
  const listRes = await rtk(env, "/meetings?per_page=50");
  if (listRes.ok) {
    const body = await listRes.json().catch(() => null);
    const meetings = unwrap<Meeting[]>(body) ?? [];
    const live = meetings.find(
      (m) => m.title === title && String(m.status || "").toUpperCase() === "ACTIVE",
    );
    if (live?.id) return { meetingId: live.id };
  }

  const path = env.RTK_R2_PATH || "realtime";
  const res = await rtk(env, "/meetings", {
    method: "POST",
    body: JSON.stringify({
      title,
      record_on_start: true,
      transcribe_on_end: true,
      summarize_on_end: true,
      persist_chat: false,
      session_keep_alive_time_in_secs: 60,
      ai_config: {
        transcription: { language: env.RTK_TRANSCRIPTION_LANGUAGE || "multi" },
      },
      recording_config: {
        storage_config: storageConfig(env, path),
        video_config: { codec: "H264", export_file: true, width: 1280, height: 720 },
        audio_config: { codec: "MP3", export_file: true, channel: "mono" },
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    return {
      error: json(
        { ok: false, error: "Could not create meeting", detail: detail.slice(0, 300) },
        502,
      ),
    };
  }
  const created = unwrap<Meeting>(await res.json().catch(() => null));
  if (!created?.id) {
    return {
      error: json({ ok: false, error: "Meeting created without an id" }, 502),
    };
  }
  return { meetingId: created.id };
}

// Dashboard-created apps ship with default presets whose names are not
// documented — group_call_host is 640x480 (vga), which is why this app carries its
// own `consult` (720p, simulcast on, 5 tiles) and `consult-member` (same media,
// no host controls) presets. Roles are explicit: a five-seat consult is one host
// plus clients, not five hosts.
async function resolvePreset(env: Env, role: "host" | "member"): Promise<string | undefined> {
  const wanted =
    role === "member"
      ? env.RTK_PRESET_MEMBER || "consult-member"
      : env.RTK_PRESET || "consult";
  const res = await rtk(env, "/presets");
  if (!res.ok) return wanted; // let the API reject an unknown name with its own message
  const names = (unwrap<Array<{ name?: string }>>(await res.json().catch(() => null)) ?? [])
    .map((r) => r?.name)
    .filter((n): n is string => Boolean(n));
  if (names.includes(wanted)) return wanted;
  return names[0]; // last resort: whatever exists, so a rename cannot 500 the call
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
  const url = new URL(request.url);
  if (url.searchParams.get("check") !== "1") {
    return json({ ok: false, error: "POST to join, or ?check=1 to inspect configuration" }, 405);
  }
  const k = r2Keys(env);
  const configured = {
    rtk_api_token: Boolean(env.RTK_API_TOKEN),
    rtk_app_id: Boolean(env.RTK_APP_ID),
    video_lobby_passcode: Boolean(env.VIDEO_LOBBY_PASSCODE),
    recording_bucket: Boolean(k.accessKey && k.secret && k.bucket),
  };
  const missing = Object.entries(configured)
    .filter(([, v]) => !v)
    .map(([k2]) => k2);
  return json({
    ok: missing.length === 0,
    configured,
    missing,
    // Without a bucket the meeting still runs, but recordings stay in
    // RealtimeKit's own R2 and are DELETED after seven days.
    note: configured.recording_bucket
      ? "recordings land in our bucket"
      : "no bucket configured — recordings would live in RealtimeKit R2 for 7 days only",
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  if (!env.RTK_API_TOKEN || !env.RTK_APP_ID) {
    return json({ ok: false, error: "RTK_API_TOKEN or RTK_APP_ID not configured" }, 500);
  }

  let body: { name?: string; passcode?: string; channel?: string; customId?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const passcode = String(body.passcode || "");
  const channel = String(body.channel || "lobby").trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40) || "lobby";
  if (!name || !passcode) return json({ ok: false, error: "Name and passcode are required" }, 400);

  if (!env.VIDEO_LOBBY_PASSCODE || !(await safeEqual(passcode, env.VIDEO_LOBBY_PASSCODE))) {
    return json({ ok: false, error: "Incorrect passcode" }, 401);
  }

  const title = `${env.RTK_TITLE_PREFIX || "V2AU consult"} ${channel}`;
  const meeting = await findOrCreateMeeting(env, json, title);
  if ("error" in meeting) return meeting.error;

  // One host, the rest clients: a five-seat consult must not hand every client the
  // host preset, which can kick and mute.
  const role: "host" | "member" =
    String(body.role || "host").trim().toLowerCase() === "member" ? "member" : "host";
  const preset = await resolvePreset(env, role);
  if (!preset) {
    return json(
      { ok: false, error: "No preset on this app and RTK_PRESET is unset", role },
      500,
    );
  }

  const res = await rtk(env, `/meetings/${meeting.meetingId}/participants`, {
    method: "POST",
    body: JSON.stringify({
      name,
      preset_name: preset,
      custom_participant_id: String(body.customId || "").slice(0, 80) || undefined,
      token: {
        expires_on: new Date(Date.now() + TOKEN_TTL_S * 1000).toISOString(),
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    return json(
      { ok: false, error: "Could not add participant", preset, detail: detail.slice(0, 300) },
      502,
    );
  }
  // The quickstart calls the returned field authToken; the API reference calls it
  // token. Accept either so a docs change cannot break the join.
  const participant = unwrap<{ id?: string; token?: string; authToken?: string }>(
    await res.json().catch(() => null),
  );
  const authToken = participant?.token || participant?.authToken;
  if (!authToken) {
    return json({ ok: false, error: "Participant added without a token", preset }, 502);
  }

  return json({
    ok: true,
    meetingId: meeting.meetingId,
    participantId: participant.id,
    role,
    preset,
    authToken,
    recording: Boolean(storageConfig(env, "realtime")),
  });
};
