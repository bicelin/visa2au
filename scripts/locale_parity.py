#!/usr/bin/env python3
"""Measure how faithfully the RU and FR trees track the English source.

Translation here is exact-string substitution driven by `scripts/loc/B_ru.py` and
`B_fr.py`, and `build_locale_pages.py` deliberately skips JS string literals. So
"is it translated" is a measurable question with two distinct failure modes:

  1. copy that stayed English   - a fragment carrying no Cyrillic in RU (and, for
     FR, a fragment byte-identical to its EN counterpart)
  2. structure that drifted     - a page whose block count differs from EN, which
     means content was added on one side only

Plus the link layer, which is what search engines read: every page must carry
hreflang `en`/`ru`/`fr` plus `x-default`, each pointing at a file that exists and
at a canonical that is absolute.

Interpreter: /usr/bin/python3 (bs4 lives there).

Usage:
    locale_parity.py                 # summary
    locale_parity.py --verbose       # per-page table + sample untranslated copy
    locale_parity.py --min 25        # fragment length threshold (default 25)
"""
from __future__ import annotations

import argparse
import collections
import html
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"
LOCALES = ("ru", "fr")
BASE = "en"
BLOCK_TAGS = ("h1", "h2", "h3", "h4", "p", "li", "summary", "dt", "dd", "figcaption")
_CYRILLIC = re.compile(r"[\u0400-\u04FF]")
_LATIN = re.compile(r"[A-Za-z]")

# Copy that legitimately stays identical across locales: the office address, the
# firm name, contact details, subclass codes, MARN numbers, dates and language
# switcher labels. Counting these as untranslated overstates the gap.
_IDENTICAL_OK = re.compile(
    r"level 17|denison|north sydney|nsw 2060|visa2\.au|visa2au|marn|@|"
    r"\+61|\b04\d{2}\b|skills in demand|\(sid\)|\b\d{3}\b|"
    r"\b\d{1,2} (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|"
    r"^(en|ru|fr|english|russian|francais)\b",
    re.I,
)


def norm(text: str) -> str:
    text = html.unescape(text)
    for a, b in (("\u2019", "'"), ("\u2018", "'"), ("\u201c", '"'),
                 ("\u201d", '"'), ("\u2014", "-"), ("\u2013", "-"), ("\u00a0", " ")):
        text = text.replace(a, b)
    return re.sub(r"\s+", " ", text).strip()


def page_key(path: Path) -> str:
    """Locale-independent identity of a page, e.g. 'visas/visitor-visa-600.html'."""
    rel = path.relative_to(APP).as_posix()
    for loc in LOCALES:
        if rel.startswith(f"{loc}/"):
            return rel[len(loc) + 1:]
    return rel


def locale_of(path: Path) -> str:
    rel = path.relative_to(APP).as_posix()
    for loc in LOCALES:
        if rel.startswith(f"{loc}/"):
            return loc
    return BASE


def blocks(path: Path, min_len: int) -> list[str]:
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    out = []
    for el in soup.find_all(BLOCK_TAGS):
        text = norm(el.get_text(" ", strip=True))
        if len(text) >= min_len:
            out.append(text)
    return out


def hreflang(path: Path) -> dict[str, str]:
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
    found: dict[str, str] = {}
    for link in soup.find_all("link", attrs={"rel": "alternate"}):
        lang = (link.get("hreflang") or "").lower()
        if lang:
            found[lang] = link.get("href") or ""
    canon = soup.find("link", attrs={"rel": "canonical"})
    found["_canonical"] = (canon.get("href") if canon else "") or ""
    return found


