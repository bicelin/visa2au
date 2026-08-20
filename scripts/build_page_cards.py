#!/usr/bin/env python3
"""Generate per-page branded social share cards (og:image).

Each card is a 1200x630 navy/gold brand layout carrying the page's own
title + subtitle, so shared links show context (e.g. "Migration Agent —
Melbourne") instead of one generic image. Rasterizes via headless Chrome
(exact pixels) with macOS qlmanage+sips fallback (mirrors build_og_card.py).

Usage:  python3 scripts/build_page_cards.py
Writes app/imgs/og-{slug}.png for every slug in PAGES, then prints the
mapping so align_seo_meta can point each page's og:image at its card.
"""
import os
import re
import shutil
import subprocess
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_SVG = os.path.join(ROOT, "app", "v2au-logo-white.svg")
OUT_DIR = os.path.join(ROOT, "app", "imgs")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# slug -> (primary title line, secondary line, footer domain/CTA)
# Cards share the brand layout; only the text varies per page.
PAGES = {
    "migration-agent-melbourne": ("Migration Agent in Melbourne",
                                  "Serving Victoria & all of Australia — plus worldwide by secure video",
                                  "visa2.au"),
    "migration-agent-sydney": ("Migration Agent in Sydney",
                               "Headquartered in North Sydney — serving NSW, all of Australia & worldwide",
                               "visa2.au"),
    "migration-agent-brisbane": ("Migration Agent in Brisbane",
                                 "Serving Queensland & all of Australia — plus worldwide by secure video",
                                 "visa2.au"),
    "migration-agent-cairns": ("Migration Agent in Cairns",
                               "Serving Far North Queensland & all of Australia — plus worldwide",
                               "visa2.au"),
    "index": ("Australian Immigration, Engineered With Care.",
              "Registered Migration Agents · MARN 0534230 / 2418663",
              "visa2.au"),
    "visas/protection-visa-866": ("Protection Visa 866 — Fee, Cost & Process",
                                  "Registered Migration Agents · MARN 0534230 / 2418663",
                                  "visa2.au"),
    "visas/skills-in-demand-482": ("Skills in Demand (SID) 482 — Fees & Guide",
                                   "Registered Migration Agents · MARN 0534230 / 2418663",
                                   "visa2.au"),
    "visas/employer-nomination-186": ("Employer Nomination Scheme 186",
                                      "Registered Migration Agents · MARN 0534230 / 2418663",
                                      "visa2.au"),
    "visas/skilled-independent-189-190": ("Skilled Independent & State Nominated 189/190",
                                          "Registered Migration Agents · MARN 0534230 / 2418663",
                                          "visa2.au"),
    "pricing": ("Transparent Fixed-Fee Pricing",
                "Consultations $330/hr · Partner visas from $5,500 · no surprises",
                "visa2.au"),
    "visas/partner-visa-820-801": ("Partner Visas 820/801 — Onshore Pathway",
                                   "Registered Migration Agents · MARN 0534230 / 2418663",
                                   "visa2.au"),
    # RU/FR city cards (localized for the Russian/French-speaking audience)
    "ru/migration-agent-melbourne": ("Миграционный агент в Мельбурне",
                                     "Обслуживаем Викторию и всю Австралию — и весь мир по видео",
                                     "visa2.au"),
    "ru/migration-agent-sydney": ("Миграционный агент в Сиднее",
                                  "Главный офис в North Sydney — обслуживаем NSW, Австралию и весь мир",
                                  "visa2.au"),
    "ru/migration-agent-brisbane": ("Миграционный агент в Брисбене",
                                    "Обслуживаем Квинсленд и всю Австралию — и весь мир по видео",
                                    "visa2.au"),
    "ru/migration-agent-cairns": ("Миграционный агент в Кэрнсе",
                                  "Обслуживаем Дальний Север Квинсленда и всю Австралию — и весь мир",
                                  "visa2.au"),
    "fr/migration-agent-melbourne": ("Agent de migration à Melbourne",
                                     "Au service de la Victoria et de toute l'Australie — et du monde entier",
                                     "visa2.au"),
    "fr/migration-agent-sydney": ("Agent de migration à Sydney",
                                  "Siège à North Sydney — au service de la NSW, de l'Australie et du monde",
                                  "visa2.au"),
    "fr/migration-agent-brisbane": ("Agent de migration à Brisbane",
                                    "Au service du Queensland et de toute l'Australie — et du monde entier",
                                    "visa2.au"),
    "fr/migration-agent-cairns": ("Agent de migration à Cairns",
                                  "Au service du Far North Queensland et de toute l'Australie — et du monde",
                                  "visa2.au"),
}

