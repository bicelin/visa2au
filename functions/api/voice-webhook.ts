// POST /api/voice-webhook — ElevenLabs Conversational AI webhook.
// On call end: extracts transcript + call summary (collected data: contact,
// visa type, consultation need), emails the Visa2AU team via Resend.
// Env: RESEND_API_KEY (required), NOTIFY_TO?, FROM_EMAIL?,
//      VOICE_WEBHOOK_SECRET? (verify `elevenlabs-signature: t=<ts>,v0=<hex>`
//      HMAC-SHA256(secret, "<ts>."+rawBody), 30-min window),
//      ELEVENLABS_API_KEY? (fetch full transcript/analysis when omitted).
//
// Agent dashboard (ElevenLabs → agent → Security/Webhook):
//   URL: https://staging.visa2.au/api/voice-webhook  (production: https://visa2.au/api/voice-webhook)
//   Events: post-call transcription (webhook type "post_call_transcription")
//   Secret: <VOICE_WEBHOOK_SECRET> — staging: wsec_6074…, prod: wsec_06f2…

interface Env {
  RESEND_API_KEY: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
  VOICE_WEBHOOK_SECRET?: string;
  ELEVENLABS_API_KEY?: string;
}

const DASHBOARD = "https://elevenlabs.io/app/conversational-ai/conversations";

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

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

// ElevenLabs webhook signature: header `elevenlabs-signature: t=<ts>,v0=<hex>`
// with v0 = HMAC-SHA256(secret, "<ts>." + rawBody), valid within 30 minutes.
async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifySignature(rawBody: string, header: string | null, secret: string): Promise<boolean> {
  if (!header) return false;
  const params = new Map<string, string>();
  for (const kv of header.split(",")) {
    const i = kv.indexOf("=");
    if (i > 0) params.set(kv.slice(0, i), kv.slice(i + 1));
  }
  const ts = params.get("t") || "";
  if (!/^\d+$/.test(ts)) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 1800) return false; // 30-min window
  const expected = await hmacHex(secret, `${ts}.${rawBody}`);
  const provided = [...params.entries()].filter(([k]) => k.startsWith("v")).map(([, v]) => v);
  for (const sig of provided) {
    if (await safeEqual(expected.toLowerCase(), sig.toLowerCase())) return true;
  }
  return false;
}

function get(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const k of path.split(".")) {
    if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return cur;
}

function fmtTranscript(t: unknown): string {
  if (typeof t === "string") return t.trim();
  if (Array.isArray(t)) {
    return t
      .map((m: { role?: string; message?: string; time_in_call_secs?: number }) => {
        const who = m.role === "agent" ? "Visa2AU" : "Caller";
        const secs = m.time_in_call_secs ?? 0;
        const mm = String(Math.floor(secs / 60)).padStart(2, "0");
        const ss = String(Math.floor(secs % 60)).padStart(2, "0");
        return `[${mm}:${ss}] ${who}: ${m.message ?? ""}`;
      })
      .join("\n");
  }
  return "";
}