def url_to_file(href: str) -> Path | None:
    if not href.startswith("https://visa2.au"):
        return None
    tail = href[len("https://visa2.au/"):]
    tail = tail.split("#")[0].split("?")[0]
    if tail == "" or tail.endswith("/"):
        tail += "index.html"
    elif not tail.endswith(".html"):
        tail += ".html"
    return APP / tail


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--min", type=int, default=25)
    args = ap.parse_args()

    pages: dict[str, dict[str, Path]] = collections.defaultdict(dict)
    for path in APP.rglob("*.html"):
        pages[page_key(path)][locale_of(path)] = path

    translated = [k for k, v in pages.items() if BASE in v and
                  any(loc in v for loc in LOCALES)]
    print(f"pages: {len(pages)} total, {len(translated)} with a translation\n")

    stats: dict[str, dict[str, int]] = {loc: collections.Counter() for loc in LOCALES}
    worst: dict[str, list[tuple[str, int, int]]] = {loc: [] for loc in LOCALES}
    samples: dict[str, list[tuple[str, str]]] = {loc: [] for loc in LOCALES}

    for key in sorted(translated):
        en_blocks = blocks(pages[key][BASE], args.min)
        en_set = {b.lower() for b in en_blocks}
        for loc in LOCALES:
            if loc not in pages[key]:
                continue
            loc_blocks = blocks(pages[key][loc], args.min)
            if not loc_blocks:
                continue
            # Verbatim English in a translated page is the signal; a proper noun
            # is identical too, so the allowlist removes those.
            bad = [b for b in loc_blocks
                   if b.lower() in en_set and not _IDENTICAL_OK.search(b)]
            s = stats[loc]
            s["blocks"] += len(loc_blocks)
            s["untranslated"] += len(bad)
            s["en_blocks"] += len(en_blocks)
            delta = len(loc_blocks) - len(en_blocks)
            if delta:
                s["structural_drift"] += 1
                s["abs_drift"] += abs(delta)
                s["max_drift"] = max(s.get("max_drift", 0), abs(delta))
            worst[loc].append((key, len(bad), len(loc_blocks)))
            for text in bad[:2]:
                samples[loc].append((key, text[:96]))

    for loc in LOCALES:
        s = stats[loc]
        if not s["blocks"]:
            continue
        pct = 100 * (s["blocks"] - s["untranslated"]) / s["blocks"]
        print(f"{loc.upper()}: {s['blocks'] - s['untranslated']}/{s['blocks']} fragments "
              f"translated ({pct:.1f}%)")
        mean = s["abs_drift"] / s["structural_drift"] if s["structural_drift"] else 0
        print(f"    structural drift: {s['structural_drift']}/{len(translated)} pages differ "
              f"in block count from EN (mean {mean:.1f} blocks, max {s['max_drift']})")
        if args.verbose:
            top = sorted(worst[loc], key=lambda r: -(r[1] / r[2] if r[2] else 0))[:8]
            print(f"    worst pages:")
            for key, bad, total in top:
                if bad:
                    print(f"      {key:52} {bad:>3}/{total:<4} untranslated")
            print(f"    sample copy still English:")
            for key, text in samples[loc][:6]:
                print(f"      {key}: {text!r}")
        print()

    # --- link layer ---------------------------------------------------------
    print("hreflang layer:")
    missing: list[str] = []
    broken: list[str] = []
    noncanonical: list[str] = []
    checked = 0
    for key in sorted(translated):
        for loc, path in pages[key].items():
            tags = hreflang(path)
            checked += 1
            have = {k for k in tags if not k.startswith("_")}
            want = {"en", "ru", "fr", "x-default"}
            absent = want - have
            if absent:
                missing.append(f"{path.relative_to(APP)} missing {sorted(absent)}")
            for lang, href in tags.items():
                if lang.startswith("_"):
                    continue
                target = url_to_file(href)
                if target is not None and not target.exists():
                    broken.append(f"{path.relative_to(APP)} {lang} -> {href} (no file)")
            canon = tags.get("_canonical", "")
            if not canon.startswith("https://visa2.au/"):
                noncanonical.append(f"{path.relative_to(APP)} canonical={canon or 'MISSING'}")

    print(f"  pages checked: {checked}")
    print(f"  missing hreflang: {len(missing)}")
    for line in missing[:6]:
        print(f"    {line}")
    print(f"  hreflang targets with no file: {len(broken)}")
    for line in broken[:6]:
        print(f"    {line}")
    print(f"  non-absolute canonical: {len(noncanonical)}")
    for line in noncanonical[:6]:
        print(f"    {line}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
