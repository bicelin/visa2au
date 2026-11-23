#!/usr/bin/env node
/**
 * Does a dispatchable agent exist in V2AU_Agent, and under what name?
 * My /api/voice-livekit-token asks for agentName "v2au-secretary"; LiveKit errors
 * differently for "unknown agent name" vs "no workers available", which tells us
 * whether the name needs changing. Creates + deletes its own room.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SEC = path.join(os.homedir(), ".hermes", "secrets");
const read = (n) => fs.readFileSync(path.join(SEC, n), "utf8").trim();
const url = read("livekit_url"), key = read("livekit_api_key"), secret = read("livekit_api_secret");
const REST = url.replace(/^ws/, "http");
const b64url = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const sign = (c) => { const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" })); const p = b64url(JSON.stringify(c));
  return `${h}.${p}.${b64url(crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest())}`; };
const now = Math.floor(Date.now() / 1000);
const admin = sign({ iss: key, sub: key, nbf: now - 10, iat: now, exp: now + 120,
  video: { roomList: true, roomCreate: true, roomAdmin: true, agentDispatch: true, agent: true, roomJoin: true } });

async function twirp(svc, method, body) {
  const r = await fetch(`${REST}/twirp/livekit.${svc}/${method}`, { method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${admin}` }, body: JSON.stringify(body || {}) });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
  return { status: r.status, body: j };
}

const room = `v2au-probe-${Math.random().toString(36).slice(2, 8)}`;
await twirp("RoomService", "CreateRoom", { name: room, emptyTimeout: 120 });
console.log("probe room:", room);

for (const name of ["v2au-secretary"]) {
  const d = await twirp("AgentDispatchService", "CreateDispatch", { room, agent_name: name });
  console.log(`\nCreateDispatch agent_name=${name} -> ${d.status}`);
  console.log("   ", JSON.stringify(d.body).slice(0, 300));
}

const l = await twirp("AgentDispatchService", "ListDispatch", { room });
console.log("\nListDispatch ->", l.status, JSON.stringify(l.body).slice(0, 300));

await twirp("RoomService", "DeleteRoom", { room });
console.log("\nprobe room deleted");
console.log(`
INTERPRETATION:
  - 200/"agent_name"              -> a worker with that name exists and was dispatched
  - error mentioning the agent name -> no such agent name; use theirs (or automatic dispatch)
  - "no workers available"/similar  -> name is known but no worker is online right now
`);
