#!/usr/bin/env python3
"""Build localized twin pages (ru/fr) for the core EN pages that locale
menus/footers link to (contact, visas, employers, pricing, team, privacy,
pay, donate). Chrome (header/footer/search/scripts) is reused from an
existing locale page; the head is rebuilt localized; the EN <main> content
is translated via exact-string maps from scripts/loc/<group>_<lang>.py
(fallback: /tmp/loc/). Idempotent.
"""
import importlib.util
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
BASE = "https://visa2.au"

PAGES = ["contact", "visas", "employers", "pricing", "team", "privacy", "pay", "donate"]
GROUP_PAGES = {"A": ["visas", "team"], "B": ["pricing", "pay", "donate"],
               "C": ["employers", "privacy"], "D": ["contact"]}

LEGAL_JSONLD = ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"LegalService",'
                '"name":"Visa2AU — Australian Immigration & Visa Services","url":"https://visa2.au",'
                '"telephone":"+61 2 9136 2462","email":"info@visa2.au",'
                '"address":{"@type":"PostalAddress","streetAddress":"Level 17, 1 Denison Street",'
                '"addressLocality":"North Sydney","addressRegion":"NSW","postalCode":"2060","addressCountry":"AU"},'
                '"foundingDate":"2004","hasCredential":[{"@type":"EducationalOccupationalCredential",'
                '"credentialCategory":"MARN Registered Migration Agent","identifier":"0534230"},'
                '{"@type":"EducationalOccupationalCredential","credentialCategory":"MARN Registered Migration Agent",'
                '"identifier":"2418663"}]}</script>')

THEME_SCRIPT = ('<script>(function () { const stored = localStorage.getItem(\'v2au-theme\'); '
                'const prefersDark = window.matchMedia(\'(prefers-color-scheme: dark)\').matches; '
                'if (stored === \'dark\' || (!stored && prefersDark)) { document.documentElement.classList.add(\'dark\'); } })();</script>')


def load_maps():
    """Returns maps[lang] = {"TITLE": {page: str}, "DESC": {page: str}, "MAP": {en: loc}}
    Files may carry flat string maps plus dict or scalar titles/descs."""
    maps = {"ru": {"TITLE": {}, "DESC": {}, "MAP": {}}, "fr": {"TITLE": {}, "DESC": {}, "MAP": {}}}
    for group in ("A", "B", "C", "D"):
        for lang in ("ru", "fr"):
            for base in (os.path.join(ROOT, "scripts", "loc"), "/tmp/loc"):
                p = os.path.join(base, f"{group}_{lang}.py")
                if os.path.isfile(p):
                    spec = importlib.util.spec_from_file_location(f"loc_{group}_{lang}", p)
                    mod = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(mod)
                    t = getattr(mod, "RU_TITLE" if lang == "ru" else "FR_TITLE", {})
                    d = getattr(mod, "RU_DESC" if lang == "ru" else "FR_DESC", {})
                    m = getattr(mod, "RU_MAP" if lang == "ru" else "FR_MAP", {})
                    if isinstance(t, dict):
                        maps[lang]["TITLE"].update(t)
                    elif isinstance(t, str):
                        maps[lang]["TITLE"][group] = t
                    if isinstance(d, dict):
                        maps[lang]["DESC"].update(d)
                    elif isinstance(d, str):
                        maps[lang]["DESC"][group] = d
                    maps[lang]["MAP"].update(m if isinstance(m, dict) else {})
                    break
    return maps


def chrome(lang):
    """Body chrome (post-</head> to <main>, and </main> to </html>) from an
    existing locale page; plus the localized title/desc of that page."""
    src = open(os.path.join(APP, lang, "urgent-visa-help.html"), encoding="utf-8").read()
    h = src.find("</head>")
    m = src.find('<main id="main">')
    m2 = src.find("</main>", m)
    pre_body = src[h + len("</head>"):m]
    post_main = src[m2 + len("</main>"):]
    return pre_body, post_main


def localized_head(lang, page, title, desc, rel_depth="../"):
    if lang == "ru":
        loc_name = {"contact": "Контакты", "visas": "Визы", "employers": "Работодателям",
                    "pricing": "Цены", "team": "Команда", "privacy": "Конфиденциальность",
                    "pay": "Оплата", "donate": "Пожертвования"}[page]
        og_locale = "ru_RU"
    else:
        loc_name = {"contact": "Contact", "visas": "Visas", "employers": "Employeurs",
                    "pricing": "Tarifs", "team": "Équipe", "privacy": "Confidentialité",
                    "pay": "Paiement", "donate": "Dons"}[page]
        og_locale = "fr_FR"
    url = f"{BASE}/{lang}/{page}"
    hreflang = (f'<link rel="canonical" href="{url}">'
                f'<link rel="alternate" hreflang="en" href="{BASE}/{page}">'
                f'<link rel="alternate" hreflang="ru" href="{BASE}/ru/{page}">'
                f'<link rel="alternate" hreflang="fr" href="{BASE}/fr/{page}">'
                f'<link rel="alternate" hreflang="x-default" href="{BASE}/{page}">')
    turnstile = ('<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>'
                 if page == "contact" else "")
    return (f'<!DOCTYPE html><html lang="{lang}"> <head><meta charset="UTF-8">'
            f'<meta name="viewport" content="width=device-width, initial-scale=1.0">'
            f'<title>{title}</title><meta name="description" content="{desc}">{hreflang}'
            f'<meta property="og:locale" content="{og_locale}">'
            f'<meta property="og:title" content="{title}">'
            f'<meta property="og:description" content="{desc}">'
            f'<meta property="og:type" content="website">'
            f'<meta property="og:url" content="{url}">'
            f'<meta property="og:image" content="{BASE}/imgs/og-share-card.png">'
            f'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
            f'<meta name="twitter:card" content="summary_large_image">'
            f'<link rel="icon" type="image/svg+xml" href="{rel_depth}v2au-logo-blue.svg">'
            f'{THEME_SCRIPT}{LEGAL_JSONLD}'
            f'<link rel="stylesheet" href="{rel_depth}_astro/index.DqolKn4r.css">'
            f'{turnstile}'
            f'<meta property="og:site_name" content="Visa2AU">'
            f'<meta name="theme-color" content="#0a0f1c"></head> ')


