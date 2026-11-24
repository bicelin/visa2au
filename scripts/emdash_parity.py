#!/usr/bin/env python3
"""Compare an EmDash content entry against the hand-authored HTML page it models.

Bidirectional parity: every text fragment in EmDash should be traceable in the page,
and every heading in the page should be represented in EmDash. Read-only.

Usage:
    emdash_parity.py <slug> [--json FILE]
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = os.environ.get("EMDASH_URL", "https://v2au-emdash.bicelin.workers.dev")
PROJECT = os.environ.get(
    "EMDASH_PROJECT", "7a7958ad-b2c8-43ff-b31f-cd0b3002c4fb"
)
TOKEN_FILE = os.path.expanduser("~/.hermes/secrets/emdash_pat")


def norm(text: str) -> str:
    """Normalise for comparison: unescape, drop markup, collapse whitespace."""
    text = html.unescape(text)
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2014", "-").replace("\u2013", "-")
    text = text.replace("\u00a0", " ")
    return re.sub(r"\s+", " ", text).strip().lower()


def page_text(path: str) -> str:
    """Visible text of an HTML page, plus its head metadata.

    Meta descriptions and the title live in attributes, so they survive only if
    captured before tags are stripped; an SEO field would otherwise read as lost
    on every page.
    """
    raw = open(path, encoding="utf-8", errors="ignore").read()
    meta = re.findall(
        r'(?is)<meta[^>]+content\s*=\s*"([^"]*)"', raw
    ) + re.findall(r"(?is)<title[^>]*>(.*?)</title>", raw)
    raw = re.sub(r"(?is)<(script|style|noscript)\b.*?</\1>", " ", raw)
    raw = re.sub(r"(?s)<!--.*?-->", " ", raw)
    body = re.sub(r"(?s)<[^>]+>", " ", raw)
    return norm(" ".join(meta) + " " + body)


def flatten(value, out: list[str]) -> None:
    """Collect every meaningful string from a field value."""
    if isinstance(value, str):
        if len(norm(value)) >= 12:
            out.append(value)
    elif isinstance(value, dict):
        for k, v in value.items():
            if k in {"_key", "_type", "style", "listItem", "level", "href", "slug"}:
                continue
            flatten(v, out)
    elif isinstance(value, list):
        for item in value:
            flatten(item, out)


def headings(path: str) -> list[str]:
    raw = open(path, encoding="utf-8", errors="ignore").read()
    found = re.findall(r"(?is)<h[123][^>]*>(.*?)</h[123]>", raw)
    return [norm(h) for h in (re.sub(r"(?s)<[^>]+>", " ", h) for h in found)]


def load(slug: str, json_file: str | None) -> dict:
    if json_file:
        payload = json.load(open(json_file, encoding="utf-8"))
    else:
        token = open(TOKEN_FILE, encoding="utf-8").read().strip()
        listing = json.loads(
            subprocess.run(
                [
                    "curl", "-sS", "--max-time", "30",
                    f"{API}/_emdash/api/content/visas?limit=100",
                    "-H", f"Authorization: Bearer {token}",
                ],
                capture_output=True, text=True, check=True,
            ).stdout
        )
        items = listing["data"]["items"]
        match = [i for i in items if i.get("slug") == slug]
        if not match:
            sys.exit(f"slug not found in EmDash: {slug}")
        payload = json.loads(
            subprocess.run(
                [
                    "curl", "-sS", "--max-time", "30",
                    f"{API}/_emdash/api/content/visas/{match[0]['id']}",
                    "-H", f"Authorization: Bearer {token}",
                ],
                capture_output=True, text=True, check=True,
            ).stdout
        )
    body = payload.get("data", {})
    return body.get("item", body)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--json", dest="json_file")
    args = ap.parse_args()

    html_path = os.path.join(ROOT, "app", "visas", f"{args.slug}.html")
    if not os.path.exists(html_path):
        sys.exit(f"no page for slug: {html_path}")

    entry = load(args.slug, args.json_file)
    fields = entry.get("data") or {}
    text = page_text(html_path)

    print(f"slug:   {args.slug}")
    print(f"page:   {os.path.relpath(html_path, ROOT)} "
          f"({os.path.getsize(html_path):,} bytes)")
    print(f"fields: {len(fields)} in EmDash")
    print()

    total = missing = 0
    field_missing: dict[str, list[str]] = {}
    for name, value in sorted(fields.items()):
        fragments: list[str] = []
        flatten(value, fragments)
        if not fragments:
            continue
        got = [f for f in fragments if norm(f) in text]
        lost = [f for f in fragments if norm(f) not in text]
        total += len(fragments)
        missing += len(lost)
        flag = "ok " if not lost else "LOST"
        print(f"  {flag} {name:16} {len(got):>3}/{len(fragments):<3}")
        if lost:
            field_missing[name] = lost

    print()
    pct = 100.0 * (total - missing) / total if total else 0.0
    print(f"EmDash -> page: {total - missing}/{total} fragments present ({pct:.1f}%)")
    for name, lost in field_missing.items():
        print(f"  {name}: {len(lost)} missing, e.g. {norm(lost[0])[:90]!r}")

    print()
    hs = [h for h in headings(html_path) if len(h) >= 4]
    absent = [h for h in hs if h not in norm(json.dumps(fields, ensure_ascii=False))]
    print(f"page headings -> EmDash: {len(hs) - len(absent)}/{len(hs)} represented")
    for h in absent:
        print(f"  unmodelled heading: {h[:80]!r}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
