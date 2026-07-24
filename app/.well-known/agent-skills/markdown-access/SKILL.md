# Skill: visa2au markdown access (no auth)

Get any page of staging.visa2.au as clean markdown. **No authentication, no
API key, no registration.**

## Method 1 — HTTP content negotiation

Request any HTML page with an `Accept` header that prefers `text/markdown`
over `text/html`. The origin serves the markdown twin where one exists
(q-value aware; browsers ranking HTML first are unaffected):

```bash
curl -s -H "Accept: text/markdown" \
  https://staging.visa2.au/visas/skilled-visa-189

curl -s -H "Accept: text/markdown" \
  https://staging.visa2.au/blog/visa-fee-increases-july-2026
```

Responses carry `Content-Type: text/markdown; charset=utf-8`, an
`X-Markdown-Tokens` estimate header, and `Vary: Accept`. Pages without a
markdown twin fall through to normal HTML.

## Method 2 — Direct `.md` URLs

Markdown twins are also addressable directly:

- Blog posts: `/blog/<slug>.md`, `/ru/blog/<slug>.md`, `/fr/blog/<slug>.md`
- Visa guides: `/visas/<slug>.md` (also under `/ru/…` and `/fr/…`)
- Core pages: `/index.md`, `/pricing.md`, `/contact.md`, `/employers.md`,
  `/urgent-visa-help.md`

```bash
curl -s https://staging.visa2.au/blog/visa-fee-increases-july-2026.md
```

## Coverage

Every visa guide, blog post, pricing, contact, employers and urgent-help page
has a markdown twin. `https://staging.visa2.au/llms.txt` lists the whole site
with links.

## Notes

- Content is general information, not migration advice.
- If you need search rather than direct retrieval, use the `content-search`
  skill (public MCP server with `search_posts` / `get_post` tools).