ALLOW_SINGLE = {"Topic"}  # short single-word keys that are safe labels


def translate_main(en_main, tmap):
    # protect brand tokens from being split by broad keys like "Visa"
    out = en_main.replace("Visa2AU", "\x00B\x00").replace("visa2.au", "\x00D\x00")
    for k in sorted(tmap, key=len, reverse=True):
        if len(k) < 5:
            continue
        if len(k) < 8 and k not in ALLOW_SINGLE and " " not in k and "·" not in k and "—" not in k and "*" not in k:
            continue  # short bare words are risky outside their page
        if k in out:
            out = out.replace(k, tmap[k])
    return out.replace("\x00B\x00", "Visa2AU").replace("\x00D\x00", "visa2.au")


def coverage_hits(en_main, tmap):
    hits = 0
    for k in tmap:
        if len(k) < 5:
            continue
        if len(k) < 8 and k not in ALLOW_SINGLE and " " not in k and "·" not in k and "—" not in k and "*" not in k:
            continue
        if k in en_main:
            hits += 1
    return hits


def en_hreflang(page):
    """Ensure EN page declares ru/fr alternates (twins now exist)."""
    p = os.path.join(APP, page + ".html")
    html = open(p, encoding="utf-8").read()
    if 'hreflang="ru"' not in html:
        can = re.search(r'(<link rel="canonical" href=")([^"]+)(">)', html)
        if can:
            ins = (f'<link rel="alternate" hreflang="ru" href="{BASE}/ru/{page}">'
                   f'<link rel="alternate" hreflang="fr" href="{BASE}/fr/{page}">')
            html = html.replace(can.group(0), can.group(0) + ins, 1)
            open(p, "w", encoding="utf-8").write(html)
            print(f"  en hreflang added: {page}.html")


def main():
    maps = load_maps()
    covered = {pg for g, pgs in GROUP_PAGES.items() for pg in pgs
               if any(os.path.isfile(os.path.join(b, f"{g}_{lang}.py"))
                      for b in (os.path.join(ROOT, "scripts", "loc"), "/tmp/loc")
                      for lang in ("ru", "fr"))}
    missing = [k for k in PAGES if k not in covered]
    if missing:
        print(f"WARN: no translation map for pages: {missing} — skipping those")
    for lang in ("ru", "fr"):
        pre_body, post_main = chrome(lang)
        tmap_all = maps[lang]["MAP"]  # flat union; keys absent on a page are no-ops
        for page in PAGES:
            if page not in covered:
                print(f"  SKIP {lang}/{page}.html (translation maps not ready)")
                continue
            en_main = re.search(r'<main id="main">(.*?)</main>', open(os.path.join(APP, page + ".html"), encoding="utf-8").read(), re.S).group(1)
            main_loc = translate_main(en_main, tmap_all)
            if page == "contact":
                main_loc = main_loc.replace("'api/enquiry'", "'/api/enquiry'")
            if page == "visas":
                # H1 "Visa Services" split across a span: fix the leading word
                main_loc = main_loc.replace(">Visa <span",
                                            ">Визовые <span" if lang == "ru" else ">Services de <span")
            # safety: skip if the map barely covered this page (untranslated build)
            hits = coverage_hits(en_main, tmap_all)
            if hits < 5:
                print(f"  SKIP {lang}/{page}.html (only {hits} translation keys matched)")
                continue
            title = maps[lang]["TITLE"].get(page) or maps[lang]["TITLE"].get(
                next((g for g in ("A", "B", "C", "D") if page in GROUP_PAGES[g]), "")) or f"Visa2AU — {page}"
            desc = maps[lang]["DESC"].get(page) or maps[lang]["DESC"].get(
                next((g for g in ("A", "B", "C", "D") if page in GROUP_PAGES[g]), "")) or ""
            head = localized_head(lang, page, title, desc)
            out = head + pre_body + f'<main id="main"> {main_loc} </main>' + post_main
            dest = os.path.join(APP, lang, page + ".html")
            old = open(dest, encoding="utf-8").read() if os.path.isfile(dest) else None
            if out != old:
                open(dest, "w", encoding="utf-8").write(out)
                print(f"  wrote {lang}/{page}.html (titles from group map)")
    for page in PAGES:
        en_hreflang(page)
    print("done")


if __name__ == "__main__":
    main()
