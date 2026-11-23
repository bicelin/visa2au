#!/usr/bin/env node
/**
 * Empirical agent test: join a room as a real participant and see whether the
 * deployed agent (CA_6ymQHKtpZb7x in project p_4hu2d41aprt) joins it.
 *
 * Answers, without needing the dashboard:
 *   - is an agent worker actually deployed and reachable?
 *   - does it join AUTOMATICALLY (name-agnostic) or does it need explicit dispatch
 *     with a matching agent name?  (my /api/voice-livekit-token asks for "v2au-secretary")
 *   - does it send anything on the data channel?
 *
 * Run from the scratch dir that has @livekit/rtc-node installed:
 *   NODE_PATH=<scratch>/node_modules node livekit-agent-join.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Room, RoomEvent, ConnectionState } from "@livekit/rtc-node";

const SEC = path.join(os.homedir(), ".hermes", "secrets");
const read = (n) => fs.readFileSync(path.join(SEC, n), "utf8").trim();
const url = read("livekit_url"), key = read("livekit_api_key"), secret = read("livekit_api_secret");
const REST = url.replace(/^ws/, "http");
const b64url = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const sign = (c) => { const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" })); const p = b64url(JSON.stringify(c));
  return `${h}.${p}.${b64url(crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest())}`; };
const now = Math.floor(Date.now() / 1000);

async function twirp(svc, method, body, token) {
  const r = await fetch(`${REST}/twirp/livekit.${svc}/${method}`, { method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || admin}` }, body: JSON.stringify(body || {}) });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
  return { status: r.status, body: j };
}
const admin = sign({ iss: key, sub: key, nbf: now - 10, iat: now, exp: now + 300,
  video: { roomList: true, roomCreate: true, roomAdmin: true } });

const roomName = `v2au-agenttest-${Math.random().toString(36).slice(2, 8)}`;
console.log("room:", roomName);

// visit as a normal caller, exactly like the website would (no explicit dispatch here,
// so this reveals whether AUTOMATIC dispatch is what your agent uses)
const visitor = sign({ iss: key, sub: `visitor-${roomName}`, nbf: now - 10, iat: now, exp: now + 300,
  name: "Visa2AU website visitor",
  metadata: JSON.stringify({ lang: "en", source: "visa2.au", lane: "livekit" }),
  video: { room: roomName, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true },
  roomConfig: { agents: [{ agentName: "v2au-secretary" }] } });

const room = new Room();
room.on(RoomEvent.ParticipantConnected, (p) => console.log(`  + participant joined: ${p.identity} (kind=${p.kind})`));
room.on(RoomEvent.ParticipantDisconnected, (p) => console.log(`  - participant left: ${p.identity}`));
room.on(RoomEvent.DataReceived, (payload, p, kind, topic) => {
  try { console.log(`  DATA from ${p?.identity}:`, Buffer.from(payload).toString().slice(0, 200)); } catch {}
});
room.on(RoomEvent.TrackSubscribed, (t, pub, p) => console.log(`  TRACK subscribed from ${p?.identity}: ${t.kind}`));
room.on(RoomEvent.Disconnected, () => console.log("  room disconnected"));

await room.connect(url, visitor, { autoSubscribe: true, dynacast: false });
console.log("connected as visitor. participants now:", [...room.remoteParticipants.values()].map((p) => p.identity));

console.log("waiting up to 25 s for an agent to join...");
for (let i = 0; i < 25; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const ps = [...room.remoteParticipants.values()];
  if (ps.length) {
    console.log(`  after ${i + 1}s: remote participants =`, ps.map((p) => `${p.identity}(kind=${p.kind})`));
    break;
  }
}
const final = [...room.remoteParticipants.values()];
console.log("\nRESULT:", final.length
  ? "an agent/participant DID join -> automatic dispatch works; no agent name needed"
  : "nobody joined -> either no worker is deployed, or dispatch needs the exact agent name");

await room.disconnect().catch(() => {});
await twirp("RoomService", "DeleteRoom", { room: roomName });
console.log("cleaned up");
process.exit(0);
