# AI-Agent Readiness — staging.visa2.au

Status of agent-readiness measures (audit basis: isitagentready.com), as of July 2026.

## Implemented

### Link headers (RFC 8288)
Every response (`/*` in `app/_headers`) carries:

```
Link: </.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="help"; type="text/plain"
```

### API catalog (RFC 9727)
`app/.well-known/api-catalog` is served as `application/linkset+json` (content type pinned
via `_headers`) and lists the three public endpoints as linkset anchors, each with a
`service-doc` relation pointing at `/llms.txt`:

- `POST /api/enquiry` — enquiry form (Turnstile-protected, R2 attachments)
- `POST /api/checkout` — Stripe Checkout session creation
- `POST /api/video-join` — Daily.co video lobby (passcode → meeting token)

### llms.txt
`app/llms.txt` documents the site, visa guides (with markdown mirrors), services, and the
API endpoints above, and references the API catalog.

### Agent-friendly content
- Visa guides, pricing, contact, employers and urgent-help pages are already published as
  markdown mirrors (`*.md` alongside `*.html`).
- `robots.txt` and `sitemap.xml` are in place.

### Markdown content negotiation ("Markdown for Agents", self-hosted)
The native Cloudflare feature requires a Pro plan, so it is implemented in
`functions/_middleware.ts` instead: for GET/HEAD requests whose `Accept`
header prefers `text/markdown` over `text/html` (q-value aware — browsers
always rank HTML first, so human traffic is unaffected), the middleware serves
the deployed markdown twin of the page with `Content-Type: text/markdown;
charset=utf-8`, an `X-Markdown-Tokens` estimate header, and `Vary: Accept`
(also added to all pass-through HTML responses). Missing twins fall through to
HTML; `/api/*` is never intercepted.

Markdown coverage: `scripts/build_blog.py` now also deploys each blog post's
raw markdown (front matter intact) to `app/blog/<slug>.md`,
`app/ru/blog/<slug>.md` and `app/fr/blog/<slug>.md` with orphan cleanup
mirroring the HTML logic; `app/index.md` is a hand-written markdown twin of
the homepage.

### DNS-AID (draft-mozleywilliams-dnsop-dnsaid) — IMPLEMENTED
ServiceMode SVCB records published 2026-07-24 via the Cloudflare dashboard
session (API tokens lack DNS scope):
- `_index._agents.visa2.au SVCB 1 staging.visa2.au. mandatory=alpn,port alpn="h2" port=443`
- `_a2a._agents.visa2.au SVCB 1 staging.visa2.au. mandatory=alpn,port alpn="h2" port=443`

Verified resolving publicly (e.g. `https://dns.google/resolve?name=_index._agents.visa2.au&type=SVCB`).

DNSSEC: enabled on the zone (Cloudflare, key tag 2371, ECDSAP256SHA256) and
the DS record was added at the registrar (GoDaddy → DNS Management → DS
Records) on the same day. Chain of trust verified:
`dig visa2.au A +dnssec @8.8.8.8` returns the `ad` (authenticated data) flag.

## Skipped — with justification

| Item | Why skipped |
|---|---|
| **OAuth/OIDC discovery** (`.well-known/openid-configuration`) | No agent-facing OAuth-protected APIs exist; the site has no user accounts or token-issuing endpoints. |
| **OAuth Protected Resource** (`.well-known/oauth-protected-resource`) | Same as above — no protected resources are exposed to agents. |
| **auth.md** | No authentication scheme to document beyond the video-lobby passcode, which is already covered in `llms.txt`. |
| **MCP Server Card** | No MCP server is operated for this site. |
| **agent-skills index** | No agent skills are published. |
| **WebMCP** | Experimental, Chrome-only API; no cross-browser support. Revisit when it matures. |
