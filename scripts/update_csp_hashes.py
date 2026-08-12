#!/usr/bin/env python3
"""Tighten the CSP: replace 'unsafe-inline' in script-src with sha256 hashes of
every inline executable <script> across the built site, plus the one inline
event handler (voice button) via 'unsafe-hashes'.

Run AFTER align_seo_meta.py so hashes match the final HTML. Deterministic:
CI runs it every build, so future inline-script edits regenerate the hashes
instead of breaking the page. Fails loudly if any inline script is unhashed.
"""
import base64
import hashlib
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
HEADERS = os.path.join(APP, "_headers")

# External script sources allowed alongside 'self' (keep in sync with needs)
SCRIPT_ALLOW = [
    "'self'",
    "blob:",
    "https://unpkg.com",
    "https://cdn.jsdelivr.net",
    "https://*.elevenlabs.io",
    "https://*.daily.co",
    "https://static.cloudflareinsights.com",
    "https://challenges.cloudflare.com",
    "https://js.stripe.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://mc.yandex.ru",
    "https://mc.yandex.net",
]

# Inline event-handler attribute values that must be allowed (via 'unsafe-hashes')
INLINE_HANDLERS = ["window.__loadVoice(); this.remove();"]


def sha256_b64(text: str) -> str:
    return base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode()


def html_files():
    for root, _dirs, files in os.walk(APP):
        if "_astro" in root or os.path.basename(root).startswith("."):
            continue
        for f in files:
            if f.endswith(".html"):
                yield os.path.join(root, f)


def inline_script_hashes():
    hashes = set()
    for path in html_files():
        html = open(path, encoding="utf-8").read()
        for m in re.finditer(r"<script\b([^>]*)>(.*?)</script>", html, re.S):
            attrs, body = m.group(1), m.group(2)
            if re.search(r"\bsrc\s*=", attrs):
                continue  # external script — governed by host allowlist
            t = re.search(r'type\s*=\s*["\']([^"\']+)["\']', attrs)
            if t and t.group(1).lower() in ("application/ld+json", "application/json"):
                continue  # not executable
            body = body.strip()
            if body:
                hashes.add("'sha256-" + sha256_b64(body) + "'")
    return hashes


def main():
    script_hashes = sorted(inline_script_hashes())
    handler_hashes = sorted("'sha256-" + sha256_b64(h) + "'" for h in INLINE_HANDLERS)
    if not script_hashes:
        print("WARN: no inline executable scripts found — nothing to hash")
    new_src = "script-src " + " ".join(SCRIPT_ALLOW + ["'unsafe-hashes'"] + handler_hashes + script_hashes) + ";"

    headers = open(HEADERS, encoding="utf-8").read()
    new_headers = re.sub(r"script-src [^;]*;", new_src, headers, count=1)
    if new_headers == headers:
        print("NO CHANGE (script-src already tightened?)")
        return

    # verification: every page's inline script + handler must be covered
    covered = set(handler_hashes) | set(script_hashes)
    missing = []
    for path in html_files():
        html = open(path, encoding="utf-8").read()
        for m in re.finditer(r"<script\b([^>]*)>(.*?)</script>", html, re.S):
            attrs, body = m.group(1), m.group(2)
            if re.search(r"\bsrc\s*=", attrs):
                continue
            t = re.search(r'type\s*=\s*["\']([^"\']+)["\']', attrs)
            if t and t.group(1).lower() in ("application/ld+json", "application/json"):
                continue
            body = body.strip()
            if body and "'sha256-" + sha256_b64(body) + "'" not in covered:
                missing.append((path, body[:40]))
        for hm in re.finditer(r'\bon(?:click|load|error|change|submit|mouseover|keyup|input|toggle)\s*=\s*["\']([^"\']*)["\']', html):
            v = hm.group(1)
            if v and "'sha256-" + sha256_b64(v) + "'" not in covered:
                missing.append((path, "on*= " + v[:40]))
    if missing:
        print("FAIL: unhashed inline script/handler found:")
        for p, snippet in missing[:10]:
            print(f"  {p}: {snippet}")
        sys.exit(1)

    open(HEADERS, "w", encoding="utf-8").write(new_headers)
    print(f"tightened CSP: {len(script_hashes)} script hashes + {len(handler_hashes)} handler hashes; 'unsafe-inline' removed")
    print("verified: every inline script/handler is hashed")


if __name__ == "__main__":
    main()
