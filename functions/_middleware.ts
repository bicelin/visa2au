// Served via Pages middleware: the CSP exceeds Cloudflare Pages' _headers
// per-header limit, so _headers would drop it. Regenerate via scripts/update_csp_hashes.py.
//
// Also implements Markdown for Agents (content negotiation) and host-aware
// discovery JSON. NOTE: Cloudflare's native "Markdown for Agents" zone setting
// (`content_converter`) requires a Pro+ plan; this edge implementation works on
// the Free plan and serves our own .md twins (see scripts/build_md_twins.py)
// instead of a lossy HTML conversion.
const CSP = `default-src 'self'; script-src 'self' blob: https://unpkg.com https://cdn.jsdelivr.net https://*.daily.co https://static.cloudflareinsights.com https://challenges.cloudflare.com https://js.stripe.com 'sha256-+1J2+2fCat5nUe17rIrsP+rXlE2fbGvBJYpzmYu6w+g=' 'sha256-+WLdnPy5eD7GJx8IfFQ9u/eTPi6KkQVIJX1V/FGA89c=' 'sha256-2+BknAVMKCuZmvxsGEd/+ZQOFy4h7NKA2qHfD4U5fy4=' 'sha256-3Qc8Jcph364kGAGDx+ahc8BAwo9JJZQ//mcihVCTHhs=' 'sha256-8KDkI21VPRWgn74R//hfvqXctgxmXrIe97HnbofWy00=' 'sha256-A1TEAvoyDjT8tRJj2jXi8Tegm9oreCsim6PzVRzAFjI=' 'sha256-E04FOytnPze7zA2XKrp791jBqsPzmHmfWwDt/j3tTSA=' 'sha256-FNWn02YgQ428780FknGu3NuNkE5sAbQVcCstbpkEK+U=' 'sha256-FW1rViSqn4tUXCCfX5Auaj4BholRHkgb/3uOu/LQFRs=' 'sha256-Fv2b9fVssVYAn7iEevw0s1nDkwxmA4UJlAZldhzFliE=' 'sha256-MBZQ0lgWp8917ENO5mWpDfzJNzw6T99h5UDLp7wo4FA=' 'sha256-O7+W+/YyBomP6rAHgoUAgREIG+Ojo2uLH6WfKpfOkWs=' 'sha256-PIuMPKl4VjHv6A66CSVJSV3wETbM1jFz44RyBGmyEYo=' 'sha256-PnnqsHGdLrw5VH9txKce80LPBNl0rQB9kNb2MYeU9KE=' 'sha256-TCEtetC9GmzQkvzXwI24s4VIW6wmM75eGCovMJLU5Zo=' 'sha256-UK6n2eu2Buqt2n5+IKddJOqFKBxq5n6FsUbIdo3amys=' 'sha256-UOhRVowBAj+2fmIftx+e3PEpB4vaG/rMyIfdcbVIbJs=' 'sha256-Ur7zuzbNNAZsC1tky+7sqtsGaK+I6GT0nymoDI0apgQ=' 'sha256-YPAbtqab2JyfyyHB93O0Y2HhzCBP9/dpI1SDoMrJ1yU=' 'sha256-hVr9vBvAFoit0F4x0vE8m0LAU47L/hPXAnkvDZmLNnU=' 'sha256-kV5CBj3fbuLAIfK6metH0BA96jJESz7FYQ3WO0gjj8E=' 'sha256-kjhYp0l1gvha4rONirWHZeoKDrYMng3hYiZ86UFk9Ls=' 'sha256-kv9OrLNw889Rh2HU+GbaRATi0dtJ5gre1yu37IRWB2s=' 'sha256-lZmPC/NquWx1mI0F4uS1sbwCojaslbP4T0cWbC8TH84=' 'sha256-oDm7c0ct0giQOqBZ6EHiURk2gaoxVsrUANTUU6xoy+A=' 'sha256-tWYc6b6j7bocxpW0sbqnFZjTjLJow+NUG/hG8rVG+h0=' 'sha256-tWrZk505esNIN7dagLHajNlO1ncSfQRz1AzYG0LRmyA=' 'sha256-trVyIpoPg+HMqd7mrBPkTowWQe9HNLuzZ2MG4Lw+fcY=' 'sha256-vQbyopcBO6PYJr9Nj2zNx9R7jVQJRXsI8TSoFHAmbdc=' 'sha256-w4Euu9hwZiKURm9SwGeCAAlP4aaRbDLJDlfRg6dg6ow=' 'sha256-yJdJWUO91yHebJzNc8q4f3STMry5vR/OO3oZ0LWnaJg='; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; media-src 'self' https:; worker-src 'self' blob:; child-src blob: https://*.daily.co https://challenges.cloudflare.com https://js.stripe.com; frame-src https://*.daily.co https://challenges.cloudflare.com https://js.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://visa2au.mmportal.cloud; upgrade-insecure-requests`;

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
  if (!isStaging && /^\/agoda(\/|$)/.test(url.pathname)) {
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
