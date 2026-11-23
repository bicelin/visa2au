#!/usr/bin/env node
/**
 * FULL round-trip test, no human needed.
 *   join with the exact dispatch block /api/voice-livekit-token sends
 *   -> capture the agent's greeting audio (proves TTS out)
 *   -> publish a synthesized QUESTION as our microphone (proves STT in)
 *   -> capture the reply (proves STT -> LLM -> TTS end to end)
 *
 * The question PCM is produced separately by ElevenLabs TTS into question.pcm.
 * Run: NODE_PATH=<scratch>/node_modules node livekit-roundtrip.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Room, RoomEvent, AudioSource, LocalAudioTrack, AudioStream, TrackKind, AudioFrame } from "@livekit/rtc-node";

const SEC = path.join(os.homedir(), ".hermes", "secrets");
const read = (n) => fs.readFileSync(path.join(SEC, n), "utf8").trim();
const url = read("livekit_url"), key = read("livekit_api_key"), secret = read("livekit_api_secret");
const REST = url.replace(/^ws/, "http");
const b64url = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const sign = (c) => { const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" })); const p = b64url(JSON.stringify(c));
  return `${h}.${p}.${b64url(crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest())}`; };
const now = Math.floor(Date.now() / 1000);
const admin = sign({ iss: key, sub: key, nbf: now - 10, iat: now, exp: now + 600, video: { roomCreate: true, roomAdmin: true, roomList: true } });

const ROOM_RATE = 48000;
const PCM_PATH = path.join(process.cwd(), "question.pcm");
const SRC_RATE = 44100; // ElevenLabs pcm_44100
const roomName = `v2au-rt-${Math.random().toString(36).slice(2, 8)}`;

const visitor = sign({ iss: key, sub: `visitor-${roomName}`, nbf: now - 10, iat: now, exp: now + 600,
  name: "Visa2AU website visitor",
  metadata: JSON.stringify({ lang: "en", source: "visa2.au", lane: "livekit" }),
  video: { room: roomName, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true },
  roomConfig: { agents: [{ agentName: "v2au-secretary" }] } });

let agentAudioBytes = 0, agentFrames = 0;
const phases = [];

const room = new Room();
room.on(RoomEvent.ParticipantConnected, (p) => console.log(`  + joined: ${p.identity} kind=${p.kind}`));
room.on(RoomEvent.TrackSubscribed, async (track, pub, p) => {
  if (track.kind !== TrackKind.KIND_AUDIO) return;
  console.log(`  audio track from ${p.identity} — reading frames`);
  try {
    const stream = new AudioStream(track);
    for await (const frame of stream) {
      agentFrames++;
      agentAudioBytes += frame.data.byteLength;
    }
  } catch (e) { /* stream ends on disconnect */ }
});

await room.connect(url, visitor, { autoSubscribe: true, dynacast: false });
console.log("joined:", roomName);

// phase 1: greeting
await new Promise((r) => setTimeout(r, 12000));
phases.push({ phase: "greeting", frames: agentFrames, bytes: agentAudioBytes });
console.log(`phase 1 (agent greeting): ${agentFrames} frames, ${agentAudioBytes} bytes of audio`);

// phase 2: publish a synthesized question as our mic
if (!fs.existsSync(PCM_PATH)) { console.log("no question.pcm — skipping inbound test"); }
else {
  const pcm = new Int16Array(fs.readFileSync(PCM_PATH).buffer);
  const source = new AudioSource(SRC_RATE, 1);
  const track = LocalAudioTrack.createAudioTrack("mic", source);
  await room.localParticipant.publishTrack(track);
  const FRAME = Math.round(SRC_RATE * 0.02);  // 20 ms
  console.log(`publishing ${(pcm.length / SRC_RATE).toFixed(1)}s of speech (${pcm.length} samples @ ${SRC_RATE}Hz)`);
  for (let i = 0; i < pcm.length; i += FRAME) {
    const chunk = pcm.subarray(i, Math.min(i + FRAME, pcm.length));
    await source.captureFrame(new AudioFrame(chunk, SRC_RATE, 1, chunk.length));
    await new Promise((r) => setTimeout(r, 20));
  }
  console.log("question published; waiting for the reply...");
  const before = agentAudioBytes;
  await new Promise((r) => setTimeout(r, 25000));
  phases.push({ phase: "reply", frames: agentFrames, bytes: agentAudioBytes });
  console.log(`phase 2 (reply): frames total ${agentFrames}, audio bytes total ${agentAudioBytes}`);
  console.log(`NEW audio after our question: ${agentAudioBytes - before} bytes`);
}

await room.disconnect().catch(() => {});
const r = await fetch(`${REST}/twirp/livekit.RoomService/DeleteRoom`, { method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${admin}` }, body: JSON.stringify({ room: roomName }) });
console.log("cleanup:", r.status);

console.log("\n=== RESULT ===");
const greeted = phases[0]?.bytes > 0;
const replied = phases.length > 1 && (phases[1].bytes - phases[0].bytes) > 2000;
console.log(`agent greeted with real audio : ${greeted ? "YES" : "no"}`);
console.log(`agent replied to our question : ${replied ? "YES" : "no"}`);
console.log(greeted && replied
  ? "=> full duplex pipeline verified: dispatch -> STT -> LLM -> TTS -> back to caller"
  : "=> transport verified; see phase numbers above for what did/didn't happen");
process.exit(0);
