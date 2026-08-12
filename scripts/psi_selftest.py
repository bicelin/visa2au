#!/usr/bin/env python3
"""PageSpeed Insights self-test for Visa2AU.

Calls the PSI API (v5 /runPagespeed) directly — no browser, no MCP — for the
site's key pages on mobile + desktop, and reports Core Web Vitals + score,
flagging any performance regression.

Usage:
  PSI_API_KEY=... python3 scripts/psi_selftest.py                # default pages
  PSI_API_KEY=... python3 scripts/psi_selftest.py --url https://staging.visa2.au/ru/ --strategy desktop
  PSI_API_KEY=... python3 scripts/psi_selftest.py --min-score 90 --json   # gate + JSON for cron

Key (secret, never commit): create one in Google Cloud Console ->
APIs & Services -> Credentials -> API key, and enable the
"PageSpeed Insights API".  Free tier: 25,000 queries/day.
"""
from __future__ import annotations

import argparse, json, os, sys, time, urllib.parse, urllib.request

API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

DEFAULT_URLS = [
    # top-level
    "https://staging.visa2.au/",
    "https://staging.visa2.au/visas",
    "https://staging.visa2.au/employers",
    "https://staging.visa2.au/contact",
    "https://staging.visa2.au/team",
    "https://staging.visa2.au/pricing",
    "https://staging.visa2.au/urgent-visa-help",
    "https://staging.visa2.au/blog",
    # core visa guides
    "https://staging.visa2.au/visas/partner-visa-820-801",
    "https://staging.visa2.au/visas/skilled-independent-189-190",
    "https://staging.visa2.au/visas/skills-in-demand-482",
    "https://staging.visa2.au/visas/student-visa-500",
    "https://staging.visa2.au/visas/visitor-visa-600",
    "https://staging.visa2.au/visas/work-holiday-417-462",
    "https://staging.visa2.au/visas/parent-visa-103",
    "https://staging.visa2.au/visas/skilled-regional-494",
    # locales
    "https://staging.visa2.au/ru/",
    "https://staging.visa2.au/fr/",
]

# audits we report (display value + a pass-ish flag where available)
KEY_AUDITS = [
    "first-contentful-paint", "largest-contentful-paint",
    "total-blocking-time", "cumulative-layout-shift", "speed-index",
    "render-blocking-resources", "errors-in-console", "unused-javascript",
    "modern-image-formats", "uses-optimized-images",
]


def fetch(url: str, strategy: str, key: str) -> dict:
    qs = urllib.parse.urlencode({
        "url": url, "strategy": strategy, "category": "performance", "key": key,
    })
    req = urllib.request.Request(f"{API}?{qs}", headers={"User-Agent": "visa2au-psi-selftest"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.loads(r.read().decode("utf-8"))


def display_value(audits: dict, name: str) -> str:
    a = audits.get(name) or {}
    return a.get("displayValue", a.get("score", "n/a"))


def run(url: str, strategy: str, key: str) -> dict:
    d = fetch(url, strategy, key)
    lr = d.get("lighthouseResult", {})
    audits = lr.get("audits", {})
    cat = lr.get("categories", {}).get("performance", {})
    score = round((cat.get("score") or 0) * 100)
    row = {"url": url, "strategy": strategy, "performance": score,
           "ttfb": display_value(audits, "server-response-time"),
           "fcp": display_value(audits, "first-contentful-paint"),
           "lcp": display_value(audits, "largest-contentful-paint"),
           "tbt": display_value(audits, "total-blocking-time"),
           "cls": display_value(audits, "cumulative-layout-shift"),
           "si": display_value(audits, "speed-index"),
           "renderBlocking": display_value(audits, "render-blocking-resources"),
           "consoleErrors": "OK" if (audits.get("errors-in-console") or {}).get("score") in (1, True) else "FAIL",
           }
    return row


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", action="append", help="override target URLs (repeatable)")
    ap.add_argument("--strategy", choices=["mobile", "desktop"], action="append", default=["mobile", "desktop"])
    ap.add_argument("--min-score", type=int, default=0, help="exit non-zero if any score below this")
    ap.add_argument("--json", action="store_true", help="emit JSON only (for cron)")
    ap.add_argument("--key", default=os.environ.get("PSI_API_KEY", ""))
    args = ap.parse_args()

    if not args.key:
        print("ERROR: set PSI_API_KEY (Google Cloud API key with PageSpeed Insights API enabled)", file=sys.stderr)
        return 2

    urls = args.url or DEFAULT_URLS
    rows, failures = [], []
    for strategy in args.strategy:
        for u in urls:
            try:
                rows.append(run(u, strategy, args.key))
                time.sleep(1)  # be gentle with the free-tier quota
            except Exception as e:
                failures.append({"url": u, "strategy": strategy, "error": str(e)})

    if args.json:
        print(json.dumps({"results": rows, "failures": failures}, indent=2))
    else:
        print(f"{'URL':38} {'strat':7} {'score':>5} {'LCP':>7} {'TBT':>6} {'CLS':>6} {'renderblk':>10}")
        for r in rows:
            print(f"{r['url'][:37]:38} {r['strategy']:7} {r['performance']:>5} "
                  f"{str(r['lcp']):>7} {str(r['tbt']):>6} {str(r['cls']):>6} {str(r['renderBlocking']):>10}")
        if failures:
            print("\nFAILURES:", file=sys.stderr)
            for f in failures:
                print(f"  {f['url']} [{f['strategy']}] {f['error']}", file=sys.stderr)
        if args.min_score:
            for r in rows:
                if r["performance"] < args.min_score:
                    print(f"REGRESSION: {r['url']} [{r['strategy']}] score {r['performance']} < {args.min_score}", file=sys.stderr)

    bad = [r for r in rows if r["performance"] < args.min_score] or failures
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
