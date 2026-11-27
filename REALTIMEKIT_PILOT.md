# RealtimeKit pilot — the two questions it must answer

Enabled/assessed 27 Nov 2026. This is a **pilot**, not a migration: Daily stays live
on `/video` and `/ru/video` until this proves itself, and LiveKit stays the voice agent.

## What we are testing

1. **Does a recording land in OUR bucket?** — `storage_config` → R2, so it is not
   deleted after RealtimeKit's 7-day retention.
2. **Is Russian speech transcribed usably?** — real-time is Deepgram Nova-3,
   post-meeting is Whisper Large v3 Turbo, both on Workers AI. Untested in Russian.

Everything else (pricing, HD, UI) is already answered below.

## HD — yes, and it costs nothing extra

| Question | Answer |
|---|---|
| HD on a 1:1 call? | **Yes** — `1280×720` is the default for two participants, and the docs name **"remote consultations"** as a case that should use `1920×1080` |
| Simulcast on a 1:1? | **Off** — one receiver gains nothing from extra layers, it only burns CPU |
| Default if we configure nothing | **`640×480`** for group calls — too soft for reading a document on screen |
| Set it how | preset resolution, or `mediaConfiguration.video = { width: {ideal:1920}, height: {ideal:1080}, frameRate: {ideal:24} }` on init |
| Bandwidth at 1080p | 3.5–14 Mbps each way, **1.6–6.3 GB per hour** (720p is 1.5–6 Mbps, 675 MB–2.7 GB) |
| **Recording resolution** | **`1280×720` fixed** — H.264/MP4 with 384 kbps AAC (VP8/WebM is also 720p). No 1080p recordings |

So: **the call can be 1080p, the recording is 720p.** If a client holds a passport
page or a grant letter to the camera, 720p + 384 kbps audio is the ceiling — that is
the one quality limit to check before choosing this over Daily.

**Price does not move with resolution.** RealtimeKit bills $0.002/participant-minute
flat, while Agora charges by resolution — HD $3.99 and Full HD $8.99 per 1,000 minutes.
A 1080p consult therefore costs **~4.5× less** here than the Full HD tier on Agora.

## Five seats changes the profile

A consult is not always two people: it can be the agent, the client, a partner or a
parent, and an interpreter — **up to five**. The docs' own table then says:

| Session | Resolution | Simulcast | FPS |
|---|---|---|---|
| 1:1 | 720p–1080p | **off** | 24–30 |
| 3×3 group (up to 9) | **480p** | **on** | 24 |
| pinned speaker + gallery | 720p–1080p speaker, 240p others | **on** | 24 |

So the 1080p/simulcast-off profile above is a **two-person** answer. What the app now
carries:

| Preset | Video | Screenshare | Tiles |
|---|---|---|---|
| `consult` (host) | **720p @30, simulcast on** | **1080p @15** | 5 desktop / 5 mobile |
| `consult-member` (client) | same | same | same, **cannot kick** |

Why 720p rather than 1080p with five: at 1080p each sender uploads 3.5–14 Mbps and
every receiver pulls **four** such streams — up to 56 Mbps, which no Russian mobile
line survives. Simulcast sends 720/360/180p layers and the SFU gives each receiver the
one its line can carry, so the weak link degrades **itself** instead of the room.
Documents stay readable because **screenshare is 1080p** — that is where a passport
page is read, not the camera tile.

**Cost at five people, one hour:** 300 participant-minutes per consult, so the 10,000
free minutes cover **33 consults a month**; the composite recording is still 60 export
minutes per call, so ~1.6 recorded hours a month are free.


## Blocker (verified, not assumed)

**The app already exists** — nothing to create:

```
App ID   b6cf201d-535c-46dc-a1ee-ae371a08af81
Created  ~1 year ago (Realtime → RealtimeKit in the dashboard)
Account  cf-e083bfeb02246c4cdc38abb254675f56
```

The token on disk is real but carries no Realtime permission, and the label the
docs tell you to look for **does not exist in the picker**:

| Docs say | Picker actually says |
|---|---|
| `Realtime` → `Realtime Admin` | **`Cloudflare Realtime`** → Read / **Edit** (account scope) |
| — | permission-group API names: `Realtime Read` / `Realtime Write` |

