#!/usr/bin/env python3
"""Weekly Google index watch for visa2.au.

Sweeps every URL in the live sitemap through the Search Console URL Inspection
API and reports what changed since the previous run: pages that became indexed,
pages that dropped out, and pages still unknown to Google.

Why this exists: GSC's Coverage screen reports counts for a *mixed* set of
current and legacy URLs (345 the last time we looked, against 148 in the
sitemap), so the aggregate hides whether the pages we actually publish are
indexed. Per-URL verdicts don't hide anything.

State lives in ~/.hermes/cache/scratch/gsc_index_watch/:
    prev.csv   the last sweep (url, verdict, coverage, last_crawl, checked_at)
    history.csv  append-only log of every sweep, one row per URL per run

Usage:
    python3 scripts/gsc_index_watch.py            # sweep + print delta
    python3 scripts/gsc_index_watch.py --limit 10 # quick probe (10 URLs)
    python3 scripts/gsc_index_watch.py --no-save  # do not update state

Requires: ~/.hermes/secrets/gsc-service-account.json with the property's
Search Console access (sc-domain:visa2.au).
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import pathlib
import re
import sys
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

SITE = "sc-domain:visa2.au"
SITEMAP = "https://visa2.au/sitemap.xml"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/140.0 Safari/537.36"
)
STATE = pathlib.Path.home() / ".hermes/cache/scratch/gsc_index_watch"
SECRET = pathlib.Path.home() / ".hermes/secrets/gsc-service-account.json"
INDEXED = "Submitted and indexed"


def sitemap_urls() -> list[str]:
    req = urllib.request.Request(SITEMAP, headers={"User-Agent": UA})
    xml = urllib.request.urlopen(req, timeout=60).read().decode()
    return re.findall(r"<loc>(.*?)</loc>", xml)


def token() -> str:
    from google.auth.transport.requests import Request
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(
        str(SECRET), scopes=["https://www.googleapis.com/auth/webmasters"]
    )
    creds.refresh(Request())
    return creds.token


def pages_report(tok: str, days: int = 28) -> None:
    """Impressions and clicks per page — the content side of the same picture.

    A page can be indexed and still earn nothing: position 40+ or zero clicks at a
    good position both mean the title/snippet, not the URL, is the problem.
    """
    end = dt.date.today() - dt.timedelta(days=3)  # GSC finalises 2-3 days late
    start = end - dt.timedelta(days=days)
    body = json.dumps(
        {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": ["page"],
            "rowLimit": 250,
        }
    ).encode()
    req = urllib.request.Request(
        f"https://searchconsole.googleapis.com/webmasters/v3/sites/{SITE.replace(':', '%3A')}/searchAnalytics/query",
        data=body,
        headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
    )
    rows = json.load(urllib.request.urlopen(req, timeout=90)).get("rows", [])
    if not rows:
        print(f"  no search-analytics rows for {start}..{end}")
        return
    clicks = sum(r["clicks"] for r in rows)
    impressions = sum(r["impressions"] for r in rows)
    print(f"  search performance {start}..{end}: {clicks:.0f} clicks / {impressions:.0f} impressions")
    top = sorted(rows, key=lambda r: -r["impressions"])[:6]
    print("  top pages by impressions:")
    for r in top:
        print(f"    {int(r['impressions']):5d} imp {int(r['clicks']):3d} clk  pos {r['position']:5.1f}  {r['keys'][0]}")
    ctr = [r for r in rows if r["position"] <= 20 and r["clicks"] == 0 and r["impressions"] >= 30]
    if ctr:
        print("  ranked in the top 20 but never clicked (title/snippet job):")
        for r in sorted(ctr, key=lambda r: -r["impressions"])[:6]:
            print(f"    {int(r['impressions']):5d} imp  pos {r['position']:5.1f}  {r['keys'][0]}")


def inspect(url: str, tok: str) -> dict:
    body = json.dumps(
        {"inspectionUrl": url, "siteUrl": SITE, "languageCode": "en-AU"}
    ).encode()
    req = urllib.request.Request(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        data=body,
        headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
    )
    try:
        res = json.load(urllib.request.urlopen(req, timeout=90))
        st = res.get("inspectionResult", {}).get("indexStatusResult", {}) or {}
        return {
            "url": url,
            "verdict": st.get("verdict", ""),
            "coverage": st.get("coverageState", ""),
            "last_crawl": (st.get("lastCrawlTime") or "")[:10],
        }
    except Exception as exc:  # quota, network, revoked access
        return {"url": url, "verdict": "ERROR", "coverage": str(exc)[:120], "last_crawl": ""}


def load_prev() -> dict[str, dict]:
    path = STATE / "prev.csv"
    if not path.exists():
        return {}
    with path.open(encoding="utf-8") as fh:
        return {row["url"]: row for row in csv.DictReader(fh)}


def save(rows: list[dict]) -> None:
    STATE.mkdir(parents=True, exist_ok=True)
    fields = ["url", "verdict", "coverage", "last_crawl"]
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    with (STATE / "prev.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    history = STATE / "history.csv"
    new = not history.exists()
    with history.open("a", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields + ["checked"])
        if new:
            w.writeheader()
        for row in rows:
            w.writerow({**row, "checked": stamp})


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="inspect only the first N URLs")
    ap.add_argument("--no-save", action="store_true", help="do not update state files")
    ap.add_argument("--pages-days", type=int, default=28, help="window for the search-performance block")
    args = ap.parse_args()

    urls = sitemap_urls()
    if args.limit:
        urls = urls[: args.limit]
    if not urls:
        print("no URLs in the sitemap — aborting")
        return 1

    tok = token()
    with ThreadPoolExecutor(max_workers=10) as pool:
        rows = list(pool.map(lambda u: inspect(u, tok), urls))

    prev = load_prev()
    counts = Counter(r["coverage"] for r in rows)
    became = [r for r in rows if r["coverage"] == INDEXED and prev.get(r["url"], {}).get("coverage") != INDEXED]
    lost = [r for r in rows if r["coverage"] != INDEXED and prev.get(r["url"], {}).get("coverage") == INDEXED]
    unknown = [r for r in rows if "unknown" in r["coverage"].lower()]
    crawled = [r for r in rows if "discovered" in r["coverage"].lower()]

    print(f"Google index watch · {len(rows)} sitemap URLs · {dt.date.today().isoformat()}")
    print(f"  indexed: {counts.get(INDEXED, 0)}")
    for state, n in sorted(counts.items(), key=lambda kv: -kv[1]):
        if state != INDEXED:
            print(f"  {n:3d}  {state}")
    if prev:
        print(f"  delta vs previous run: +{len(became)} newly indexed, -{len(lost)} dropped out")
        for r in became:
            print(f"    + {r['url']}")
        for r in lost:
            print(f"    - {r['url']}  ({r['coverage']})")
    else:
        print("  first run: no previous sweep to compare against")
    if unknown:
        print(f"  unknown to Google ({len(unknown)}): " + ", ".join(u["url"].replace("https://visa2.au", "") for u in unknown[:8]))
    if crawled:
        print(f"  discovered, not yet crawled ({len(crawled)}): " + ", ".join(u["url"].replace("https://visa2.au", "") for u in crawled[:8]))

    if not args.no_save:
        save(rows)
        print(f"  saved → {STATE/'prev.csv'}")

    try:
        pages_report(tok, days=args.pages_days)
    except Exception as exc:  # analytics permission is separate from inspection
        print(f"  search performance unavailable: {exc}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
