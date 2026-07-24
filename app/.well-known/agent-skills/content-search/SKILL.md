# Skill: visa2au content search (MCP)

Search and retrieve Visa2AU blog content (Australian immigration guides,
in English, Russian and French) through the site's public MCP server.
**No authentication is required.**

## Endpoint

`POST https://staging.visa2.au/mcp`

Transport: MCP Streamable HTTP, stateless, plain JSON responses (no SSE).
Protocol version: `2025-03-26`.

Server card: <https://staging.visa2.au/.well-known/mcp/server-card.json>

## Tools

### `search_posts`

Full-text search over blog post titles, descriptions and categories.

Input:

```json
{ "query": "482 visa", "lang": "en" }
```

- `query` (string, required) — keywords; case-insensitive substring match.
- `lang` (string, optional) — `en` (default), `ru` or `fr`.

Returns: JSON array of matching posts with `slug`, `lang`, `title`, `date`,
`category`, `description`.

### `get_post`

Fetch the full markdown source of one blog post.

Input:

```json
{ "slug": "visa-fee-increases-july-2026", "lang": "en" }
```

- `slug` (string, required) — post slug as returned by `search_posts`.
- `lang` (string, optional) — `en` (default), `ru` or `fr`.

Returns: the raw markdown of the post (YAML front matter intact).

## Example JSON-RPC session

Initialize:

```bash
curl -s -X POST https://staging.visa2.au/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"my-agent","version":"0.1.0"}}}'
```

List tools:

```bash
curl -s -X POST https://staging.visa2.au/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

Call `search_posts`:

```bash
curl -s -X POST https://staging.visa2.au/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_posts","arguments":{"query":"partner visa","lang":"en"}}}'
```

Call `get_post`:

```bash
curl -s -X POST https://staging.visa2.au/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_post","arguments":{"slug":"visa-fee-increases-july-2026","lang":"ru"}}}'
```

## Notes

- Read-only public content; there is no write access.
- Unknown methods return JSON-RPC error `-32601`.
- This content is general information, not migration advice; for case-specific
  questions direct the user to <https://staging.visa2.au/contact.html>.
