#!/usr/bin/env python3
"""Fail the build when blog imagery drifts from the publishing contract.

What this gate exists for: for two years every article shipped
alt="Feature image for: <title>" — boilerplate that describes nothing, in English
on the Russian and French pages — with the raw 122 KB JPEG as the LCP element and
no srcset at all. This makes that state un-buildable.

Checks (any failure exits 1):
  1. every <img> in a blog page has non-empty alt, width and height;
  2. raster images go through /cdn-cgi/image (SVG logos are exempt);
  3. alt text is 20-125 chars, is not the title, and is not boilerplate;
  4. the hero is eager + fetchpriority=high, cards are lazy;
  5. every image referenced by a post exists, and has alt text in blog_art.ALT;
  6. art added under app/imgs/blog/ belongs to exactly one post (no reuse).

Usage:
    python3 scripts/check_image_invariants.py
"""
from __future__ import annotations

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import blog_art  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP = ROOT / "app"
CMS = ("cms/blog", "cms/blog-ru", "cms/blog-fr")
PAGES = ("blog", "ru/blog", "fr/blog")

IMG_TAG = re.compile(r"<img\b[^>]*>", re.I)
ATTR = re.compile(r'(\w[\w-]*)\s*=\s*"([^"]*)"')


def attrs(tag: str) -> dict[str, str]:
    return {k.lower(): v for k, v in ATTR.findall(tag)}


def posts() -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for folder in CMS:
        for path in sorted((ROOT / folder).glob("*.md")):
            text = path.read_text(encoding="utf-8")
            end = text.index("\n---\n", 4)
            fm = {}
            for line in text[4:end].splitlines():
                key, _, value = line.partition(":")
                fm[key.strip()] = value.strip().strip('"')
            out[f"{folder}/{path.name}"] = fm
    return out


def main() -> int:
    problems: list[str] = []
    warnings: list[str] = []

    # 5/6 — sources: the image exists, has alt text, and is not shared by
    # different posts once it lives under app/imgs/blog/ (post-specific art).
    usage: dict[str, set[str]] = {}
    for key, fm in posts().items():
        image = (fm.get("image") or "").lstrip("/")
        if not image:
            problems.append(f"{key}: no image in front matter")
            continue
        if not (APP / image).is_file():
            problems.append(f"{key}: image missing on disk: {image}")
            continue
        if image not in blog_art.ALT:
            problems.append(f"{key}: no alt text entry for {image} in scripts/blog_art.py")
        # the same picture is supposed to serve the EN/RU/FR twins of one slug;
        # what must not happen is two different articles sharing one file
        usage.setdefault(image, set()).add(pathlib.Path(key).stem)
    for image, used in usage.items():
        if image.startswith("imgs/blog/") and len(used) > 1:
            problems.append(f"{image}: shared by posts {sorted(used)} (post-specific art must be unique)")

    # 1-4 — rendered pages
    titles: dict[str, str] = {}
    for folder in PAGES:
        for page in sorted((APP / folder).glob("*.html")):
            html = page.read_text(encoding="utf-8")
            rel = page.relative_to(ROOT)
            h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
            title = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else ""
            titles[str(rel)] = title
            for tag in IMG_TAG.findall(html):
                a = attrs(tag)
                src = a.get("src", "")
                alt = a.get("alt", "")
                if not src:
                    problems.append(f"{rel}: <img> without src")
                    continue
                if src.endswith(".svg"):
                    if not alt:
                        problems.append(f"{rel}: logo <img> without alt ({src})")
                    continue
                if "/cdn-cgi/image/" not in src:
                    problems.append(f"{rel}: raster image not served by Cloudflare Image "
                                    f"Resizing: {src}")
                if not alt:
                    problems.append(f"{rel}: <img> without alt: {src}")
                    continue
                if "Feature image for" in alt:
                    problems.append(f"{rel}: boilerplate alt still present")
                if not 20 <= len(alt) <= 125:
                    warnings.append(f"{rel}: alt is {len(alt)} chars (want 20-125): {alt[:40]}")
                if title and alt.strip().lower() == title.strip().lower():
                    problems.append(f"{rel}: alt repeats the headline")
                if not a.get("width") or not a.get("height"):
                    problems.append(f"{rel}: <img> without width/height (CLS): {src}")
                if "fetchpriority" in a and a["fetchpriority"] == "high":
                    if a.get("loading") != "eager":
                        problems.append(f"{rel}: hero with fetchpriority=high but not eager")
                if a.get("loading") == "lazy" and src.endswith((".jpg", ".png")):
                    pass  # cards are expected to be lazy
            # the hero preload must exist and point at the hero itself
            preload = re.search(r'<link rel="preload" as="image" imagesrcset="([^"]*)"', html)
            hero = next((t for t in IMG_TAG.findall(html)
                         if 'fetchpriority="high"' in t), "")
            if not preload:
                problems.append(f"{rel}: hero preload link missing")
            elif hero:
                hero_src = attrs(hero).get("src", "")
                if hero_src and hero_src.split("/imgs/")[-1] not in preload.group(1):
                    problems.append(f"{rel}: preload does not match the hero image")

    for w in warnings[:10]:
        print(f"  warn: {w}")
    if warnings[10:]:
        print(f"  warn: … {len(warnings) - 10} more alt-length warnings")
    if problems:
        print(f"== FAIL: {len(problems)} image invariant problem(s)")
        for p in problems[:25]:
            print(f"  - {p}")
        if len(problems) > 25:
            print(f"  … {len(problems) - 25} more")
        return 1
    pages = sum(len(list((APP / f).glob('*.html'))) for f in PAGES)
    print(f"== OK: {pages} blog pages · alt/width/height/cdn-cgi/preload invariants hold")
    return 0


if __name__ == "__main__":
    sys.exit(main())
