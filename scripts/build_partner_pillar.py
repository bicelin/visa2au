#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render the partner-visa pillar in EN, RU and FR.

The page is content-driven: `scripts/pillar/{en,ru,fr}.py` hold the copy, this
module renders it into the shell of the existing 820/801 page (so nav, footer,
assets and CSP stay identical) and rewrites title/description/canonical/hreflang/
OG/JSON-LD for the pillar URL.

Run: python3 scripts/build_partner_pillar.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")

LANGS = {
    "en": {
        "shell": "visas/partner-visa-820-801.html",
        "out": "visas/partner-visa.html",
        "url": "https://visa2.au/visas/partner-visa",
        "prefix": "",
        "breadcrumb": ("Home", "Visa Services", "Partner Visa"),
        "home": "/",
        "hub": "/visas",
    },
    "ru": {
        "shell": "ru/visas/partner-visa-820-801.html",
        "out": "ru/visas/partner-visa.html",
        "url": "https://visa2.au/ru/visas/partner-visa",
        "prefix": "/ru",
        "breadcrumb": ("Главная", "Визовые услуги", "Партнёрская виза"),
        "home": "/ru/",
        "hub": "/ru/visas",
    },
    "fr": {
        "shell": "fr/visas/partner-visa-820-801.html",
        "out": "fr/visas/partner-visa.html",
        "url": "https://visa2.au/fr/visas/partner-visa",
        "prefix": "/fr",
        "breadcrumb": ("Accueil", "Services de visa", "Visa partenaire"),
        "home": "/fr/",
        "hub": "/fr/visas",
    },
}

HREFLANG = """  <link rel="alternate" hreflang="en" href="https://visa2.au/visas/partner-visa">
  <link rel="alternate" hreflang="ru" href="https://visa2.au/ru/visas/partner-visa">
  <link rel="alternate" hreflang="fr" href="https://visa2.au/fr/visas/partner-visa">
  <link rel="alternate" hreflang="x-default" href="https://visa2.au/visas/partner-visa">"""

CTA = {
    "en": ("Considering a partner visa?",
           "Get a clear, honest assessment of your prospects and a fixed-fee quote — before you commit to anything.",
           "Book a consultation →", "Detailed Visa Assessment", "/contact"),
    "ru": ("Думаете о партнёрской визе?",
           "Честная оценка ваших перспектив и фиксированная стоимость — до того, как вы что-то решите.",
           "Записаться на консультацию →", "Детальная оценка визы", "/ru/contact"),
    "fr": ("Vous envisagez un visa partenaire ?",
           "Une évaluation honnête de vos perspectives et un devis à honoraires fixes — avant tout engagement.",
           "Réserver une consultation →", "Évaluation détaillée du visa", "/fr/contact"),
}


def load(lang):
    path = os.path.join(ROOT, "scripts", "pillar", lang + ".py")
    ns = {"__file__": path, "__name__": "pillar_" + lang}
    with open(path, encoding="utf-8") as f:
        exec(compile(f.read(), path, "exec"), ns)  # noqa: S102 - repo-local content module
    return {
        "title": ns["TITLE"],
        "description": ns["DESCRIPTION"],
        "h1": ns["H1"],
        "badge": ns["BADGE"],
        "lead": ns["LEAD"],
        "reviewed": ns["REVIEWED"],
        "sections": ns["SECTIONS"],
        "faq_title": ns["FAQ_TITLE"],
        "faq": ns["FAQ"],
    }


def hero(cfg, c):
    b1, b2, b3 = cfg["breadcrumb"]
    return f"""  <section class="relative overflow-hidden bg-navy-950 text-white">
    <div class="relative mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-20">
      <nav class="mb-2 font-tech text-xs text-slate-400" aria-label="Breadcrumb">
        <a href="{cfg['home']}" class="hover:text-gold-400">{b1}</a> <span aria-hidden="true">/</span>
        <a href="{cfg['hub']}" class="hover:text-gold-400">{b2}</a> <span aria-hidden="true">/</span>
        <span class="text-gold-400">{b3}</span>
      </nav>
      <h1 class="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">{c['h1']}</h1>
      <p class="mt-4 inline-block rounded-full border border-gold-500/50 px-3 py-1 font-tech text-sm font-semibold text-gold-400">{c['badge']}</p>
      <p class="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">{c['lead']}</p>
      <p class="mt-6 font-tech text-xs uppercase tracking-wider text-slate-400">{c['reviewed']}</p>
    </div>
  </section>"""


def section(inner):
    return f"""  <section class="reveal mx-auto max-w-5xl px-4 py-12 lg:px-8">
{inner}
  </section>"""


def cta_block(lang):
    """Identical markup to the CTA block already used on every visa page."""
    head, text, btn, btn2, href = CTA[lang]
    return f"""  <section class="reveal mx-auto max-w-5xl px-4 py-16 lg:px-8">
    <div class="relative overflow-hidden rounded-3xl bg-navy-800 px-6 py-12 text-center shadow-xl sm:px-12">
      <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-20" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 800 300">
        <path d="M0 240 Q 100 208 200 240 T 400 240 T 600 240 T 800 240" stroke="#f0a000" stroke-width="1.25" fill="none"></path>
        <path d="M0 70 Q 100 45 200 70 T 400 70 T 600 70 T 800 70" stroke="#f0a000" stroke-width="0.9" fill="none" opacity="0.6"></path>
        <circle cx="200" cy="240" r="3.5" fill="#f0a000"></circle>
        <circle cx="600" cy="70" r="3.5" fill="#f0a000"></circle>
      </svg>
      <h2 class="relative font-display text-3xl font-bold text-white sm:text-4xl">{head}</h2>
      <p class="relative mx-auto mt-3 max-w-xl text-slate-300">{text}</p>
      <div class="relative mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href="{href}" class="rounded-lg bg-gold-500 px-7 py-3.5 font-tech text-sm font-semibold text-navy-950 shadow-lg transition hover:bg-gold-400">{btn}</a>
        <a href="https://visa2au.mmportal.cloud/assessment/" target="_blank" rel="noopener" class="rounded-lg border border-white/25 px-7 py-3.5 font-tech text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-400">{btn2}</a>
      </div>
    </div>
  </section>"""


