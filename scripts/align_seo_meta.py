#!/usr/bin/env python3
"""Align SEO meta across all app/**/*.html (idempotent).

- Fix RU/FR homepage canonical + hreflang (kills /ru/ru.html-style dead links)
- Canonical/hreflang/og:url -> extensionless form (match sitemap + 308 targets)
- og:image -> Cloudflare Image Resizing URL (1200w)
- Insert og:site_name + theme-color where missing
- Stats counters: real no-JS fallback values ("2,000+" not "0")
"""
import os
import re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
BASE = "https://visa2.au"

# ── RU/FR homepage canonical+hreflang: correct values ─────────────────────────
HOMEPAGE_FIX = {
    "ru": ("https://visa2.au/ru/", "https://visa2.au/", "https://visa2.au/ru/", "https://visa2.au/fr/", "https://visa2.au/"),
    "fr": ("https://visa2.au/fr/", "https://visa2.au/", "https://visa2.au/ru/", "https://visa2.au/fr/", "https://visa2.au/"),
}
HOMEPAGE_BLOCK = re.compile(
    r'(<link rel="canonical" href=")[^"]*("><link rel="alternate" hreflang="en" href=")[^"]*'
    r'("><link rel="alternate" hreflang="ru" href=")[^"]*("><link rel="alternate" hreflang="fr" href=")[^"]*'
    r'("><link rel="alternate" hreflang="x-default" href=")[^"]*(">)'
)

# ── stats counters: no-JS fallback ────────────────────────────────────────────
COUNTER_FIX = [
    (re.compile(r'(<span data-count="2000" data-suffix="\+">)0(</span>)'), r"\g<1>2,000+\g<2>"),
    (re.compile(r'(<span data-count="99\.8" data-decimals="1" data-suffix="%">)0(</span>)'), r"\g<1>99.8%\g<2>"),
    (re.compile(r'(<span data-count="20" data-suffix="\+">)0(</span>)'), r"\g<1>20+\g<2>"),
]

# ── hero founding-year consistency (2005 -> 2004, matches schema/footer/llms) ─
YEAR_FIX = [
    (re.compile(r"Experienced since 2005"), "Experienced since 2004"),
    (re.compile(r"Опыт с 2005 года"), "Опыт с 2004 года"),
    (re.compile(r"expérience depuis 2005"), "expérience depuis 2004"),
]


def canonicalize(url: str) -> str:
    """Strip .html; map /ru /fr home to trailing-slash form."""
    if not url.startswith(BASE):
        return url
    u = url
    if u.endswith(".html"):
        u = u[:-5]
    if u.endswith("/ru") or u.endswith("/fr"):
        u += "/"
    return u


def lang_of(path: str) -> str:
    rel = os.path.relpath(path, APP)
    if rel.startswith("ru/") or rel == "ru.html":
        return "ru"
    if rel.startswith("fr/") or rel == "fr.html":
        return "fr"
    return "en"


