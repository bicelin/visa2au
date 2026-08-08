#!/usr/bin/env python3
"""Localize visa-page <title>/<h1>/og:title for the RU and FR locales and
replace the English "MARN Registered Agents" title suffix on locale pages.
Idempotent: only touches files listed in the maps.
"""
import os
import re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")

SUFFIX_RU = "Visa2AU — зарегистрированные миграционные агенты"
SUFFIX_FR = "Visa2AU — agents de migration enregistrés"

# slug -> (title part before suffix, h1)
TITLE_MAP = {
    ("ru", "employer-nomination-186"): ("Схема номинации работодателя (ENS) 186", "Схема номинации работодателя (ENS)"),
    ("ru", "skills-in-demand-482"):    ("Востребованные навыки (SID) 482", "Востребованные навыки (SID)"),
    ("fr", "employer-nomination-186"): ("Schéma de nomination par l'employeur (ENS) 186", "Schéma de nomination par l'employeur (ENS)"),
    ("fr", "skills-in-demand-482"):    ("Compétences en demande (SID) 482", "Compétences en demande (SID)"),
}


def main() -> None:
    # 1) suffix localization on every locale visa page
    for lang, suffix in (("ru", SUFFIX_RU), ("fr", SUFFIX_FR)):
        d = os.path.join(APP, lang, "visas")
        for f in sorted(os.listdir(d)):
            if not f.endswith(".html"):
                continue
            p = os.path.join(d, f)
            html = open(p, encoding="utf-8").read()
            new = html.replace("Visa2AU — MARN Registered Agents", suffix)
            new = new.replace("Visa2AU — MARN Registered", suffix)
            if new != html:
                open(p, "w", encoding="utf-8").write(new)
                print(f"suffix {lang}: {f}")

    # 2) title/H1/og:title for the untranslated pages
    for (lang, slug), (title, h1) in TITLE_MAP.items():
        p = os.path.join(APP, lang, "visas", slug + ".html")
        html = open(p, encoding="utf-8").read()
        orig = html
        html = re.sub(r"<title>[^<]*</title>", f"<title>{title} | {SUFFIX_RU if lang == 'ru' else SUFFIX_FR}</title>", html, count=1)
        html = re.sub(r'(<meta property="og:title" content=")[^"]*(")', rf'\g<1>{title}\g<2>', html, count=1)
        h1s = re.findall(r"<h1[^>]*>.*?</h1>", html, flags=re.S)
        if h1s:
            html = html.replace(h1s[0], re.sub(r">[^<]*<", f">{h1}<", h1s[0], count=1), 1)
        if html != orig:
            open(p, "w", encoding="utf-8").write(html)
            print(f"localized {lang}: {slug}")


if __name__ == "__main__":
    main()
