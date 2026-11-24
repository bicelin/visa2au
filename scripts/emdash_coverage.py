#!/usr/bin/env python3
"""Measure how much of each visa page's prose the EmDash model actually holds.

The companion script `emdash_parity.py` answers "does every value the CMS holds
appear on the page". This answers the harder question: "is every paragraph on the
page present in the CMS". Forward parity can be perfect while the model holds a
small fraction of the page, so both directions are needed before a page can be
generated from the CMS.

Three fragment classes are excluded from the denominator, because they are not
visa-entry content and storing them would duplicate another collection:

  blog teaser   cards inside <article><section> that carry a publication date, so
                they belong to the blog collection and are rendered by reference
  journey step  the <li> joins "N title description", while the entry stores the
                title and description as separate repeater subfields
  hero tagline  template copy under the <h1>; it has no field at all, so it is
                reported separately as work remaining

Interpreter: /usr/bin/python3 (bs4 lives there).

Usage:
    emdash_coverage.py --all
    emdash_coverage.py parent-visa-103
    emdash_coverage.py --all --lenient    # exclude hero taglines from the gap
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "app" / "visas"
API = os.environ.get("EMDASH_URL", "https://v2au-emdash.bicelin.workers.dev")
TOKEN_FILE = Path.home() / ".hermes" / "secrets" / "emdash_pat"

_DATE = re.compile(
    r"\b\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}\b"
)


def norm(text: str) -> str:
    text = html.unescape(text)
    for a, b in (
        ("\u2019", "'"), ("\u2018", "'"), ("\u201c", '"'),
        ("\u201d", '"'), ("\u2014", "-"), ("\u2013", "-"), ("\u00a0", " "),
    ):
        text = text.replace(a, b)
    return re.sub(r"\s+", " ", text).strip().lower()


def fetch(slug: str | None) -> dict[str, dict]:
    """Entries from the running instance, keyed by slug (or one of them)."""
    token = TOKEN_FILE.read_text(encoding="utf-8").strip()

    def curl(url: str) -> dict:
        out = subprocess.run(
            ["curl", "-sS", "--max-time", "45", url,
             "-H", f"Authorization: Bearer {token}"],
            capture_output=True, text=True, check=True,
        ).stdout
        return json.loads(out)

    listing = curl(f"{API}/_emdash/api/content/visas?limit=100")
    items = listing["data"]["items"]
    if slug:
        items = [i for i in items if i.get("slug") == slug]
    return {i["slug"]: curl(f"{API}/_emdash/api/content/visas/{i['id']}")["data"]["item"]
            for i in items if i.get("slug")}


def classify(path: Path, item: dict) -> dict[str, list[str]]:
    """Bucket every page paragraph: modelled, an excluded class, or still absent."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    main = soup.find("main")
    if main is None:
        return {}

    fields = item["data"]
    blob = norm(json.dumps(item, ensure_ascii=False))
    steps = [(norm(s.get("title", "")), norm(s.get("description", "")))
             for s in (fields.get("journey_steps") or [])]

    teasers: set[int] = set()
    for section in main.find_all("section"):
        if _DATE.search(section.get_text(" ", strip=True)):
            for el in section.find_all(["p", "li"]):
                teasers.add(id(el))

    buckets: dict[str, list[str]] = {}
    for el in main.find_all(["p", "li"]):
        if el.find_parent(["nav", "footer", "aside"]):
            continue
        text = norm(el.get_text(" ", strip=True))
        if len(text) < 45 or re.fullmatch(r"[\d\W]+", text):
            continue
        if text in blob:
            key = "modelled"
        elif id(el) in teasers:
            key = "blog teaser"
        elif any(title and desc and desc in text and title in text
                 for title, desc in steps):
            key = "journey step"
        elif ("mt-3" in " ".join(el.get("class") or [])
              and "max-w-2xl" in " ".join(el.get("class") or [])):
            key = "hero tagline"
        else:
            key = "absent"
        buckets.setdefault(key, []).append(text)
    return buckets


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug", nargs="?")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--lenient", action="store_true",
                    help="treat hero taglines as template chrome, not a gap")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()

    if not args.slug and not args.all:
        ap.error("give a slug or --all")

    entries = fetch(None if args.all else args.slug)
    if not entries:
        sys.exit("no matching entries")

    totals: dict[str, int] = {}
    per_page: list[tuple[str, int, int, int]] = []
    absent_samples: list[tuple[str, str]] = []

    for slug in sorted(entries):
        path = PAGES / f"{slug}.html"
        if not path.exists():
            print(f"  skip {slug}: no page")
            continue
        buckets = classify(path, entries[slug])
        modelled = len(buckets.get("modelled", []))
        excluded = len(buckets.get("blog teaser", [])) + len(buckets.get("journey step", []))
        tagline = len(buckets.get("hero tagline", []))
        absent = len(buckets.get("absent", []))
        for key in ("modelled", "blog teaser", "journey step", "hero tagline", "absent"):
            totals[key] = totals.get(key, 0) + len(buckets.get(key, []))
        # A tagline counts as a gap by default: it is real page copy with no field.
        denominator = modelled + absent + (0 if args.lenient else tagline)
        per_page.append((slug, modelled, denominator, absent))
        for text in buckets.get("absent", [])[:3]:
            absent_samples.append((slug, text[:100]))

    print(f"{'slug':34} {'modelled':>14}")
    for slug, modelled, denominator, absent in sorted(
            per_page, key=lambda r: (r[1] / r[2] if r[2] else 1)):
        pct = 100 * modelled / denominator if denominator else 0.0
        print(f"  {slug:32} {modelled:>4}/{denominator:<4} {pct:5.1f}%")

    total = sum(totals.values())
    modelled = totals.get("modelled", 0)
    denominator = total - totals.get("blog teaser", 0) - totals.get("journey step", 0)
    if args.lenient:
        denominator -= totals.get("hero tagline", 0)
    print(f"\nfragment accounting across {len(per_page)} pages:")
    for key in ("modelled", "journey step", "blog teaser", "hero tagline", "absent"):
        if totals.get(key):
            print(f"  {key:14} {totals[key]:>4}")
    print(f"  {'total':14} {total:>4}")
    print(f"\nmodelled {modelled}/{total} = {100 * modelled / total:.2f}% of all paragraphs")
    print(f"modelled {modelled}/{denominator} = "
          f"{100 * modelled / denominator:.2f}% of content that must be modelled")

    if args.verbose and absent_samples:
        print("\nstill absent:")
        for slug, text in absent_samples:
            print(f"  {slug}: {text}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