def faq_html(c):
    items = []
    for q, a in c["faq"]:
        items.append(
            '      <details class="rounded-2xl border border-navy-800/10 bg-tint-100 p-5 dark:border-white/10 dark:bg-navy-950">'
            f'<summary class="cursor-pointer font-medium text-navy-800 dark:text-white">{q}</summary>'
            f'<p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a}</p></details>')
    return "\n".join(items)


def render(lang):
    cfg = LANGS[lang]
    c = load(lang)
    shell = open(os.path.join(APP, cfg["shell"]), encoding="utf-8").read()

    body = [hero(cfg, c)]
    for h2, inner in c["sections"]:
        body.append(section(f'    <h2 class="mb-5 font-display text-2xl font-bold leading-snug text-navy-900 dark:text-white sm:text-3xl">{h2}</h2>\n{inner}'))
    body.append(section(
        f'    <h2 class="mb-5 font-display text-2xl font-bold leading-snug text-navy-900 dark:text-white sm:text-3xl">{c["faq_title"]}</h2>\n'
        '    <div class="mt-6 space-y-4">\n' + faq_html(c) + "\n    </div>"))
    body.append(cta_block(lang))
    main = '<main id="main">\n' + "\n".join(body) + "\n</main>"

    html = re.sub(r'<main id="main">.*?</main>', lambda m: main, shell, count=1, flags=re.S)
    assert main in html, "main not replaced"

    # head: title, description, canonical, OG, hreflang
    html, n = re.subn(r'<title>.*?</title>', lambda m: f'<title>{c["title"]}</title>', html, count=1, flags=re.S)
    assert n == 1
    html = re.sub(r'(<meta name="description" content=")[^"]*(")',
                  lambda m: m.group(1) + c["description"] + m.group(2), html, count=1)
    html = re.sub(r'(<meta property="og:title" content=")[^"]*(")',
                  lambda m: m.group(1) + c["title"] + m.group(2), html, count=1)
    html = re.sub(r'(<meta property="og:description" content=")[^"]*(")',
                  lambda m: m.group(1) + c["description"] + m.group(2), html, count=1)
    html = re.sub(r'(<meta property="og:url" content=")[^"]*(")',
                  lambda m: m.group(1) + cfg["url"] + m.group(2), html, count=1)
    # replace the whole alternate + canonical group in one go: the shells indent
    # these differently, so match the tags, not their surrounding whitespace.
    html = re.sub(r'\s*<link rel="alternate"[^>]*>', "", html)
    html = re.sub(r'<link rel="canonical" href="[^"]*">',
                  lambda m: HREFLANG + '\n  <link rel="canonical" href="' + cfg["url"] + '">', html, count=1)
    assert 'hreflang="en"' in html and html.count('hreflang="ru"') == 1, "hreflang block not replaced"
    assert not re.search(r'<link rel="alternate"[^>]*820-801', html), "stale alternate left in head"

    # FAQPage JSON-LD from the same questions the page shows
    ld = {"@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [{"@type": "Question", "name": q,
                          "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in c["faq"]]}
    block = re.compile(r'<script type="application/ld\+json">\{"@context":"https://schema\.org","@type":"FAQPage".*?</script>', re.S)
    if block.search(html):
        html = block.sub(lambda m: '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False, separators=(",", ":")) + "</script>", html, count=1)
    else:
        html = html.replace("</head>", '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False, separators=(",", ":")) + "</script>\n</head>", 1)

    # breadcrumb JSON-LD should name the pillar, not the 820/801 page
    def fix_breadcrumb(m):
        data = json.loads(m.group(1))
        trail = ((cfg["home"], cfg["breadcrumb"][0]), (cfg["hub"], cfg["breadcrumb"][1]), (cfg["url"], cfg["breadcrumb"][2]))
        items = data.get("itemListElement") or []
        for i, (href, name) in enumerate(trail):
            if i < len(items):
                items[i]["name"] = name
                items[i]["item"] = "https://visa2.au" + href if href.startswith("/") else href
        data["itemListElement"] = items[:3]
        return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "</script>"
    html = re.sub(r'<script type="application/ld\+json">(\{"@context":"https://schema\.org","@type":"BreadcrumbList".*?\})</script>',
                  fix_breadcrumb, html, count=1, flags=re.S)

    out = os.path.join(APP, cfg["out"])
    old = open(out, encoding="utf-8").read() if os.path.exists(out) else ""
    if old != html:
        open(out, "w", encoding="utf-8").write(html)
        return True
    return False


if __name__ == "__main__":
    for lang in LANGS:
        changed = render(lang)
        print(f"{lang}: {'written' if changed else 'unchanged'}")
