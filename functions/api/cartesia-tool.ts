// POST /api/cartesia-tool — Cartesia webhook-tool endpoint: lead capture.
// The agent invokes tool `record_v2au_enquiry`; Cartesia POSTs the model's
// arguments + tool_call_id here. Stored twice:
//   leads/by-tool/{tool_call_id}.json      — authoritative (used if lifecycle
//                                            call_turn events arrive)
//   leads/ts/{epoch}-{rand}.json           — time-window index; Cartesia does
//                                            NOT pass call_id to tool calls and
//                                            Bot Fight Mode may drop call_turn
//                                            webhooks, so /api/cartesia-webhook
//                                            claims the most recent unclaimed
//                                            lead within the call's time window.
// Reply body is fed back to the model, so keep it short (<4 KiB).
// Env: CARTESIA_TOOL_SECRET (X-V2AU-Secret), VOICE_TRANSCRIPTS (R2).
interface Env {
  CARTESIA_TOOL_SECRET?: string;
  VOICE_TRANSCRIPTS?: R2Bucket;
}

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

const FIELDS = [
  "name", "email", "phone", "messenger", "visa_interest", "situation",
  "wants_agent_contact", "consultation_ready", "preferred_language", "notes",
] as const;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CARTESIA_TOOL_SECRET || request.headers.get("X-V2AU-Secret") !== env.CARTESIA_TOOL_SECRET)
    return json({ error: "unauthorized" }, 401);
  if (!env.VOICE_TRANSCRIPTS) return json({ error: "storage unavailable" }, 503);

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return json({ error: "invalid json" }, 400); }

  // Arguments may arrive flat or nested (schema evolves) — take the first shape that has `name`.
  const cands = [body, body.arguments, body.parameters, body.args].filter(
    (c): c is Record<string, unknown> => !!c && typeof c === "object"
  );
  const src = cands.find((c) => "name" in c) ?? body;

  const lead: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = (src as Record<string, unknown>)[f];
    if (v !== undefined && v !== null && v !== "") lead[f] = String(v).slice(0, 500);
  }
  if (!lead.name || !lead.email)
    return json({ ok: false, result: "Rejected: name and email are required before saving." });

  const now = Date.now();
  const at = new Date(now).toISOString();
  const toolCallId = String(body.tool_call_id ?? "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64) || "anon";
  const rand = Math.random().toString(36).slice(2, 8);
  try {
    const rec = JSON.stringify({ lead, at, tool_call_id: toolCallId, claimed: false }, null, 1);
    await Promise.all([
      env.VOICE_TRANSCRIPTS.put(`leads/by-tool/${toolCallId}.json`, rec),
      env.VOICE_TRANSCRIPTS.put(`leads/ts/${now}-${rand}.json`, rec),
    ]);
  } catch { /* reply anyway — must never break the caller's conversation */ }

  return json({
    ok: true,
    result: "Saved. Tell the caller their details were recorded, a registered agent will contact them via their preferred messenger or email, and if they are ready to book the AUD 330 consultation their callback is prioritised.",
  });
};