def main() -> None:
    files = []
    for root, _, fs in os.walk(APP):
        for f in fs:
            if f.endswith(".html"):
                files.append(os.path.join(root, f))
    changed = 0
    for path in sorted(files):
        html = open(path, encoding="utf-8").read()
        orig = html
        rel = os.path.relpath(path, APP)
        lang = lang_of(path)

        # 1) homepage canonical/hreflang block fix (RU/FR only, incl. root stubs)
        if rel in ("ru/index.html", "fr/index.html", "ru.html", "fr.html"):
            can, en, ru, fr, xd = HOMEPAGE_FIX[lang]
            html = HOMEPAGE_BLOCK.sub(
                rf'\g<1>{can}\g<2>{en}\g<3>{ru}\g<4>{fr}\g<5>{xd}\g<6>', html, count=1)

        # 2) generic extensionless alignment
        html = re.sub(r'(<link rel="canonical" href=")([^"]+)(")',
                      lambda m: m.group(1) + canonicalize(m.group(2)) + m.group(3), html)
        html = re.sub(r'(<link rel="alternate" hreflang="[^"]+" href=")([^"]+)(")',
                      lambda m: m.group(1) + canonicalize(m.group(2)) + m.group(3), html)

        # Drop hreflang alternates whose target page does not exist (dead links
        # like /ru/contact when only the EN contact page exists).
        def keep_hreflang(m):
            href = m.group(0)
            m2 = re.search(r'href="([^"]+)"', href)
            url = m2.group(1)
            if not url.startswith(BASE):
                return href
            relp = url[len(BASE):].lstrip("/")
            if not relp:
                return href
            if relp.endswith("/"):
                relp += "index.html"
            if os.path.isfile(os.path.join(APP, relp)) or os.path.isfile(os.path.join(APP, relp + ".html")):
                return href
            return ""  # target missing -> remove the dead alternate link

        html = re.sub(r'<link rel="alternate" hreflang="[^"]+" href="[^"]+">', keep_hreflang, html)
        html = re.sub(r'(<meta property="og:url" content=")([^"]+)(")',
                      lambda m: m.group(1) + canonicalize(m.group(2)) + m.group(3), html)

        # og:image: default placeholder -> branded share card; others -> CF resize
        def fix_og_image(m):
            url = m.group(2)
            plain = re.sub(r"^https://visa2\.au/cdn-cgi/image/[^/]+/", "https://visa2.au/", url)
            if "og-share-card.png" in url:
                return m.group(0)  # already the branded card
            if plain.endswith("/imgs/hero-coast.jpg"):
                return (m.group(1) + BASE + "/imgs/og-share-card.png" + m.group(3)
                        + '<meta property="og:image:width" content="1200">'
                        + '<meta property="og:image:height" content="630">')
            return m.group(1) + BASE + "/cdn-cgi/image/width=1200,quality=80,format=auto/" \
                + plain[len(BASE) + 1:] + m.group(3)

        html = re.sub(r'(<meta property="og:image" content=")(https://visa2\.au/[^"]+)(")',
                      fix_og_image, html)

        # 3) og:site_name + theme-color
        if "og:site_name" not in html:
            html = html.replace("</head>",
                                '<meta property="og:site_name" content="Visa2AU">'
                                '<meta name="theme-color" content="#0a0f1c"></head>', 1)

        # 4) stats counters no-JS fallback
        for rx, rep in COUNTER_FIX:
            html = rx.sub(rep, html)

        # 5) founding-year consistency
        for rx, rep in YEAR_FIX:
            html = rx.sub(rep, html)

        # 6) performance: LCP preload, cdn-cgi story images, mobile JS gating
        if rel in ("index.html", "ru/index.html", "fr/index.html") and 'rel="preload" as="image"' not in html:
            preload = ('<link rel="preload" as="image" href="/cdn-cgi/image/width=1280,quality=80,format=auto,onerror=redirect/story/hero-dawn.jpg" '
                       'imagesrcset="/cdn-cgi/image/width=640,quality=80,format=auto,onerror=redirect/story/hero-dawn.jpg 640w, '
                       '/cdn-cgi/image/width=1280,quality=80,format=auto,onerror=redirect/story/hero-dawn.jpg 1280w, '
                       '/cdn-cgi/image/width=1920,quality=80,format=auto,onerror=redirect/story/hero-dawn.jpg 1920w" '
                       'imagesizes="100vw" fetchpriority="high">')
            html = html.replace("</head>", preload + "</head>", 1)
        html = re.sub(r'src="(?:\.\./)?story/([^"]+\.jpg)"',
                      lambda m: 'src="/cdn-cgi/image/width=1280,quality=80,format=auto,onerror=redirect/story/'
                      + m.group(1) + '"', html)
        html = html.replace(
            "initField('coastCanvas', 'coast');\n      initField('crossCanvas', 'cross');",
            "if (window.matchMedia('(min-width: 768px)').matches) {\n"
            "        initField('coastCanvas', 'coast');\n"
            "        initField('crossCanvas', 'cross');\n"
            "      }")
        html = html.replace(
            "/* ————— parallax on story panels ————— */\n      if (!reduced) {",
            "/* ————— parallax on story panels ————— */\n      if (!reduced && window.matchMedia('(min-width: 768px)').matches) {")

        if html != orig:
            open(path, "w", encoding="utf-8").write(html)
            changed += 1
            print(f"updated: {rel}")
    print(f"== {changed} files updated ==")


if __name__ == "__main__":
    main()
