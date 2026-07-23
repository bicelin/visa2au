#!/usr/bin/env python3
"""Build the static blog from Markdown sources.

Reads cms/blog/*.md (YAML front matter + Markdown body) and regenerates:
  - app/blog/<slug>.html   (full pages from scripts/blog_template.html)
  - the post-card grid in app/blog.html (sorted by date, newest first)
  - the blog entries in app/search-index.json (type "Guide", slug order)

Pure Python 3 stdlib. Idempotent: re-running produces identical output.
"""
import glob
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://visa2.au"

MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
]
MONTHS_SHORT = [m[:3] for m in MONTHS_LONG]


# ---------------------------------------------------------------- front matter

def parse_md(path):
    text = open(path, encoding="utf-8").read()
    assert text.startswith("---\n"), path
    end = text.index("\n---\n", 4)
    fm = {}
    for line in text[4:end].splitlines():
        key, _, value = line.partition(":")
        value = value.strip()
        if len(value) >= 2 and value[0] == '"' and value[-1] == '"':
            value = value[1:-1].replace('\\"', '"').replace("\\\\", "\\")
        fm[key.strip()] = value
    body = text[end + 5:].strip("\n")
    fm["reading_time"] = int(fm.get("reading_time") or 5)
    return fm, body


# ------------------------------------------------------------------- markdown

def slugify(text):
    s = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"\s", "-", s).strip("-")


def render_inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    text = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', text)
    return text


def render_markdown(md):
    """Render the limited Markdown used in cms/blog: ## / ### headings,
    paragraphs, - and 1. lists, > quotes, **strong**, *em*, links."""
    out = []
    for block in re.split(r"\n\s*\n", md):
        block = block.strip("\n")
        if not block:
            continue
        lines = block.splitlines()
        if block.startswith("### "):
            t = render_inline(block[4:].strip())
            out.append(f'<h3 id="{slugify(html.unescape(re.sub(r"<[^>]+>", "", t)))}">{t}</h3>')
        elif block.startswith("## "):
            t = render_inline(block[3:].strip())
            out.append(f'<h2 id="{slugify(html.unescape(re.sub(r"<[^>]+>", "", t)))}">{t}</h2>')
        elif block.startswith("> "):
            inner = "\n".join(l[2:] for l in lines)
            out.append(f"<blockquote>{render_inline(inner)}</blockquote>")
        elif all(re.match(r"\d+\. ", l) for l in lines):
            items = "\n".join(
                "<li>" + render_inline(re.sub(r"^\d+\. ", "", l)) + "</li>"
                for l in lines
            )
            out.append(f"<ol>\n{items}\n</ol>")
        elif all(l.startswith("- ") for l in lines):
            items = "\n".join("<li>" + render_inline(l[2:]) + "</li>" for l in lines)
            out.append(f"<ul>\n{items}\n</ul>")
        else:
            inner = "\n".join(render_inline(l) for l in lines)
            out.append(f"<p>{inner}</p>")
    return "\n".join(out)


# ---------------------------------------------------------------------- build

def fmt_long(iso):
    y, m, d = (int(x) for x in iso.split("-"))
    return f"{d} {MONTHS_LONG[m - 1]} {y}"


def fmt_short(iso):
    y, m, d = (int(x) for x in iso.split("-"))
    return f"{d} {MONTHS_SHORT[m - 1]} {y}"


def json_str(s):
    return json.dumps(s, ensure_ascii=False)[1:-1]


def render_post(template, fm, body_html):
    slug = fm["slug"]
    img = fm["image"].lstrip("/")  # e.g. imgs/hero-coast.jpg
    page = template
    page = page.replace("{{TITLE_HTML}}", html.escape(fm["title"], quote=False))
    page = page.replace("{{TITLE_JSON}}", json_str(fm["title"]))
    page = page.replace("{{DESC_HTML}}", html.escape(fm["description"], quote=False))
    page = page.replace("{{DESC_JSON}}", json_str(fm["description"]))
    page = page.replace("{{URL_ABS}}", f"{SITE}/blog/{slug}.html")
    page = page.replace("{{SLUG}}", slug)
    page = page.replace("{{AUTHOR}}", fm["author"])
    page = page.replace("{{DATE_JSON}}", f"{fm['date']}T00:00:00.000Z")
    page = page.replace("{{CATEGORY}}", fm["category"])
    page = page.replace(
        "{{META_LINE}}",
        f"{fm['author']} \u00b7 {fmt_long(fm['date'])} \u00b7 {fm['reading_time']} min read",
    )
    page = page.replace("{{IMAGE_REL}}", f"../{img}")
    page = page.replace("{{IMAGE_ABS}}", f"{SITE}/{img}")
    page = page.replace("{{BODY}}", body_html)
    return page


