#!/usr/bin/env python3
from __future__ import annotations

"""CI smoke test for SEO invariants. Exits non-zero on violations.

Checks across every app/**/*.html:
  - canonical/hreflang URLs are extensionless and on the production base
  - every hreflang target resolves to a real file
  - hreflang reciprocity: a page's locale twins link back to it
  - sitemap.xml URLs all resolve to real files and match canonicals
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
SITE = "https://visa2.au"

errors = []


def path_from_url(url: str) -> str | None:
    """Map a site URL back to the file it serves (extensionless form)."""
    if not url.startswith(SITE):
        return None
    p = url[len(SITE):].lstrip("/")
    if not p:
        return "index.html"
    if p.endswith("/"):
        return p + "index.html"
    if os.path.isfile(os.path.join(APP, p)):
        return p
    if os.path.isfile(os.path.join(APP, p + ".html")):
        return p + ".html"
    return p  # keep original so the caller can flag it as missing


def main() -> int:
    files = []
    for root, _, fs in os.walk(APP):
        for f in fs:
            if f.endswith(".html"):
                files.append(os.path.join(root, f))

    pages = {}  # rel-path -> (canonical, {lang: hreflang_url})
    for path in files:
        rel = os.path.relpath(path, APP)
        html = open(path, encoding="utf-8").read()
        can = re.search(r'<link rel="canonical" href="([^"]+)"', html)
        hf = re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', html)
        pages[rel] = (can.group(1) if can else None, dict(hf))

    # 1) canonical form + existence
    for rel, (can, _) in pages.items():
        if can is None:
            errors.append(f"{rel}: missing canonical")
            continue
        if ".html" in can:
            errors.append(f"{rel}: canonical has .html -> {can}")
        if not can.startswith(SITE):
            errors.append(f"{rel}: canonical off-base -> {can}")
        target = path_from_url(can)
        if target and not os.path.isfile(os.path.join(APP, target)):
            errors.append(f"{rel}: canonical target missing -> {can}")

    # 2) hreflang targets exist + are extensionless
    for rel, (_, hf) in pages.items():
        for lang, url in hf.items():
            if ".html" in url:
                errors.append(f"{rel}: hreflang[{lang}] has .html -> {url}")
            t = path_from_url(url)
            if t is None:
                errors.append(f"{rel}: hreflang[{lang}] off-base -> {url}")
            elif not os.path.isfile(os.path.join(APP, t)):
                errors.append(f"{rel}: hreflang[{lang}] target missing -> {url}")

    # 3) reciprocity: a page's locale twin must point back to this page
    for rel, (can, hf) in pages.items():
        our_lang = ("ru" if rel.startswith("ru/") or rel == "ru.html"
                    else "fr" if rel.startswith("fr/") or rel == "fr.html"
                    else "en")
        for lang, url in hf.items():
            if lang == "x-default":
                continue
            t = path_from_url(url)
            if not t or not os.path.isfile(os.path.join(APP, t)):
                continue
            other = pages.get(t, (None, {}))
            if other[0] is None:
                continue
            # the target page's hreflang for OUR language must equal our canonical
            back_url = other[1].get(our_lang)
            if back_url is None or back_url != can:
                errors.append(f"{rel}: {t} hreflang[{our_lang}] != our canonical ({can} vs {back_url})")

    # 4) sitemap vs files
    sitemap = os.path.join(APP, "sitemap.xml")
    if os.path.isfile(sitemap):
        text = open(sitemap, encoding="utf-8").read()
        locs = re.findall(r"<loc>(.*?)</loc>", text)
        for loc in locs:
            t = path_from_url(loc)
            if t is None:
                errors.append(f"sitemap: off-base URL {loc}")
            elif not os.path.isfile(os.path.join(APP, t)):
                errors.append(f"sitemap: missing target {loc}")
        # every canonical should appear in the sitemap (404 page excluded)
        canonicals = {can for (rel, (can, _)) in pages.items() if can and rel != "404.html"}
        sitemap_set = set(locs)
        for c in sorted(canonicals):
            if c not in sitemap_set:
                errors.append(f"canonical not in sitemap: {c}")

    if errors:
        print(f"VIOLATIONS ({len(errors)}):")
        for e in errors[:60]:
            print(" -", e)
        return 1
    print(f"== OK: {len(pages)} pages, canonicals/hreflang/sitemap consistent ==")
    return 0


if __name__ == "__main__":
    sys.exit(main())
