#!/usr/bin/env python3
"""Resumable full-site PageSpeed Insights sweep for Visa2AU.

Reads every URL from app/sitemap.xml and runs PSI (mobile + desktop) for each,
APPENDING each result as one JSON line to the output file immediately, so the
sweep is resumable and survives timeouts/interruptions. Re-running skips URLs
already present in the output.

Usage:
  PSI_API_KEY=... python3 scripts/psi_sweep.py                    # all sitemap URLs
  PSI_API_KEY=... python3 scripts/psi_sweep.py --host https://staging.visa2.au
  PSI_API_KEY=... python3 scripts/psi_sweep.py --limit 20         # first N
  PSI_API_KEY=... python3 scripts/psi_sweep.py --summary         # just print summary
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
OUT = os.path.join(ROOT, "psi_results.jsonl")


def sitemap_urls(host: str):
    sm = open(os.path.join(ROOT, "app", "sitemap.xml"), encoding="utf-8").read()
    locs = re.findall(r"<loc>([^<]+)</loc>", sm)
    # rewrite prod host -> staging host
    out = []
    for u in locs:
        p = u.replace("https://visa2.au", "")
        out.append(host.rstrip("/") + (p or "/"))
    return out


def done_keys(path):
    keys = set()
    if os.path.isfile(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
                keys.add((r["url"], r["strategy"]))
            except Exception:
                pass
    return keys


def call(url, strategy, key):
    qs = urllib.parse.urlencode({
        "url": url, "strategy": strategy, "category": "performance", "key": key,
    })
    req = urllib.request.Request(f"{API}?{qs}", headers={"User-Agent": "visa2au-psi-sweep"})
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.loads(r.read().decode("utf-8"))
    lr = d.get("lighthouseResult", {})
    a = lr.get("audits", {})
    score = round((lr.get("categories", {}).get("performance", {}).get("score") or 0) * 100)
    def dv(n):
        x = a.get(n) or {}
        return x.get("displayValue", x.get("score"))
    return {
        "url": url, "strategy": strategy, "performance": score,
        "lcp": dv("largest-contentful-paint"), "fcp": dv("first-contentful-paint"),
        "tbt": dv("total-blocking-time"), "cls": dv("cumulative-layout-shift"),
        "si": dv("speed-index"), "ttfb": dv("server-response-time"),
        "console": "OK" if (a.get("errors-in-console") or {}).get("score") in (1, True) else "FAIL",
        "ts": int(time.time()),
    }


def summarize(path):
    rows = []
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if line:
            try:
                rows.append(json.loads(line))
            except Exception:
                pass
    if not rows:
        print("no results yet")
        return
    by = {}
    for r in rows:
        by.setdefault(r["strategy"], []).append(r)
    print(f"{'strategy':8} {'n':>4} {'avg':>5} {'min':>5} {'max':>5} {'<90':>5} {'consoleFAIL':>12}")
    for s in sorted(by):
        v = [r["performance"] for r in by[s]]
        bad = [r for r in by[s] if r["performance"] < 90]
        cf = [r for r in by[s] if r.get("console") == "FAIL"]
        print(f"{s:8} {len(v):>4} {sum(v)/len(v):>5.1f} {min(v):>5} {max(v):>5} {len(bad):>5} {len(cf):>12}")
    # worst offenders
    worst = sorted(rows, key=lambda r: r["performance"])[:12]
    print("\nWORST 12:")
    for r in worst:
        print(f"  {r['performance']:>3} {r['strategy']:8} LCP {str(r['lcp']):>7} TBT {str(r['tbt']):>7} CLS {str(r['cls']):>6} {r['url']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="https://staging.visa2.au")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--out", default=OUT)
    ap.add_argument("--summary", action="store_true")
    ap.add_argument("--strategies", nargs="+", default=["mobile", "desktop"])
    args = ap.parse_args()

    if args.summary:
        summarize(args.out)
        return 0

    key = os.environ.get("PSI_API_KEY", "")
    if not key:
        print("ERROR: set PSI_API_KEY", file=sys.stderr)
        return 2

    urls = sitemap_urls(args.host)
    if args.limit:
        urls = urls[: args.limit]
    already = done_keys(args.out)
    print(f"{len(urls)} URLs, {len(already)} (url,strategy) pairs already done", flush=True)

    todo = [(u, s) for s in args.strategies for u in urls if (u, s) not in already]
    print(f"{len(todo)} PSI calls to make", flush=True)

    fh = open(args.out, "a", encoding="utf-8")
    ok = err = 0
    for i, (u, s) in enumerate(todo, 1):
        try:
            rec = call(u, s, key)
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
            fh.flush()
            ok += 1
            print(f"[{i}/{len(todo)}] {rec['performance']:>3} {s:7} {u}", flush=True)
        except Exception as e:
            err += 1
            print(f"[{i}/{len(todo)}] ERR  {s:7} {u} :: {str(e)[:90]}", flush=True)
        time.sleep(0.4)
    fh.close()
    print(f"\nDONE ok={ok} err={err}", flush=True)
    summarize(args.out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
