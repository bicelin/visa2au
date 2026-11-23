#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Give the partner-visa pillar the two internal links it needs to be found:

1. a "start here" card on every /visas listing (EN, RU, FR), placed before the
   820/801 card, cloned from that card so the markup stays identical;
2. a contextual link on the three child pages (820/801, 309/100, 300) inside the
   existing in-body band, so the child points up at the pillar.

Idempotent: skips pages that already link to the pillar.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")

CARD = {
    "en": dict(shell="visas.html", path="./visas/partner-visa",
               badge="Start here", title="Partner Visa Australia",
               subclass="820/801 · 309/100 · 300",
               text="Which partner visa applies to you, what it costs and how long each stage takes.",
               meta="Compare the streams", cta="Compare →"),
    "ru": dict(shell="ru/visas.html", path="./visas/partner-visa",
               badge="Начните здесь", title="Партнёрская виза в Австралию",
               subclass="820/801 · 309/100 · 300",
               text="Какая партнёрская виза вам подходит, сколько стоит и сколько занимает каждый этап.",
               meta="Сравнить схемы", cta="Сравнить →"),
    "fr": dict(shell="fr/visas.html", path="./visas/partner-visa",
               badge="Commencez ici", title="Visa partenaire en Australie",
               subclass="820/801 · 309/100 · 300",
               text="Quel visa partenaire vous concerne, son coût et la durée de chaque étape.",
               meta="Comparez les voies", cta="Comparer →"),
}

CHILD_LINK = {
    "en": ("Which partner visa applies to you", "visas/partner-visa"),
    "ru": ("Какая партнёрская виза вам подходит", "visas/partner-visa"),
    "fr": ("Quel visa partenaire vous concerne", "visas/partner-visa"),
}

CHILDREN = ["visas/partner-visa-820-801.html", "visas/partner-visa-309-100.html",
            "visas/prospective-marriage-300.html"]


def add_card(lang, cfg):
    path = os.path.join(APP, cfg["shell"])
    html = open(path, encoding="utf-8").read()
    if cfg["path"] + '"' in html:
        print(f"{lang} /visas: card already present")
        return 0
    marker = 'href="./visas/partner-visa-820-801" data-cat="Family"'
    i = html.find(marker)
    assert i > 0, f"{lang}: no 820/801 card"
    start = html.rfind("<a ", 0, i)
    end = html.find("</a>", i) + len("</a>")
    card = html[start:end]
    new = card.replace('href="./visas/partner-visa-820-801"', f'href="{cfg["path"]}"', 1)
    new = re.sub(r'(font-bold uppercase tracking-wider text-gold-500 dark:text-gold-400">)[^<]*(</span>)',
                 lambda m: m.group(1) + cfg["badge"] + m.group(2), new, count=1)
    new = re.sub(r'(text-navy-800 dark:text-white">)[^<]*(</h2>)',
                 lambda m: m.group(1) + cfg["title"] + m.group(2), new, count=1)
    new = re.sub(r'(tracking-wider text-gold-500 dark:text-gold-400">)[^<]*(</p>)',
                 lambda m: m.group(1) + cfg["subclass"] + m.group(2), new, count=1)
    new = re.sub(r'(text-sm leading-relaxed text-slate-600 dark:text-slate-300">)[^<]*(</p>)',
                 lambda m: m.group(1) + cfg["text"] + m.group(2), new, count=1)
    new = re.sub(r'(text-slate-500 dark:text-slate-300">)[^<]*(</span>)',
                 lambda m: m.group(1) + cfg["meta"] + m.group(2), new, count=1)
    new = re.sub(r'(group-hover:translate-x-1 dark:text-gold-400">)[^<]*(</span>)',
                 lambda m: m.group(1) + cfg["cta"] + m.group(2), new, count=1)
    assert new != card, f"{lang}: card not rewritten"
    html = html[:start] + new + "\n" + html[start:]
    open(path, "w", encoding="utf-8").write(html)
    print(f"{lang} /visas: pillar card added")
    return 1


def add_child_links(lang):
    text, target = CHILD_LINK[lang]
    n = 0
    for rel in CHILDREN:
        path = os.path.join(APP, rel if lang == "en" else os.path.join(lang, rel))
        if not os.path.exists(path):
            continue
        html = open(path, encoding="utf-8").read()
        if f'href="/{"" if lang == "en" else lang + "/"}{target}"' in html:
            continue
        prefix = "" if lang == "en" else lang + "/"
        href = f"/{prefix}{target}"
        item = (f'<li><a href="{href}" class="font-medium text-cobalt-500 transition hover:text-cobalt-400 '
                f'dark:text-gold-400 dark:hover:text-gold-400">{text}</a></li>')
        band_ul = re.search(r'(<ul class="mt-3 space-y-2\.5 text-sm">)(.*?)(</ul>)', html, re.S)
        assert band_ul, f"{rel}: no in-body band"
        html = html[:band_ul.start(2)] + item + html[band_ul.start(2):]
        open(path, "w", encoding="utf-8").write(html)
        n += 1
    print(f"{lang}: {n} child pages linked up to the pillar")
    return n


if __name__ == "__main__":
    for lang, cfg in CARD.items():
        add_card(lang, cfg)
        add_child_links(lang)
