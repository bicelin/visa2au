# Agent Authentication — staging.visa2.au

How automated agents authenticate to the protected agent content API on this
site. Plain public content (all pages, visa guides, blog posts) needs **no
authentication** — use markdown content negotiation or the API catalog
instead (see "Public, unauthenticated access" below).

## What is protected

- `GET /api/content` — machine-readable markdown access to blog posts and a
  JSON post index. Requires an OAuth 2.0 Bearer token with scope
  `content:read`.

Everything else (`/mcp`, `/llms.txt`, `*.md` twins, the api-catalog, OAuth
metadata) is public.

## Step 1 — Obtain client credentials

Self-serve client registration is **not yet automated on staging**. To
request a `client_id` / `client_secret` pair, email
[info@visa2.au](mailto:info@visa2.au) with:

- your agent's name and purpose,
- the operator (person or organisation) responsible for it,
- an estimate of request volume.

Staging credentials are issued manually and may be rotated or revoked without
notice.

## Step 2 — Get an access token

Client-credentials grant (RFC 6749 §4.4), HTTP Basic client authentication:

```bash
curl -s -X POST https://staging.visa2.au/oauth/token \
  -u "$CLIENT_ID:$CLIENT_SECRET" \
  -d "grant_type=client_credentials&scope=content:read"
```

Response:

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "content:read"
}
```

Tokens are HS256-signed JWTs (RFC 7519): `iss=https://staging.visa2.au`,
`aud=https://staging.visa2.au/api`, 1-hour expiry. Note: HS256 means there is
no `jwks_uri` — agents do not need to verify the signature; just present the
token. Token endpoint is rate-limited (~30 req/min per IP).

## Step 3 — Call the content API

```bash
# JSON index of all posts (en/ru/fr)
curl -s https://staging.visa2.au/api/content?list=1 \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Full markdown of one post
curl -s "https://staging.visa2.au/api/content?path=/blog/visa-fee-increases-july-2026&lang=ru" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Errors follow RFC 6750: missing/invalid token → `401` with a
`WWW-Authenticate: Bearer` header; missing scope → `403`. The API is
rate-limited (~60 req/min per IP).

## Discovery metadata

- Authorization server metadata (RFC 8414):
  <https://staging.visa2.au/.well-known/oauth-authorization-server>
- Protected resource metadata (RFC 9728):
  <https://staging.visa2.au/.well-known/oauth-protected-resource>
- API catalog (RFC 9728 linkset):
  <https://staging.visa2.au/.well-known/api-catalog>
- MCP server card (SEP-1649):
  <https://staging.visa2.au/.well-known/mcp/server-card.json>

## Public, unauthenticated access

Most agents do not need credentials at all:

- **Markdown content negotiation** — request any page with
  `Accept: text/markdown` to get the markdown twin where one exists:
  `curl -H "Accept: text/markdown" https://staging.visa2.au/blog/visa-fee-increases-july-2026`
- **Direct markdown URLs** — blog posts are also at `/blog/<slug>.md`,
  `/ru/blog/<slug>.md`, `/fr/blog/<slug>.md`; visa guides at
  `/visas/<slug>.md` (and `/ru/…`, `/fr/…`).
- **MCP** — a stateless, unauthenticated, read-only MCP server at
  `POST /mcp` exposes `search_posts` and `get_post` tools over the same blog
  content. See `/.well-known/mcp/server-card.json`.
- **llms.txt** — <https://staging.visa2.au/llms.txt> describes the whole site.
