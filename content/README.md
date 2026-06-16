# TinaCMS Integration Guide for Visa2AU Blog

The blog system has been restructured to be fully compatible with TinaCMS, a Git-backed headless CMS.

## Current Architecture

- **Content source**: All blog posts live in `/content/blog/*.md` as Markdown files with YAML frontmatter
- **Build-time loading**: Vite's `import.meta.glob()` inlines all Markdown content into the JS bundle at build time
- **Frontmatter parsing**: A lightweight custom parser (no Node.js Buffer dependency) extracts YAML frontmatter in the browser
- **TinaCMS schema**: `tina/config.ts` defines the content collection structure ready for Tina Cloud

## File Structure

```
content/blog/                    # All blog posts as Markdown files
├── understanding-partner-visa-820-801.md
├── employer-sponsorship-482-186-explained.md
├── visitor-visa-600-tips.md
├── skills-assessment-guide.md
├── parent-visa-options-australia.md
├── australian-citizenship-guide.md
├── visa-refusal-what-to-do.md
├── prospective-marriage-visa-300.md
├── work-holiday-visa-417-462.md
├── sponsored-parent-visa-870.md
├── protection-visa-866-guide.md
└── skilled-independent-visa-189.md

tina/
└── config.ts                  # TinaCMS collection schema

src/data/blogPosts.ts          # Content loader (import.meta.glob + parser)
src/pages/Blog.tsx             # Blog listing page
src/pages/BlogPost.tsx         # Individual blog post page
```

## Frontmatter Schema

Each blog post uses this YAML frontmatter structure:

```yaml
---
title: "Post Title"
excerpt: "Short description for cards and SEO"
date: "2025-04-15"
author: "Natasha Arens"
category: "Partner Visas"
readTime: "6 min read"
image: "/imgs/blog-image.jpg"
metaDescription: "SEO meta description"
---
```

**Available authors:** Natasha Arens, Sergey Vinnichenko, Denis Kosachev, Franz Somera

**Available categories:** Partner Visas, Employer Sponsorship, Visitor Visas, Skills Assessment, Family Visas, Citizenship, Visa Refusals, Work Visas, Protection Visas, Skilled Visas

## Connecting TinaCMS (Optional)

To enable the TinaCMS visual editor:

1. **Install TinaCMS packages:**
   ```bash
   npm install tinacms @tinacms/cli
   ```

2. **Set up Tina Cloud credentials** in `.env`:
   ```
   TINA_CLIENT_ID=your-client-id
   TINA_TOKEN=your-token
   ```

3. **Update `tina/config.ts`** with your branch name:
   ```ts
   branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
   ```

4. **Add the TinaCMS admin route** to your app (follow TinaCMS React integration docs)

5. **Run the TinaCMS dev server:**
   ```bash
   npx tinacms dev
   ```

## Adding New Blog Posts (Without TinaCMS)

Simply create a new `.md` file in `content/blog/` following the frontmatter schema. The file's URL slug is derived from the filename (without `.md`).

## Performance Benefits

- **No runtime API calls**: All blog content is embedded at build time
- **No external dependencies**: Custom frontmatter parser is ~1KB vs gray-matter's ~120KB
- **SEO-friendly**: Static rendering with proper meta descriptions
- **Instant page loads**: No CMS latency

## Migration Notes

The previous static TypeScript data file (`blogPosts.ts` with hardcoded arrays) has been replaced with the Markdown file approach. The component API remains identical - `blogPosts`, `getBlogPostBySlug()`, `getBlogPostsByCategory()`, and `getAllCategories()` all work the same way.
