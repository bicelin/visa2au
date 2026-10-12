// POST /api/voice-lead — provider-neutral lead intake for voice-agent tool calls.
//
// The agent calls its `record_v2au_enquiry` tool; the vendor POSTs the model's
// arguments here. Accepted from ANY lane (ElevenLabs webhook tool, Cartesia
// webhook tool, Pipecat) so the CRM/storage path is vendor-independent.
//
// Auth: header X-V2AU-Secret must equal VOICE_LEAD_SECRET.
// Storage (R2 bucket VOICE_TRANSCRIPTS):
//   leads/by-tool/{tool_call_id}.json        authoritative when the vendor sends an id
//   leads/ts/{epoch}-{rand}.json             time index, so a post-call webhook can
//                                            claim the newest unclaimed lead in the
//                                            call's window (some vendors don't pass
//                                            a call id to tool calls)
// The reply body is fed back to the model — keep it short and speakable.
//
// Env: VOICE_LEAD_SECRET (required), VOICE_TRANSCRIPTS (R2).

interface Env {
  VOICE_LEAD_SECRET?: string;
  VOICE_TRANSCRIPTS?: R2Bucket;
}

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const FIELDS = [
  "full_name", "name", "email", "phone", "messenger", "visa_interest", "situation",
  "wants_agent_contact", "consultation_ready", "urgency", "is_employer",
  "preferred_language", "notes",
] as const;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.VOICE_LEAD_SECRET || request.headers.get("X-V2AU-Secret") !== env.VOICE_LEAD_SECRET)
    return json({ error: "unauthorized" }, 401);
  if (!env.VOICE_TRANSCRIPTS) return json({ error: "storage unavailable" }, 503);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  // Vendor shapes differ: ElevenLabs sends { tool_call_id, ...args } (sometimes
  // nested under "arguments"/"parameters"), Cartesia sends its own envelope.
  // Pick the first object that actually carries the lead fields.
  const candidates = [body, body.arguments, body.parameters, body.args, body.tool_call]
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object");
  const src = candidates.find((c) => FIELDS.some((f) => f in c)) ?? body;

  const lead: Record<string, unknown> = {};
  for (const f of FIELDS) if (src[f] !== undefined) lead[f] = src[f];
  lead.name = lead.name ?? lead.full_name;      // normalise across vocabularies
  lead.received_at = new Date().toISOString();
  lead.provider = String(body.provider ?? src.provider ?? "unknown");
  lead.tool_call_id = String(body.tool_call_id ?? src.tool_call_id ?? "");
  lead.call_id = String(body.call_id ?? src.call_id ?? body.conversation_id ?? src.conversation_id ?? "");

  // Minimum viable lead: a name plus one contact channel.
  const hasName = typeof lead.name === "string" && lead.name.trim().length > 0;
  const hasContact = [lead.email, lead.phone, lead.messenger]
    .some((v) => typeof v === "string" && v.trim().length > 0);
  lead.complete = hasName && hasContact;

  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  const payload = JSON.stringify(lead, null, 1);

  try {
    await Promise.all([
      lead.tool_call_id
        ? env.VOICE_TRANSCRIPTS.put(`leads/by-tool/${lead.tool_call_id}.json`, payload)
        : Promise.resolve(null),
      env.VOICE_TRANSCRIPTS.put(`leads/ts/${ts}-${rand}.json`, payload),
    ]);
  } catch {
    // Never block the conversation on storage — the post-call webhook is the backstop.
  }

  return json({
    status: "recorded",
    message: lead.complete
      ? "Enquiry saved. Tell the caller a registered agent will contact them."
      : "Saved, but a name and at least one contact channel are still missing — please ask for them.",
  });
};
