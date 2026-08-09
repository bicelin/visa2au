# Astro Rebuild Ticket — performance & CSP hardening

The static site is hand-maintained HTML (no Astro build pipeline in the repo;
`_astro/` assets are committed artifacts). This ticket is for when the original
Astro source is rebuilt/regenerated. Each item is measured and scoped from the
2026-08 audits of staging.visa2.au.

## P1 — Cut the render-blocking CSS from the critical path

- Current: `_astro/index.DqolKn4r.css` = 27.7 KiB transfer (103 KiB raw), the
  ONLY render-blocking resource (150 ms on slow-4G).
- Do: **inline the critical above-the-fold CSS** in `<head>` (hero, nav, ticker,
  first sections) and load the full bundle async (`media="print" onload` trick
  or `<link rel="preload" as="style">` + late swap). Target: no render-blocking
  stylesheet on the 3 homepages.
- Measure: FCP/LCP −100–150 ms on mobile PSI.

## P1 — Trim the font family set (9 woff2 in the critical chain)

- Current fonts (all self-hosted, `font-display: swap`): Space Grotesk 400/700,
  DM Sans 400/500/600, JetBrains Mono 400/600 latin + cyrillic ≈ 140 KiB.
- Problems:
  - The EN/FR homepages fetch **JetBrains Mono cyrillic** because the voice
    section contains the word «Русский» — either subset it out or rephrase.
  - DM Sans 500/600 are fetched but body text is 400 — drop unneeded weights.
- Do: keep 2 display weights (SG 400/700), 1–2 body weights (DM 400 + 600 for
  headings), 1 mono weight (JBM 400) with **unicode-range** so cyrillic loads
  only on RU/FR pages. Consider `font-display: optional` for the hero font.
- Measure: −90–110 KiB from the critical path.

## P2 — CSP without `'unsafe-inline'` (Best Practices 100)

- Current CSP allows `script-src 'unsafe-inline'` because every page carries
  ~11 inline scripts (theme, JSON-LD, particles, reveal, search palette,
  CF-images promotion, voice widget, form JS).
- Do (two options):
  a. **Move the shared inline scripts to external files** (`/assets/*.js`,
     `defer`), leaving only JSON-LD inline (JSON-LD is not subject to
     script-src) → CSP drops `'unsafe-inline'`, adds strict allowlist
     (self + cloudflareinsights + challenges.cloudflare.com + js.stripe.com +
     elevenlabs + daily.co).
  b. Or keep inline scripts but add **sha256 hashes** per unique script to the
     CSP. Fragile: any edit (e.g. the align pipeline rewriting a script) breaks
     the hash → script blocked. Prefer (a).
- Note: the `align_seo_meta.py` pipeline currently rewrites inline JS (particle
  gating, voice dynamic-variables) — externalizing the scripts requires
  updating the pipeline to patch files instead of inline code.

## P2 — Hero image pipeline

- Hero ladder already 480/720/1080/1600 AVIF (17–68 KiB) — keep. In the rebuild
  keep `fetchpriority="high"` + `<link rel="preload" as="image">` with
  `imagesrcset`/`imagesizes`, `loading="eager"`, explicit `width/height`.

## P3 — Misc

- `email-decode.min.js` gone (Email Obfuscation disabled at zone level) — don't
  reintroduce obfuscation.
- RUM/Web Analytics beacon removed (zone `rum=off`) — if analytics are wanted,
  add back deliberately and keep `https://static.cloudflareinsights.com` in the
  CSP (already present).
- Search palette + reveal observer: keep the mobile gating (particles/parallax
  off below 768 px, `prefers-reduced-motion` respected) — already in place.
- Consider a real build pipeline (Astro/Tailwind v4) so `_astro/` hashes and
  the CSS bundle stop being hand-maintained; wire `scripts/*` (align, sitemap,
  invariants, locale pages) as build steps instead of a post-commit patch pass.

## Acceptance criteria

- PSI mobile (2 runs): Performance ≥ 95, LCP < 2.0 s, no render-blocking CSS
  audit, TBT < 50 ms.
- Best Practices = 100 (CSP effective + strong HSTS + no console errors).
- `scripts/check_seo_invariants.py` still green after rebuild (canonical/
  hreflang/sitemap), RU/FR chrome preserved (localized nav, footer, voice
  dynamic-variables, carousel EN visa names per user directive).
