#!/usr/bin/env python3
"""Localize the "Most requested visas" carousel card titles and the blog-card
titles/descriptions on the ru/ and fr/ homepages, pulling the localized text
from the existing localized pages (visa pages' H1s and blog pages' <title> +
meta description). Data-driven, idempotent.
"""
import os
import re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
LANGS = ("ru", "fr")


def localized_title(path):
    html = open(path, encoding="utf-8").read()
    t = re.search(r"<title>(.*?)</title>", html)
    if not t:
        return None
    return re.sub(r"\s*\|\s*(Блог|Blog) Visa2AU\s*$", "", t.group(1))


def main():
    for lang in LANGS:
        p = os.path.join(APP, lang, "index.html")
        html = open(p, encoding="utf-8").read()
        orig = html

        # 1) carousel cards: h3 title inside <a href="...<slug>.html"> cards
        def fix_card(m):
            href = m.group(1)
            slug = re.search(r"([a-z0-9-]+)\.html$", href)
            if not slug:
                return m.group(0)
            vp = os.path.join(APP, lang, "visas", slug.group(1) + ".html")
            if not os.path.isfile(vp):
                return m.group(0)
            vhtml = open(vp, encoding="utf-8").read()
            h1 = re.search(r"<h1[^>]*>(.*?)</h1>", vhtml, re.S)
            if not h1:
                return m.group(0)
            loc = re.sub(r"<[^>]+>", "", h1.group(1)).strip()
            # replace the first <h3> text node in this card block
            block = m.group(0)
            h3 = re.search(r"(<h3[^>]*>)([^<]*)(</h3>)", block)
            if h3 and h3.group(2).strip():
                return block[:h3.start()] + h3.group(1) + loc + h3.group(3) + block[h3.end():]
            return block

        html = re.sub(r'<a href="(?:\./)?visas/([^"]+\.html)" class="[^"]*group relative flex[^>]*>.*?</a>',
                      fix_card, html, flags=re.S)

        # 2) blog cards: <a href="./blog/<slug>.html" ...> with <h4> + <p> desc
        def fix_blog(m):
            href = m.group(1)
            slug = re.search(r"([a-z0-9-]+)\.html$", href)
            if not slug:
                return m.group(0)
            bp = os.path.join(APP, lang, "blog", slug.group(1) + ".html")
            if not os.path.isfile(bp):
                return m.group(0)
            loc_title = localized_title(bp)
            if not loc_title:
                return m.group(0)
            bhtml = open(bp, encoding="utf-8").read()
            desc = re.search(r'<meta name="description" content="([^"]+)"', bhtml)
            block = m.group(0)
            h4 = re.search(r"(<h4[^>]*>)([^<]*)(</h4>)", block)
            if h4 and h4.group(2).strip():
                block = block[:h4.start()] + h4.group(1) + loc_title + h4.group(3) + block[h4.end():]
            if desc:
                d = desc.group(1)
                pdesc = re.search(r'(<p class="mt-2\.5 line-clamp-2[^>]*>)([^<]*)(</p>)', block)
                if pdesc and pdesc.group(2).strip():
                    block = block[:pdesc.start()] + pdesc.group(1) + d + pdesc.group(3) + block[pdesc.end():]
            return block

        html = re.sub(r'<a href="(?:\./)?blog/([^"]+\.html)" class="reveal[^>]*>.*?</a>',
                      fix_blog, html, flags=re.S)

        if html != orig:
            open(p, "w", encoding="utf-8").write(html)
            print(f"localized homepage cards: {lang}/index.html")
        else:
            print(f"no card changes: {lang}/index.html")


if __name__ == "__main__":
    main()
