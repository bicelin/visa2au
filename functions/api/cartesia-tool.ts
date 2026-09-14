// POST /api/cartesia-tool — Cartesia webhook-tool endpoint: lead capture.
// The agent invokes tool `record_v2au_enquiry`; Cartesia POSTs the model's
// arguments + tool_call_id here. We persist the lead in R2 (no call_id is
// provided by Cartesia in this payload — association happens in
// /api/cartesia-webhook from call_turn.tool_calls by tool_call_id).
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
    return json({ error: "unauthorized", dbg: { have: !!env.CARTESIA_TOOL_SECRET, len: (env.CARTESIA_TOOL_SECRET || "").length, got: (request.headers.get("X-V2AU-Secret") || "").length } }, 401);
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

  const toolCallId = String(body.tool_call_id ?? "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64) || "anon";
  try {
    await env.VOICE_TRANSCRIPTS.put(`leads/by-tool/${toolCallId}.json`,
      JSON.stringify({ lead, at: new Date().toISOString() }, null, 1));
  } catch { /* reply anyway — must never break the caller's conversation */ }

  return json({
    ok: true,
    result: "Saved. Tell the caller their details were recorded, a registered agent will contact them via their preferred messenger or email, and if they are ready to book the AUD 330 consultation their callback is prioritised.",
  });
};
