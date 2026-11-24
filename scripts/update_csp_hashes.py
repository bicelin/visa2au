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

# External script sources allowed alongside 'self' (keep in sync with needs).
#
# NOTE: googletagmanager.com, google-analytics.com AND mc.yandex.* were REMOVED from
# script-src. GA4 is served by Cloudflare Zaraz at the edge, and the Yandex Metrika
# counter was dropped entirely, so the browser loads no third-party analytics script
# at all. Removing them narrows the CSP attack surface. Do not re-add any of them
# unless client-side analytics is deliberately reintroduced.
# (Zaraz's GA4 component talks to Google via connect-src, which stays 'self' https:.)
SCRIPT_ALLOW = [
    "'self'",
    "blob:",
    "https://unpkg.com",
    "https://cdn.jsdelivr.net",
    "https://*.daily.co",
    "https://static.cloudflareinsights.com",
    "https://challenges.cloudflare.com",
    "https://js.stripe.com",
]

# Inline event-handler attribute values via 'unsafe-hashes' — NONE now (voice button
# click is JS-bound in align step 14), so 'unsafe-hashes' is dropped from the CSP.
INLINE_HANDLERS = []


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
            # hash the exact raw body — CSP hashes include leading/trailing whitespace
            if body:
                hashes.add("'sha256-" + sha256_b64(body) + "'")
    return hashes
