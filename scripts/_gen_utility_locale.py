#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate ru/fr twins for the two utility pages (one-time committed output,
same pattern as _gen_city_locale.py — no CI regenerator touches them, so they
persist safely):

  video.html    -> app/{ru,fr}/video.html     (localized lobby UI; the
                    /api/video-join mechanics, JSON-LD schema and NAP stay EN)
  pathways.html -> app/{ru,fr}/pathways.html  (localized redirect stub)

Run from repo root. Afterwards add reciprocal hreflang ru/fr alternates to the
two EN pages, then run: fix_locale_links.py, align_seo_meta.py,
build_sitemap.py, check_seo_invariants.py, audit_link_graph.py.
"""
from __future__ import annotations
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(os.path.dirname(HERE), "app")
BASE = "https://visa2.au"
OG_LOCALE = {"ru": "ru_RU", "fr": "fr_FR"}

THEME = ('<script>(function () { const stored = localStorage.getItem(\'v2au-theme\'); '
         'const prefersDark = window.matchMedia(\'(prefers-color-scheme: dark)\').matches; '
         'if (stored === \'dark\' || (!stored && prefersDark)) { document.documentElement.classList.add(\'dark\'); } })();</script>')

def chrome(lang):
    """Localized body chrome (header/footer/nav/search/scripts) from the donor page."""
    src = read(os.path.join(APP, lang, "urgent-visa-help.html"))
    h = src.find("</head>")
    m = src.find('<main id="main">')
    m2 = src.find("</main>", m)
    assert h > 0 and m > 0 and m2 > 0, f"donor {lang}/urgent-visa-help.html split failed"
    return src[h + len("</head>"):m], src[m2 + len("</main>"):]

def read(p):
    return open(p, encoding="utf-8").read()

def head(lang, slug, title, desc, schema):
    url, en = f"{BASE}/{lang}/{slug}", f"{BASE}/{slug}"
    hreflang = (f'<link rel="canonical" href="{url}">'
                f'<link rel="alternate" hreflang="en" href="{en}">'
                f'<link rel="alternate" hreflang="ru" href="{BASE}/ru/{slug}">'
                f'<link rel="alternate" hreflang="fr" href="{BASE}/fr/{slug}">'
                f'<link rel="alternate" hreflang="x-default" href="{en}">')
    return (f'<!DOCTYPE html><html lang="{lang}"> <head><meta charset="UTF-8">'
            f'<meta name="viewport" content="width=device-width, initial-scale=1.0">'
            f'<title>{title}</title><meta name="description" content="{desc}">{hreflang}'
            f'<meta property="og:locale" content="{OG_LOCALE[lang]}">'
            f'<meta property="og:title" content="{title}">'
            f'<meta property="og:description" content="{desc}">'
            f'<meta property="og:type" content="website">'
            f'<meta property="og:url" content="{url}">'
            f'<meta property="og:image" content="{BASE}/imgs/og-share-card.png">'
            f'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
            f'<meta name="twitter:card" content="summary_large_image">'
            f'<link rel="icon" type="image/svg+xml" href="../v2au-logo-blue.svg">'
            f'{THEME}{schema}'
            f'<link rel="stylesheet" href="../_astro/index.DqolKn4r.css">'
            f'<meta property="og:site_name" content="Visa2AU">'
            f'<meta name="theme-color" content="#0a0f1c"></head> ')

META = {
  "video": {
    "title": {"ru": "Видеоконсультация | Visa2AU", "fr": "Consultation vidéo | Visa2AU"},
    "desc": {"ru": "Подключитесь к запланированной видеоконсультации Visa2AU. Введите имя и код доступа, который вам выдали. Консультации записываются в целях качества и соответствия требованиям.",
             "fr": "Rejoignez votre consultation vidéo Visa2AU planifiée. Entrez votre nom et le code d’accès qui vous a été fourni. Les consultations sont enregistrées à des fins de qualité et de conformité."},
  },
  "pathways": {
    "title": {"ru": "Подбор визового маршрута | Visa2AU", "fr": "Recherche de parcours de visa | Visa2AU"},
    "desc": {"ru": "Подбор визового маршрута теперь доступен в разделе визовых услуг.",
             "fr": "Le rechercheur de parcours de visa est désormais dans nos services de visas."},
  },
}

VIDEO_MAIN = {
 "ru": '<section class="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28"> <div id="v-wrap" class="relative mx-auto max-w-md px-4"> <div id="v-card" class="rounded-3xl border border-white/10 bg-navy-900/80 p-8 shadow-2xl backdrop-blur"> <img src="../v2au-logo-white.svg" alt="Visa2AU — smart immigration" class="mx-auto mb-6 h-11 w-auto" width="154" height="55"> <h1 class="text-center font-display text-2xl font-bold">Видеоконсультация</h1> <p class="mt-2 text-center text-sm text-slate-400">Введите ваше имя и код доступа, который мы вам прислали, чтобы присоединиться к консультации.</p> <div class="mt-6 grid gap-4"> <div> <label for="v-name" class="mb-1.5 block font-tech text-sm font-medium text-slate-200">Ваше имя</label> <input id="v-name" class="w-full rounded-lg border border-white/15 bg-navy-950/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-gold-500" placeholder="Полное имя" autocomplete="name"> </div> <div> <label for="v-pass" class="mb-1.5 block font-tech text-sm font-medium text-slate-200">Код доступа</label> <input id="v-pass" type="password" class="w-full rounded-lg border border-white/15 bg-navy-950/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-gold-500" placeholder="Выдан вашим агентом"> </div> <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-navy-950/40 p-4 text-xs leading-relaxed text-slate-300"> <input id="v-consent" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"> <span>Я понимаю и согласен(на), что эта консультация <strong class="text-white">записывается в целях качества и соответствия требованиям</strong> и что во время звонка будет виден индикатор записи.</span> </label> <p id="v-error" class="hidden rounded-lg border border-ochre-500/50 bg-ochre-500/10 px-4 py-2.5 text-center text-xs text-ochre-500"></p> <button id="v-join" class="rounded-lg bg-gold-500 px-6 py-3.5 font-tech text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50" disabled> Присоединиться к консультации → </button> </div> <div class="mt-6 border-t border-white/10 pt-5 text-center text-xs text-slate-500"> <p>Защищённое видео на базе Daily.co · Проверка кода доступа на сервере.</p> <p class="mt-1">Нет кода? Спросите вашего миграционного агента или <a href="mailto:info@visa2.au" class="text-gold-400 underline">напишите нам</a>.</p> </div> </div> </div> </section>',
 "fr": '<section class="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28"> <div id="v-wrap" class="relative mx-auto max-w-md px-4"> <div id="v-card" class="rounded-3xl border border-white/10 bg-navy-900/80 p-8 shadow-2xl backdrop-blur"> <img src="../v2au-logo-white.svg" alt="Visa2AU — smart immigration" class="mx-auto mb-6 h-11 w-auto" width="154" height="55"> <h1 class="text-center font-display text-2xl font-bold">Consultation vidéo</h1> <p class="mt-2 text-center text-sm text-slate-400">Entrez votre nom et le code d’accès qui vous a été envoyé pour rejoindre votre consultation.</p> <div class="mt-6 grid gap-4"> <div> <label for="v-name" class="mb-1.5 block font-tech text-sm font-medium text-slate-200">Votre nom</label> <input id="v-name" class="w-full rounded-lg border border-white/15 bg-navy-950/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-gold-500" placeholder="Nom complet" autocomplete="name"> </div> <div> <label for="v-pass" class="mb-1.5 block font-tech text-sm font-medium text-slate-200">Code d’accès</label> <input id="v-pass" type="password" class="w-full rounded-lg border border-white/15 bg-navy-950/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-gold-500" placeholder="Fourni par votre agent"> </div> <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-navy-950/40 p-4 text-xs leading-relaxed text-slate-300"> <input id="v-consent" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"> <span>Je comprends et j’accepte que cette consultation soit <strong class="text-white">enregistrée à des fins de qualité et de conformité</strong> et qu’un indicateur d’enregistrement soit visible pendant l’appel.</span> </label> <p id="v-error" class="hidden rounded-lg border border-ochre-500/50 bg-ochre-500/10 px-4 py-2.5 text-center text-xs text-ochre-500"></p> <button id="v-join" class="rounded-lg bg-gold-500 px-6 py-3.5 font-tech text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50" disabled> Rejoindre la consultation → </button> </div> <div class="mt-6 border-t border-white/10 pt-5 text-center text-xs text-slate-500"> <p>Vidéo sécurisée par Daily.co · Code d’accès vérifié côté serveur.</p> <p class="mt-1">Pas de code ? Demandez à votre agent de migration ou <a href="mailto:info@visa2.au" class="text-gold-400 underline">écrivez-nous</a>.</p> </div> </div> </div> </section>',
}

PATHWAYS_MAIN = {
 "ru": '<section class="bg-navy-950 py-20 text-white lg:py-28"> <div class="mx-auto max-w-md px-4 text-center"> <h1 class="font-display text-2xl font-bold">Подбор визового маршрута</h1> <p class="mt-3 text-sm text-slate-400">Подбор визового маршрута теперь находится в разделе визовых услуг.</p> <p class="mt-2 text-sm text-slate-400">Произойдёт автоматическое перенаправление — или перейдите сразу.</p> <a href="visas.html#pathway-finder" class="mt-6 inline-block rounded-lg bg-gold-500 px-6 py-3 font-tech text-sm font-semibold text-navy-950 transition hover:bg-gold-400"> Открыть подбор маршрута →</a> </div> </section> <script>window.location.replace(\'./visas.html#pathway-finder\');</script>',
 "fr": '<section class="bg-navy-950 py-20 text-white lg:py-28"> <div class="mx-auto max-w-md px-4 text-center"> <h1 class="font-display text-2xl font-bold">Recherche de parcours de visa</h1> <p class="mt-3 text-sm text-slate-400">Le rechercheur de parcours se trouve désormais dans nos services de visas.</p> <p class="mt-2 text-sm text-slate-400">Vous serez redirigé automatiquement — ou accédez-y directement.</p> <a href="visas.html#pathway-finder" class="mt-6 inline-block rounded-lg bg-gold-500 px-6 py-3 font-tech text-sm font-semibold text-navy-950 transition hover:bg-gold-400"> Ouvrir la recherche de parcours →</a> </div> </section> <script>window.location.replace(\'./visas.html#pathway-finder\');</script>',
}

# localized strings inside the copied join script (exact EN literals)
VIDEO_SCRIPT_ERR = {
 "ru": {
  "Join Consultation →": "Присоединиться к консультации →",
  "Could not load the video library. Please check your connection and retry.": "Не удалось загрузить видеобиблиотеку. Проверьте подключение и повторите.",
  "Too many attempts. Please contact your agent.": "Слишком много попыток. Свяжитесь с вашим агентом.",
  "Incorrect passcode. Please check the code you were sent.": "Неверный код доступа. Проверьте код, который вам был отправлен.",
  "Could not start the video session. Please retry.": "Не удалось начать видеосессию. Повторите попытку.",
  "Network error — please check your connection and retry.": "Ошибка сети — проверьте подключение и повторите попытку.",
  "Could not open the video room. Please retry.": "Не удалось открыть видеокоридор. Повторите попытку.",
  "Connected as ": "Подключено как ",
  "If your camera or microphone is blocked, allow access in the browser prompt.": "Если камера или микрофон заблокированы, разрешите доступ в запросе браузера.",
 },
 "fr": {
  "Join Consultation →": "Rejoindre la consultation →",
  "Could not load the video library. Please check your connection and retry.": "Impossible de charger la bibliothèque vidéo. Vérifiez votre connexion et réessayez.",
  "Too many attempts. Please contact your agent.": "Trop de tentatives. Veuillez contacter votre agent.",
  "Incorrect passcode. Please check the code you were sent.": "Code d’accès incorrect. Vérifiez le code qui vous a été envoyé.",
  "Could not start the video session. Please retry.": "Impossible de démarrer la session vidéo. Réessayez.",
  "Network error — please check your connection and retry.": "Erreur réseau — vérifiez votre connexion et réessayez.",
  "Could not open the video room. Please retry.": "Impossible d’ouvrir la salle vidéo. Réessayez.",
  "Connected as ": "Connecté comme ",
  "If your camera or microphone is blocked, allow access in the browser prompt.": "Si votre caméra ou microphone est bloqué, autorisez l’accès dans la fenêtre du navigateur.",
 },
}

def build(slug, lang, main_html):
    src = read(os.path.join(APP, f"{slug}.html"))
    m = re.search(r'<script type="application/ld\+json">.*?</script>', src, re.S)
    assert m, f"{slug}.html has no JSON-LD schema"
    schema = m.group(0)
    pre, post = chrome(lang)
    # donor chrome carries EN-relative fetches — fix depth for /{lang}/ pages
    post = post.replace("fetch('./search-index.json'", "fetch('../search-index.json'")
    return head(lang, slug, META[slug]["title"][lang], META[slug]["desc"][lang], schema) \
           + pre + f'<main id="main"> {main_html} </main>' + post

def main():
    vsrc = read(os.path.join(APP, "video.html"))
    vmain_en = re.search(r'<main id="main">(.*?)</main>', vsrc, re.S).group(1)
    join_script = re.search(r'<script>\s*\(function \(\) \{.*?</script>', vmain_en, re.S)
    assert join_script, "video join script not found"
    for lang in ("ru", "fr"):
        script = join_script.group(0)
        for k, v in VIDEO_SCRIPT_ERR[lang].items():
            assert k in script, f"join-script literal missing: {k!r}"
            script = script.replace(k, v)
        if lang == "fr":
            # FR JS-safety: no ASCII word-internal apostrophes in string literals
            script = re.sub(r"(?<=[A-Za-zÀ-ÿ])'(?=[A-Za-zÀ-ÿ])", "’", script)
        open(os.path.join(APP, lang, "video.html"), "w").write(
            build("video", lang, VIDEO_MAIN[lang] + " " + script))
        open(os.path.join(APP, lang, "pathways.html"), "w").write(
            build("pathways", lang, PATHWAYS_MAIN[lang]))
        print(f"wrote app/{lang}/video.html + app/{lang}/pathways.html")

if __name__ == "__main__":
    main()
