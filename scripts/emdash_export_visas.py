#!/usr/bin/env python3
"""Export the site's visa pages into an EmDash seed file.

Direction of travel: the site is the source of truth for the first import. This reads the
committed HTML and produces an EmDash seed (collection model + content entries), which is
then applied to a running EmDash instance.

Why this exists: the 19 visa pages are effectively one template (16 of them share an
identical structural skeleton), with per-page content in fixed blocks — a 4-step journey,
eligibility list, document checklist, FAQ accordion, an "at a glance" <dl>, and related
links. That shape maps onto EmDash collections/repeaters, so the content can be modelled
rather than re-typed.

Interpreter: /usr/bin/python3 (bs4 lives there; the CI installs it explicitly).

Usage:
    /usr/bin/python3 scripts/emdash_export_visas.py --out /path/to/visas.seed.json
    /usr/bin/python3 scripts/emdash_export_visas.py --out ... --slug parent-visa-103
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

APP = Path(__file__).resolve().parent.parent / "app" / "visas"

# ---------------------------------------------------------------------------
# Collection model, derived from the real pages (see EMDASH_ASSESSMENT.md §5)
# ---------------------------------------------------------------------------
COLLECTION = {
    "slug": "visas",
    "label": "Visas",
    "labelSingular": "Visa",
    "urlPattern": "/visas/{slug}",
    "supports": ["drafts", "revisions", "preview", "search", "seo"],
    "fields": [
        {"slug": "title", "label": "Title", "type": "string", "required": True, "searchable": True},
        # Subclass numbers must never diverge between locales.
        {"slug": "subclass_code", "label": "Subclass code", "type": "string",
         "translatable": False, "searchable": True},
        {"slug": "lede", "label": "Lede", "type": "text"},
        {"slug": "overview", "label": "Overview", "type": "portableText", "searchable": True},
        {"slug": "journey_steps", "label": "Journey steps", "type": "repeater",
         "validation": {"maxItems": 8, "subFields": [
             {"slug": "title", "label": "Title", "type": "string", "required": True},
             {"slug": "description", "label": "Description", "type": "text"}]}},
        {"slug": "eligibility", "label": "Eligibility requirements", "type": "portableText",
         "searchable": True},
        {"slug": "documents", "label": "Document checklist", "type": "portableText"},
        {"slug": "faq", "label": "FAQ", "type": "repeater",
         "validation": {"maxItems": 20, "subFields": [
             {"slug": "question", "label": "Question", "type": "string", "required": True},
             {"slug": "answer", "label": "Answer", "type": "text", "required": True}]}},
        # Powers the existing <dl> "At a glance" block.
        {"slug": "at_a_glance", "label": "At a glance", "type": "repeater",
         "validation": {"maxItems": 10, "subFields": [
             {"slug": "label", "label": "Label", "type": "string", "required": True},
             {"slug": "value", "label": "Value", "type": "string", "required": True}]}},
        {"slug": "related", "label": "Related pathways", "type": "repeater",
         "validation": {"maxItems": 10, "subFields": [
             {"slug": "label", "label": "Label", "type": "string", "required": True},
             {"slug": "slug", "label": "Target slug", "type": "string", "required": True}]}},
        # SEO limits are enforced by check_seo_invariants.py, so encode them here.
        {"slug": "seo_title", "label": "SEO title", "type": "string",
         "validation": {"maxLength": 60}},
        {"slug": "seo_description", "label": "SEO description", "type": "text",
         "validation": {"maxLength": 160}},
    ],
}


def _pt_bullets(items: list[str], key_prefix: str) -> list[dict]:
    """Portable Text bullet list — EmDash stores rich text as structured JSON, not HTML."""
    blocks = []
    for i, text in enumerate(items):
        blocks.append({
            "_type": "block",
            "style": "normal",
            "listItem": "bullet",
            "level": 1,
            "_key": f"{key_prefix}{i}",
            "children": [{"_type": "span", "text": text, "_key": f"{key_prefix}{i}s"}],
        })
    return blocks


def _pt_paragraphs(items: list[str], key_prefix: str) -> list[dict]:
    blocks = []
    for i, text in enumerate(items):
        blocks.append({
            "_type": "block",
            "style": "normal",
            "_key": f"{key_prefix}{i}",
            "children": [{"_type": "span", "text": text, "_key": f"{key_prefix}{i}s"}],
        })
    return blocks


def _bullets_after(soup_main, heading_re: str) -> list[str]:
    h2 = soup_main.find("h2", string=re.compile(heading_re, re.I))
    if not h2:
        return []
    for sib in h2.find_all_next():
        if sib.name == "h2":
            break
        if sib.name == "ul":
            return [li.get_text(" ", strip=True) for li in sib.find_all("li")]
    return []


def _paras_after(soup_main, heading_re: str) -> list[str]:
    h2 = soup_main.find("h2", string=re.compile(heading_re, re.I))
    if not h2:
        return []
    out = []
    for sib in h2.find_all_next():
        if sib.name == "h2":
            break
        if sib.name == "p":
            txt = sib.get_text(" ", strip=True)
            if txt:
                out.append(txt)
    return out


def extract(path: Path) -> dict | None:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    main = soup.find("main")
    if not main:
        return None

    h1 = main.find("h1")
    title = h1.get_text(strip=True) if h1 else ""

    journey = []
    for ol in main.find_all("ol"):
        for li in ol.find_all("li", recursive=False):
            h3 = li.find("h3")
            if h3:
                p = li.find("p")
                journey.append({
                    "title": h3.get_text(strip=True),
                    "description": p.get_text(" ", strip=True) if p else "",
                })
        if journey:
            break

    faq = []
    for det in main.find_all("details"):
        summary, answer = det.find("summary"), det.find("p")
        if summary and answer:
            span = summary.find("span")
            faq.append({
                "question": (span or summary).get_text(" ", strip=True),
                "answer": answer.get_text(" ", strip=True),
            })

    glance = []
    dl = main.find("dl")
    if dl:
        for div in dl.find_all("div", recursive=False):
            dt, dd = div.find("dt"), div.find("dd")
            if dt and dd:
                glance.append({"label": dt.get_text(" ", strip=True),
                               "value": dd.get_text(" ", strip=True)})

    related = []
    marker = main.find(string=re.compile("Related pathways", re.I))
    if marker:
        ul = marker.find_next("ul")
        if ul:
            for a in ul.find_all("a"):
                related.append({"label": a.get_text(strip=True),
                                "slug": (a.get("href") or "").lstrip("./")})

    seo_title = soup.title.get_text(strip=True) if soup.title else title
    meta = soup.find("meta", attrs={"name": "description"})

    slug = path.stem
    codes = re.findall(r"\d{3}", slug)
    subclass = ", ".join(dict.fromkeys(codes)) if codes else ""

    return {
        "slug": slug,
        "data": {
            "title": title,
            "subclass_code": subclass,
            "lede": (_paras_after(main, "overview") or [""])[0],
            "overview": _pt_paragraphs(_paras_after(main, "overview")[1:], f"{slug}-ov"),
            "journey_steps": journey,
            "eligibility": _pt_bullets(_bullets_after(main, "eligibility requirements"), f"{slug}-el"),
            "documents": _pt_bullets(_bullets_after(main, "document checklist"), f"{slug}-dc"),
            "faq": faq,
            "at_a_glance": glance,
            "related": related,
            "seo_title": seo_title,
            "seo_description": (meta.get("content") if meta else "") or "",
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--slug", help="export a single page (parity check)")
    args = ap.parse_args()

    files = sorted(APP.glob("*.html"))
    if args.slug:
        files = [f for f in files if f.stem == args.slug]
        if not files:
            print(f"ERROR: no such visa page: {args.slug}")
            return 1

    entries, skipped = [], []
    for f in files:
        d = extract(f)
        if not d or not d["data"]["title"]:
            skipped.append(f.stem)
            continue
        entries.append({
            "id": d["slug"],
            "slug": d["slug"],
            "status": "published",
            "data": d["data"],
        })

    seed = {
        "$schema": "https://emdashcms.com/seed.schema.json",
        "version": "1",
        "meta": {
            "name": "Visa2AU visas",
            "description": "Visa pages exported from the static site",
        },
        "collections": [COLLECTION],
        "content": {"visas": entries},
    }

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(seed, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"== exported {len(entries)} visa page(s) -> {out}")
    for e in entries:
        d = e["data"]
        print(f"   {e['slug']:30} journey={len(d['journey_steps'])} elig={len(d['eligibility'])} "
              f"docs={len(d['documents'])} faq={len(d['faq'])} glance={len(d['at_a_glance'])} "
              f"related={len(d['related'])}")
    if skipped:
        print(f"   SKIPPED (no title): {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
