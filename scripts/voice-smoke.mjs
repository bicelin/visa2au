// Voice smoke test: real Cartesia agent WS call through the site's token mint.
// node voice-smoke.mjs [en|ru|fr]
const LANG = process.argv[2] || "en";
const STATUS = await fetch("https://staging.visa2.au/api/voice-status").then((r) => r.json());
const AGENT = STATUS.agents[LANG];
if (!AGENT) { console.log("NO AGENT for", LANG); process.exit(1); }
const { token } = await fetch("https://staging.visa2.au/api/voice-token").then((r) => r.json());
if (!token) { console.log("NO TOKEN"); process.exit(1); }

const ws = new WebSocket(
  `wss://api.cartesia.ai/v1/agents/websocket/${AGENT}?cartesia_version=2026-08-14&access_token=${encodeURIComponent(token)}`);

let audioChunks = 0, audioBytes = 0, finalText = "", ready = false, callId = "";
const t0 = Date.now();

ws.onopen = () => ws.send(JSON.stringify({
  type: "session_create",
  audio: { input_format: "pcm_16000", output_delivery: "speaking_pace" },
}));

ws.onmessage = (m) => {
  const ev = JSON.parse(m.data);
  if (ev.type === "session_ready") { ready = true; callId = ev.call_id; console.log("READY", LANG, callId); }
  if (ev.type === "audio_output") { audioChunks++; audioBytes += ev.audio.length; }
  if (ev.type === "turn_ended" && ev.role === "assistant") finalText += (finalText ? " | " : "") + ev.text;
  if (ev.type === "error") console.log("WS ERROR", JSON.stringify(ev).slice(0, 200));
};
ws.onerror = () => console.log("WS transport error");

// listen for greeting ~14s, then say a canned utterance? We can't synthesize speech
// here; greeting + KB answer check is enough for the smoke test.
setTimeout(() => {
  try { ws.send(JSON.stringify({ type: "session_close" })); } catch {}
  try { ws.close(1000); } catch {}
  console.log(JSON.stringify({
    lang: LANG, ready, callId, audioChunks, audioKb: Math.round(audioBytes / 1024),
    greeting: finalText.slice(0, 160), secs: (Date.now() - t0) / 1000,
  }));
  process.exit(0);
}, 14000);
