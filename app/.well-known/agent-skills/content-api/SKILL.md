# Skill: visa2au OAuth content API

Access the protected agent content API on staging.visa2.au using OAuth 2.0
client-credentials. Use this when you need a stable, authenticated, rate-limit
-friendly pipeline for the site's blog content. **Unauthenticated
alternatives** (MCP, markdown negotiation) cover most use cases — see the
`content-search` and `markdown-access` skills.

## Overview

- Token endpoint: `POST https://staging.visa2.au/oauth/token`
  (RFC 6749 §4.4, `client_secret_basic` client auth).
- Resource: `GET https://staging.visa2.au/api/content`
  (RFC 6750 Bearer, required scope `content:read`).
- Tokens: HS256 JWT, `iss=https://staging.visa2.au`,
  `aud=https://staging.visa2.au/api`, 1-hour expiry.

Discovery metadata:

- <https://staging.visa2.au/.well-known/oauth-authorization-server> (RFC 8414)
- <https://staging.visa2.au/.well-known/oauth-protected-resource> (RFC 9728)
- <https://staging.visa2.au/auth.md> (full registration instructions)

## Step 1 — Register

There is no automated self-serve registration. Email
[info@visa2.au](mailto:info@visa2.au) with your agent's name and purpose, the
operator responsible for it, and an estimated request volume. Staging
credentials are issued manually and may be rotated or revoked without notice.

## Step 2 — Get an access token

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

## Step 3 — Call the content API

List all posts (en/ru/fr) as JSON:

```bash
curl -s "https://staging.visa2.au/api/content?list=1" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Fetch one post's full markdown:

```bash
curl -s "https://staging.visa2.au/api/content?path=/blog/visa-fee-increases-july-2026&lang=ru" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

`path` is the post path without extension (`/blog/<slug>`); `lang` is `en`
(default), `ru` or `fr`.

## Errors and limits

- Missing/invalid token → `401` with `WWW-Authenticate: Bearer` (RFC 6750).
- Wrong scope → `403`.
- Rate limits: token endpoint ~30 req/min per IP; API ~60 req/min per IP.
