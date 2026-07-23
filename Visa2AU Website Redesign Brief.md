# Visa2AU Website Redesign — Final Build Brief

**Version:** 1.2 (approved for build — adds site search, voice AI assistant, expanded original iconography)
**Date:** 17 July 2026 (v1.2, same day)
**Client:** Visa2AU Pty Ltd (ABN 36676512397)
**Domain:** visa2.au — DNS already on Cloudflare
**Status:** Requirements locked. Ready for implementation.

---

## 1. Executive Summary

A complete rebuild of the Visa2AU website as a fast, multilingual, Cloudflare-native platform owned end-to-end by the client. The new site replaces the sealed Kimi 2.7 page-builder output (which could not be fixed, extended, or self-hosted) with a real codebase in the client's Git repository, deployed to the client's Cloudflare account.

The design language fuses a restrained, original dot-art motif system ("songlines") with modern Australian imagery — professional first, decorative second — across matched light ("Day") and dark ("Night") themes with dedicated hero video cuts for each. The site is content-rich and detail-oriented: every visa page is a structured journey map with transparent costs and FAQ schema, built to rank in Google and to be quoted by AI assistants.

Scope at launch: full visa hub library, interactive Pathway Finder, command-palette site search (retained from v2.7), ElevenLabs voice AI assistant in 27+ languages, blog on TinaCMS, invoice payment page (/pay) with disclosed 4.55% international card fee, donations page, branded video consultation lobby (/video) on Daily.co, and EN/RU/FR language architecture.

---

## 2. Background & Lessons from v2.7

### 2.1 What the audit of the current site found

The current site (built with Kimi 2.7, hosted on kimi.page) has a strong content foundation — a comprehensive visa inventory, FAQ content, trust data, and team structure — but suffers from platform-imposed defects reported by the owner and confirmed by audit:

1. **Unfixable layout defects** — overlapping elements (e.g. language selector obscured by buttons); the sealed builder offers no access to fix them.
2. **Footer links that cannot be embedded** — platform limitation.
3. **Duplicated funnel sections** — contact and CTA blocks repeated without logic, diluting conversion.
4. **Conversion leak** — the primary "Free Visa Assessment" CTA sends visitors off-domain to visa2au.mmportal.cloud.
5. **Dark-only design** with a hero headline ("2025–2026") that expires.
6. **Mobile weaknesses** and no hero video, no payment page, no video consultation page.

### 2.2 The governing principle of the rebuild

**Ownership.** Every pixel, link, and behaviour lives in client-owned code. Nothing is platform-locked. Any future developer (or AI agent) can fix or extend anything.

---

## 3. Design Concept: "Your Songline to Australia"

In Aboriginal cultures, songlines are paths of knowledge across the land. The site's central metaphor: **every visa journey is a songline** — a dotted path connecting milestones from first enquiry to grant.

How the concept expresses itself:

