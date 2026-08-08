#!/usr/bin/env python3
from __future__ import annotations

"""Generate app/sitemap.xml from the deployed file tree (single source of
truth: whatever is committed under app/). Blog lastmod comes from the
markdown frontmatter twins. Idempotent, deterministic order.
"""
import datetime
import os
import re
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
SITE = "https://visa2.au"

PRIORITY = {
    "index": 1.0,
    "ru/index": 0.9, "fr/index": 0.9,
    "visas/": 0.8, "blog/": 0.6, "urgent-visa-help": 0.6,
    "pay": 0.4, "donate": 0.4, "video": 0.4, "privacy": 0.3,
}
DEFAULT_PRIORITY = 0.6


def file_url(path: str) -> str | None:
    rel = os.path.relpath(path, APP)
    if rel == "404.html":
        return None
    if rel in ("ru.html", "fr.html"):  # redirect stubs; canonical is /ru/ or /fr/
        return None
    if rel == "index.html":
        return SITE + "/"
    if rel.endswith("index.html"):
        return SITE + "/" + rel[:-len("index.html")]
    if rel.endswith(".html"):
        return SITE + "/" + rel[:-5]
    return None


def lastmod_for(path: str) -> str | None:
    """Blog posts have a .md twin with YYYY-MM-DD frontmatter date."""
    md = path[:-5] + ".md"
    if not os.path.isfile(md):
        return None
    text = open(md, encoding="utf-8", errors="ignore").read(4000)
    m = re.search(r"^date:\s*(\d{4}-\d{2}-\d{2})", text, re.M)
    return m.group(1) if m else None


def priority_for(url: str) -> str:
    for key, pr in PRIORITY.items():
        if key in url:
            return str(pr)
    return str(DEFAULT_PRIORITY)


def main() -> None:
    urls = []
    for root, _, fs in os.walk(APP):
        for f in fs:
            if not f.endswith(".html"):
                continue
            p = os.path.join(root, f)
            u = file_url(p)
            if u is None:
                continue
            urls.append((u, lastmod_for(p), priority_for(u)))
    urls.sort()

    ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", ns)
    root_el = ET.Element(f"{{{ns}}}urlset")
    for u, lastmod, pr in urls:
        el = ET.SubElement(root_el, f"{{{ns}}}url")
        ET.SubElement(el, f"{{{ns}}}loc").text = u
        if lastmod:
            ET.SubElement(el, f"{{{ns}}}lastmod").text = lastmod
        ET.SubElement(el, f"{{{ns}}}changefreq").text = "monthly"
        ET.SubElement(el, f"{{{ns}}}priority").text = pr

    tree = ET.ElementTree(root_el)
    out = os.path.join(APP, "sitemap.xml")
    tree.write(out, encoding="utf-8", xml_declaration=True)
    print(f"== sitemap.xml written: {len(urls)} URLs ==")


if __name__ == "__main__":
    main()