def main():
    script_hashes = sorted(inline_script_hashes())
    handler_hashes = sorted("'sha256-" + sha256_b64(h) + "'" for h in INLINE_HANDLERS)
    if not script_hashes:
        print("WARN: no inline executable scripts found — nothing to hash")
    new_src = "script-src " + " ".join(SCRIPT_ALLOW + handler_hashes + script_hashes) + ";"

    headers = open(HEADERS, encoding="utf-8").read()
    new_headers = re.sub(r"script-src [^;]*;", new_src, headers, count=1)
    if new_headers == headers:
        print("NO CHANGE (script-src already tightened); ensuring middleware in sync")
    else:
        open(HEADERS, "w", encoding="utf-8").write(new_headers)
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

    # Pages' _headers drops CSP values over its per-header limit, so also emit a
    # middleware that sets the header at runtime (no size limit). Regenerate both.
    csp_value = re.search(r"Content-Security-Policy: ([^\n]+)", new_headers).group(1).strip()
    mw = '''// Served via Pages middleware: the CSP exceeds Cloudflare Pages' _headers
// per-header limit, so _headers would drop it. Regenerate via scripts/update_csp_hashes.py.
//
// Also implements Markdown for Agents (content negotiation) and host-aware
// discovery JSON. NOTE: Cloudflare's native "Markdown for Agents" zone setting
// (`content_converter`) requires a Pro+ plan; this edge implementation works on
// the Free plan and serves our own .md twins (see scripts/build_md_twins.py)
// instead of a lossy HTML conversion.
const CSP = `%CSP%`;

// Discovery documents that hardcode an origin. Rewritten to the request origin
// so staging serves staging URLs and production serves production URLs from the
// same committed file (staging URLs were leaking into prod discovery).
const ORIGIN_REWRITE = [
  "/.well-known/oauth-protected-resource",
  "/.well-known/oauth-authorization-server",
  "/.well-known/ai-catalog.json",
  "/.well-known/agent-card.json",
  "/.well-known/mcp/server-card.json",
  "/.well-known/agent-skills/index.json",
];
// Text/markdown agent surfaces that also embed absolute staging URLs in the
// committed source. Without these, production advertised staging.* to crawlers
// and AI agents (auth.md, api-catalog and the agent-skills docs).
const ORIGIN_REWRITE_TEXT = [
  "/auth.md",
  "/llms.txt",
  "/.well-known/api-catalog",
  "/.well-known/ard.json",
];
function wantsOriginRewrite(pathname: string): boolean {
  if (ORIGIN_REWRITE.includes(pathname)) return true;
  if (ORIGIN_REWRITE_TEXT.includes(pathname)) return true;
  if (pathname.startsWith("/.well-known/agent-skills/")) return true;
  return false;
}

// Parse an Accept header and decide whether the client prefers markdown to HTML.
function prefersMarkdown(accept: string): boolean {
  if (!accept) return false;
  const parts = accept.split(",").map((raw) => {
    const bits = raw.trim().split(";");
    let q = 1;
    for (const param of bits.slice(1)) {
      const m = param.trim().match(/^q=([0-9.]+)$/i);
      if (m) q = parseFloat(m[1]);
    }
    return { type: bits[0].trim().toLowerCase(), q };
  });
  const md = parts.find((p) => p.type === "text/markdown");
  if (!md || md.q === 0) return false;
  // A bare Accept: text/markdown (no text/html, no */*) means markdown.
  const html = parts.find((p) => p.type === "text/html" || p.type === "*/*");
  if (!html) return true;
  return md.q > html.q;
}

const INTERNAL_COOKIE = "v2au_internal";

/**
 * Internal traffic flag.
 *
 * TPG hands the office a rotating public IP (and shifts between pools, CGNAT and
 * mobile), so an IP allowlist in GA4 — or a Cloudflare rule that disables Zaraz —
 * is not a stable answer: it either stops matching after a lease or excludes a
 * whole ISP range of real visitors. One first-party cookie marks the browser
 * instead: `/internal` sets it for a year, `/internal?off=1` clears it, and the
 * analytics tag is blocked for browsers carrying it (Zaraz cookie rule).
 */
function internalFlag(url: URL): Response {
  const off = url.searchParams.get("off") === "1";
  const cookie = off
    ? `${INTERNAL_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`
    : `${INTERNAL_COOKIE}=1; Path=/; Max-Age=31536000; Secure; SameSite=Lax`;
  const line = off
    ? "Internal traffic flag cleared — this browser counts in analytics again."
    : "Internal traffic flag set — this browser is excluded from analytics for one year.";
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
      `<meta name="robots" content="noindex,nofollow">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>Internal traffic flag</title></head><body>` +
      `<p>${line}</p><p><a href="/">Back to the site</a></p></body></html>`,
    {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
        "set-cookie": cookie,
        // Same hardening as every page, and it also blocks the analytics tag's
        // injected inline script here: the flag page must not count as a visit.
        "content-security-policy": CSP,
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "referrer-policy": "strict-origin-when-cross-origin",
      },
    },
  );
}

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  // Answers before any page logic; the route is noindexed and unlinked.
  if (url.pathname === "/internal") return internalFlag(url);
  const host = url.hostname;
  // Staging / preview deployments must never be indexed — they otherwise
  // compete with the production domain and split ranking signals.
  // Production hosts (visa2.au, www.visa2.au) never match these predicates.
  const isStaging = host.startsWith("staging.") || host.endsWith(".pages.dev");
  // Discovery JSON should always advertise the apex, never a www. host.
  const origin = host.startsWith("www.") ? url.protocol + "//" + host.slice(4) : url.origin;

  // ---------- internal test harness is never reachable in production
  // app/agoda/ is the Agora group-call rig: staff-code field, admin diagnostics,
  // hardcoded test channel. Pages publishes app/ verbatim with no build step, so
  // it cannot be filtered at compile time - gate it by host instead. Staging and
  // preview keep it for voice testing; production returns a plain 404.
  if (!isStaging && /^\\/agoda(\\/|$)/.test(url.pathname)) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ---------- Markdown for Agents: Accept: text/markdown -> <path>.md twin
  if (prefersMarkdown(request.headers.get("Accept") || "")) {
    const mdPath = url.pathname.endsWith("/") ? url.pathname + "index.md" : url.pathname + ".md";
    const mdRes = await next(new Request(new URL(mdPath, url), request));
    if (mdRes.ok && (mdRes.headers.get("content-type") || "").includes("markdown")) {
      const body = await mdRes.text();
      const headers = new Headers(mdRes.headers);
      headers.set("Content-Type", "text/markdown; charset=utf-8");
      headers.set("Vary", "Accept");
      // Rough token estimate (no tokenizer in the worker); ~4 chars per token.
      headers.set("x-markdown-tokens", String(Math.ceil(body.length / 4)));
      if (isStaging) headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(body, { status: 200, headers });
    }
    // No twin for this path — fall through and serve HTML.
  }

  const res = await next();
  const ct = res.headers.get("content-type") || "";

  // ---------- host-aware structured discovery documents
  if (wantsOriginRewrite(url.pathname) && (ct.includes("json") || ct.includes("text/"))) {
    const body = (await res.text())
      .split("https://staging.visa2.au").join(origin)
      .split("https://visa2.au").join(origin);
    const headers = new Headers(res.headers);
    headers.set("Vary", "Accept");
    if (isStaging) headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(body, { status: res.status, headers });
  }

  if (!ct.includes("text/html")) {
    // CSP only matters for documents, but the noindex tag must apply to every
    // response (JSON, .md twins, llms.txt, …) or those get indexed instead.
    if (!isStaging) return res;
    const r0 = new Response(res.body, res);
    r0.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r0;
  }

  const r = new Response(res.body, res);
  if (isStaging) r.headers.set("X-Robots-Tag", "noindex, nofollow");
  r.headers.set("Content-Security-Policy", CSP);
  // Render-blocking CSS: hint the stylesheet from the response HEADERS, so the
  // browser can start the fetch before it parses the document. With Cloudflare
  // Early Hints enabled this becomes a 103 preload (no page-weight cost and no
  // inlining); without it the browser still sees the hint as it reads headers.
  const cssPreload = "</_astro/index.DqolKn4r.css>; rel=preload; as=style";
  const existingLink = r.headers.get("Link");
  // The _headers file already advertises api-catalog / llms.txt / oauth relations
  // on every path; append instead of replacing, or HTML pages lose them.
  r.headers.set("Link", existingLink ? existingLink + ", " + cssPreload : cssPreload);
  return r;
};
'''.replace("%CSP%", csp_value)
    mw_path = os.path.join(os.path.dirname(os.path.dirname(HEADERS)), "functions", "_middleware.ts")
    os.makedirs(os.path.dirname(mw_path), exist_ok=True)
    open(mw_path, "w", encoding="utf-8").write(mw)
    print(f"wrote middleware CSP ({len(csp_value)} chars) to {mw_path}")

    print(f"tightened CSP: {len(script_hashes)} script hashes + {len(handler_hashes)} handler hashes; 'unsafe-inline' removed")
    print("verified: every inline script/handler is hashed")


if __name__ == "__main__":
    main()
