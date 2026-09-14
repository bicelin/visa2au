// POST /api/cartesia-webhook — Cartesia agent lifecycle webhook.
// Events: call_started | call_turn | call_completed | call_failed | post_call_analysis.
//   call_turn     → persist tool_call_id→call_id mapping for record_v2au_enquiry
//                   (lead args were already stored by /api/cartesia-tool under
//                   leads/by-tool/{tool_call_id}.json).
//   call_completed/failed → assemble ONE combined email to the notification
//                   mailbox: captured lead (if any) + full transcript + summary
//                   + recording link (WAV fetched from Cartesia, stored in R2
//                   ENQUIRIES bucket, served via the existing HMAC-signed
//                   /api/file/{key} route, 7-day expiry).
// Idempotent per webhook_request_id (retries) and per call (sent flag).
// Env: CARTESIA_WEBHOOK_SECRET (x-webhook-secret header), CARTESIA_API_KEY,
//      VOICE_TRANSCRIPTS (R2), ENQUIRIES (R2), ENQUIRY_HMAC_SECRET,
//      NOTIFY_TO? (default sergey@visa2.au), FROM_EMAIL? (default noreply@visa2.au),
//      RESEND_API_KEY.
interface Env {
  CARTESIA_WEBHOOK_SECRET?: string;
  CARTESIA_API_KEY?: string;
  VOICE_TRANSCRIPTS?: R2Bucket;
  ENQUIRIES?: R2Bucket;
  ENQUIRY_HMAC_SECRET?: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
}

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

