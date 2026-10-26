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
  AGORA_RECORDER_UID_VIDEO?: string;
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
      // Two parallel sessions from one tap:
      //  A) individual audio-only HLS  -> per-speaker STT lane (lands live, chunked)
      //  B) mix-mode audio+video MP4   -> one composite "session video" (finalized at stop)
      // New REST flow: acquire carries the FULL startParameter; start must send
      // an identical clientRequest (Agora compares request hashes) within ~2 s.
      const ttlS = Math.min(24 * 3600, Math.max(4 * 3600, parseInt(env.AGORA_TOKEN_TTL_S || "14400", 10)));
      const token = await buildRtcToken(env.AGORA_APP_ID!, env.AGORA_APP_CERTIFICATE!, channel, "", ttlS);
      const day = new Date().toISOString().slice(0, 10);
      const recUidVideo = env.AGORA_RECORDER_UID_VIDEO || "880002";
      const specs: { kind: string; mode: string; uid: string; creq: Record<string, unknown> }[] = [
        {
          kind: "audio", mode: "individual", uid: recorderUid,
          creq: {
            token,
            storageConfig: { ...storageConfig(env), fileNamePrefix: [channel, day] },
            recordingConfig: {
              channelType: 0, streamTypes: 0, maxIdleTime: 30, subscribeUidGroup: 0,
              subscribeVideoUids: [], subscribeAudioUids: ["#allstream#"],
            },
            recordingFileConfig: { avFileType: ["hls"] },
          },
        },
        {
          kind: "video", mode: "mix", uid: recUidVideo,
          creq: {
            token,
            storageConfig: { ...storageConfig(env), fileNamePrefix: [`${channel}-video`, day] },
            recordingConfig: { channelType: 0, streamTypes: 2, maxIdleTime: 30, subscribeUidGroup: 0 },
            videoParams: { maxWidth: 1280, maxHeight: 720, framerate: 15 },
            recordingFileConfig: { avFileType: ["hls", "mp4"] }, // Agora rejects mp4-only even in mix; hls+mp4 where allowed, remux fallback
          },
        },
      ];
      const sessions: Record<string, unknown>[] = [];
      for (const sp of specs) {
        const acq = await agora(env, "/cloud_recording/acquire", {
          method: "POST",
          body: JSON.stringify({ cname: channel, uid: sp.uid, clientRequest: { resourceExpiredHour: 24, startParameter: sp.creq } }),
        });
        const r = acq.body?.resourceId;
        if (!r) { sessions.push({ kind: sp.kind, ok: false, error: "acquire failed", agora: acq.body }); continue; }
        let res = await agora(env, `/cloud_recording/resourceid/${encodeURIComponent(r)}/mode/${sp.mode}/start`, {
          method: "POST", body: JSON.stringify({ cname: channel, uid: sp.uid, clientRequest: sp.creq }),
        });
        // avFileType combo rejected by this Agora tier? retry once with pure hls (we remux locally)
        if ((res.body?.code ?? -1) !== 0 && String(res.body?.reason || "").includes("avFileType")) {
          const creq2 = { ...sp.creq, recordingFileConfig: { avFileType: ["hls"] } };
          const acq2 = await agora(env, "/cloud_recording/acquire", {
            method: "POST",
            body: JSON.stringify({ cname: channel, uid: sp.uid, clientRequest: { resourceExpiredHour: 24, startParameter: creq2 } }),
          });
          const r2 = acq2.body?.resourceId;
          if (r2) {
            res = await agora(env, `/cloud_recording/resourceid/${encodeURIComponent(r2)}/mode/${sp.mode}/start`, {
              method: "POST", body: JSON.stringify({ cname: channel, uid: sp.uid, clientRequest: creq2 }),
            });
            sessions.push({ kind: sp.kind + "(hls-only)", mode: sp.mode, uid: sp.uid, rid: r2, sid: res.body?.sid, ok: [0, 200].includes(res.body?.code ?? -1), ...(res.body?.code !== 0 ? { agora: res.body } : {}) });
            continue;
          }
        }
        const code = res.body?.code ?? -1;
        sessions.push({ kind: sp.kind, mode: sp.mode, uid: sp.uid, rid: r, sid: res.body?.sid, ok: code === 0 || code === 200, ...(code !== 0 ? { agora: res.body } : {}) });
      }
      return json({ ok: sessions.some((s) => s.ok === true), sessions });
    }

    if (action === "stop" || action === "query") {
      // client passes the full sessions manifest (each has its own rid/sid/mode/uid);
      // legacy single rid+sid query params still accepted.
      let items: { rid?: string; sid?: string; mode?: string; uid?: string }[] = [];
      if (action === "stop") {
        try { const b = await request.json() as { sessions?: typeof items }; if (b?.sessions) items = b.sessions; } catch { /* legacy */ }
      }
      if (!items.length) items = [{ rid, sid, mode: RECORDER_MODE, uid: recorderUid }];
      if (!items.some((it) => it.rid && it.sid)) return json({ ok: false, error: "rid+sid required" }, 400);
      const results: Record<string, unknown>[] = [];
      for (const it of items) {
        if (!it.rid || !it.sid) { results.push({ kind: it.uid, skipped: "missing rid/sid" }); continue; }
        const path = action === "stop"
          ? `/cloud_recording/resourceid/${encodeURIComponent(it.rid)}/sid/${encodeURIComponent(it.sid)}/mode/${it.mode || "individual"}/stop`
          : `/cloud_recording/resourceid/${encodeURIComponent(it.rid)}/sid/${encodeURIComponent(it.sid)}/mode/${it.mode || "individual"}/query?cname=${encodeURIComponent(channel)}`;
        const res = await agora(env, path, {
          method: action === "stop" ? "POST" : "GET",
          body: action === "stop" ? JSON.stringify({ cname: channel, uid: String(it.uid || recorderUid), clientRequest: {} }) : undefined,
        });
        results.push({ ok: (res.body?.code ?? -1) === 0 || action === "query", agora: res.body });
      }
      return json({ ok: true, results });
    }
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) {
    return json({ ok: false, error: `recording proxy failed: ${(e as Error).message}` }, 500);
  }
};
