# Production Cutover Runbook — visa2.au

Goal: move the new static site (currently only on `staging.visa2.au`) to the
apex `visa2.au` + `www.visa2.au`, replacing the legacy Odoo site, with zero
downtime and a clean Google transition. Everything below is staged and verified
on staging; the remaining steps are DNS + Pages custom domains + GSC.

## Current state (verified 2026-08-09)

- New site fully localized: 131 pages (EN/RU/FR), all menus, blog 13×3,
  sitemap.xml (128 URLs), robots.txt (consolidated AI rules), llms.txt, WebMCP,
  OAuth content API, branded OG card, `_redirects` legacy map, HSTS 1y+preload.
- `www.visa2.au` still serves the legacy Odoo site (301s everything to www).
- `app/_redirects` (21 rules) maps legacy Odoo URLs → new pages (inert on
  staging, activates on production domain).

## Step 1 — Pre-flight (staging, already done)

- [x] SEO invariants green (131 pages): canonical/hreflang/sitemap consistent
- [x] Performance: AVIF images, LCP preload, mobile JS gating, no console errors
- [x] Contact form + attachments + RU form: tested end-to-end
- [x] Voice webhook: deployed (needs Pages env secrets — see Step 4)
- [x] robots.txt single source (Cloudflare dashboard-injected AI block: DISABLE
      in dashboard → Bots → AI Scrapers and Crawlers)
- [x] `_redirects` legacy map live on staging (`/fees`→`/pricing` 301 verified)

## Step 2 — DNS + custom domains (Cloudflare dashboard, ~5 min)

1. Workers & Pages → `visa2au` project → **Custom domains** → add:
   - `visa2au.au` (apex)
   - `www.visa2au.au`
   Cloudflare auto-creates the DNS records (CNAME/apex flattening).
2. Keep the old Odoo host reachable for a grace period on a subdomain if
   desired (e.g. `legacy.visa2.au` → Odoo) — optional; otherwise stop the Odoo
   container after DNS propagates (VPS: `docker stop <odoo>` once verified).
3. Wait for TLS certificates (Pages issues automatically). Verify:
   `curl -I https://visa2.au/` → 200 + HSTS header (1y) + CSP.

## Step 3 — Post-cutover verification (15 min)

Run each; all must pass before Step 4:
1. `curl -sI https://visa2.au/` → 200, `strict-transport-security: max-age=31536000`
2. Legacy redirects: `/fees` → `/pricing`, `/contactus` → `/contact`,
   `/shop` → `/pricing`, `/pt_BR` → `/fr` (all 301, extensionless target)
3. `/ru/`, `/fr/`, `/ru/contact` → 200, canonical/hreflang on production base
4. `https://visa2.au/sitemap.xml` → 128 `<loc>`, all `https://visa2.au/...`
5. `https://visa2.au/llms.txt` + `/.well-known/api-catalog` + `/.well-known/mcp/server-card.json` → 200
6. OG card: `curl -s https://visa2.au/ | grep og:image` → `og-share-card.png`
7. PSI run (mobile ×2) → LCP < 2.5 s target
8. `www.visa2.au` → serves the same site (redirect to apex or serve directly)

## Step 4 — Secrets + voice webhook (dashboard)

- Pages env vars (both environments):
  - `VOICE_WEBHOOK_SECRET`: staging `wsec_60748ae0…8a073`, production `wsec_06f28790…feef`
  - `ELEVENLABS_API_KEY`: `sk_36d987a4…`
  - (Enquiry secrets already present: `RESEND_API_KEY`, `NOTIFY_TO`, Turnstile,
    HMAC secrets, R2 binding)
- ElevenLabs agent webhook → URL `https://visa2.au/api/voice-webhook` with the
  production secret; add data-collection fields (email, phone, visa type,
  consultation need) if not done.

## Step 5 — Google (Search Console, 15 min)

1. GSC → Add property → **Domain property** `visa2.au` (DNS-verified via CF).
2. Sitemaps → submit `https://visa2.au/sitemap.xml`.
3. URL Inspection → request indexing for `/`, `/visas`, `/contact`,
   `/blog/understanding-partner-visa-820-801`, `/ru/`, `/fr/`.
4. Legacy Odoo URLs will 301 to the new site — GSC picks up the redirects
   automatically; monitor "Coverage" for the old URLs over 2–4 weeks.
5. Brand query "visa2au" currently returns 0 results — expect the first
   indexing wave within days; a couple of quality backlinks + GMB listing
   (if applicable) accelerate it.

## Step 6 — Rollback plan

- **DNS**: flip the Pages custom-domain records back (or repoint apex to the
  Odoo server IP) — effective in minutes (CF proxied).
- **Pages**: deploy history allows reverting to any previous deployment.
- **Odoo**: if stopped, restart the container (VPS) — data untouched.

## Post-cutover follow-ups

- Re-run the full audit suite (`scripts/check_seo_invariants.py` in CI).
- Update `llms.txt` + any hardcoded `staging.visa2.au` references (grep).
- Rotate credentials that appeared in chat (GitHub PATs, ElevenLabs key).
- Schedule: GSC coverage check at +1 week, PSI re-baseline, analytics (if
  Cloudflare Web Analytics re-enabled, add it back to CSP consciously).