async function sign(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const safeId = (s: unknown) => String(s ?? "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);

interface Turn { tool_calls?: Array<{ id?: string; name?: string; arguments?: unknown }> }

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CARTESIA_WEBHOOK_SECRET || request.headers.get("x-webhook-secret") !== env.CARTESIA_WEBHOOK_SECRET)
    return json({ error: "unauthorized" }, 401);
  if (!env.VOICE_TRANSCRIPTS) return json({ error: "storage unavailable" }, 503);

  let ev: { type?: string; call_id?: string; webhook_request_id?: string;
            turn?: Turn; call?: Record<string, unknown> };
  try { ev = await request.json() as typeof ev; }
  catch { return json({ ok: true, ignored: "unparsable" }); }

  const callId = safeId(ev.call_id);
  if (!callId) return json({ ok: true, ignored: "no call_id" });

  // --- call_turn: persist tool_call_id -> call mapping (cheap, never blocks) ---
  if (ev.type === "call_turn" && ev.turn?.tool_calls?.length) {
    for (const tc of ev.turn.tool_calls) {
      if (tc.name !== "record_v2au_enquiry" || !tc.id) continue;
      try {
        await env.VOICE_TRANSCRIPTS.put(`calls/${callId}/toolcall-${safeId(tc.id)}.json`,
          JSON.stringify({ tool_call_id: String(tc.id), args: tc.arguments ?? null }));
      } catch { /* best-effort */ }
    }
    return json({ ok: true });
  }

  // --- call_completed / call_failed: one combined email ---
  if (ev.type !== "call_completed" && ev.type !== "call_failed") return json({ ok: true });

  const reqId = safeId(ev.webhook_request_id);
  const r2 = env.VOICE_TRANSCRIPTS;
  try {
    if (reqId) {
      const seen = await r2.get(`processed/${reqId}`);
      if (seen) return json({ ok: true, deduped: true });
      await r2.put(`processed/${reqId}`, "1");
    }
    if (await r2.get(`calls/${callId}/done`)) return json({ ok: true, deduped: "call" });

    // lead: find the tool_call(s) for this call, read the stored args
    let lead: Record<string, string> | null = null;
    try {
      const listing = await r2.list({ prefix: `calls/${callId}/toolcall-`, limit: 10 });
      for (const obj of listing.objects) {
        const gm = await r2.get(obj.key);
        if (!gm) continue;
        const map = JSON.parse(await gm.text()) as { tool_call_id?: string };
        if (!map.tool_call_id) continue;
        const f = await r2.get(`leads/by-tool/${safeId(map.tool_call_id)}.json`);
        if (f) { lead = JSON.parse(await f.text()).lead; break; }
      }
    } catch { /* transcript email still goes out */ }

    const call = (ev.call ?? {}) as { transcript?: Array<{ role?: string; text?: string }>;
      start_time?: string; end_time?: string; agent_name?: string; error_message?: string };
    const transcript: Array<{ role?: string; text?: string }> = call.transcript ?? [];

    // recording (best-effort): WAV from Cartesia -> ENQUIRIES bucket -> signed link
    let recLink = "";
    if (env.CARTESIA_API_KEY && env.ENQUIRIES && env.ENQUIRY_HMAC_SECRET) {
      try {
        const ar = await fetch(`https://api.cartesia.ai/agents/calls/${callId}/audio`, {
          headers: { "X-API-Key": env.CARTESIA_API_KEY, "Cartesia-Version": "2026-03-01" },
        });
        if (ar.ok) {
          const buf = await ar.arrayBuffer();
          if (buf.byteLength > 0 && buf.byteLength < 80 * 1024 * 1024) {
            const key = `voice/${callId}/recording.wav`;
            await env.ENQUIRIES.put(key, buf, { httpMetadata: { contentType: "audio/wav" } });
            const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
            const sig = await sign(env.ENQUIRY_HMAC_SECRET, `${key}:${exp}`);
            const base = new URL(request.url).origin;
            recLink = `${base}/api/file/${encodeURIComponent(key)}?exp=${exp}&sig=${sig}`;
          }
        }
      } catch { /* recording optional */ }
    }

    if (!lead && transcript.length === 0 && !recLink) return json({ ok: true, skipped: "empty call" });

    const to = env.NOTIFY_TO || "sergey@visa2.au";
    const from = env.FROM_EMAIL || "noreply@visa2.au";
    const leadHtml = lead ? `<h2>Captured enquiry</h2><table cellpadding="4">` +
      Object.entries(lead).map(([k, v]) =>
        `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(String(v))}</td></tr>`).join("") +
      `</table>` : `<p><i>No structured lead was captured during this call.</i></p>`;
    const prio = lead?.consultation_ready === "true" || lead?.consultation_ready === "True"
      ? `<p style="color:#b45309"><b>⚡ Consultation-ready (AUD 330) — PRIORITISE this callback.</b></p>` : "";
    const trHtml = transcript.length
      ? `<h2>Transcript (${transcript.length} turns)</h2>` + transcript.map((t) =>
          `<p><b>${t.role === "user" ? "Caller" : "Agent"}:</b> ${escapeHtml(t.text ?? "")}</p>`).join("")
      : "<p><i>No transcript.</i></p>";
    const html = `<h1>Visa2AU voice agent — call report</h1>
      <p>Agent: ${escapeHtml(call.agent_name || "—")} · Started: ${escapeHtml(call.start_time || "—")} ·
      Ended: ${escapeHtml(call.end_time || ev.type)} · Call ID: <code>${callId}</code></p>
      ${call.error_message ? `<p style="color:#dc2626"><b>Error:</b> ${escapeHtml(call.error_message)}</p>` : ""}
      ${prio}${leadHtml}
      ${recLink ? `<p><a href="${recLink}">▶ Download call recording (WAV, link valid 7 days)</a></p>` : "<p><i>No recording available.</i></p>"}
      ${trHtml}`;

    const payload = { lead, call_id: callId, at: new Date().toISOString(), transcript, recording: recLink };
    await r2.put(`calls/${callId}/report.json`, JSON.stringify(payload, null, 1));

    const hasEmail = lead || transcript.length;
    if (hasEmail && env.RESEND_API_KEY) {
      const subject = lead
        ? `Voice agent enquiry: ${lead.name} — ${lead.visa_interest || lead.preferred_language || "consultation"}`
        : `Voice agent call finished (${ev.type}) — ${callId.slice(0, 14)}`;
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `Visa2AU Voice Agent <${from}>`,
            to: [to],
            reply_to: lead?.email || undefined,
            subject, html,
          }),
        });
      } catch { /* report already in R2 */ }
    }
    await r2.put(`calls/${callId}/done`, "1");
    return json({ ok: true, emailed: hasEmail, recording: !!recLink });
  } catch (err) {
    return json({ ok: false, detail: String(err).slice(0, 160) }, 200); // 200: no infinite retries on our bugs
  }
};
