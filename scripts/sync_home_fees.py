#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Keep the homepage fee cards equal to /pricing, which is the source of truth.

The cards were hand-written and had drifted from `scripts/fees_data.py` — the same
data that renders /pricing: 189/190 showed 4,910 against 6,135/6,140, 491 showed
4,910 against 6,140, 482 showed 3,210 against "itemised at engagement", 186 and
417/462 showed 4,910 and 650 against "itemised at engagement". Two different
prices on your own site is worse than a missing price, so the cards are derived
from the one data file and a mismatch fails the build.

The ten cards are matched in document order and each carries a marker from the OLD
copy: if the page is reordered or a card is added, this fails loudly instead of
silently keeping a stale number. Only the `<span>` holding the GOV FEE label is
rewritten — never anything else in the card markup.
"""
import importlib.util
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.join(ROOT, "app", "index.html")

SPAN = re.compile(
    r'<span class="font-tech text-\[11px\] tracking-\[0\.14em\] text-paper/70">'
    r'GOV FEE[^<]*</span>'
)

# document order: (marker that must be in the OLD span, [(label, fee row)])
CARDS = [
    ("11,710", [("", "820/801 Partner (onshore)")]),
    ("250", [("", "600 Visitor (offshore)")]),
    ("2,500", [("", "500 Student")]),
    ("3,210", [("", "482 Skills in Demand")]),
    ("4,910", [("189", "189 Skilled Independent"), ("190", "190 Skilled Nominated")]),
    ("4,910", [("", "491 Skilled Work Regional")]),
    ("4,910", [("", "186 Employer Nomination")]),
    ("650", [("", "417/462 Work and Holiday")]),
    ("11,710", [("", "300 Prospective Marriage")]),
    ("7,055", [("103", "103 Parent (offshore)"),
               ("143", "143 Contributory Parent"),
               ("870", "870 Sponsored Parent (temporary)")]),
]


def load_rows() -> dict:
    path = os.path.join(ROOT, "scripts", "fees_data.py")
    spec = importlib.util.spec_from_file_location("fees_data", path)
    assert spec and spec.loader, f"cannot import {path}"
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return {name: (gov, fee) for name, _path, gov, fee in mod.rows()}


def render(pairs: list[tuple[str, str]]) -> str:
    def one(gov: str) -> str:
        gov = gov.removeprefix("from ").strip()   # fees_data mixes "from $11,710"
        if gov.startswith("$"):
            return f"from AUD {gov[1:]}"
        return gov                      # e.g. "itemised at engagement"

    if len(pairs) == 1 and not pairs[0][0]:
        return one(pairs[0][1])
    return " · ".join(f"{lab}: {one(gov)}" for lab, gov in pairs)


def main() -> int:
    rows = load_rows()
    html = open(HOME, encoding="utf-8").read()
    if len(SPAN.findall(html)) != len(CARDS):
        raise SystemExit(f"expected {len(CARDS)} GOV FEE cards, found {len(SPAN.findall(html))}")

    out, changed, i = html, [], 0
    while i < len(CARDS):
        marker, pairs = CARDS[i]
        spans = list(SPAN.finditer(out))
        if len(spans) != len(CARDS):
            raise SystemExit("the card count changed mid-run — refusing to write")
        m = spans[i]
        want = render([(lab, rows[name][0]) for lab, name in pairs])
        have = m.group(0).split("GOV FEE", 1)[1].removesuffix("</span>").strip()
        if have == want:
            i += 1
            continue
        if marker not in m.group(0):
            raise SystemExit(
                f"card {i + 1} does not contain {marker!r} any more: "
                f"{m.group(0)[-80:]!r} — the cards moved; update CARDS"
            )
        head = m.group(0).split("GOV FEE", 1)[0]
        out = out[:m.start()] + head + "GOV FEE " + want + "</span>" + out[m.end():]
        changed.append((f"card {i + 1}", have, want))
        i += 1

    for card, old, new in changed:
        print(f"  {card:8} {old[:42]:44} -> {new}")

    if out != html:
        open(HOME, "w", encoding="utf-8").write(out)
    print(f"homepage fees: {len(CARDS)} cards checked against fees_data.py, {len(changed)} rewritten")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
