#!/usr/bin/env python3
"""Bot Fight efficiency report for visa2au (staging) from Cloudflare Logpush.

Reads firewall_events JSONL pushed to the R2 bucket (via Logpush) and computes
how Super Bot Fight Mode / Bot Fight Mode is performing: how much traffic is
blocked vs allowed, bot-score distribution, and top offenders.

Pure-stdlib (no boto3) — uses the R2 S3-compatible API with SigV4 signing.

Usage:
  R2_ACCOUNT_ID=<id> R2_ACCESS_KEY=... R2_SECRET_KEY=... \
  BUCKET=visa2au-logs python3 bot_stats.py [--days 7] [--json]

Output:
  - prints a human summary (or JSON with --json)
  - writes bot_stats.json in CWD (for later merging into an SEO report)
"""
import sys, os, re, json, time, datetime, hmac, hashlib, urllib.request, urllib.parse, collections

ACCOUNT = os.environ.get("R2_ACCOUNT_ID", "")
ACCESS = os.environ.get("R2_ACCESS_KEY", "")
SECRET = os.environ.get("R2_SECRET_KEY", "")
BUCKET = os.environ.get("BUCKET", "visa2au-logs")
ENDPOINT = f"https://{ACCOUNT}.r2.cloudflarestorage.com" if ACCOUNT else ""
DAYS = 7


def _sign(key, msg):
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()


def _hmac_hex(key, msg):
    return hmac.new(key, msg.encode(), hashlib.sha256).hexdigest()


def s3_request(method, bucket, key="", query=""):
    """SigV4-signed R2 request; returns (status, body)."""
    now = datetime.datetime.utcnow()
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")
    service, region = "s3", "auto"
    payload_hash = hashlib.sha256(b"").hexdigest() if method == "GET" else hashlib.sha256(b"").hexdigest()
    canonical_qs = query or ""
    path = "/" + urllib.parse.quote(bucket) + (("/" + urllib.parse.quote(key)) if key else "")
    canonical_uri = path
    canonical_headers = f"host:{urllib.parse.urlparse(ENDPOINT).netloc}\nx-amz-content-sha256:{payload_hash}\nx-amz-date:{amz_date}\n"
    signed_headers = "host;x-amz-content-sha256;x-amz-date"
    canonical_request = "\n".join([method, canonical_uri, canonical_qs, canonical_headers, signed_headers, payload_hash])
    scope = f"{date_stamp}/{region}/{service}/aws4_request"
    string_to_sign = "\n".join(["AWS4-HMAC-SHA256", amz_date, scope, hashlib.sha256(canonical_request.encode()).hexdigest()])
    k_date = _sign(("AWS4" + SECRET).encode(), date_stamp)
    k_region = _sign(k_date, region)
    k_service = _sign(k_region, service)
    k_signing = _sign(k_service, "aws4_request")
    signature = _hmac_hex(k_signing, string_to_sign)
    auth = f"AWS4-HMAC-SHA256 Credential={ACCESS}/{scope}, SignedHeaders={signed_headers}, Signature={signature}"
    url = f"{ENDPOINT}{path}" + (f"?{query}" if query else "")
    req = urllib.request.Request(url, method=method, headers={
        "Authorization": auth, "x-amz-date": amz_date,
        "x-amz-content-sha256": payload_hash, "Host": urllib.parse.urlparse(ENDPOINT).netloc})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def list_keys(prefix):
    """List object keys under prefix via S3 ListObjectsV2."""
    keys = []
    token = ""
    while True:
        q = "list-type=2&prefix=" + urllib.parse.quote(prefix)
        if token:
            q += "&continuation-token=" + urllib.parse.quote(token)
        status, body = s3_request("GET", BUCKET, query=q)
        if status != 200:
            raise RuntimeError(f"S3 list failed {status}: {body[:200]}")
        for m in re.finditer(r"<Key>([^<]+)</Key>", body):
            keys.append(m.group(1))
        tok = re.search(r"<NextContinuationToken>([^<]+)</NextContinuationToken>", body)
        if not tok:
            break
        token = tok.group(1)
    return keys


