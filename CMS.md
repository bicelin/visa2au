# CMS — Blog Publishing (Pages CMS)

The blog is managed as Markdown sources in `cms/blog/` and compiled to static
HTML in `app/blog/` by `scripts/build_blog.py`. Editing happens either through
[Pages CMS](https://pagescms.org) (for humans, no local tooling) or directly in
git (for AI agents / scripts). Cloudflare Pages deploys `main` automatically —
there is no build step on Pages; whatever is committed to `app/` is served.

## For humans: editing via pagescms.org

1. Go to https://pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub App on the `bicelin/visa2au` repository when
   prompted (one-time owner action).
3. Open the repo → branch `main` → the **Blog** collection (configured in
   `.pages.yml`).
4. Create or edit a post. Fields map 1:1 to the front matter described below.
   Images are picked from `app/imgs` and stored as `/imgs/...` paths.
5. Save — Pages CMS commits the Markdown file to `main`. The
   **Build blog from CMS sources** GitHub Action then regenerates
   `app/blog/*.html`, the cards in `app/blog.html`, and the blog entries in
   `app/search-index.json`, and commits the result back to `main`
   (`[skip ci]`, so no loops).
6. Cloudflare Pages deploys; the change is live on https://staging.visa2.au
   within ~1–2 minutes.

## For AI agents / bots: publishing via git

1. Write (or update) `cms/blog/<slug>.md` with the front matter below.
2. Run `python3 scripts/build_blog.py` locally and commit both `cms/` and the
   regenerated `app/` files — or just push the Markdown and let the GitHub
   Action build (it triggers on pushes touching `cms/**`).
3. Never edit `app/blog/*.html` by hand; those files are generated and will be
   overwritten. The page chrome (header/footer/head) lives in
   `scripts/blog_template.html`.

## Filename conventions

- One file per post: `cms/blog/<slug>.md`.
- `<slug>` is lowercase kebab-case, must match the `slug` field, and becomes
  the public URL: `https://visa2.au/blog/<slug>.html`.
- Do not rename a slug after publication without setting up a redirect.

## Front matter

```yaml
---
title: "Post title"            # required
slug: my-post-slug             # required, matches filename
date: 2025-03-10               # required, ISO date
category: "Visitor Visas"      # required, one of the categories below
description: "Meta description (head/SEO)."
excerpt: "Short teaser shown on blog cards and in site search."
author: "Natasha Arens"
image: /imgs/hero-coast.jpg    # feature image, from app/imgs
reading_time: 5                # minutes, integer
lang: en
---
```

Body is Markdown: `##`/`###` headings, paragraphs, `-` and `1.` lists,
`**bold**`, `*italic*`, `[links](url)`, `>` quotes.

## Categories

- Partner Visas
- Employer Sponsorship
- Visitor Visas
- Skills Assessment
- Family Visas
- Citizenship
- Visa Refusals
- Skilled Visas
- Protection Visas
- Work Visas

A new category can be added, but also add it to the `select` options in
`.pages.yml` and to the filter chips in `app/blog.html`.

## Layout of this pipeline

| Path | Role |
| --- | --- |
| `cms/blog/*.md` | source of truth for post content |
| `scripts/build_blog.py` | generator (Python 3 stdlib only, idempotent) |
| `scripts/blog_template.html` | page chrome template with `{{TOKENS}}` |
| `scripts/migrate_blog.py` | one-off migration used to create `cms/` (kept for reference) |
| `.pages.yml` | Pages CMS configuration |
| `.github/workflows/build-blog.yml` | auto-build on push to `main` touching `cms/**` |
| `app/blog/*.html`, `app/blog.html`, `app/search-index.json` | generated output — do not hand-edit |