function toCollectedList(v: unknown): { collection_name: string; result: unknown }[] {
  if (Array.isArray(v)) return v as { collection_name: string; result: unknown }[];
  if (v && typeof v === "object") {
    return Object.entries(v as Record<string, unknown>).map(([k, val]) => ({
      collection_name: k,
      result: val && typeof val === "object" ? (val as any)?.value ?? (val as any)?.result ?? val : val,
    }));
  }
  return [];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const rawBody = await request.text();

  // --- verify the caller (when a secret is configured) ---
  if (env.VOICE_WEBHOOK_SECRET) {
    const ok = await verifySignature(rawBody, request.headers.get("elevenlabs-signature"), env.VOICE_WEBHOOK_SECRET);
    if (!ok) return json({ ok: false, error: "Bad signature" }, 401);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // ElevenLabs post-call webhooks wrap everything under `data`
  // {type:"post_call_transcription", data:{conversation_id, status, transcript,
  //  metadata, analysis, conversation_initiation_client_data}}
  const data = (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data))
    ? (payload.data as Record<string, unknown>)
    : payload;
  const type = String(payload.type || data.type || "");
  const conversationId = String(get(data, "conversation_id") || data.id || "");
  const status = String(get(data, "status") || "");

  // Only terminal events carry a useful transcript
  const terminal = /post_call_transcription/i.test(type) ||
    /done|completed|ended|interrupted|canceled|cancelled/i.test(status) ||
    /conversation_completed|conversation_end/i.test(type);
  if (!terminal || !conversationId) {
    return json({ ok: true, skipped: "non-terminal event" });
  }

  // --- assemble the pieces ---
  let transcript = fmtTranscript(get(data, "transcript"));
  let analysis = get(data, "analysis") as Record<string, unknown> | undefined;
  let collected = toCollectedList(get(data, "analysis.data_collection_results"));
  if (env.ELEVENLABS_API_KEY) {
    // fetch full transcript + analysis from the Conversations API when missing
    if (!transcript || !analysis) {
      try {
        const r = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`, {
          headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
        });
        if (r.ok) {
          const conv = (await r.json()) as Record<string, unknown>;
          if (!transcript) transcript = fmtTranscript(get(conv, "transcript") ?? get(conv, "conversation.transcript"));
          if (!analysis) analysis = get(conv, "analysis") as Record<string, unknown> | undefined;
          if (!collected.length) collected = toCollectedList(get(conv, "metadata.data_collection_results"));
        }
      } catch {
        /* transcript fetch is best-effort */
      }
    }
  }

  const summary = String(
    (analysis && (analysis.transcript_summary ?? analysis.summary)) || ""
  );
  const dv = (get(data, "conversation_initiation_client_data.dynamic_variables") ||
    get(data, "dynamic_variables")) as Record<string, unknown> | undefined;
  const userName = String(
    dv?.user_name || (collected?.find((c) => String((c as any)?.collection_name).toLowerCase().includes("name")) as any)?.result || "Guest"
  );
  const durationSecs = Number(get(data, "metadata.call_duration_secs") ?? 0);

  const fields: { label: string; value: string }[] = [];
  if (Array.isArray(collected)) {
    for (const c of collected) {
      const cc = c as { collection_name?: string; result?: unknown };
      if (cc.collection_name && cc.result !== undefined && cc.result !== null) {
        fields.push({ label: String(cc.collection_name), value: String(cc.result) });
      }
    }
  }
  const collectedHtml = fields.length
    ? `<h3>Collected on call</h3><table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
       ${fields.map((f) => `<tr><td style="border:1px solid #ddd;padding:6px 10px;font-weight:bold">${escapeHtml(f.label)}</td><td style="border:1px solid #ddd;padding:6px 10px">${escapeHtml(f.value)}</td></tr>`).join("")}
     </table>`
    : "";

  const truncated = transcript.slice(0, 12000);
  const transcriptHtml = truncated
    ? `<h3>Transcript</h3><pre style="font-family:ui-monospace,Menlo,monospace;font-size:12px;line-height:1.5;white-space:pre-wrap;background:#f6f7f9;padding:14px;border-radius:8px">${escapeHtml(truncated)}</pre>`
    : "<p><i>No transcript captured.</i></p>";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a2333">
      <h2 style="color:#0a0f1c">Voice call report — Visa2AU assistant</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td style="font-weight:bold">Status</td><td>${escapeHtml(status || "completed")}</td></tr>
        <tr><td style="font-weight:bold">Caller</td><td>${escapeHtml(userName)}</td></tr>
        ${durationSecs > 0 ? `<tr><td style="font-weight:bold">Duration</td><td>${Math.floor(durationSecs / 60)}m ${Math.round(durationSecs % 60)}s</td></tr>` : ""}
        <tr><td style="font-weight:bold">Conversation</td><td><a href="${DASHBOARD}/${encodeURIComponent(conversationId)}?tab=transcript">${escapeHtml(conversationId)}</a></td></tr>
        ${summary ? `<tr><td style="font-weight:bold">Summary</td><td>${escapeHtml(summary)}</td></tr>` : ""}
      </table>
      ${collectedHtml}
      <div style="margin-top:16px">${transcriptHtml}</div>
      <p style="color:#888;font-size:12px;margin-top:20px">Sent by the Visa2AU voice-assistant webhook.</p>
    </div>`;

  const to = env.NOTIFY_TO || "info@visa2.au";
  const from = env.FROM_EMAIL || "noreply@visa2.au";
  const subject = `Voice call: ${userName} — ${status || "completed"}`;

  const er = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Visa2AU Website <${from}>`, to: [to], subject, html }),
  });
  if (!er.ok) {
    return json({ ok: false, error: "Email delivery failed", detail: (await er.text()).slice(0, 200) }, 502);
  }
  return json({ ok: true, conversation_id: conversationId, email_to: to });
};
