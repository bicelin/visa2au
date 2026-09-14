#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the voice-agent knowledge base from the site's own pages.

Every textual page in app/ (EN + ru/ + fr/) is transformed into a compact
markdown document for the Cartesia knowledge base:

  * <main id="main"> content only (chrome/footer/nav/search stripped)
  * headings -> markdown, <summary> -> "Q:", details/FAQs kept
  * the page's FAQPage JSON-LD appended (kept verbatim, official terms EN)
  * per-language metadata (lang, category, source_url, title)

Output: kb/{lang}/{slug}.md + kb/manifest.json (folder upload contract).
Run: python3 scripts/build_voice_kb.py
"""
from __future__ import annotations
import json, os, re, html as htmllib
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
APP = os.path.join(ROOT, "app")
OUT = os.path.join(ROOT, "kb")

SKIP_FILES = {"404.html", "index.html", "ru.html", "fr.html"}  # chrome-only / error page
SKIP_DIRS = {"_astro", "imgs", "story", "fonts", "motifs"}

def lang_of(rel: str) -> str:
    p = rel.split(os.sep)
    return p[0] if p[0] in ("ru", "fr") else "en"

def category_of(slug: str) -> str:
    if slug.startswith("blog/"): return "blog-guide"
    if slug.startswith("visas/"): return "visa-page"
    if "migration-agent" in slug: return "local-page"
    if slug in ("privacy", "terms"): return "legal"
    if slug in ("pricing", "pay", "donate", "contact", "team", "visas", "employers", "urgent-visa-help", "video"): return "core"
    return "page"

BLOCK_TEXT = re.compile(
    r"<(h[1-6])[^>]*>(.*?)</\1>"      # headings
    r"|<(p|li)[^>]*>(.*?)</\1>"        # paragraphs, list items
    r"|<summary[^>]*>(.*?)</summary>"  # FAQ questions
    r"|<(td|th)[^>]*>(.*?)</\1>",      # table cells
    re.S | re.I)
TAG = re.compile(r"<[^>]+>")

def clean(s: str) -> str:
    s = re.sub(r"<(script|style|noscript|svg)\b.*?</\1>", " ", s, flags=re.S | re.I)
    return s

def md_text(s: str) -> str:
    s = clean(s)
    s = s.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
    s = s.replace("</li>", "\n").replace("<li>", "- ")
    s = TAG.sub(" ", s)
    s = htmllib.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" ?\n ?", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()

def main_to_md(main_html: str, title: str) -> str:
    out = [f"# {title.strip()}", ""]
    # Walk blocks in document order, capturing gaps as plain text too.
    # Pattern order matters: <summary> BEFORE <p|li> so nested <p> inside a
    # details element doesn't shadow its question line.
    pattern = re.compile(
        r"<(h[1-6])[^>]*>(.*?)</\1>"
        r"|<summary[^>]*>(.*?)</summary>"
        r"|<(p|li)[^>]*>(.*?)</\1>"
        r"|<(td|th)[^>]*>(.*?)</\1>",
        re.S | re.I)
    pos = 0
    for m in pattern.finditer(main_html):
        gap = md_text(main_html[pos:m.start()])
        if gap:
            out.extend(gap.split("\n")); out.append("")
        pos = m.end()
        tag = (m.group(1) or m.group(3) or m.group(5) or "").lower()
        body = m.group(2) or m.group(4) or m.group(6) or ""
        if tag.startswith("h"):
            n = int(tag[1])
            t = md_text(body).replace("\n", " ")
            if t:
                out.append("#" * min(n + 1, 6) + " " + t); out.append("")
        elif tag == "summary":
            t = md_text(body).replace("\n", " ")
            if t:
                out.append(f"**Q:** {t}"); out.append("")
        else:
            t = md_text(body)
            if t:
                out.append(t if t.startswith("- ") else "- " + t if tag == "li" else t)
                out.append("")
    tail = md_text(main_html[pos:])
    if tail:
        out.extend(tail.split("\n"))
    text = "\n".join(x for x in out if x is not None)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def page_doc(rel: str):
    path = os.path.join(APP, rel)
    src = open(path, encoding="utf-8", errors="replace").read()
    mt = re.search(r"<title>(.*?)</title>", src, re.S)
    title = htmllib.unescape(mt.group(1)).replace(" | Visa2AU", "").strip() if mt else rel
    mm = re.search(r'<main id="main"[^>]*>(.*?)</main>', src, re.S)
    if not mm:
        return None
    body = main_to_md(mm.group(1), title)
    # FAQ JSON-LD adds structured answers not always mirrored in <summary>
    faqs = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
        try:
            sch = json.loads(m.group(1))
        except Exception:
            continue
        if sch.get("@type") == "FAQPage":
            for q in sch.get("mainEntity", [])[:12]:
                faqs.append("**Q:** " + q.get("name", "").strip()
                            + "\n" + md_text(q.get("acceptedAnswer", {}).get("text", "")))
    if faqs:
        body += "\n\n## FAQ\n\n" + "\n\n".join(faqs)
    if len(body) < 200:
        return None  # stub/no content (redirect pages)
    md = re.search(r'name="description" content="(.*?)"', src)
    desc = htmllib.unescape(md.group(1)) if md else ""
    slug = rel[:-5]                      # e.g. "ru/blog/x" or "visas/x"
    lang = lang_of(rel)
    core = slug[len(lang) + 1:] if lang != "en" else slug   # locale-stripped for categorisation
    url = f"https://visa2.au/{slug}"
    doc = {
        "name": f"[{lang}] {slug}",
        "content": body,
        "metadata": {
            "lang": lang,
            "category": category_of(core),
            "slug": slug,
            "source_url": url,
            "title": title,
            "description": desc,
        },
    }
    os.makedirs(os.path.join(OUT, lang_of(rel)), exist_ok=True)
    open(os.path.join(OUT, lang_of(rel), slug.replace(os.sep, "__") + ".md"), "w").write(
        f"---\nlang: {doc['metadata']['lang']}\ncategory: {doc['metadata']['category']}\ntitle: {title}\n---\n\n{body}\n")
    return doc

def main():
    docs = []
    skipped = []
    for dirpath, dirnames, files in os.walk(APP):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for f in files:
            if not f.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(dirpath, f), APP)
            base = os.path.basename(f)
            if base in SKIP_FILES and not rel.startswith(("ru/", "fr/")):
                continue
            if rel in ("ru/index.html", "fr/index.html"):
                continue  # homepage copy duplicates its sections everywhere
            doc = page_doc(rel)
            (docs.append(doc) if doc else skipped.append(rel))
    os.makedirs(OUT, exist_ok=True)
    json.dump({"documents": docs, "skipped": skipped},
              open(os.path.join(OUT, "manifest.json"), "w"), indent=1, ensure_ascii=False)
    from collections import Counter
    c = Counter(d["metadata"]["lang"] for d in docs)
    total_chars = sum(len(d["content"]) for d in docs)
    print(f"KB built: {len(docs)} docs {dict(c)} | {total_chars:,} chars total | skipped {len(skipped)} stubs")
    print("manifest:", os.path.join(OUT, "manifest.json"))

if __name__ == "__main__":
    main()
