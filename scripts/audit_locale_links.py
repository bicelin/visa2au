#!/usr/bin/env python3
"""Audit every internal link on /ru/ and /fr/ pages.

Classifies each <a href> target as:
  LOCALE_OK    — same-locale page (target exists)
  LOCALE_HOME  — falls back to the locale homepage
  EN_NO_TWIN   — points at an EN page with NO localized twin (fix: create twin)
  EN_FALLBACK  — EN target whose locale twin exists (fix: should point to twin)
  BROKEN       — target does not exist anywhere
Ignores: mailto/tel/#/javascript, external links, in-page anchors.
"""
import os
import posixpath
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
BASE = "https://visa2.au"
LOCALES = ("ru", "fr")

HREF_RE = re.compile(r'<a\b[^>]*?\bhref="([^"]*)"', re.S)


def resolve(rel_dir, href):
    if href.startswith(("mailto:", "tel:", "#", "javascript:", "data:", "//")):
        return None
    if href.startswith(("http://", "https://")):
        if not href.startswith(BASE + "/"):
            return None
        p = href[len(BASE) + 1:]
    else:
        p = href
    p = p.split("#")[0].split("?")[0]
    return posixpath.normpath(posixpath.join(rel_dir, p))


def exists(p):
    return os.path.isfile(os.path.join(APP, p))


def main():
    totals = {"LOCALE_OK": 0, "LOCALE_HOME": 0, "EN_NO_TWIN": 0, "EN_FALLBACK": 0, "BROKEN": 0}
    missing_twins = {}  # en page -> count of links wanting it
    for lang in LOCALES:
        root = os.path.join(APP, lang)
        for dirpath, _, files in os.walk(root):
            for f in sorted(files):
                if not f.endswith(".html"):
                    continue
                path = os.path.join(dirpath, f)
                rel = os.path.relpath(path, APP)
                rel_dir = posixpath.dirname(rel)
                html = open(path, encoding="utf-8").read()
                page = {"LOCALE_OK": 0, "LOCALE_HOME": 0, "EN_NO_TWIN": 0, "EN_FALLBACK": 0, "BROKEN": 0}
                examples = {"EN_NO_TWIN": [], "EN_FALLBACK": [], "BROKEN": []}
                for m in HREF_RE.finditer(html):
                    href = m.group(1)
                    target = resolve(rel_dir, href)
                    if target is None:
                        continue
                    first = target.split("/", 1)[0]
                    if first in LOCALES:
                        cls = "LOCALE_OK" if exists(target) else "BROKEN"
                    else:
                        twin = posixpath.join(lang, target)
                        if target.endswith(".html") and exists(twin):
                            cls = "EN_FALLBACK"
                            missing_twins.setdefault(target, []).append(rel)
                        elif exists(target):
                            cls = "EN_NO_TWIN"
                            missing_twins.setdefault(target, []).append(rel)
                            if len(examples["EN_NO_TWIN"]) < 3:
                                examples["EN_NO_TWIN"].append(f"{rel} -> {href}")
                        else:
                            cls = "BROKEN"
                            if len(examples["BROKEN"]) < 3:
                                examples["BROKEN"].append(f"{rel} -> {href}")
                    page[cls] += 1
                    totals[cls] += 1
                if any(page.values()):
                    print(f"{rel}: OK={page['LOCALE_OK']} HOME={page['LOCALE_HOME']} "
                          f"EN_NO_TWIN={page['EN_NO_TWIN']} EN_FALLBACK={page['EN_FALLBACK']} BROKEN={page['BROKEN']}")
                    for k, v in examples.items():
                        if page[k]:
                            print(f"    {k}: " + "; ".join(v))
    print("\n== TOTALS ==")
    for k, v in totals.items():
        print(f"  {k}: {v}")
    print("\n== EN pages wanted by locales (count) ==")
    for en, refs in sorted(missing_twins.items(), key=lambda kv: -len(kv[1])):
        print(f"  {en}  x{len(refs)}   (from e.g. {refs[0]})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