So search the picker for **`realtime`** — not "realtime admin" — and pick
**Cloudflare Realtime → Edit**.


## Setup, in order

```bash
# 1. secrets (astra-staging serves visa2.au)
#    APP_ID is not a secret — it is the existing app above.
printf 'b6cf201d-535c-46dc-a1ee-ae371a08af81' > /tmp/rtk_app_id && chmod 600 /tmp/rtk_app_id
npx wrangler pages secret put RTK_APP_ID       --project-name astra-staging < /tmp/rtk_app_id
npx wrangler pages secret put RTK_API_TOKEN    --project-name astra-staging < ~/.hermes/secrets/rtk_api_token

# 2. R2 keys — reuse the pair that already backs /api/agora-recording,
#    so the pilot needs no new credentials (RTK_R2_* fall back to AGORA_R2_*).

# 3. deploy, then verify WITHOUT booking a call
curl -s 'https://visa2.au/api/realtime-token?check=1'
#    → expect { ok: true, configured: { … all true }, note: "recordings land in our bucket" }
```

## The test itself

1. `POST /api/realtime-token` with `{ name, passcode }` → returns `meetingId`,
   `preset`, `authToken`, `recording: true`. The meeting is created with
   `record_on_start`, `transcribe_on_end`, `summarize_on_end` and the R2
   `storage_config`.

   ```bash
   curl -s -X POST https://visa2.au/api/realtime-token \
     -H 'content-type: application/json' \
     -d '{"name":"Sergey","passcode":"<lobby passcode>"}'
   ```

2. Each person opens the pilot page **locally** — no npm, no build, and the site's
   CSP is never touched, because the page is not served by the site:

   ```bash
   python3 -m http.server 8788 --directory scripts/rtk-pilot
   # each browser:  http://localhost:8788/?authToken=<that person's authToken>
   ```

   Mint one token per seat — `"role":"host"` for the agent, `"role":"member"` for
   everyone else, so only the agent can mute or remove anyone:

   ```bash
   curl -s -X POST https://visa2.au/api/realtime-token \
     -H 'content-type: application/json' \
     -d '{"name":"Natasha","passcode":"<lobby passcode>","role":"member"}'
   ```

   Five seats is the ceiling to test: agent + client + partner/parent + interpreter.
   `scripts/rtk-pilot/index.html` is the quickstart's own Web Components snippet
   (jsdelivr CDN, pinned only by `@latest` — pin it before production).

3. Talk **in Russian for 3–5 minutes**, share one document on screen — and
   deliberately have one participant on a weak connection (mobile data, not Wi-Fi)
   to see simulcast do its job rather than the room stalling.
4. `GET /api/realtime-recording?action=status&meetingId=…` with the
   `x-agent-passcode` header, then `action=list` for the download URL.
5. Confirm the file is in **our** R2 under `realtime/`, not only in RealtimeKit's bucket.

## What the quickstart changed in the code

| Quickstart point | What we did |
|---|---|
| "Skip this step if you created the app in the dashboard — default presets are already set up" | we no longer send `preset_name: "default"` (not a real preset name); the function lists presets and uses the first, or `RTK_PRESET` if set |
| Response field is called `authToken` | accept `token` **or** `authToken` — the two docs pages disagree |
| Web Components load from a CDN | that is the pilot page above, so no build step and no CSP work |
| "Create different apps for staging and production" | the existing app `b6cf201d…` is a year old; create a **second app** before this leaves the pilot |


## Pass / fail

| Check | Pass looks like |
|---|---|
| Recording exists | `action=list` returns a row with `download` **and** the object is in our R2 |
| Retention | the file is still ours **after 7 days** (RealtimeKit deletes its copy) |
| Russian transcript | names, dates and visa subclasses transcribed correctly enough to file |
| Audio | both voices intelligible at 384 kbps |
| Mobile | a client can join on a phone in Safari without installing anything |

**Stop and go back to Daily if:** the Russian transcript is not filable, or the
720p recording cannot resolve a document, or the Beta API churns under us.

## Decision

Cron `c765032a0438` runs **4 Dec 2026** and asks for KEEP or REMOVE with the
strongest number behind it.
