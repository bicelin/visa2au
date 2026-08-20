#!/usr/bin/env python3
"""One-time generator: RU/FR twins for the 4 city landing pages.

The city pages (migration-agent-{melbourne,sydney,brisbane,cairns}.html) are
committed static files with NO CI regenerator, so the generated ru/fr twins
persist safely (same as ru/fr/visas/*). This script:

  * reuses the localized body chrome (header/footer/nav/search/scripts) from
    the donor locale page app/{lang}/urgent-visa-help.html
  * builds a localized head (title/desc/canonical/hreflang/og) with favicon +
    stylesheet at ../ depth
  * injects the per-city LocalBusiness schema (geo/areaServed/NAP kept in
    English for entity consistency) verbatim from the EN page
  * writes app/{lang}/migration-agent-{city}.html
  * fixes the literal '{city}' template bug in the 4 EN city pages' FAQ

Run once from repo root:  python3 scripts/_gen_city_locale.py
Then: align_seo_meta.py -> fix_locale_links.py -> build_sitemap.py ->
      check_seo_invariants.py -> audit_locale_links.py -> check_inline_js.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
BASE = "https://visa2.au"
CITIES = ["melbourne", "sydney", "brisbane", "cairns"]

# ---------------------------------------------------------------------------
# Per-city variable data (EN + RU + FR)
# ---------------------------------------------------------------------------
CITY = {
    "melbourne": {
        "en": "Melbourne", "ru": "Мельбурне", "fr": "Melbourne",
        "agent": ("Sergey Vinnichenko", "Сергей Винниченко", "Sergey Vinnichenko"),
        "intro": (
            "Registered migration agent <b>Sergey Vinnichenko</b> (MARN 2418663) is based in Melbourne, working with clients across Victoria and all of Australia — and worldwide via secure video consultation. From skilled and partner visas to employer sponsorship and visa refusals, we build your strategy before you pay a cent.",
            "Зарегистрированный миграционный агент <b>Сергей Винниченко</b> (MARN 2418663) работает в Мельбурне и обслуживает клиентов по всей Виктории и всей Австралии — а также по всему миру через защищённую видеоконсультацию. От Skilled и Partner Visas до Employer Sponsorship и отказов в визах — мы строим вашу стратегию до того, как вы заплатите хоть цент.",
            "L'agent de migration enregistré <b>Sergey Vinnichenko</b> (MARN 2418663) est basé à Melbourne et travaille avec des clients de toute la Victoria et de toute l'Australie — et du monde entier via une consultation vidéo sécurisée. Des visas de compétences et de conjoint au parrainage employeur et aux refus de visa, nous construisons votre stratégie avant que vous ne payiez un centime.",
        ),
        "local": (
            "Whether you're in the CBD, Southbank, the western suburbs or regional Victoria, your consultation is fully remote — no need to travel.",
            "Где бы вы ни находились — в центре, в Southbank, в западных пригородах или в регионах Виктории — ваша консультация полностью удалённая, ехать никуда не нужно.",
            "Que vous soyez dans le centre-ville, à Southbank, dans les banlieues ouest ou dans la Victoria régionale, votre consultation est entièrement à distance — pas besoin de vous déplacer.",
        ),
        "title": ("Migration Agent in Melbourne | Visa2AU",
                  "Миграционный агент в Мельбурне | Visa2AU",
                  "Agent de migration à Melbourne | Visa2AU"),
        "desc": ("Registered migration agent in Melbourne (MARN 2418663) serving Victoria and all of Australia — plus worldwide via secure video consultation. Fixed fees, strategy first.",
                 "Зарегистрированный миграционный агент в Мельбурне (MARN 2418663), обслуживает Викторию и всю Австралию — и по всему миру через защищённую видеоконсультацию. Фиксированные гонорары, сначала стратегия.",
                 "Agent de migration enregistré à Melbourne (MARN 2418663) au service de la Victoria et de toute l'Australie — et du monde entier via une consultation vidéo sécurisée. Honoraires fixes, stratégie d'abord."),
    },
    "sydney": {
        "en": "Sydney", "ru": "Сиднее", "fr": "Sydney",
        "agent": ("the Visa2AU team", "команда Visa2AU", "l'équipe Visa2AU"),
        "intro": (
            "Our registered migration agents (MARN 0534230 &amp; 2418663) are headquartered in North Sydney, serving clients across Sydney and New South Wales — and all of Australia plus worldwide via secure video consultation. Strategy first, fixed fees quoted upfront.",
            "Наши зарегистрированные миграционные агенты (MARN 0534230 и 2418663) работают из North Sydney и обслуживают клиентов по всему Сиднею и Новому Южному Уэльсу — а также по всей Австралии и всему миру через защищённую видеоконсультацию. Сначала стратегия, фиксированные гонорары указаны заранее.",
            "Nos agents de migration enregistrés (MARN 0534230 et 2418663) sont basés à North Sydney et servent des clients dans tout Sydney et en Nouvelle-Galles du Sud — ainsi que dans toute l'Australie et dans le monde entier via une consultation vidéo sécurisée. Stratégie d'abord, honoraires fixes indiqués à l'avance.",
        ),
        "local": (
            "From the CBD to the North Shore, the inner west and Greater Western Sydney — we work with you remotely, on your schedule.",
            "От центра до North Shore, inner west и Большого Западного Сиднея — мы работаем с вами удалённо, по вашему графику.",
            "Du centre-ville à North Shore, de l'inner west au Greater Western Sydney — nous travaillons avec vous à distance, à votre rythme.",
        ),
        "title": ("Migration Agent in Sydney | Visa2AU",
                  "Миграционный агент в Сиднее | Visa2AU",
                  "Agent de migration à Sydney | Visa2AU"),
        "desc": ("Registered migration agents in Sydney (MARN 0534230/2418663) — headquartered in North Sydney, serving NSW and all of Australia plus worldwide via secure video consultation.",
                 "Зарегистрированные миграционные агенты в Сиднее (MARN 0534230/2418663) — главный офис в North Sydney, обслуживаем NSW и всю Австралию, а также весь мир через защищённую видеоконсультацию.",
                 "Agents de migration enregistrés à Sydney (MARN 0534230/2418663) — siège à North Sydney, au service de la NSW et de toute l'Australie, et du monde entier via une consultation vidéo sécurisée."),
    },
    "brisbane": {
        "en": "Brisbane", "ru": "Брисбене", "fr": "Brisbane",
        "agent": ("the Visa2AU team", "команда Visa2AU", "l'équipe Visa2AU"),
        "intro": (
            "Registered migration agents serving Brisbane and the whole of Queensland — and all of Australia plus worldwide via secure video consultation. Whether it's a skilled, partner, employer-sponsored, student or family visa, we map the clearest pathway for you.",
            "Зарегистрированные миграционные агенты обслуживают Брисбен и весь Квинсленд — а также всю Австралию и весь мир через защищённую видеоконсультацию. Будь то Skilled, Partner, employer-sponsored, Student или Family Visa — мы выстраиваем для вас самый понятный путь.",
            "Des agents de migration enregistrés au service de Brisbane et de tout le Queensland — ainsi que de toute l'Australie et du monde entier via une consultation vidéo sécurisée. Qu'il s'agisse d'un visa de compétences, de conjoint, parrainé par un employeur, étudiant ou familial, nous traçons pour vous le chemin le plus clair.",
        ),
        "local": (
            "Based anywhere in Queensland? Your consultation is fully remote — meet your agent by secure video, wherever you are in the state.",
            "Находитесь где угодно в Квинсленде? Ваша консультация полностью удалённая — встречайтесь с вашим агентом по защищённому видео, где бы вы ни были в штате.",
            "Basé n'importe où au Queensland ? Votre consultation est entièrement à distance — rencontrez votre agent par vidéo sécurisée, où que vous soyez dans l'État.",
        ),
        "title": ("Migration Agent in Brisbane | Visa2AU",
                  "Миграционный агент в Брисбене | Visa2AU",
                  "Agent de migration à Brisbane | Visa2AU"),
        "desc": ("Registered migration agent in Brisbane serving Queensland and all of Australia — plus worldwide via secure video consultation. Skilled, partner, employer & family visas.",
                 "Зарегистрированный миграционный агент в Брисбене обслуживает Квинсленд и всю Австралию — и весь мир через защищённую видеоконсультацию. Skilled, Partner, Employer и Family Visas.",
                 "Agent de migration enregistré à Brisbane au service du Queensland et de toute l'Australie — et du monde entier via une consultation vidéo sécurisée. Visas de compétences, de conjoint, employeur et familiaux."),
    },
    "cairns": {
        "en": "Cairns", "ru": "Кэрнсе", "fr": "Cairns",
        "agent": ("Natasha Arens", "Наташа Аренс", "Natasha Arens"),
        "intro": (
            "Registered migration agent <b>Natasha Arens</b> (MARN 0534230, NAATI CPN0VW21W) works from Cairns, serving clients across Far North Queensland and all of Australia — and worldwide via secure video consultation. Family and partner visas are a particular focus.",
            "Зарегистрированный миграционный агент <b>Наташа Аренс</b> (MARN 0534230, NAATI CPN0VW21W) работает из Кэрнса и обслуживает клиентов по всему Дальнему Северу Квинсленда и всей Австралии — а также по всему миру через защищённую видеоконсультацию. Family и Partner Visas — особая специализация.",
            "L'agent de migration enregistré <b>Natasha Arens</b> (MARN 0534230, NAATI CPN0VW21W) travaille depuis Cairns et sert des clients dans tout le Far North Queensland et toute l'Australie — ainsi que dans le monde entier via une consultation vidéo sécurisée. Les visas familiaux et de conjoint sont une spécialité particulière.",
        ),
        "local": (
            "From Cairns and Port Douglas to Townsville and the Tablelands — your consultation is fully remote, no travel needed.",
            "От Кэрнса и Port Douglas до Townsville и Tablelands — ваша консультация полностью удалённая, ехать не нужно.",
            "De Cairns et Port Douglas à Townsville et aux Tablelands — votre consultation est entièrement à distance, pas de déplacement nécessaire.",
        ),
        "title": ("Migration Agent in Cairns | Visa2AU",
                  "Миграционный агент в Кэрнсе | Visa2AU",
                  "Agent de migration à Cairns | Visa2AU"),
        "desc": ("Registered migration agent in Cairns (MARN 0534230) serving Far North Queensland and all of Australia — plus worldwide via secure video consultation. Family & partner visas a specialty.",
                 "Зарегистрированный миграционный агент в Кэрнсе (MARN 0534230) обслуживает Дальний Север Квинсленда и всю Австралию — и весь мир через защищённую видеоконсультацию. Специализация — Family и Partner Visas.",
                 "Agent de migration enregistré à Cairns (MARN 0534230) au service du Far North Queensland et de toute l'Australie — et du monde entier via une consultation vidéo sécurisée. Visas familiaux et de conjoint en spécialité."),
    },
}

# ---------------------------------------------------------------------------
# Shared translated strings, per language index (0=EN 1=RU 2=FR)
# ---------------------------------------------------------------------------
EYEBROW = [
    "Registered Migration Agents · MARN 0534230/2418663 · Australia &amp; Worldwide",
    "Зарегистрированные миграционные агенты · MARN 0534230/2418663 · Австралия и весь мир",
    "Agents de migration enregistrés · MARN 0534230/2418663 · Australie et monde entier",
]
BOOK = ["Book a consultation →", "Записаться на консультацию →", "Réserver une consultation →"]
EXPLORE = ["Explore visa services", "Изучить визовые услуги", "Explorer les services de visas"]
SVC_H2 = ["Visa services for {} clients", "Визовые услуги для клиентов в {}", "Services de visas pour les clients de {}"]
WHY_H2 = ["Why clients choose Visa2AU in {}", "Почему клиенты выбирают Visa2AU в {}", "Pourquoi les clients choisissent Visa2AU à {}"]
FAQ_H2 = ["Frequently asked questions", "Часто задаваемые вопросы", "Questions fréquemment posées"]
SERVING_H2 = ["Serving clients across Australia", "Обслуживаем клиентов по всей Австралии", "Nous servons des clients dans toute l'Australie"]
SERVING_P = [
    "Our registered migration agents work from these cities — and anywhere, via secure video consultation.",
    "Наши зарегистрированные миграционные агенты работают в этих городах — и где угодно, через защищённую видеоконсультацию.",
    "Nos agents de migration enregistrés travaillent depuis ces villes — et partout ailleurs, via une consultation vidéo sécurisée.",
]
CITY_LINK = ["Migration agent in {}", "Миграционный агент в {}", "Agent de migration à {}"]
TALK_H = ["Talk to {} today", "Поговорите с {} сегодня", "Parlez à {} aujourd'hui"]
TALK_P = [
    "Start with a consultation — your pathway, mapped.",
    "Начните с консультации — ваш маршрут уже продуман.",
    "Commencez par une consultation — votre parcours, tracé.",
]
# feature cards
FEAT = [
    [("MARN-registered", "Certified migration agents, held to a professional code of conduct."),
     ("2,000+ cases, 99.8% success", "Strategy first, fixed fees quoted upfront — since 2004."),
     ("Remote &amp; worldwide", "Secure video consultations — serve you in {}, across Australia, or abroad.")],
    [("Зарегистрировано в MARN", "Сертифицированные миграционные агенты, соблюдающие профессиональный кодекс поведения."),
     ("2,000+ дел, 99.8% успеха", "Сначала стратегия, фиксированные гонорары указаны заранее — с 2004 года."),
     ("Удалённо и по всему миру", "Защищённые видеоконсультации — обслужим вас в {}, по всей Австралии или за рубежом.")],
    [("Enregistré auprès de MARN", "Des agents de migration certifiés, tenus à un code de conduite professionnel."),
     ("2 000+ dossiers, 99,8 % de succès", "Stratégie d'abord, honoraires fixes indiqués à l'avance — depuis 2004."),
     ("À distance et dans le monde entier", "Des consultations vidéo sécurisées — nous vous servons à {}, dans toute l'Australie ou à l'étranger.")],
]
# FAQ
FAQ = [
    [("Do I need to be in {} to use your service?", "No. We serve clients across Australia and worldwide via secure video and phone consultations — your location doesn't limit us."),
     ("Can you help if I'm overseas?", "Yes. Most of our consultations are fully remote, so we work with clients in Australia and abroad."),
     ("Are your fees fixed?", "Yes. Every cost is disclosed upfront — fixed fees quoted before you commit.")],
    [("Нужно ли мне находиться в {}, чтобы воспользоваться вашими услугами?", "Нет. Мы обслуживаем клиентов по всей Австралии и по всему миру через защищённые видеоконсультации и по телефону — ваше местоположение нам не мешает."),
     ("Вы можете помочь, если я за границей?", "Да. Большинство наших консультаций проходит полностью удалённо, поэтому мы работаем с клиентами в Австралии и за рубежом."),
     ("Ваши гонорары фиксированные?", "Да. Каждая стоимость раскрывается заранее — фиксированные гонорары указываются до того, как вы примете решение.")],
    [("Dois-je être à {} pour utiliser votre service ?", "Non. Nous servons des clients dans toute l'Australie et dans le monde entier via des consultations vidéo et téléphoniques sécurisées — votre localisation ne nous limite pas."),
     ("Pouvez-vous m'aider si je suis à l'étranger ?", "Oui. La plupart de nos consultations sont entièrement à distance, nous travaillons donc avec des clients en Australie et à l'étranger."),
     ("Vos honoraires sont-ils fixes ?", "Oui. Chaque coût est dévoilé à l'avance — des honoraires fixes sont indiqués avant que vous ne vous engagiez.")],
]
# visa list (official names stay English per localization rule)
VISA_LIST = [
    ("Partner Visas", "./visas/partner-visa-820-801.html"),
    ("Skilled Visas (189/190/491)", "./visas/skilled-independent-189-190.html"),
    ("Employer Sponsorship (482/186)", "./visas/employer-nomination-186.html"),
    ("Student Visas (500)", "./visas/student-visa-500.html"),
    ("Visa Refusals & Cancellations", "./visas/visa-refusals-art-appeals.html"),
    ("Parent & Family Visas", "./visas/parent-visa-103.html"),
]

LANGS = {"ru": 1, "fr": 2}
LANG_ATTR = {"ru": "ru", "fr": "fr"}
OG_LOCALE = {"ru": "ru_RU", "fr": "fr_FR"}


def chrome(lang):
    """Reuse localized body chrome from the donor locale page (header/footer/nav/search/scripts)."""
    src = open(os.path.join(APP, lang, "urgent-visa-help.html"), encoding="utf-8").read()
    h = src.find("</head>")
    m = src.find('<main id="main">')
    m2 = src.find("</main>", m)
    pre_body = src[h + len("</head>"):m]
    post_main = src[m2 + len("</main>"):]
    return pre_body, post_main


def localized_head(lang, city, title, desc):
    url = f"{BASE}/{lang}/migration-agent-{city}"
    hreflang = (f'<link rel="canonical" href="{url}">'
                f'<link rel="alternate" hreflang="en" href="{BASE}/migration-agent-{city}">'
                f'<link rel="alternate" hreflang="ru" href="{BASE}/ru/migration-agent-{city}">'
                f'<link rel="alternate" hreflang="fr" href="{BASE}/fr/migration-agent-{city}">'
                f'<link rel="alternate" hreflang="x-default" href="{BASE}/migration-agent-{city}">')
    theme = ('<script>(function () { const stored = localStorage.getItem(\'v2au-theme\'); '
             'const prefersDark = window.matchMedia(\'(prefers-color-scheme: dark)\').matches; '
             'if (stored === \'dark\' || (!stored && prefersDark)) { document.documentElement.classList.add(\'dark\'); } })();</script>')
    # reuse the per-city LocalBusiness schema from the EN source (geo/areaServed/NAP in English)
    en = open(os.path.join(APP, f"migration-agent-{city}.html"), encoding="utf-8").read()
    sch = re.search(r'(<script type="application/ld\+json">\{.*?\}</script>)', en, re.S).group(1)
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
            f'{theme}{sch}'
            f'<link rel="stylesheet" href="../_astro/index.DqolKn4r.css">'
            f'<meta property="og:site_name" content="Visa2AU">'
            f'<meta name="theme-color" content="#0a0f1c"></head> ')


def build_main(city, li):
    d = CITY[city]
    lname = d["en"] if li == 0 else (d["ru"] if li == 1 else d["fr"])
    agent = d["agent"][li]
    svc_h2 = SVC_H2[li].format(lname)
    why_h2 = WHY_H2[li].format(lname)
    feat = FEAT[li]
    faq = FAQ[li]
    faq_h2 = FAQ_H2[li]
    # cross-city links: other 3 cities
    others = [c for c in CITIES if c != city]
    cross = "".join(
        f'<a href="../migration-agent-{c}.html" class="rounded-lg border border-navy-800/10 px-4 py-2 text-sm font-semibold text-navy-800 hover:border-gold-500 dark:border-white/15 dark:text-white">{CITY_LINK[li].format(CITY[c]["en"] if li==0 else (CITY[c]["ru"] if li==1 else CITY[c]["fr"]))}</a>'
        for c in others)
    visa_li = "".join(f'<li><a href="../{h}' if False else f'<li><a href="{h}" class="text-gold-600 hover:text-gold-500 dark:text-gold-400">{n}</a></li>'
                      for (n, h) in [(n, h.replace("./", "../", 1)) for (n, h) in VISA_LIST])
    return f'''
  <section class="mx-auto max-w-5xl px-4 py-20 lg:px-8">
    <p class="font-tech text-xs font-semibold uppercase tracking-[0.25em] text-gold-500 dark:text-gold-400">{EYEBROW[li]}</p>
    <h1 class="mt-3 font-display text-4xl font-bold text-navy-800 dark:text-white md:text-5xl">Migration Agent in {d["en"]}</h1>
    <p class="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">{d["intro"][li]}</p>
    <p class="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{d["local"][li]}</p>
    <div class="mt-8 flex flex-wrap gap-4">
      <a href="../contact.html" class="rounded-xl bg-navy-900 px-6 py-3 font-semibold text-white hover:bg-navy-800 dark:bg-gold-500 dark:text-navy-900">{BOOK[li]}</a>
      <a href="../visas.html" class="rounded-xl border border-navy-800/20 px-6 py-3 font-semibold text-navy-800 hover:border-gold-500 dark:border-white/20 dark:text-white">{EXPLORE[li]}</a>
    </div>
  </section>
  <section class="mx-auto max-w-5xl px-4 py-12 lg:px-8">
    <h2 class="font-display text-2xl font-bold text-navy-800 dark:text-white">{svc_h2}</h2>
    <ul class="mt-4 grid gap-3 sm:grid-cols-2">{visa_li}</ul>
  </section>
  <section class="mx-auto max-w-5xl px-4 py-12 lg:px-8">
    <h2 class="font-display text-2xl font-bold text-navy-800 dark:text-white">{why_h2}</h2>
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-navy-800/10 bg-white p-5 dark:border-white/10 dark:bg-navy-900"><h3 class="font-display font-bold">{feat[0][0]}</h3><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{feat[0][1]}</p></div>
      <div class="rounded-xl border border-navy-800/10 bg-white p-5 dark:border-white/10 dark:bg-navy-900"><h3 class="font-display font-bold">{feat[1][0]}</h3><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{feat[1][1]}</p></div>
      <div class="rounded-xl border border-navy-800/10 bg-white p-5 dark:border-white/10 dark:bg-navy-900"><h3 class="font-display font-bold">{feat[2][0]}</h3><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{feat[2][1].format(lname)}</p></div>
    </div>
  </section>
  <section class="mx-auto max-w-5xl px-4 py-12 lg:px-8">
    <h2 class="font-display text-2xl font-bold text-navy-800 dark:text-white">{faq_h2}</h2>
    <div class="mt-4 grid gap-3">{''.join(
        f'<div class="rounded-xl border border-navy-800/10 bg-white p-5 dark:border-white/10 dark:bg-navy-900"><h3 class="font-display font-bold text-navy-800 dark:text-white">{q.format(lname)}</h3><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{a}</p></div>'
        for (q, a) in faq)}</div>
  </section>
  <section class="mx-auto max-w-5xl px-4 py-12 lg:px-8">
    <h2 class="font-display text-2xl font-bold text-navy-800 dark:text-white">{SERVING_H2[li]}</h2>
    <p class="mt-2 text-slate-600 dark:text-slate-300">{SERVING_P[li]}</p>
    <div class="mt-4 flex flex-wrap gap-3">{cross}</div>
  </section>
  <section class="mx-auto max-w-5xl px-4 py-12 text-center lg:px-8">
    <h2 class="font-display text-2xl font-bold text-navy-800 dark:text-white">{TALK_H[li].format(agent)}</h2>
    <p class="mt-2 text-slate-600 dark:text-slate-300">{TALK_P[li]}</p>
    <a href="../contact.html" class="mt-5 inline-block rounded-xl bg-navy-900 px-6 py-3 font-semibold text-white hover:bg-navy-800 dark:bg-gold-500 dark:text-navy-900">{BOOK[li]}</a>
  </section>
'''


def fix_en_city_bug():
    """Replace the literal '{city}' template placeholder in the 4 EN city pages' FAQ."""
    for city in CITIES:
        f = os.path.join(APP, f"migration-agent-{city}.html")
        html = open(f, encoding="utf-8").read()
        new = html.replace("in {city} to use your service", f"in {CITY[city]['en']} to use your service")
        new = new.replace("in {city}", f"in {CITY[city]['en']}")
        if new != html:
            open(f, "w", encoding="utf-8").write(new)
            print(f"fixed {{city}} bug in EN {city}.html")
        else:
            print(f"EN {city}.html: no {{city}} placeholder found")


def main():
    for lang, li in LANGS.items():
        pre_body, post_main = chrome(lang)
        for city in CITIES:
            d = CITY[city]
            title = d["title"][li]
            desc = d["desc"][li]
            head = localized_head(lang, city, title, desc)
            main_html = build_main(city, li)
            out = head + pre_body + f'<main id="main"> {main_html} </main>' + post_main
            dest = os.path.join(APP, lang, f"migration-agent-{city}.html")
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            open(dest, "w", encoding="utf-8").write(out)
            print(f"wrote {lang}/migration-agent-{city}.html")
    fix_en_city_bug()
    print("done")


if __name__ == "__main__":
    main()
