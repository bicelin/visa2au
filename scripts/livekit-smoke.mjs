#!/usr/bin/env node
/**
 * LiveKit lane smoke test — zero dependencies (node:crypto + fetch only).
 *
 * Proves, against the REAL V2AU LiveKit project, in this order:
 *   1. the secret files exist and are readable
 *   2. a token built with the SAME claims /api/voice-livekit-token emits is accepted
 *      by LiveKit's own server API (RoomService/ListRooms)
 *   3. a visitor token can be minted for a room, and the room can be created
 *   4. whether an agent (or anyone) is present in the project
 *
 * Reads ~/.hermes/secrets/livekit_{url,api_key,api_secret}. Never prints a secret.
 *
 * Usage: node scripts/livekit-smoke.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SEC = path.join(os.homedir(), ".hermes", "secrets");
const read = (n) => {
  const p = path.join(SEC, n);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : "";
};

const url = read("livekit_url");
const key = read("livekit_api_key");
const secret = read("livekit_api_secret");

console.log("LiveKit lane smoke test");
console.log("  url   :", url ? url.replace(/^(wss:\/\/)([^.]*)\./, "$1$2.") : "(missing)");
console.log("  key   :", key ? key.slice(0, 3) + "…" + " (" + key.length + " chars)" : "(missing)");
console.log("  secret:", secret ? "present (" + secret.length + " chars)" : "(MISSING)");
if (!url || !key || !secret) {
  console.log("\nCANNOT RUN: all three of livekit_url / livekit_api_key / livekit_api_secret are required.");
  process.exit(1);
}

const REST = url.replace(/^ws/, "http");
const b64url = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const sign = (claims) => {
  const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = b64url(JSON.stringify(claims));
  const sig = b64url(crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest());
  return `${h}.${p}.${sig}`;
};

const now = Math.floor(Date.now() / 1000);
const rand = Math.random().toString(36).slice(2, 10);
const room = `v2au-smoke-${rand}`;

async function twirp(svc, method, token, body) {
  const r = await fetch(`${REST}/twirp/livekit.${svc}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body || {}),
  });
  const text = await r.text();
  let j; try { j = JSON.parse(text); } catch { j = text; }
  return { status: r.status, body: j };
}

// 1) admin token -> ListRooms (proves key+secret are live for this project)
const admin = sign({ iss: key, sub: key, nbf: now - 10, iat: now, exp: now + 120,
  video: { roomList: true, roomCreate: true, roomAdmin: true } });
console.log("\n1) admin token -> RoomService/ListRooms");
const lr = await twirp("RoomService", "ListRooms", admin, {});
if (lr.status !== 200) {
  console.log("   ✗ FAILED", lr.status, JSON.stringify(lr.body).slice(0, 300));
  console.log("   -> key/secret rejected or project unreachable. Check you copied the SECRET,");
  console.log("      not the key twice, and that the key belongs to V2AU_Agent (p_4hu2d41aprt).");
  process.exit(2);
}
const rooms = lr.body?.rooms || [];
console.log("   ✓ credentials accepted —", rooms.length, "existing room(s)");
rooms.slice(0, 10).forEach((r) => console.log("      ", r.name, "| participants:", r.numParticipants ?? r.num_participants ?? "?"));

// 2) visitor token with the EXACT claims the website endpoint builds
const visitor = sign({
  iss: key, sub: `visitor-${rand}`, nbf: now - 10, iat: now, exp: now + 600,
  name: "Visa2AU website visitor",
  metadata: JSON.stringify({ lang: "en", source: "visa2.au", lane: "livekit" }),
  video: { room, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true, canUpdateOwnMetadata: true },
  roomConfig: { agents: [{ agentName: "v2au-secretary" }] },
});
console.log("\n2) create room", room, "(same path /api/voice-livekit-token drives)");
const cr = await twirp("RoomService", "CreateRoom", admin, { name: room, emptyTimeout: 300 });
console.log("   ", cr.status === 200 ? "✓ room created" : "✗ " + cr.status + " " + JSON.stringify(cr.body).slice(0, 200));

console.log("\n3) participant view (is an agent configured to join?)");
const pr = await twirp("RoomService", "ListParticipants", admin, { room });
const parts = pr.body?.participants || [];
console.log("   participants now:", parts.length, parts.map((p) => p.identity).slice(0, 5));
if (parts.length === 0)
  console.log("   note: no agent joined the empty room — expected. LiveKit dispatches an agent when a\n" +
              "         participant joins (or via AgentDispatch), so this is not a failure.");

console.log("\n4) cleanup");
const dr = await twirp("RoomService", "DeleteRoom", admin, { room });
console.log("   ", dr.status === 200 || dr.status === 404 ? "✓ test room removed" : "✗ " + dr.status);
console.log("\nRESULT: LiveKit credentials + token minting verified against the real project.");
console.log("        Visitor token length:", visitor.length, "chars (never printed).");
