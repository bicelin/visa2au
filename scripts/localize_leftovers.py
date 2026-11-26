#!/usr/bin/env python3
"""Apply the translation maps to locale pages that no build step regenerates.

`build_locale_pages.py` regenerates only the eight pages in its `PAGES` list
(contact, visas, employers, pricing, team, privacy, pay, donate). The other RU/FR
twins - `ru/index.html`, `ru/blog/*`, `ru/visas/*` and friends - are static, so
when the English source gains a sentence those pages keep it in English and drift
silently. That is where the leftover-English tail came from.

This is the safety net, not a replacement: it never rewrites translated copy,
because each key is an English source string, so it can only match text that is
still English. Existing translations are left untouched and the pass is idempotent.

The maps themselves come from `build_locale_pages`, so there is one source of
truth for translations and no second copy to fall out of sync.

Interpreter: /usr/bin/python3 (bs4 not required; markup is handled as text).
"""
from __future__ import annotations

import importlib.util
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"
LOCALES = ("ru", "fr")
REBUILT = {"contact", "visas", "employers", "pricing", "team", "privacy", "pay", "donate"}


def load_builder():
    """`build_locale_pages` as a module: one source of truth for the maps."""
    spec = importlib.util.spec_from_file_location(
        "blp", ROOT / "scripts" / "build_locale_pages.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    blp = load_builder()
    maps = blp.load_maps()

    total_files = total_hits = 0
    touched: list[tuple[str, int]] = []

    for loc in LOCALES:
        tmap = maps[loc]["MAP"]
        if not tmap:
            continue
        for path in sorted((APP / loc).rglob("*.html")):
            rel = path.relative_to(APP / loc).as_posix()
            if rel[:-5] in REBUILT:
                continue  # already regenerated from the same maps
            src = path.read_text(encoding="utf-8")
            start = src.find("<main")
            end = src.find("</main>", start)
            if start == -1 or end == -1:
                continue
            inner = src[start:end]
            new = blp.translate_main(inner, tmap)
            total_files += 1
            if new == inner:
                continue
            hits = sum(1 for k in tmap if k in inner)
            total_hits += hits
            path.write_text(src[:start] + new + src[end:], encoding="utf-8")
            touched.append((f"{loc}/{rel}", hits))

    print(f"== localize leftovers: {total_files} locale page(s) inspected, "
          f"{len(touched)} updated, {total_hits} source string(s) translated")
    for name, hits in touched[:12]:
        print(f"   {name:52} {hits:>3} string(s)")
    if len(touched) > 12:
        print(f"   ... and {len(touched) - 12} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
