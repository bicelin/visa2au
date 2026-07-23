# CMS Deployment — Findings, Status & Owner Steps

Date: 2026-07-XX (prep branch `cms/emdash-prep`)
Prepared by: Kimi agent. No production resources were created or modified.

## TL;DR

1. **EmDash exists and is real** — [github.com/emdash-cms/emdash](https://github.com/emdash-cms/emdash), announced by Cloudflare 2026-04-01, MIT-licensed, beta (v0.2.x). Docs: <https://docs.emdashcms.com/>.
2. **But it is NOT git-based.** EmDash stores content in a SQL database (Cloudflare D1), media in R2, sessions in KV. Content edits made in its admin panel live in D1 and are **never committed to the GitHub repo**. There is no Markdown editor and no GitHub commit/OAuth-content flow. The reference doc's description ("git-based … commits content via GitHub") does not match EmDash's actual architecture.
3. **It cannot be bolted onto this repo as-is.** EmDash is an *Astro integration* requiring an Astro source project rendered with SSR on a Worker. This repo contains only static build output (`app/*.html`) plus Pages Functions — there is no Astro source to integrate into, and blog posts exist **only as static HTML** (`app/blog/*.html`); there is no Markdown source for any blog post.
4. **Token blocker.** The scoped `CLOUDFLARE_API_TOKEN` in `astra/.env.staging` is valid but has **Pages-only scope**. D1, R2, Workers and KV API calls all return `Authentication error (10000)`, and token creation returns `Unauthorized (9109)` — so a new token cannot be minted via the API either. The zone-settings token is zone-scoped and irrelevant to Workers.

## What this means

Deploying EmDash "for this site" really means **building a new EmDash/Astro site** and either migrating content into D1 (a one-way move away from git) or running it as a separate blog at a subpath — with the existing static site untouched. That is a rebuild decision, not a deployment.

If the actual goal is *"edit blog/content in a friendly UI and have changes committed to GitHub"*, the correct tool category is a **git-based CMS** (no Cloudflare resources needed at all):

| Option | How it works | Fit |
|---|---|---|
| **PagesCMS** (pagescms.org) | Free hosted GitHub App; edits files directly in the repo via a `.pages.yml` config; media committed to repo | Best fit — zero infra, works with this exact repo/Pages setup |
| **Decap CMS** | Self-hosted admin at `/admin`, GitHub backend via OAuth gateway | Works, needs a small OAuth Worker |
| **TinaCMS / Outstatic** | Git-backed, more involved setup | Overkill |

Caveat for ALL git-based options: blog posts here are static **HTML** with no Markdown source, so a CMS would either edit raw HTML bodies or we first add Markdown sources + a build step that regenerates the HTML (Pages can run a build command).

## Owner action needed (pick one path)

### Path A — Proceed with EmDash anyway (rebuild track)
1. In Cloudflare dashboard → My Profile → API Tokens → **Create Token** with: *Account → Workers Scripts:Edit, D1:Edit, R2:Edit, KV:Edit* (account `e083bf…5f56`). Save it into `astra/.env.staging` as `CLOUDFLARE_API_TOKEN` (or a new var).
2. Decide where the Astro source project lives (new repo or `src/` in this one) — agent can scaffold with `npm create emdash@latest` / template `@emdash-cms/template-blog`.
3. Agent then runs: `wrangler d1 create visa2au-emdash`, `wrangler r2 bucket create visa2au-emdash-media`, `wrangler kv namespace create SESSIONS`, fills the IDs into `emdash/wrangler.jsonc` (already prepared), runs D1 migrations, deploys, and routes `staging.visa2.au/_emdash/*` to the Worker (no conflict with Pages Functions under `/api/*`).
4. First admin user is created via passkey in the browser at `https://staging.visa2.au/_emdash/admin` — owner must complete that click-flow.

### Path B — Git-based CMS (recommended; matches the stated goal)
1. Visit <https://pagescms.org> → sign in with GitHub (`bicelin`) → install the PagesCMS GitHub App on `bicelin/visa2au` (repo-scoped, revocable).
2. Tell the agent "PagesCMS is installed" — the agent will commit a `.pages.yml` mapping the editable content (pages `.md`, blog HTML bodies or new Markdown sources + build step) and you're done. No Cloudflare changes, no tokens, no D1/R2.

## What was verified during prep
- Tooling OK: node v24.15.0, npm 11.12.1, wrangler 4.114.0.
- `CLOUDFLARE_API_TOKEN` status: active; Pages access confirmed (projects `astra-staging`, `visa2au-staging`, `visa2au-prod` visible).
- D1/R2/Workers/KV/token-creation: all denied with current token (errors 10000 / 9109).
- Repo `main` untouched; everything here lives on branch `cms/emdash-prep`.
- `https://staging.visa2.au` confirmed still serving 200 after this branch was pushed (branch pushes only create a Pages preview, production unaffected).

## Files on this branch
- `CMS_DEPLOYMENT.md` — this document.
- `emdash/wrangler.jsonc` — ready-to-fill Worker config template for Path A (placeholder D1/KV IDs; secrets listed in comments, values intentionally absent).
