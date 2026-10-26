/**
 * GET /api/agora-recording?action=start|stop|query|files&channel=<name>[&sid=&rid=]
 * x-agent-passcode header REQUIRED (booked staff code) — proxy to Agora Cloud
 * Recording REST (api.sd-rtn.com) holding Customer ID/Secret + R2 keys server-side.
 *
 * mode=individual → per-uid media files (STT-friendly). R2 via vendor 11
 * (S3-compatible), endpoint = https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 * (bucket has no jurisdiction — jurisdiction buckets REQUIRE the eu./us. form).
 *
 * Env: AGORA_APP_ID, AGORA_APP_CERTIFICATE, AGORA_AGENT_CODES,
 *      AGORA_CUSTOMER_ID, AGORA_CUSTOMER_SECRET,
 *      AGORA_R2_ACCESS_KEY_ID, AGORA_R2_SECRET_ACCESS_KEY,
 *      AGORA_R2_ENDPOINT, AGORA_R2_BUCKET, AGORA_R2_REGION (int, empirical),
 *      AGORA_RECORDER_UID (default 880001), AGORA_TOKEN_TTL_S (recorder TTL)
 */

import { buildRtcToken } from "./agora-token";
import { resolveStaff } from "../_shared/agora-helpers";

interface Env {
  AGORA_APP_ID?: string;
  AGORA_APP_CERTIFICATE?: string;
  AGORA_AGENT_CODES?: string;
  AGORA_CUSTOMER_ID?: string;
  AGORA_CUSTOMER_SECRET?: string;
  AGORA_R2_ACCESS_KEY_ID?: string;
  AGORA_R2_SECRET_ACCESS_KEY?: string;
  AGORA_R2_ENDPOINT?: string;
  AGORA_R2_BUCKET?: string;
  AGORA_R2_REGION?: string;
  AGORA_RECORDER_UID?: string;
  AGORA_TOKEN_TTL_S?: string;
}

const API = "https://api.sd-rtn.com";
const RECORDER_MODE = "individual";

function storageConfig(env: Env) {
  return {
    vendor: 11,
    region: parseInt(env.AGORA_R2_REGION || "3", 10),
    bucket: env.AGORA_R2_BUCKET,
    accessKey: env.AGORA_R2_ACCESS_KEY_ID,
    secretKey: env.AGORA_R2_SECRET_ACCESS_KEY,
    extensionParams: { endpoint: env.AGORA_R2_ENDPOINT },
  };
}

async function agora(env: Env, path: string, init: RequestInit = {}): Promise<{ code?: number; status?: number; body: any; http: number }> {
  const r = await fetch(`${API}/v1/apps/${env.AGORA_APP_ID}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${btoa(`${env.AGORA_CUSTOMER_ID}:${env.AGORA_CUSTOMER_SECRET}`)}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  let body: any = {};
  try { body = await r.json(); } catch { /* empty */ }
  return { code: body.code, status: body.status, body, http: r.status };
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, x-agent-passcode" },
    });
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });

  const need = ["AGORA_APP_ID", "AGORA_APP_CERTIFICATE", "AGORA_CUSTOMER_ID", "AGORA_CUSTOMER_SECRET",
    "AGORA_R2_ACCESS_KEY_ID", "AGORA_R2_SECRET_ACCESS_KEY", "AGORA_R2_ENDPOINT", "AGORA_R2_BUCKET"] as const;
  const missing = need.filter((k) => !env[k]);
  if (missing.length) return json({ ok: false, error: `recording not configured (missing ${missing.length} env vars)` }, 500);

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "query";
  const channel = url.searchParams.get("channel") || "";
  if (!/^v2au-[A-Za-z0-9_\-]{1,58}$/.test(channel)) return json({ ok: false, error: "bad channel" }, 400);

  const staff = resolveStaff(env.AGORA_AGENT_CODES || "", request.headers.get("x-agent-passcode") || "");
  if (!staff) return json({ ok: false, error: "staff code required" }, 403);

  const rid = url.searchParams.get("rid") || "";
  const sid = url.searchParams.get("sid") || "";
  const recorderUid = env.AGORA_RECORDER_UID || "880001";

  try {
    if (action === "start") {
      if (!rid || !sid) return json({ ok: false, error: "rid+sid required (from acquire)" }, 400);
      const ttlS = Math.min(24 * 3600, Math.max(4 * 3600, parseInt(env.AGORA_TOKEN_TTL_S || "14400", 10)));
      const token = await buildRtcToken(env.AGORA_APP_ID!, env.AGORA_APP_CERTIFICATE!, channel, "", ttlS);
      const day = new Date().toISOString().slice(0, 10);
      const res = await agora(env, `/cloud_recording/resourceid/${encodeURIComponent(rid)}/mode/${RECORDER_MODE}/start`, {
        method: "POST",
        body: JSON.stringify({
          cname: channel,
          uid: recorderUid,
          clientRequest: {
            token,
            storageConfig: { ...storageConfig(env), fileNamePrefix: [channel, day] },
            recordingConfig: {
              channelType: 0,
              streamTypes: 0, // audio-only per-user files (mp4); video needs hls+transcoding — later
              maxIdleTime: 30,
              subscribeUidGroup: 0,
              subscribeVideoUids: [],
              subscribeAudioUids: ["#allstream#"],
            },
            recordingFileConfig: { avFileType: ["hls"] }, // individual mode requires default hls
          },
        }),
      });
      return json({ ok: (res.code ?? 0) === 0 || (res.code ?? 0) === 200, agora: res });
    }

    if (action === "acquire") {
      const res = await agora(env, "/cloud_recording/acquire", {
        method: "POST",
        body: JSON.stringify({
          cname: channel,
          uid: recorderUid,
          clientRequest: {
            resourceExpiredHour: 24,
            startParameter: {
              storageConfig: storageConfig(env),
            },
          },
        }),
      });
      return json({ ok: (res.code ?? 0) === 0 || (res.code ?? 0) === 200, agora: res });
    }

    if (!rid || !sid) return json({ ok: false, error: "rid+sid required" }, 400);
    if (action === "stop") {
      const res = await agora(env, `/cloud_recording/resourceid/${encodeURIComponent(rid)}/sid/${encodeURIComponent(sid)}/mode/${RECORDER_MODE}/stop`, {
        method: "POST",
        body: JSON.stringify({ cname: channel, uid: recorderUid, clientRequest: {} }),
      });
      return json({ ok: true, agora: res });
    }
    // default: query
    const res = await agora(env, `/cloud_recording/resourceid/${encodeURIComponent(rid)}/sid/${encodeURIComponent(sid)}/mode/${RECORDER_MODE}/query?cname=${encodeURIComponent(channel)}`, { method: "GET" });
    return json({ ok: true, agora: res });
  } catch (e) {
    return json({ ok: false, error: `recording proxy failed: ${(e as Error).message}` }, 500);
  }
};
