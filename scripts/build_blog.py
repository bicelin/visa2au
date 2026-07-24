#!/usr/bin/env python3
"""Build the static blog from Markdown sources.

Reads cms/blog/*.md plus the translated sources cms/blog-ru/*.md and
cms/blog-fr/*.md (YAML front matter + Markdown body) and regenerates:
  - app/blog/<slug>.html      (EN, from scripts/blog_template.html)
  - app/blog/<slug>.md        (raw markdown twin, front matter intact)
  - app/ru/blog/<slug>.html   (RU, from scripts/blog_template_ru.html)
  - app/ru/blog/<slug>.md     (raw markdown twin)
  - app/fr/blog/<slug>.html   (FR, from scripts/blog_template_fr.html)
  - app/fr/blog/<slug>.md     (raw markdown twin)
  - app/ru/blog.html          (RU index, from scripts/blog_index_template_ru.html)
  - app/fr/blog.html          (FR index, from scripts/blog_index_template_fr.html)
  - the post-card grid in app/blog.html (EN only, sorted newest first)
  - the blog entries in app/search-index.json (EN only, slug order)

Each language manages only its own output directory, including orphan
cleanup. Pure Python 3 stdlib. Idempotent: re-running produces identical
output.
"""
import glob
import html
import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://visa2.au"

MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
]
MONTHS_SHORT = [m[:3] for m in MONTHS_LONG]
MONTHS_RU = [  # genitive case for dates
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
]
MONTHS_FR = [
    "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre",
]

# Per-language blog pipelines. "en" additionally maintains app/blog.html and
# the blog entries in app/search-index.json; ru/fr also rebuild their own
# localized blog index pages (translated posts only).
LANGS = [
    {
        "lang": "en",
        "src": "cms/blog",
        "template": "scripts/blog_template.html",
        "out": "app/blog",
        "url": SITE + "/blog/{slug}.html",
        "rel_prefix": "../",
    },
    {
        "lang": "ru",
        "src": "cms/blog-ru",
        "template": "scripts/blog_template_ru.html",
        "out": "app/ru/blog",
        "url": SITE + "/ru/blog/{slug}.html",
        "rel_prefix": "../../",
        "index_template": "scripts/blog_index_template_ru.html",
        "index_out": "app/ru/blog.html",
        "index_img_prefix": "../",
        "index_img_alt": "Обложка статьи",
        "index_reading": "мин чтения",
    },
    {
        "lang": "fr",
        "src": "cms/blog-fr",
        "template": "scripts/blog_template_fr.html",
        "out": "app/fr/blog",
        "url": SITE + "/fr/blog/{slug}.html",
        "rel_prefix": "../../",
        "index_template": "scripts/blog_index_template_fr.html",
        "index_out": "app/fr/blog.html",
        "index_img_prefix": "../",
        "index_img_alt": "Image d'illustration",
        "index_reading": "min de lecture",
    },
]


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
        elif all(l.lstrip().startswith("|") for l in lines) and len(lines) >= 2:
            def cells(row):
                return [c.strip() for c in row.strip().strip("|").split("|")]
            header = cells(lines[0])
            body = [cells(r) for r in lines[2:]]
            thead = "".join(f"<th>{render_inline(c)}</th>" for c in header)
            rows = "\n".join(
                "<tr>" + "".join(f"<td>{render_inline(c)}</td>" for c in r) + "</tr>"
                for r in body
            )
            out.append(
                '<table class="fee-table">\n<thead><tr>'
                + thead
                + "</tr></thead>\n<tbody>\n"
                + rows
                + "\n</tbody></table>"
            )
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


def meta_line(fm, lang):
    y, m, d = (int(x) for x in fm["date"].split("-"))
    author = fm["author"]
    rt = fm["reading_time"]
    if lang == "ru":
        return f"{author} · {d} {MONTHS_RU[m - 1]} {y} г. · {rt} мин чтения"
    if lang == "fr":
        return f"{author} · {d} {MONTHS_FR[m - 1]} {y} · {rt} min de lecture"
    return f"{author} · {d} {MONTHS_LONG[m - 1]} {y} · {rt} min read"


def json_str(s):
    return json.dumps(s, ensure_ascii=False)[1:-1]


def render_post(template, fm, body_html, cfg):
    slug = fm["slug"]
    img = fm["image"].lstrip("/")  # e.g. imgs/hero-coast.jpg
    page = template
    page = page.replace("{{TITLE_HTML}}", html.escape(fm["title"], quote=False))
    page = page.replace("{{TITLE_JSON}}", json_str(fm["title"]))
    page = page.replace("{{DESC_HTML}}", html.escape(fm["description"], quote=False))
    page = page.replace("{{DESC_JSON}}", json_str(fm["description"]))
    page = page.replace("{{URL_ABS}}", cfg["url"].format(slug=slug))
    page = page.replace("{{SLUG}}", slug)
    page = page.replace("{{AUTHOR}}", fm["author"])
    page = page.replace("{{DATE_JSON}}", f"{fm['date']}T00:00:00.000Z")
    page = page.replace("{{CATEGORY}}", fm["category"])
    page = page.replace("{{META_LINE}}", meta_line(fm, cfg["lang"]))
    page = page.replace("{{IMAGE_REL}}", cfg["rel_prefix"] + img)
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

