#!/usr/bin/env python3
"""Generate the branded social share card (og:image) for Visa2AU.

Reads app/v2au-logo-white.svg (vector logo), embeds its paths into a
1200x630 card layout (navy/gold brand system), and rasterizes it to
app/imgs/og-share-card.png.

Rendering: headless Chrome when available (exact pixels), otherwise macOS
QuickLook + sips center-crop. Output is a static asset — regenerate only
when the design or logo changes.
"""
import os
import re
import shutil
import subprocess
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_SVG = os.path.join(ROOT, "app", "v2au-logo-white.svg")
CARD_SVG = os.path.join(ROOT, "scripts", "og-card.svg")
OUT_PNG = os.path.join(ROOT, "app", "imgs", "og-share-card.png")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CARD = """<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
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
  {logo}
  <!-- Southern Cross -->
  <g fill="#f0a000">
    <path transform="translate(985 130) scale(1.1)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1065 152) scale(0.7)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1128 116) scale(0.9)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1096 196) scale(0.55)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <path transform="translate(1002 206) scale(0.42)" d="M0 -16 L3.6 -3.6 L16 0 L3.6 3.6 L0 16 L-3.6 3.6 L-16 0 L-3.6 -3.6 Z"/>
    <circle cx="930" cy="150" r="3" opacity="0.7"/>
    <circle cx="1130" cy="180" r="2.4" opacity="0.6"/>
    <circle cx="1020" cy="90" r="2.2" opacity="0.5"/>
    <circle cx="1180" cy="250" r="2.6" opacity="0.5"/>
  </g>
  <text x="80" y="305" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="58" fill="#ffffff">Australian immigration,</text>
  <text x="80" y="378" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="58" fill="#ffffff">engineered with <tspan fill="#f0a000">care.</tspan></text>
  <text x="80" y="450" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="#aeb9d0">Registered Migration Agents · MARN 0534230 / 2418663</text>
  <rect x="80" y="480" width="120" height="4" rx="2" fill="#f0a000"/>
  <text x="80" y="540" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="25" fill="#f0a000">2,000+ cases   ·   99.8% success   ·   since 2004</text>
  <text x="80" y="598" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="36" fill="#ffffff">visa2.au</text>
  <rect x="872" y="560" width="248" height="46" rx="23" fill="#f0a000"/>
  <text x="996" y="590" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="21" fill="#0a0f1c" text-anchor="middle">Book a consultation</text>
</svg>
"""


def logo_inner() -> str:
    svg = open(LOGO_SVG, encoding="utf-8").read()
    inner = re.sub(r"^<svg[^>]*>", "", svg, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S)
    return inner.strip()


def render_chrome(src: str, out: str) -> bool:
    if not os.path.isfile(CHROME):
        return False
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", "--window-size=1200,630",
         "--screenshot=" + out, "file://" + src],
        check=True, capture_output=True)
    return True


def render_qlmanage(src: str, out: str) -> None:
    with tempfile.TemporaryDirectory() as td:
        subprocess.run(["qlmanage", "-t", "-s", "1200", "-o", td, src],
                       check=True, capture_output=True)
        png = os.path.join(td, os.path.basename(src) + ".png")
        subprocess.run(["sips", "-c", "630", "1200", png, "--out", png],
                       check=True, capture_output=True)
        shutil.copy(png, out)


def main() -> None:
    os.makedirs(os.path.dirname(CARD_SVG), exist_ok=True)
    with open(CARD_SVG, "w", encoding="utf-8") as f:
        f.write(CARD.format(logo=f'<g transform="translate(80,54) scale(0.5)">{logo_inner()}</g>'))
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    if not render_chrome(CARD_SVG, OUT_PNG):
        render_qlmanage(CARD_SVG, OUT_PNG)
    print("wrote", OUT_PNG)


if __name__ == "__main__":
    main()
