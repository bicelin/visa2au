# AI-Agent Readiness — staging.visa2.au

Status of agent-readiness measures (audit basis: isitagentready.com), as of July 2026.

## Implemented

### Agent content API + OAuth 2.0 (client_credentials) — IMPLEMENTED 2026-07-24
Real, minimal endpoints (Cloudflare Pages Functions, no external services):

- `POST /oauth/token` (`functions/oauth/token.ts`) — RFC 6749 §4.4
  client-credentials grant, HTTP Basic client auth (`client_secret_basic`),
  issues a compact HS256 JWT (`iss=https://staging.visa2.au`,
  `aud=https://staging.visa2.au/api`, scope `content:read`, 1h expiry).
  Clients live in the `AGENT_CLIENTS` Pages secret (static staging
  credentials; no dynamic registration — request flow documented in
  `/auth.md`). Signing key in `AGENT_TOKEN_KEY` Pages secret. HS256 via
  WebCrypto only (`functions/lib/jwt.ts`), so there is intentionally **no
  `jwks_uri`** — symmetric-key tokens are not meant for third-party
  verification. Light per-IP rate limiting (~30 req/min, in-memory,
  best-effort per isolate).
- `GET /api/content` (`functions/api/content.ts`) — RFC 6750 Bearer
  protected. `?list=1` returns the generated JSON post index
  (`app/content-index.json`, emitted by `scripts/build_blog.py` — slug,
  lang, title, date, category, description for en/ru/fr);
  `?path=/blog/<slug>&lang=en|ru|fr` returns the raw markdown twin via
  `env.ASSETS` (same lookup as `_middleware.ts`). Missing/invalid token →
  401 with `WWW-Authenticate: Bearer`; wrong scope → 403. Rate-limited
  ~60 req/min per IP.

### OAuth discovery + auth documentation — IMPLEMENTED 2026-07-24
- `/.well-known/oauth-authorization-server` (RFC 8414) — issuer, token
  endpoint, `client_credentials` grant, `client_secret_basic` auth,
  `content:read` scope, plus an `agent_auth.register_uri` pointer at
  `/auth.md` (self-serve registration is **not** automated on staging).
- `/.well-known/oauth-protected-resource` (RFC 9728) — resource
  `https://staging.visa2.au/api`, bearer via header only.
- `/auth.md` — honest agent registration/authentication instructions with
  curl examples; states clearly that public content needs no auth.
- Content types pinned in `app/_headers`; discovery relations added to the
  global `Link` header and the api-catalog linkset (`service-desc`,
  `service-doc`, `oauth-as` on the `/api/content` and `/mcp` anchors).

### MCP server + Server Card (SEP-1649) — IMPLEMENTED 2026-07-24
- `POST /mcp` (`functions/mcp.ts`) — stateless Streamable HTTP MCP server,
  plain JSON responses (no SSE), no auth (read-only public content).
  Methods: `initialize` (protocolVersion `2025-03-26`), `ping`,
  `notifications/*` (202), `tools/list`, `tools/call`; unknown method →
  `-32601`. Tools: `search_posts({query, lang?})` against
  `content-index.json`, `get_post({slug, lang?})` returning markdown twins.
- `/.well-known/mcp/server-card.json` — serverInfo, streamable-http
  transport URL, capabilities, tool list.


### Link headers (RFC 8288)
Every response (`/*` in `app/_headers`) carries:

```
Link: </.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="help"; type="text/plain"
```

### API catalog (RFC 9727)
`app/.well-known/api-catalog` is served as `application/linkset+json` (content type pinned
via `_headers`) and lists the five public endpoints as linkset anchors, each with a
`service-doc` relation pointing at `/llms.txt` (plus `service-desc`/`oauth-as`
relations for the OAuth-protected and MCP endpoints):

- `POST /api/enquiry` — enquiry form (Turnstile-protected, R2 attachments)
- `POST /api/checkout` — Stripe Checkout session creation
- `POST /api/video-join` — Daily.co video lobby (passcode → meeting token)
- `GET /api/content` — agent content API (OAuth Bearer, scope `content:read`)
- `POST /mcp` — stateless MCP server (no auth, read-only)

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
| **OpenID Connect** (`.well-known/openid-configuration`) | OAuth 2.0 client-credentials is implemented (above); OIDC adds identity-layer semantics the site does not need — there are no user accounts or login flows. |
| **agent-skills index** | No agent skills are published. |
| **WebMCP** | Experimental, Chrome-only API; no cross-browser support. Revisit when it matures. |
