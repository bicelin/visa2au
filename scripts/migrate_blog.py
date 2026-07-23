#!/usr/bin/env python3
"""One-off migration: convert app/blog/*.html posts into cms/blog/*.md sources.

Also extracts scripts/blog_template.html (page chrome with {{TOKENS}}) from
app/blog/visitor-visa-600-tips.html. Kept for provenance; safe to re-run.
"""
import glob
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE_SRC = os.path.join(ROOT, "app/blog/visitor-visa-600-tips.html")


def slugify(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s


def inline_to_md(fragment):
    fragment = re.sub(r"<strong>(.*?)</strong>", r"**\1**", fragment, flags=re.S)
    fragment = re.sub(r"<em>(.*?)</em>", r"*\1*", fragment, flags=re.S)
    fragment = re.sub(
        r'<a href="(.*?)">(.*?)</a>', r"[\2](\1)", fragment, flags=re.S
    )
    return html.unescape(fragment).strip()


def body_html_to_md(body):
    out = []
    for m in re.finditer(r"<(p|h2|ul|ol)[^>]*>(.*?)</\1>", body, re.S):
        tag, inner = m.group(1), m.group(2)
        if tag == "p":
            out.append(inline_to_md(inner))
        elif tag == "h2":
            out.append("## " + inline_to_md(inner))
        else:
            items = re.findall(r"<li>(.*?)</li>", inner, re.S)
            lines = []
            for n, it in enumerate(items, 1):
                prefix = f"{n}. " if tag == "ol" else "- "
                lines.append(prefix + inline_to_md(it))
            out.append("\n".join(lines))
    return "\n\n".join(out) + "\n"


def yaml_quote(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main():
    os.makedirs(os.path.join(ROOT, "cms/blog"), exist_ok=True)
    excerpts = {
        e["url"][5:-5]: e["excerpt"]
        for e in json.load(open(os.path.join(ROOT, "app/search-index.json"), encoding="utf-8"))
        if e.get("url", "").startswith("blog/")
    }
    for path in sorted(glob.glob(os.path.join(ROOT, "app/blog/*.html"))):
        h = open(path, encoding="utf-8").read()
        slug = os.path.basename(path)[:-5]
        title = html.unescape(
            re.search(r"<title>(.*?)\| Visa2AU", h).group(1).strip()
        )
        desc = re.search(r'name="description" content="(.*?)"', h).group(1)
        date = re.search(r'datePublished":"(.*?)"', h).group(1)[:10]
        author = re.search(r'"author":\{"@type":"Person","name":"(.*?)"', h).group(1)
        cat = re.search(
            r'uppercase tracking-wider text-gold-600[^>]*>([^<]+)</p>', h
        ).group(1)
        meta = re.search(
            r'font-tech text-sm text-slate-500[^>]*>\s*(.*?)\s*</p>', h
        ).group(1)
        reading = re.search(r"(\d+) min read", meta).group(1)
        img = re.search(r'<img src="\.\./(imgs/[^"]+)" alt="Feature', h).group(1)
        body = re.search(
            r'prose-visa mt-10[^>]*>(.*?)</div> <div class="mt-12', h, re.S
        ).group(1).strip()
        md_body = body_html_to_md(body)
        fm = [
            "---",
            f"title: {yaml_quote(title)}",
            f"slug: {slug}",
            f"date: {date}",
            f"category: {yaml_quote(cat)}",
            f"description: {yaml_quote(desc)}",
            f"excerpt: {yaml_quote(excerpts[slug])}",
            f"author: {yaml_quote(author)}",
            f"image: /{img}",
            f"reading_time: {reading}",
            "lang: en",
            "---",
            "",
        ]
        out = "\n".join(fm) + md_body
        dest = os.path.join(ROOT, "cms/blog", slug + ".md")
        open(dest, "w", encoding="utf-8").write(out)
        print("wrote", dest)

    # --- extract page template from the visitor post ---
    h = open(TEMPLATE_SRC, encoding="utf-8").read()
    title = re.search(r"<title>(.*?)\| Visa2AU", h).group(1).strip()  # escaped
    title_u = html.unescape(title)
    desc = re.search(r'name="description" content="(.*?)"', h).group(1)
    slug = "visitor-visa-600-tips"
    cat = "Visitor Visas"
    img_rel = "../imgs/hero-coast.jpg"
    img_abs = "https://visa2.au/imgs/hero-coast.jpg"
    date_json = "2025-03-10T00:00:00.000Z"
    meta = "Natasha Arens \u00b7 10 March 2025 \u00b7 5 min read"

    # JSON string-escaped variants (content only, without surrounding quotes)
    title_json = json.dumps(title_u, ensure_ascii=False)[1:-1]
    desc_json = json.dumps(html.unescape(desc), ensure_ascii=False)[1:-1]

    t = h
    # head + JSON-LD substitutions (order matters: escaped/JSON forms first)
    t = t.replace(title_json, "{{TITLE_JSON}}")
    t = t.replace(desc_json, "{{DESC_JSON}}")
    t = t.replace(title, "{{TITLE_HTML}}")  # remaining escaped occurrences
    t = t.replace(desc, "{{DESC_HTML}}")
    t = t.replace(date_json, "{{DATE_JSON}}")
    t = t.replace(img_abs, "{{IMAGE_ABS}}")
    t = t.replace("https://visa2.au/blog/" + slug + ".html", "{{URL_ABS}}")
    # ru/fr hreflang alternates keep the same slug under a locale prefix
    t = t.replace("blog/" + slug + ".html", "blog/{{SLUG}}.html")
    t = t.replace('name":"Natasha Arens"', 'name":"{{AUTHOR}}"')
    # article section
    m = re.search(
        r'<nav class="mb-6 font-tech.*?</div> <div class="mt-12', t, re.S
    )
    seg = m.group(0)
    new = seg
    new = new.replace(
        f'<span class="text-gold-600 dark:text-gold-400">{cat}</span>',
        '<span class="text-gold-600 dark:text-gold-400">{{CATEGORY}}</span>',
    )
    new = new.replace(
        f'tracking-wider text-gold-600 dark:text-gold-400">{cat}</p>',
        'tracking-wider text-gold-600 dark:text-gold-400">{{CATEGORY}}</p>',
    )
    new = new.replace(meta, "{{META_LINE}}")
    new = new.replace(img_rel, "{{IMAGE_REL}}")
    new = re.sub(
        r'prose-visa mt-10[^>]*>.*?</div> <div class="mt-12',
        'prose-visa mt-10 text-navy-800 dark:text-slate-200"> {{BODY}} </div>'
        ' <div class="mt-12',
        new,
        flags=re.S,
    )
    assert "{{BODY}}" in new and "{{CATEGORY}}" in new and "{{META_LINE}}" in new
    t = t[: m.start()] + new + t[m.end():]
    # restore HTML-context tokens (generic replace above matched JSON form first)
    t = t.replace("<title>{{TITLE_JSON}}", "<title>{{TITLE_HTML}}")
    t = t.replace('og:title" content="{{TITLE_JSON}} |', 'og:title" content="{{TITLE_HTML}} |')
    t = t.replace(">{{TITLE_JSON}}</h1>", ">{{TITLE_HTML}}</h1>")
    t = t.replace('alt="Feature image for: {{TITLE_JSON}}"', 'alt="Feature image for: {{TITLE_HTML}}"')
    t = t.replace('name="description" content="{{DESC_JSON}}"', 'name="description" content="{{DESC_HTML}}"')
    t = t.replace('og:description" content="{{DESC_JSON}}"', 'og:description" content="{{DESC_HTML}}"')
    assert "{{TITLE_JSON}}" in t and "{{URL_ABS}}" in t and "{{AUTHOR}}" in t
    assert "{{TITLE_HTML}}" in t and "{{DESC_HTML}}" in t and "{{DESC_JSON}}" in t
    assert "{{IMAGE_ABS}}" in t
    assert slug not in t
    assert "{{TITLE_JSON}} |" not in t and "{{TITLE_JSON}}<" not in t
    open(os.path.join(ROOT, "scripts/blog_template.html"), "w", encoding="utf-8").write(t)
    print("wrote scripts/blog_template.html")


if __name__ == "__main__":
    main()
