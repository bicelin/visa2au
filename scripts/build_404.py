#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render app/404.html from the design source, so a CMS rebuild can't drop it.

Twice this month the CMS rebuild committed `app/` and the 404 lost its hero
("This page didn't meet the character test.") — it had to be restored from git
history by hand. The design now lives in `scripts/pages/404.src.html`, this
script writes the served page from it, and the rebuild workflow runs it before
the gates, so the error page survives every publish.

The page must stay out of the index: no canonical, `noindex,follow`, and
extensionless hreflang (`/404`, not `/404.html`) to match the site convention.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "scripts", "pages", "404.src.html")
OUT = os.path.join(ROOT, "app", "404.html")
BASE = "https://visa2.au"
HERO = "This page didn't meet the character test."

TITLE_MAX, DESC_MAX = 60, 160


def main() -> int:
    html = open(SRC, encoding="utf-8").read()

    if HERO not in html:
        raise SystemExit("404 design source lost its hero line — refusing to publish it")

    html = re.sub(r'<link rel="canonical"[^>]*>', "", html)
    html = re.sub(r'<link rel="alternate"[^>]*>', "", html)
    html = re.sub(r'<meta name="robots"[^>]*>', "", html)
    html = re.sub(r'<meta property="og:url"[^>]*>', "", html)

    head_add = (
        f'<meta name="robots" content="noindex,follow">'
        f'<link rel="alternate" hreflang="en" href="{BASE}/404">'
        f'<link rel="alternate" hreflang="x-default" href="{BASE}/404">'
        f'<meta property="og:url" content="{BASE}/">'
    )
    html = html.replace("</head>", head_add + "</head>", 1)

    title = re.search(r"<title>(.*?)</title>", html, re.S)
    desc = re.search(r'<meta name="description" content="(.*?)">', html, re.S)
    if not title or not desc:
        raise SystemExit("404 rendered without a title or description")
    if len(title.group(1)) > TITLE_MAX:
        raise SystemExit(f"404 title is {len(title.group(1))} chars, over {TITLE_MAX}")
    if len(desc.group(1)) > DESC_MAX:
        raise SystemExit(f"404 description is {len(desc.group(1))} chars, over {DESC_MAX}")

    open(OUT, "w", encoding="utf-8").write(html)
    print(f"404 rendered: title {len(title.group(1))}, description {len(desc.group(1))}, "
          f"noindex, no canonical, hero intact")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