CARD = (
    '<a href="./blog/{slug}.html" class="reveal group flex flex-col overflow-hidden'
    " rounded-2xl border border-navy-800/10 bg-white transition hover:-translate-y-1"
    " hover:shadow-lg dark:border-white/10 dark:bg-navy-900\"> "
    '<div class="h-48 overflow-hidden bg-navy-800"> '
    '<img src="./{img}" alt="Feature image for: {title}" class="h-full w-full'
    ' object-cover transition group-hover:scale-105" loading="lazy"> </div> '
    '<div class="flex flex-1 flex-col p-5"> '
    '<p class="font-tech text-xs font-semibold uppercase tracking-wider'
    ' text-gold-600 dark:text-gold-400">{category}</p> '
    '<h2 class="mt-1.5 font-display text-lg font-bold leading-snug text-navy-800'
    ' dark:text-white">{title}</h2> '
    '<p class="mt-2 line-clamp-3 flex-1 text-sm text-slate-600'
    ' dark:text-slate-400">{desc}</p> '
    '<p class="mt-4 font-tech text-xs text-slate-400">{author} \u00b7 {date}'
    " \u00b7 {reading} min read</p> </div> </a>"
)


def write_if_changed(path, content):
    if os.path.exists(path) and open(path, encoding="utf-8").read() == content:
        return False
    open(path, "w", encoding="utf-8").write(content)
    return True


def main():
    template = open(
        os.path.join(ROOT, "scripts/blog_template.html"), encoding="utf-8"
    ).read()

    posts = []
    for path in sorted(glob.glob(os.path.join(ROOT, "cms/blog/*.md"))):
        fm, md = parse_md(path)
        fm.setdefault("slug", os.path.basename(path)[:-3])
        posts.append((fm, md))

    changed = []

    # 1. post pages
    for fm, md in posts:
        page = render_post(template, fm, render_markdown(md))
        dest = os.path.join(ROOT, "app/blog", fm["slug"] + ".html")
        if write_if_changed(dest, page):
            changed.append(dest)

    # 2. blog.html card grid (date desc)
    by_date = sorted(posts, key=lambda p: p[0]["date"], reverse=True)
    cards = "".join(
        CARD.format(
            slug=fm["slug"],
            img=fm["image"].lstrip("/"),
            title=html.escape(fm["title"], quote=False),
            category=fm["category"],
            desc=html.escape(fm["excerpt"], quote=False),
            author=fm["author"],
            date=fmt_short(fm["date"]),
            reading=fm["reading_time"],
        )
        for fm, _ in by_date
    )
    index_path = os.path.join(ROOT, "app/blog.html")
    index = open(index_path, encoding="utf-8").read()
    pattern = re.compile(
        r'(<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ).*?( </div> </section>)',
        re.S,
    )
    new_index, n = pattern.subn(lambda m: m.group(1) + cards + m.group(2), index, count=1)
    assert n == 1, "card grid not found in app/blog.html"
    if write_if_changed(index_path, new_index):
        changed.append(index_path)

    # 3. search-index.json blog entries (slug order, compact JSON)
    si_path = os.path.join(ROOT, "app/search-index.json")
    data = json.load(open(si_path, encoding="utf-8"))
    first = next(
        (i for i, e in enumerate(data) if e.get("url", "").startswith("blog/")),
        len(data),
    )
    data = [e for e in data if not e.get("url", "").startswith("blog/")]
    entries = [
        {
            "type": "Guide",
            "title": fm["title"],
            "excerpt": fm["excerpt"],
            "url": f"blog/{fm['slug']}.html",
            "keywords": fm["category"],
        }
        for fm, _ in posts
    ]
    data[first:first] = entries
    blob = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    if write_if_changed(si_path, blob):
        changed.append(si_path)

    print(f"{len(posts)} posts built; {len(changed)} file(s) updated")
    for c in changed:
        print("  updated", os.path.relpath(c, ROOT))


if __name__ == "__main__":
    main()
