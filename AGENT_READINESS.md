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

## Skipped — with justification

| Item | Why skipped |
|---|---|
| **Markdown for Agents** (Cloudflare content negotiation, `Accept: text/markdown`) | Attempted via zone API (`PATCH /zones/{id}/settings/content_converter` with the zone-settings token) — rejected with `Not allowed to edit zone setting content_converter` (code 1015). The feature requires a **Pro/Business plan**; the zone is on the Free plan. Revisit after a plan upgrade. Markdown mirrors (`*.md`) already cover the highest-value content in the meantime. |
| **OAuth/OIDC discovery** (`.well-known/openid-configuration`) | No agent-facing OAuth-protected APIs exist; the site has no user accounts or token-issuing endpoints. |
| **OAuth Protected Resource** (`.well-known/oauth-protected-resource`) | Same as above — no protected resources are exposed to agents. |
| **auth.md** | No authentication scheme to document beyond the video-lobby passcode, which is already covered in `llms.txt`. |
| **MCP Server Card** | No MCP server is operated for this site. |
| **agent-skills index** | No agent skills are published. |
| **DNS-AID** | Draft RFC, still speculative; no stable resolver or tooling support. Revisit when standardized. |
| **WebMCP** | Experimental, Chrome-only API; no cross-browser support. Revisit when it matures. |
