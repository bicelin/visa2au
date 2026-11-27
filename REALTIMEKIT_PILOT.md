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

## Blocker (verified, not assumed)

```
~/.hermes/secrets/cloudflare_api_token   → valid, status=active
GET /accounts/…/realtime/kit/apps         → 10000 "Authentication error"
```

The token is real but carries **no Realtime permission**. Wrangler's own OAuth token is
rejected by `api.cloudflare.com` outright (`Authentication error`).

Needed: an API token with **Realtime → Realtime Admin** (Account → API Tokens → Create
Token → Custom token). Enter it only in the Cloudflare dashboard or via
`wrangler pages secret put RTK_API_TOKEN` from a 0600 file — never in the repo.

## Setup, in order

```bash
# 1. secrets (astra-staging serves visa2.au)
npx wrangler pages secret put RTK_API_TOKEN   --project-name astra-staging < ~/.hermes/secrets/rtk_api_token
npx wrangler pages secret put RTK_APP_ID      --project-name astra-staging < /tmp/rtk_app_id

# 2. R2 keys — reuse the pair that already backs /api/agora-recording,
#    so the pilot needs no new credentials (RTK_R2_* fall back to AGORA_R2_*).

# 3. deploy, then verify WITHOUT booking a call
curl -s 'https://visa2.au/api/realtime-token?check=1'
#    → expect { ok: true, configured: { … all true }, note: "recordings land in our bucket" }
```

## The test itself

1. `POST /api/realtime-token` with `{ name, passcode }` → returns `meetingId`,
   `authToken`, `recording: true`. The meeting is created with
   `record_on_start`, `transcribe_on_end`, `summarize_on_end` and the R2
   `storage_config`.
2. Two browsers join with that token — the official sample app is the fastest way
   (`cloudflare/realtimekit-web-examples` → `html-examples/examples/default-meeting-ui`),
   so the site's own CSP is untouched during the pilot.
3. Talk **in Russian for 3–5 minutes**, share one document on screen.
4. `GET /api/realtime-recording?action=status&meetingId=…` with the
   `x-agent-passcode` header, then `action=list` for the download URL.
5. Confirm the file is in **our** R2 under `realtime/`, not only in RealtimeKit's bucket.

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