- **A travelling dotted path** animates down each page, connecting sections; on visa pages it becomes an explicit journey map (Eligibility → Skills Assessment → Nomination/Application → Grant).
- **Dot-particle hero**: gold particles form the Australian coastline, then dissolve into the hero video.
- **Dot-art animal wayfinding icons** (original artwork, supplied by the client's designer): kangaroo = skilled migration (the forward leap), koala = student visas, turtle = parent & family visas (the long journey), star = citizenship.
- **Footer songline band**: the designer's navy-and-gold wave artwork becomes a living, subtly animated brand signature.

**Cultural integrity (binding constraint):** all motifs are original, dot-*inspired* designs commissioned/created for Visa2AU — no reproduction or imitation of specific Aboriginal artworks or clan styles (respecting Indigenous Cultural & Intellectual Property). An **Acknowledgement of Country** appears in the footer of every page.

---

## 4. Brand System

### 4.1 Colour palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Depth | Navy | `#1A2744` | Backgrounds (Night), headers, ink on light |
| Primary | Cobalt Blue | `#1E6BBB` | Links, UI actions, interactive elements |
| Signature | Gold | `#F0A000` | Primary CTA, highlights, songline glow |
| Base | White | `#FFFFFF` | Day backgrounds, text on navy |
| Tint | Blue Tint | `#E8F0FA` | Day section backgrounds, cards |
| Accent (new) | Burnt Ochre | `#C1622B` | Warm earth accent; sparing — badges, hover states, art details |

Rationale: navy/cobalt/gold alone reads corporate; the ochre accent grounds the palette in the Australian landscape and warms the dot-art system. Ochre is used at ≤5% of visible colour.

### 4.2 Typography

| Role | Typeface | Usage |
|---|---|---|
| Display | Playfair Display | Page titles, section headings, key statements |
| Body | Inter | Paragraphs, UI, forms, tables |
| Technical | Mona Sans | Buttons, tags, labels, visa subclass chips |

Fonts are self-hosted, subset (EN/RU/FR glyph ranges), `font-display: swap`, preloaded.

### 4.3 Logo

Client-supplied vector logos: **white version** (for Night theme / navy backgrounds) and **blue version** (for Day theme), SVG, 700×250 viewBox. Theme-aware logo switching via `prefers-color-scheme` and the manual toggle. High-resolution raster versions exist in the client archive if needed.

### 4.4 Iconography & motif library (expanded — v1.2)

The motif system is **not limited to supplied materials** — new original emblems are created in-house in the established style (Appendix A spec), using the designer's kangaroo as the locked style reference. Every generated asset is cleaned, optimised, and registered in `brand/asset-library.md` (name, usage, alt text) before use. No third-party stock icons enter the motif system.

**Tier 1 — Wayfinding emblems** (dot-art, one per visa family):

| Emblem | Meaning | Assigned to |
|---|---|---|
| Kangaroo | The forward leap (never walks backwards) | Skilled migration 189/190 · Skills Assessment |
| Koala | Settling into a new branch | Student 500 · Training 407 |
| Turtle | The long journey | Parent 103 · Sponsored Parent 870 |
| Southern Cross | Navigation, guidance home | Citizenship · PR pathways |
| Golden wattle | National floral emblem, citizenship ceremonies | Citizenship accents · success states |
| Songline heart | Two paths joining | Partner 820/801 · 309/100 · Prospective Marriage 300 |
| Harbour Bridge | The literal bridge | Bridging visas |
| Opera House | Arrival, world-famous welcome | Visitor 600 · Work & Holiday 417/462 |
| Kookaburra | Australia's storyteller | Blog & news voice |
| Uluru | Endurance and sanctuary | Protection 866 |
| Waratah | NSW floral emblem | State-nominated 190 accents |
| Dotted briefcase | Skilled workers wanted | Employer-sponsored 482/494/186 |

**Tier 2 — Section ornaments:** songline streams, dotted corner textures, wave bands, eucalyptus/leaves (supplied set + regenerated clean versions).

**Tier 3 — UI icons:** hand-crafted stroke SVGs (1.5 px stroke, gold/cobalt, paired with Mona Sans) for search, phone, mail, calendar, documents, checkmarks, arrows — crisp at any size, animatable, zero raster weight.

**Production pipeline (binding):** style-reference generation → transparent PNG → artefact cleanup → optimisation (inline SVG for ornaments; WebP/AVIF for illustrations) → registration in the asset library with alt text. **Backlog for future sections/posts:** emu (the kangaroo's coat-of-arms partner — "the country that only moves forward"), wombat, platypus, cockatoo, echidna, whale, Twelve Apostles, Flinders Street line-art, boab, banksia.

All motifs remain original dot-*inspired* work per the ICIP constraint in Section 3. Decorative motifs are implemented as inline SVG where possible and marked `aria-hidden`.

---

## 5. Dual-Theme System, Motion & Media

### 5.1 Themes

- **Day (light):** white/blue-tint surfaces, navy ink, cobalt actions, gold accents.
- **Night (dark):** deep navy surfaces, off-white text, glowing gold songlines.
- Default follows OS preference; manual toggle persists (localStorage); no flash-of-wrong-theme (inline theme script in `<head>`).

### 5.2 Hero videos

- Two matched cuts — **Day** (bright coastline/city) and **Night** (dusk/night skyline with light trails) — auto-switched with the theme.
- Technical: muted, autoplay, looped, playsinline; H.264/AV1 ≤3 MB each, 8–12 s; poster image fallback; `prefers-reduced-motion` swaps video for the poster. Below-the-fold media lazy-loads.

### 5.3 Motion language

Smooth, purposeful, GPU-cheap: scroll-linked songline drawing (SVG stroke-dash), fade/slide section reveals, card hover lifts. No parallax jank, no layout-shift animations. All animation honours `prefers-reduced-motion`.

---

## 6. Information Architecture — Full Page Inventory

### 6.1 Core pages

Home · About / Our Team · Pricing · Contact · Blog (listing + posts) · Privacy Policy & Terms

### 6.2 Visa hubs (migrated content from archive, rewritten marketing language)

Partner Visas 820/801 · Partner Visa 309/100 · Prospective Marriage 300 · Visitor 600 · Student 500 · Work Holiday 417/462 · Training 407 · Short Stay 400 & 408 · Skills in Demand 482 (SID) · Skilled Regional 494 · Employer Nomination 186 · Skilled Independent 189/190 · Parent 103 · Skills Assessments · Citizenship · Visa Refusals & ART Appeals · Bridging Visas · Protection 866

### 6.3 Employer section

Employer Hub (overview) · 482 SID for employers · 494 for regional employers · 186 nominations

### 6.4 Interactive & service pages (new)

**Pathway Finder** (/pathways) — 5-question eligibility wizard → realistic pathways with indicative costs → consultation CTA.
**Free Assessment** — retained external link to visa2au.mmportal.cloud (full assessment portal).
**/pay** — invoice payment (Section 10).
**/donate** — donations (Section 10).
**/video** — consultation lobby (Section 11).

### 6.5 Funnel rules (binding)

- One primary CTA site-wide: **Book Consultation** (gold). One secondary: **Free Assessment** (outline).
- No duplicated contact/CTA sections on any page; each page ends with exactly one conversion block.
- Header CTA visible at all breakpoints; language switcher never obscured (header + footer placement, verified at 360 px and up).

---

## 7. Home Page Blueprint

1. **Hero** — day/night video, headline (evergreen, no dates), MARN-registered trust badge ("Since 2004"), primary + secondary CTA, visa-chip quick links (top 6 subclasses), consultation price anchor ($330/hr).
2. **Trust strip** — MARN · 2,000+ cases · 99.8% success · 20+ years (single instance only).
3. **Pathway Finder teaser** — interactive entry ("Not sure which visa? Answer 5 questions").
4. **Who we help** — Individuals / Families / Employers / Skilled Workers (4 cards, one link each).
5. **Popular visa services** — 6 cards with dot-art animal icons + "View all services".
6. **Why Visa2AU** — image collage + 4 value props + review avatars.
7. **Meet the team** — carousel (4 professionals, photos supplied).
8. **Testimonials** — placeholder cards now; Google Reviews live feed in Phase 2.
9. **Urgent help banner** — refused/cancelled/deadline cases → Contact.
10. **Blog preview** — 3 latest posts with feature images.
11. **FAQ** — 5–6 questions with FAQPage schema.
12. **Contact** — single form (name, email, phone, message) + booking link.
13. **Footer** — full sitemap, contact, MARN/NAATI/ABN compliance block, Acknowledgement of Country, Donations link, MARA link, language switcher, animated songline band.

---

## 8. Visa Hub Page Template

Every visa page follows one template (content depth is the product):

1. Hero band with subclass chip + animal/motif accent
2. **Journey map** — songline milestone graphic: Eligibility → Assessment/Documentation → Application/Nomination → Grant
3. At-a-glance card: processing time, government charges, our professional fee, stay/rights summary
4. Eligibility requirements (structured lists)
5. Document checklist
6. Costs table (transparent, itemised; schema-marked)
7. FAQ (FAQPage JSON-LD — direct, quotable answers)
8. Related visas + single conversion block (Book Consultation)

---

## 9. Interactive Tools

### 9.1 Pathway Finder (/pathways)

Five questions (situation, age range, occupation/skills, English level, timeframe) → ranked pathway cards with indicative cost ranges and "discuss your case" CTA. Built on-site (SEO asset, no off-domain leak). Static-first: decision logic ships as a small hydrated island; results pages are shareable via URL state.

### 9.2 Free Assessment

Retained as external link to the existing mmportal.cloud portal (owner decision). Presented as the "detailed assessment" step beneath Pathway Finder results.

### 9.3 Site Search (retained from v2.7 — confirmed valuable)

- **Command-palette UX preserved:** search icon in header + `Ctrl/Cmd K` shortcut, exactly as users had in v2.7.
- **Engine: Pagefind** — static search index generated at build time; zero external service, zero recurring cost, near-zero runtime JS (loads only when the palette opens). Indexes all visa hubs, blog posts, pricing and FAQ content.
- **Multilingual-aware:** per-language indexes (EN/RU/FR), stemming support; results scoped to the visitor's current language.
- Result cards show page type badge (Visa / Blog / Guide), title, and highlighted excerpt; keyboard-navigable; fully accessible (ARIA combobox pattern).

### 9.4 Voice AI Assistant (ElevenLabs ConvAI)

- **What it is:** an audio conversation assistant anchored at the bottom of every page (ElevenLabs ConvAI widget, agent ID `sbc5vWaEfYENNm21h3Sd`), letting visitors explore the website's content by voice in **27+ languages** — a genuine accessibility and conversion asset for a multilingual client base.
- **Positioning (binding copy requirement):** presented as *"an additional assistant to help you find the right visa"* — with a visible, persistent disclaimer: **it cannot replace a registered migration agent or a professional consultation.** No advice claims; it guides, the agents advise (MARA Code of Conduct alignment).
- **Lead capture:** the assistant collects enquiry details (another intake channel alongside forms); collected data flows to the same notification pipeline as contact forms and is covered by the privacy policy (third-party processing by ElevenLabs disclosed; cross-border disclosure per APP 8).
- **Conversation limit:** 6 minutes per session (configured in the ElevenLabs agent dashboard — owner-side setting).
- **Knowledge grounding:** the agent is configured against the site's content (the Markdown endpoints and llms.txt from Section 14 double as its knowledge source).
- **Feature flag (binding):** the entire widget ships behind an environment flag (`PUBLIC_VOICE_ASSISTANT_ENABLED`) — one-line disable, no code surgery, if the owner decides to switch it off.
- **Embed (reference implementation):**

```html
<elevenlabs-convai agent-id="sbc5vWaEfYENNm21h3Sd"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

- **Performance rule:** the script never loads during initial page render — it loads on first user interaction with the launcher button (or after idle), keeping the ≥97 Lighthouse budget intact. Widget styled to brand (navy/gold launcher).

---

## 10. Commerce Pages

### 10.1 /pay — invoice payment

- Fields: full name, invoice / service order number, amount (AUD).
- **Fee disclosure (binding UI requirement):** before payment, the page itemises — Invoice amount + International card processing fee (4.55%) = Total charged. Copy makes clear Visa2AU passes the card cost to the client when paying by international credit card (RBA-compliant: disclosed pre-payment, not exceeding cost of acceptance).
- Stripe Checkout (international cards), server-side amount/fee computation via Cloudflare Worker; Stripe keys supplied later — UI and logic built against test keys.
- Success/failure pages with payment reference; email receipt.

### 10.2 /donate

Preset + custom amounts via Stripe (Payment Links or Checkout); warm, non-intrusive design consistent with brand; linked in footer, never as a primary CTA.

---

## 11. Video Consultation Lobby (/video)

**Purpose:** a single branded link the agent shares with a client for quick consultations.

Flow:
1. Agent sends client `visa2.au/video` + the current passcode.
2. Client lands on a branded lobby (logo, songline motif, theme-aware), enters name + passcode.
3. Cloudflare Worker validates the passcode server-side (development default: `visahelp`, stored as Worker secret `VIDEO_LOBBY_PASSCODE`, rotatable in one line), creates/fetches a private Daily room and issues a short-lived meeting token.
4. Client joins an embedded Daily Prebuilt call inside the branded frame (camera/mic pre-join check).
5. **Recording is ON by default** (cloud recording auto-start). Pre-join screen displays: *"This consultation is recorded for quality and compliance."* with a mandatory acknowledgement tick; a recording indicator remains visible in-call. New Daily VCS compositor with layout animations enabled.

Notes: Daily API key + Daily domain supplied by owner at build time; key lives only in Worker secrets. No booking calendar in v1 (deliberately simple). Optional Phase 2: per-client one-time codes, transcription.

---

## 12. Blog & CMS

- **TinaCMS** managing Markdown content collections (posts, visa pages, team, testimonials). Owner edits without a developer; content lives in the repo (Git-based, versioned).
- 12 existing posts migrate from the archive (see Section 19).
- Every post: feature image (per Appendix A spec), mandatory alt text, author, publish date, reading time, tags, related posts, Article JSON-LD.
- RSS feed; per-post social/OG images.
- **Phase 2 hook:** audio narration of posts via Cloudflare Workers AI TTS (architecture must not preclude it).

---

## 13. Multilingual Architecture

- **English** is the default language at root; **Russian** at `/ru/` and **French** at `/fr/`.
- i18n routing, language switcher (header + footer), `hreflang` clusters, translated URL slugs, per-language sitemaps — all built from day one.
- Content translation is handled by the owner later; the system ships with EN complete and RU/FR structures ready (fallback to EN for untranslated pages, clearly handled for SEO with `x-default`).
- Font subsets cover Cyrillic and French diacritics.

---

## 14. SEO & AI Citability

- **Structured data (JSON-LD) on every page type:** LegalService (+ MARN identifiers), FAQPage, Article, BreadcrumbList, SpeakableSpecification, Organization with sameAs.
- **AI readiness:** `/llms.txt`, per-page Markdown endpoints (content negotiation pattern), clean semantic HTML, direct-answer FAQ and cost blocks written to be quoted with figures and dates.
- XML sitemap + per-language sitemaps, canonical URLs, robots.txt.
- Open Graph + Twitter cards with branded OG images (songline template).
- Redirect map from all current kimi.page URLs (301s) — no link equity loss at cutover.
- Core Web Vitals monitored via Cloudflare Web Analytics (privacy-friendly, no cookie banner needed).

---

## 15. Performance Budget (target: Lighthouse ≥ 97)

| Budget item | Limit / rule |
|---|---|
| Framework | Astro 5 — zero JS by default; hydration only for islands (Pathway Finder, video lobby, theme toggle) |
| Images | Cloudflare image pipeline; AVIF/WebP, responsive `srcset`, lazy below fold; every image has descriptive alt text |
| Hero video | ≤3 MB, poster fallback, lazy, reduced-motion aware |
| Fonts | Self-hosted, subset, ≤3 families, preloaded |
| CSS | Critical CSS inlined; Tailwind 4 purged output |
| Third parties | Turnstile deferred; Stripe/Daily load only on their pages; ElevenLabs widget lazy-loads on interaction only |
| Search | Pagefind index pre-built at deploy; search JS loads only when palette opens |
| Caching | Cloudflare edge caching, immutable asset hashing |
| Mobile | Mobile-first; verified from 360 px; tap targets ≥44 px |

---

## 16. Technical Architecture

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro 5 + TypeScript + Tailwind CSS 4 | Content-first SSG with islands |
| CMS | TinaCMS (Git-based) | Markdown/MDX collections |
| Hosting | Cloudflare Pages (static) + Workers (dynamic) | Client's existing Cloudflare account/DNS |
| Data | Cloudflare D1 (form submissions log) + R2 (media/recordings refs) | Schema migrated from archive |
| Images | Cloudflare image optimisation / R2 + responsive markup | AVIF/WebP |
| Forms | Workers endpoints + Turnstile + Resend (email to info@visa2.au) | 2 DKIM records to add to DNS (values at build) |
| Video | Daily.co (Prebuilt embed + REST API from Worker) | Passcode gate at our end |
| Payments | Stripe Checkout + Webhooks (Worker) | Test keys first |
| Search | Pagefind (build-time static index) | No external service; per-language indexes |
| Voice AI | ElevenLabs ConvAI widget (agent `sbc5vWaEfYENNm21h3Sd`) | Feature-flagged, lazy-loaded |
| Repo/CI | Client-owned Git repo → Cloudflare Pages CI | Preview deployments per branch |

---

## 17. Security & Secrets Management

- All secrets live in **Cloudflare Worker secrets** (server-side only), never in the client bundle, never committed to Git: `DAILY_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `VIDEO_LOBBY_PASSCODE`.
- Browser receives only short-lived, single-purpose tokens (Daily meeting tokens, Stripe publishable key).
- Turnstile on all public forms; rate limiting on passcode attempts (lockout after repeated failures); security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy).

---

## 18. Accessibility, Privacy & Compliance

- WCAG 2.2 AA: contrast-checked palette pairs, keyboard navigation, focus states, skip links, descriptive alt text (decorative motifs `aria-hidden`).
- **Privacy Act 1988 (Cth)** compliant privacy policy; form data minimisation; submission records in D1 with retention rule.
- Recording consent flow on /video (Section 11).
- Card-fee disclosure on /pay (Section 10.1).
- MARA Code of Conduct respected: registration numbers displayed, no misleading success guarantees (stats presented as historical record).
- **Voice assistant compliance:** persistent on-widget disclaimer that the AI assistant cannot replace a registered migration agent or professional consultation; no migration advice is given by the assistant; lead-capture data handling disclosed in the privacy policy including third-party processing (ElevenLabs) and cross-border disclosure (APP 8); conversation recordings/transcripts handled per ElevenLabs data terms and the site retention rule.
- Acknowledgement of Country in footer; ICIP-respectful original artwork only.

---

## 19. Content & Asset Inventory (in hand)

| Asset | Source | Status |
|---|---|---|
| Full v2.7 source (141 files: 33 pages, components, pricing data, D1 schema, Tina config) | WeTransfer archive V82 | Secured in project storage |
| 12 blog posts (Markdown) | Archive | Ready to migrate |
| Pricing data (7 categories) | Archive | Ready to migrate |
| Brand board (palette, typography, elements) | Designer (WhatsApp) | Digitised into Section 4 |
| Logo SVGs — white & blue versions | Owner upload | Secured (vector) |
| Dot-art animals & songline textures (9 images) | Designer | Secured; clean regeneration where artefacts |
| Original motifs — kookaburra, golden wattle, Opera House, Southern Cross (transparent PNG, watermark-cleaned) | In-house generation (v1.2) | Secured in project asset library |
| Site imagery (13 MB: heroes, Uluru, coast, cities) | Archive | Ready for optimisation |
| Team photos (Sergey, Denis, Franz, Natasha) | Archive | Ready |
| Design proposal document | Archive | Reviewed; superseded by this brief |

---

## 20. Launch & Migration Plan

1. Scaffold repo + CI on Cloudflare Pages (preview URL for review at every stage).
2. Content migration & rewrite pass (visa hubs, pricing, posts).
3. Component build: themes, songline motion, hubs, Pathway Finder.
4. Service pages: /pay (test keys), /donate, /video (Daily keys needed here).
5. i18n structure + SEO/AI layer + performance hardening to ≥97.
6. Redirect map + DNS cutover (zero downtime; Cloudflare already hosts DNS).
7. Post-launch: Search Console, analytics baseline, 2-week monitoring.

**Credentials the owner will supply during build:** Daily domain + API key · Stripe keys · (Resend handled by adding 2 DKIM DNS records).

---

## 21. Phase 2 (post-launch backlog)

- Google Reviews live feed (placeholders ship in v1).
- Audio narration of blog posts via Workers AI TTS.
- Per-client one-time video passcodes; call transcription.
- RU/FR content population (owner-led).
- Self-hosted Tina backend evaluation vs TinaCloud.

---

## Appendix A — Blog Feature Image Style Spec (reusable)

**Format:** 3:2 (1200×800), transparent or white base, PNG/WebP.
**Style:** single-motif gold dot-art line illustration on white (light posts) or navy `#1A2744` (dark contexts), matching the supplied designer set.
**Motifs:** one subject per post — animal (kangaroo/koala/turtle), landmark (Opera House, Harbour Bridge, Uluru), or document symbol (passport, stamp, checklist) — rendered as concentric dot-and-line art with 1–3 solid gold orbs as focal points.

**Reusable generation prompt (template):**

> Minimalist Aboriginal-inspired dot-art line illustration of [SUBJECT], thin elegant dotted concentric lines in gold (#F0A000) with subtle navy (#1A2744) accents, 1–3 solid gold orb focal points, generous white negative space, flat vector style, clean edges, no text, no background clutter, 3:2 composition — suitable as a blog feature image for a professional Australian immigration agency.

**Alt text rule:** describe the subject and its relevance to the post, e.g. *"Gold dot-art illustration of a kangaroo for an article on skilled migration visas."*

---

## Appendix B — Verified Business Data

| Item | Value |
|---|---|
| Entity | Visa2AU Pty Ltd, ABN 36676512397 |
| Address | Level 17, 1 Denison Street, North Sydney NSW 2060 |
| Phone | +61 2 9136 2462 (voicemail) |
| Email | info@visa2.au |
| MARN | 0534230 (N. Arens) · 2418663 (S. Vinnichenko) |
| NAATI | CPN0VW21W (N. Arens) |
| Consultation | $330 AUD per 1 hour (pro rata may apply) |
| Track record | Since 2004 · 2,000+ cases · 99.8% success rate |
| Assessment portal | visa2au.mmportal.cloud (retained) |
| Video lobby passcode (dev) | `visahelp` (Worker secret, rotatable) |
| ElevenLabs agent | `sbc5vWaEfYENNm21h3Sd` (6-min session limit set in agent dashboard) |
| Search | Pagefind static index, `Ctrl/Cmd K` palette (retained from v2.7) |

---

## Appendix C — Cloudflare Services Map

Pages (hosting/CDN) · Workers (forms, passcode gate, Stripe, Daily API) · D1 (submissions) · R2 (media) · Images (optimisation) · Turnstile (bot protection) · Web Analytics (privacy-friendly metrics) · DNS (already in place) · Email Routing (optional, inbound).

*End of brief — v1.2. Approved decisions are binding for the build; open items are listed in Sections 20–21. Changelog: v1.1 added Section 9.3 Site Search (Pagefind) and Section 9.4 Voice AI Assistant (ElevenLabs ConvAI, feature-flagged); v1.2 expanded Section 4.4 into a three-tier original iconography system (12-emblem wayfinding map, production pipeline, asset governance) with the first four in-house motifs delivered (kookaburra, golden wattle, Opera House, Southern Cross).*
