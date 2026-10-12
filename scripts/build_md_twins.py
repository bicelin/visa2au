#!/usr/bin/env python3
"""Generate markdown twins for HTML pages that do not already have one.

Purpose: support `Accept: text/markdown` content negotiation ("Markdown for
Agents"). functions/_middleware.ts rewrites a request to `<path>.md` when the
client prefers markdown, so every page needs a twin.

Curated twins are PRESERVED, never overwritten:
  - app/blog/*.md, app/ru/blog/*.md, app/fr/blog/*.md  (written by build_blog.py
    from the cms/ sources — real markdown, not a conversion)
  - app/visas/*.md                                      (hand-authored)

Generated files carry MARKER as their first line; only files bearing the marker
are ever rewritten, so a curated twin added later is picked up automatically.

Idempotent: re-running produces identical output. Pure stdlib + bs4.

Usage:
  python3 scripts/build_md_twins.py            # generate/refresh
  python3 scripts/build_md_twins.py --check    # report only, exit 1 if stale
"""
from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from urllib.parse import urljoin

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
MARKER = "<!-- generated:md-twin -->"
SKIP_HTML = {"404.html"}


def _ws(s: str) -> str:
    return re.sub(r"[ \t]+", " ", s)


def inline(node) -> str:
    """Render the inline content of a tag as markdown."""
    out = []
    for c in node.children:
        if isinstance(c, NavigableString):
            out.append(_ws(str(c)))
        elif isinstance(c, Tag):
            n = c.name
            if n in ("script", "style", "svg", "noscript", "template"):
                continue
            if n in ("strong", "b"):
                t = inline(c).strip()
                out.append(f"**{t}**" if t else "")
            elif n in ("em", "i"):
                t = inline(c).strip()
                out.append(f"*{t}*" if t else "")
            elif n == "code":
                out.append(f"`{inline(c).strip()}`")
            elif n == "br":
                out.append("\n")
            elif n == "a":
                href = (c.get("href") or "").strip()
                txt = re.sub(r"\s+", " ", inline(c)).strip()
                if href and not href.startswith(("#", "mailto:", "tel:")):
                    out.append(f"[{txt or href}]({urljoin(BASE[0], href)})")
                elif txt:
                    out.append(txt)
            elif n == "img":
                src = (c.get("src") or "").strip()
                alt = (c.get("alt") or "").strip()
                if src:
                    out.append(f"![{alt}]({urljoin(BASE[0], src)})")
            else:
                out.append(inline(c))
    return re.sub(r"\n{3,}", "\n\n", "".join(out))


BASE = [""]


def blocks(node, depth=0) -> list[str]:
    """Render block-level children as markdown blocks."""
    out: list[str] = []
    for c in node.children:
        if isinstance(c, NavigableString):
            t = re.sub(r"\s+", " ", str(c)).strip()
            if t:
                out.append(t)
            continue
        if not isinstance(c, Tag):
            continue
        n = c.name
        if n in ("script", "style", "svg", "noscript", "template", "nav", "form"):
            continue
        if re.fullmatch(r"h[1-6]", n or ""):
            lvl = int(n[1])
            t = inline(c).strip()
            if t:
                out.append(f"{'#' * lvl} {t}")
        elif n == "p":
            t = inline(c).strip()
            if t:
                out.append(t)
        elif n == "blockquote":
            t = "\n".join(blocks(c)).strip()
            if t:
                out.append("\n".join("> " + ln for ln in t.splitlines()))
        elif n == "hr":
            out.append("---")
        elif n in ("ul", "ol"):
            items = []
            for i, li in enumerate([x for x in c.find_all("li", recursive=False)], 1):
                t = "\n".join(blocks(li)).strip() or inline(li).strip()
                t = re.sub(r"\n+", " ", t).strip()
                if t:
                    items.append(f"{i}. {t}" if n == "ol" else f"- {t}")
            if items:
                out.append("\n".join(items))
        elif n == "table":
            rows = []
            for tr in c.find_all("tr"):
                cells = [re.sub(r"\s+", " ", inline(td)).strip()
                         for td in tr.find_all(["th", "td"])]
                if cells:
                    rows.append(cells)
            if rows:
                w = max(len(r) for r in rows)
                rows = [r + [""] * (w - len(r)) for r in rows]
                md = ["| " + " | ".join(rows[0]) + " |",
                      "|" + "|".join([" --- "] * w) + "|"]
                md += ["| " + " | ".join(r) + " |" for r in rows[1:]]
                out.append("\n".join(md))
        elif n in ("div", "section", "article", "main", "aside", "header", "footer", "li"):
            out.extend(blocks(c, depth + 1))
        else:
            t = inline(c).strip()
            if t:
                out.append(t)
    return [b for b in (x.strip() for x in out) if b]


def convert(html: str, base_url: str) -> str:
    BASE[0] = base_url
    soup = BeautifulSoup(html, "lxml")
    title = ""
    if soup.title and soup.title.string:
        title = re.sub(r"\s+", " ", soup.title.string).strip()
    desc = ""
    m = soup.find("meta", attrs={"name": "description"})
    if m and m.get("content"):
        desc = re.sub(r"\s+", " ", m["content"]).strip()

    main = soup.find("main") or soup.body or soup
    for bad in main.find_all(["script", "style", "svg", "noscript", "template", "nav", "form"]):
        bad.decompose()

    body = "\n\n".join(blocks(main))
    parts = [MARKER]
    if title:
        parts.append(f"# {title}")
    if desc:
        parts.append(f"> {desc}")
    if body:
        parts.append(body)
    return re.sub(r"\n{3,}", "\n\n", "\n\n".join(parts)).strip() + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="report stale twins, do not write")
    args = ap.parse_args()

    created = updated = skipped = 0
    stale: list[str] = []

    for path in sorted(glob.glob(os.path.join(APP, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(path, APP)
        if os.path.basename(rel) in SKIP_HTML:
            continue
        md_path = path[:-5] + ".md"
        if os.path.isfile(md_path):
            head = open(md_path, encoding="utf-8").read(200)
            if MARKER not in head:
                skipped += 1          # curated twin — never touch
                continue

        html = open(path, encoding="utf-8").read()
        soup = BeautifulSoup(html, "lxml")
        can = soup.find("link", attrs={"rel": "canonical"})
        if can and can.get("href"):
            base_url = can["href"].rstrip("/") + ""
        else:
            clean = "" if rel == "index.html" else "/" + rel[:-5]
            base_url = "https://visa2.au" + clean
        md = convert(html, base_url)

        existed = os.path.isfile(md_path)
        if existed and open(md_path, encoding="utf-8").read() == md:
            continue
        if args.check:
            stale.append(rel)
            continue
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md)
        if existed:
            updated += 1
        else:
            created += 1

    if args.check:
        if stale:
            print(f"{len(stale)} stale/missing markdown twin(s):")
            for s in stale[:25]:
                print("  ", s)
            return 1
        print("all markdown twins up to date")
        return 0

    print(f"md twins: {created} created, {updated} updated, {skipped} curated preserved")
    return 0


if __name__ == "__main__":
    sys.exit(main())
