#!/usr/bin/env python3
"""Alt text for every blog image, in the three published languages.

Why a module and not the front matter: 14 posts share 8 photographs today, so the
same picture needs one accurate description per language rather than 14 rewrites —
and the build fails loudly when a new image has no entry, instead of shipping
"Feature image for: <title>" as it did for two years.

Rule for the wording: describe what is IN THE FRAME (objects, place, light) and
never imply a real client, a real grant notice or a real event. 20-125 characters,
no "image of", no repeated headline.
"""

ALT: dict[str, dict[str, str]] = {
    "imgs/blog-employer.jpg": {
        "en": "Business people meeting around a boardroom table above Sydney Harbour",
        "ru": "Деловая встреча за столом в офисе над Сиднейской бухтой",
        "fr": "Réunion de travail autour d’une table avec vue sur la baie de Sydney",
    },
    "imgs/blog-parent.jpg": {
        "en": "An older couple walking a beach at sunset, holding hands",
        "ru": "Пожилая пара идёт по пляжу на закате, держась за руки",
        "fr": "Un couple âgé marche sur une plage au coucher du soleil, main dans la main",
    },
    "imgs/blog-partner-visa.jpg": {
        "en": "A couple holding a certificate beside Sydney Harbour at golden hour",
        "ru": "Пара с документом на фоне Сиднейской бухты на закате",
        "fr": "Un couple tenant un document devant la baie de Sydney au coucher du soleil",
    },
    "imgs/blog-skilled.jpg": {
        "en": "Construction worker in high-visibility gear beside an excavator",
        "ru": "Строитель в светоотражающей одежде рядом с экскаватором",
        "fr": "Ouvrier du bâtiment en tenue haute visibilité près d’une pelleteuse",
    },
    "imgs/hero-sydney.jpg": {
        "en": "Sydney Opera House and Harbour Bridge lit at night over the water",
        "ru": "Сиднейский оперный театр и мост Харбор-Бридж ночью над водой",
        "fr": "L’Opéra de Sydney et le Harbour Bridge illuminés la nuit au-dessus de l’eau",
    },
    "imgs/hero-coast.jpg": {
        "en": "Sandstone cliffs and surf under a storm-lit sunset sky",
        "ru": "Песчаниковые скалы и прибой под грозовым закатным небом",
        "fr": "Falaises de grès et ressac sous un ciel d’orage au coucher du soleil",
    },
    "imgs/hero-outback.jpg": {
        "en": "Red outback plain and distant ranges under a wide sky",
        "ru": "Красная равнина аутбэка и далёкие хребты под широким небом",
        "fr": "Plaine rouge de l’outback et reliefs lointains sous un ciel immense",
    },
    "imgs/hero-rainforest.jpg": {
        "en": "Rainforest canopy and ferns in soft green light",
        "ru": "Кроны тропического леса и папоротники в мягком зелёном свете",
        "fr": "Canopée de forêt tropicale et fougères dans une lumière verte",
    },
    "imgs/blog/understanding-partner-visa-820-801.jpg": {
        "en": "Blank passport cover, two gold rings and a desk in window light",
        "ru": "Пустой паспорт, два золотых кольца и стол в свете окна",
        "fr": "Couverture de passeport vierge, deux alliances et un bureau à la lumière",
    },
    "imgs/blog/employer-sponsorship-482-186-explained.jpg": {
        "en": "Unmarked documents and a pen on a plain desk in daylight",
        "ru": "Документы без надписей и ручка на столе при дневном свете",
        "fr": "Documents vierges et un stylo sur un bureau à la lumière du jour",
    },
    "imgs/blog/onshore-application-charge-1500-2026.jpg": {
        "en": "An almost empty savings jar and loose coins on a pale table",
        "ru": "Почти пустая банка для сбережений и монеты на светлом столе",
        "fr": "Un bocal d’épargne presque vide et des pièces sur une table claire",
    },
    "imgs/blog/visa-refusal-what-to-do.jpg": {
        "en": "A sealed envelope on a desk beside a window",
        "ru": "Запечатанный конверт на столе рядом с окном",
        "fr": "Une enveloppe fermée sur un bureau près d’une fenêtre",
    },
}

LANGS = ("en", "ru", "fr")


def alt_for(image: str, lang: str) -> str:
    key = image.lstrip("/")
    entry = ALT.get(key)
    if not entry:
        raise KeyError(
            f"no alt text for {key} — add it to scripts/blog_art.py ALT "
            f"(the build refuses to publish 'Feature image for: <title>' again)"
        )
    return entry[lang]