# Localized variant for the ru/fr index pages: image path and meta line use
# the language's own prefixes/labels (see LANGS index_* keys).
CARD_LOC = (
    '<a href="./blog/{slug}.html" class="reveal group flex flex-col overflow-hidden'
    " rounded-2xl border border-navy-800/10 bg-white transition hover:-translate-y-1"
    " hover:shadow-lg dark:border-white/10 dark:bg-navy-900\"> "
    '<div class="h-48 overflow-hidden bg-navy-800"> '
    '<img src="{img_prefix}{img}" alt="{img_alt}: {title}" class="h-full w-full'
    ' object-cover transition group-hover:scale-105" loading="lazy"> </div> '
    '<div class="flex flex-1 flex-col p-5"> '
    '<p class="font-tech text-xs font-semibold uppercase tracking-wider'
    ' text-gold-600 dark:text-gold-400">{category}</p> '
    '<h2 class="mt-1.5 font-display text-lg font-bold leading-snug text-navy-800'
    ' dark:text-white">{title}</h2> '
    '<p class="mt-2 line-clamp-3 flex-1 text-sm text-slate-600'
    ' dark:text-slate-400">{desc}</p> '
    '<p class="mt-4 font-tech text-xs text-slate-400">{author} \u00b7 {date}'
    " \u00b7 {reading} {reading_label}</p> </div> </a>"
)


def fmt_card_date(iso, lang):
    y, m, d = (int(x) for x in iso.split("-"))
    if lang == "ru":
        return f"{d} {MONTHS_RU[m - 1]} {y} г."
    if lang == "fr":
        return f"{d} {MONTHS_FR[m - 1]} {y}"
    return f"{d} {MONTHS_SHORT[m - 1]} {y}"


def write_if_changed(path, content):
    if os.path.exists(path) and open(path, encoding="utf-8").read() == content:
        return False
    open(path, "w", encoding="utf-8").write(content)
    return True


def main():
    changed = []
    posts_en = []

    # 1. post pages, per language (each language manages only its own dir)
    for cfg in LANGS:
        template = open(os.path.join(ROOT, cfg["template"]), encoding="utf-8").read()
        posts = []
        for path in sorted(glob.glob(os.path.join(ROOT, cfg["src"], "*.md"))):
            fm, md = parse_md(path)
            fm.setdefault("slug", os.path.basename(path)[:-3])
            posts.append((fm, md))
        if cfg["lang"] == "en":
            posts_en = posts

        out_dir = os.path.join(ROOT, cfg["out"])
        os.makedirs(out_dir, exist_ok=True)
        live_slugs = set()
        for fm, md in posts:
            live_slugs.add(fm["slug"])
            page = render_post(template, fm, render_markdown(md), cfg)
            dest = os.path.join(out_dir, fm["slug"] + ".html")
            if write_if_changed(dest, page):
                changed.append(dest)

        # 1a-ii. raw markdown twins (front matter intact) for agent
        # content negotiation via functions/_middleware.ts
        for path in glob.glob(os.path.join(ROOT, cfg["src"], "*.md")):
            dest = os.path.join(out_dir, os.path.basename(path))
            if not (os.path.exists(dest) and
                    open(dest, encoding="utf-8").read() ==
                    open(path, encoding="utf-8").read()):
                shutil.copyfile(path, dest)
                changed.append(dest)

        # 1b. remove pages whose source was deleted (this language only)
        for stale in glob.glob(os.path.join(out_dir, "*.html")):
            if os.path.basename(stale)[:-5] not in live_slugs:
                os.remove(stale)
                changed.append(stale + " (deleted)")
        for stale in glob.glob(os.path.join(out_dir, "*.md")):
            if os.path.basename(stale)[:-3] not in live_slugs:
                os.remove(stale)
                changed.append(stale + " (deleted)")

        # 1c. localized blog index (ru/fr): translated posts only, newest first
        if "index_out" in cfg:
            by_date_loc = sorted(posts, key=lambda p: p[0]["date"], reverse=True)
            cards = "".join(
                CARD_LOC.format(
                    slug=fm["slug"],
                    img_prefix=cfg["index_img_prefix"],
                    img=fm["image"].lstrip("/"),
                    img_alt=cfg["index_img_alt"],
                    title=html.escape(fm["title"], quote=False),
                    category=fm["category"],
                    desc=html.escape(fm["excerpt"], quote=False),
                    author=fm["author"],
                    date=fmt_card_date(fm["date"], cfg["lang"]),
                    reading=fm["reading_time"],
                    reading_label=cfg["index_reading"],
                )
                for fm, _ in by_date_loc
            )
            tmpl = open(
                os.path.join(ROOT, cfg["index_template"]), encoding="utf-8"
            ).read()
            page = tmpl.replace("{{CARDS}}", cards)
            dest = os.path.join(ROOT, cfg["index_out"])
            if write_if_changed(dest, page):
                changed.append(dest)

    posts = posts_en

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

    print(f"{len(posts)} EN posts built; {len(changed)} file(s) updated")
    for c in changed:
        print("  updated", os.path.relpath(c, ROOT))


if __name__ == "__main__":
    main()