def logo_inner() -> str:
    svg = open(LOGO_SVG, encoding="utf-8").read()
    inner = re.sub(r"^<svg[^>]*>", "", svg, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S)
    return inner.strip()

def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))

def card_svg(title: str, sub: str, footer: str, button: str = "Book a consultation",
             btn_w: int = 248, btn_fs: int = 21) -> str:
    title, sub, footer = esc(title), esc(sub), esc(footer)
    button = esc(button)
    # wrap title to <=2 lines of 30 chars each; fit font-size
    def wrap(s, n=30):
        words = s.split()
        lines, cur = [], ""
        for w in words:
            if len(cur) + len(w) + 1 > n and cur:
                lines.append(cur); cur = w
            else:
                cur = (cur + " " + w).strip()
        if cur: lines.append(cur)
        return lines[:2]

    tlines = wrap(title)
    size = 54 if max(len(l) for l in tlines) <= 28 else 46
    y = 300 - (len(tlines) - 1) * 30
    texts = "".join(
        f'<text x="80" y="{y + i*72}" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="{size}" fill="#ffffff">{l}</text>'
        for i, l in enumerate(tlines))
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#16223f"/>
      <stop offset="0.55" stop-color="#0d1428"/>
      <stop offset="1" stop-color="#060a14"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#f0a000" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#f0a000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="6" fill="#f0a000"/>
  <circle cx="300" cy="520" r="560" fill="url(#glow)"/>
  <g transform="translate(80,54) scale(0.5)">{logo_inner()}</g>
  <g fill="#f0a000">
    <path transform="translate(985 130) scale(1.1)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1065 152) scale(0.7)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1128 116) scale(0.9)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1096 196) scale(0.55)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1002 206) scale(0.42)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
  </g>
  {texts}
  <text x="80" y="452" font-family="Arial,Helvetica,sans-serif" font-size="27" fill="#aeb9d0">{sub}</text>
  <rect x="80" y="482" width="120" height="4" rx="2" fill="#f0a000"/>
  <text x="80" y="545" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="25" fill="#f0a000">2,000+ cases · 99.8% success · since 2004</text>
  <text x="80" y="598" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="36" fill="#ffffff">{footer}</text>
  <rect x="872" y="560" width="{btn_w}" height="46" rx="23" fill="#f0a000"/>
  <text x="{872 + btn_w//2}" y="590" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="{btn_fs}" fill="#0a0f1c" text-anchor="middle">{button}</text>
</svg>
"""

def render(src: str, out: str) -> None:
    if os.path.isfile(CHROME):
        try:
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            "--force-device-scale-factor=1", "--window-size=1200,630",
                            "--screenshot=" + out, "file://" + src],
                           check=True, capture_output=True, timeout=60)
            return
        except Exception:
            pass
    with tempfile.TemporaryDirectory() as td:
        subprocess.run(["qlmanage", "-t", "-s", "1200", "-o", td, src],
                       check=True, capture_output=True)
        png = os.path.join(td, os.path.basename(src) + ".png")
        subprocess.run(["sips", "-c", "630", "1200", png, "--out", png],
                       check=True, capture_output=True)
        shutil.copy(png, out)

def slug_name(slug):
    return "og-" + slug.replace("/", "-") + ".png"

def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    mapping = {}
    for slug, (title, sub, footer) in PAGES.items():
        if slug.startswith("ru/"):
            button, btn_w, btn_fs = "Записаться на консультацию", 320, 19
        elif slug.startswith("fr/"):
            button, btn_w, btn_fs = "Réserver une consultation", 320, 19
        else:
            button, btn_w, btn_fs = "Book a consultation", 248, 21
        svg = card_svg(title, sub, footer, button, btn_w, btn_fs)
        tmp = os.path.join(tempfile.gettempdir(), "card.svg")
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(svg)
        out = os.path.join(OUT_DIR, slug_name(slug))
        render(tmp, out)
        if os.path.isfile(out):
            mapping[slug] = slug_name(slug)
            print(f"wrote {out} ({os.path.getsize(out)} bytes)")
        else:
            print(f"FAILED {slug}")
    with open(os.path.join(ROOT, "scripts", "page_card_map.json"), "w", encoding="utf-8") as f:
        import json
        json.dump(mapping, f, indent=2)
    print("map written to scripts/page_card_map.json")

if __name__ == "__main__":
    main()
