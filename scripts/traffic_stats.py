#!/usr/bin/env python3
"""Traffic analytics report for visa2au (staging) from Cloudflare GraphQL.

Uses the Zone Analytics: Read token to query httpRequests1dGroups (365-day
retention, free plan) — requests/day, top paths, countries, HTTP statuses.
Emits a structured JSON for later merging into an SEO report.

Usage:
  CF_API_TOKEN=<zone analytics read token> ZONE=<zone_id> python3 traffic_stats.py [--days 30] [--json]
"""
import sys, os, json, time, datetime, urllib.request, urllib.parse

TOKEN = os.environ.get("CF_API_TOKEN", "")
ZONE = os.environ.get("ZONE", "598d0203e59a1fc8f604b9a85a5d2194")
DAYS = int(next((a for a in sys.argv if a.isdigit()), 30))


def graphql(query):
    req = urllib.request.Request(
        "https://api.cloudflare.com/client/v4/graphql",
        method="POST",
        data=json.dumps({"query": query}).encode(),
        headers={"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode() or "{}")


def main():
    if not TOKEN:
        print("Missing CF_API_TOKEN env (Zone Analytics:Read)", file=sys.stderr)
        sys.exit(2)
    gte = (datetime.date.today() - datetime.timedelta(days=DAYS)).isoformat()
    # Free-plan httpRequests1dGroups exposes only the `date` dimension
    # (country/path/status breakdowns are plan-gated). We report request volume
    # trends; the richer breakdowns require Pro+/dashboard analytics.
    q = f'''query {{
  viewer {{ zones(filter: {{zoneTag: "{ZONE}"}}) {{
    byDay: httpRequests1dGroups(limit: {DAYS}, filter: {{date_geq: "{gte}"}}) {{
      sum {{ requests }} dimensions {{ date }}
    }}
  }} }}
}}'''
    data = graphql(q)
    try:
        zones = data["data"]["viewer"]["zones"][0]
    except (KeyError, IndexError, TypeError):
        print("GraphQL error:", json.dumps(data.get("errors", data))[:400], file=sys.stderr)
        sys.exit(1)

    by_day = [{"label": d["dimensions"]["date"], "requests": d["sum"]["requests"]} for d in zones["byDay"]]
    total = sum(r["requests"] for r in by_day)
    avg = round(total / max(len(by_day), 1))
    peak = max(by_day, key=lambda r: r["requests"]) if by_day else {}
    report = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "days": DAYS,
        "total_requests": total,
        "avg_requests_per_day": avg,
        "peak_day": peak,
        "requests_by_day": by_day,
        "note": "Free plan exposes only daily request volume; country/path/bot breakdown requires Pro+ or the dashboard.",
    }
    with open("traffic_stats.json", "w") as f:
        json.dump(report, f, indent=2)

    if "--json" in sys.argv:
        print(json.dumps(report, indent=2))
    else:
        print(f"Traffic — last {DAYS} days")
        print(f"  total: {total}  |  avg/day: {avg}")
        if peak:
            print(f"  peak: {peak['requests']} on {peak['label']}")
        print("  (full JSON -> traffic_stats.json; free plan = request volume only)")


if __name__ == "__main__":
    main()