def main():
    if not (ACCOUNT and ACCESS and SECRET):
        print("Missing R2_ACCOUNT_ID / R2_ACCESS_KEY / R2_SECRET_KEY env vars", file=sys.stderr)
        sys.exit(2)
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=DAYS)
    prefix = "firewall_events_"
    keys = [k for k in list_keys(prefix)]
    events = []
    for k in keys:
        m = re.search(r"(\d{8})_(\d{6})", k)
        if m:
            ts = datetime.datetime.strptime(m.group(1) + m.group(2), "%Y%m%d%H%M%S")
            if ts < cutoff:
                continue
        status, body = s3_request("GET", BUCKET, key=k)
        if status == 200:
            for line in body.splitlines():
                line = line.strip()
                if line:
                    try:
                        events.append(json.loads(line))
                    except Exception:
                        pass
    if not events:
        print(f"No firewall events found in bucket '{BUCKET}' for the last {DAYS} days.")
        print("Check the Logpush job is running and the R2 credentials/bucket are correct.")
        sys.exit(1)

    acts = collections.Counter()
    bot_buckets = {"definitely-human (80-99)": 0, "likely-human (50-79)": 0,
                   "likely-automated (30-49)": 0, "definitely-automated (0-29)": 0, "no-score": 0}
    blocked_by = collections.Counter()
    top_paths = collections.Counter()
    top_asn = collections.Counter()
    top_country = collections.Counter()
    verified_bots = collections.Counter()
    challenged = 0
    for e in events:
        action = e.get("Action") or e.get("Action") or ""
        acts[action] += 1
        score = e.get("BotScore")
        if score is None or score == "":
            bot_buckets["no-score"] += 1
        elif int(score) <= 29:
            bot_buckets["definitely-automated (0-29)"] += 1
        elif int(score) <= 49:
            bot_buckets["likely-automated (30-49)"] += 1
        elif int(score) <= 79:
            bot_buckets["likely-human (50-79)"] += 1
        else:
            bot_buckets["definitely-human (80-99)"] += 1
        src = e.get("BotScoreSrc") or ""
        if src:
            verified_bots[src] += 1
        top_paths[e.get("ClientRequestPath", "")] += 1
        top_asn[e.get("ClientASN", "")] += 1
        top_country[e.get("ClientCountry", "")] += 1
        if action in ("challenge", "jschallenge", "managed_challenge"):
            challenged += 1

    total = len(events)
    blocked = sum(v for k, v in acts.items() if "block" in k.lower())
    report = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "days": DAYS,
        "total_events": total,
        "actions": dict(acts),
        "bot_score_distribution": bot_buckets,
        "blocked_count": blocked,
        "block_rate_pct": round(100.0 * blocked / total, 2) if total else 0,
        "challenged_count": challenged,
        "top_blocked_paths": top_paths.most_common(10),
        "top_asns": top_asn.most_common(10),
        "top_countries": top_country.most_common(10),
        "bot_score_sources": dict(verified_bots),
    }
    with open("bot_stats.json", "w") as f:
        json.dump(report, f, indent=2, default=str)

    if "--json" in sys.argv:
        print(json.dumps(report, indent=2, default=str))
    else:
        print(f"Bot Fight efficiency — last {DAYS} days")
        print(f"  events: {total}")
        print(f"  actions: {dict(acts)}")
        print(f"  blocked: {blocked} ({report['block_rate_pct']}%)  |  challenged: {challenged}")
        print(f"  bot scores: {bot_buckets}")
        print(f"  top blocked paths: {top_paths.most_common(5)}")
        print("  (full JSON written to bot_stats.json)")


if __name__ == "__main__":
    main()
