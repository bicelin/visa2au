// Served via Pages middleware: the CSP exceeds Cloudflare Pages' _headers
// per-header limit, so _headers would drop it. Regenerate via scripts/update_csp_hashes.py.
//
// Also implements Markdown for Agents (content negotiation) and host-aware
// discovery JSON. NOTE: Cloudflare's native "Markdown for Agents" zone setting
// (`content_converter`) requires a Pro+ plan; this edge implementation works on
// the Free plan and serves our own .md twins (see scripts/build_md_twins.py)
// instead of a lossy HTML conversion.
const CSP = `default-src 'self'; script-src 'self' blob: https://unpkg.com https://cdn.jsdelivr.net https://*.daily.co https://static.cloudflareinsights.com https://challenges.cloudflare.com https://js.stripe.com https://mc.yandex.ru https://mc.yandex.net https://mc.yandex.com 'sha256-+xm/cl7w04e6D4Jxr/blGe5FGYltVFeOqO/Y5nXELK0=' 'sha256-0wClGbGlLn7PQ446/nMrQIYNuPh5ogv0ubUo2DOdG6w=' 'sha256-2+BknAVMKCuZmvxsGEd/+ZQOFy4h7NKA2qHfD4U5fy4=' 'sha256-3Qc8Jcph364kGAGDx+ahc8BAwo9JJZQ//mcihVCTHhs=' 'sha256-63R59nlkKwyNj6v2oj6ub/VlClsUHteHq4KBt/bfFBI=' 'sha256-8KDkI21VPRWgn74R//hfvqXctgxmXrIe97HnbofWy00=' 'sha256-A1TEAvoyDjT8tRJj2jXi8Tegm9oreCsim6PzVRzAFjI=' 'sha256-E04FOytnPze7zA2XKrp791jBqsPzmHmfWwDt/j3tTSA=' 'sha256-F7G/QvBzd73kqNQZiihtrVEhd/fBU4TelkcFa1LVbac=' 'sha256-FNWn02YgQ428780FknGu3NuNkE5sAbQVcCstbpkEK+U=' 'sha256-Fv2b9fVssVYAn7iEevw0s1nDkwxmA4UJlAZldhzFliE=' 'sha256-GuCarPNKYix76zmNCJ9EVwtOkDosVvNPytMimKTLVC8=' 'sha256-H7o//z46HEAc0JNF/JsJAuWitdfyJLsJMTVIugW2YUY=' 'sha256-Hf0Z2PfGSlAPa2vId/lttm3GrQF2RudpbvZP9BFUduM=' 'sha256-LQYsITp/gKgSkBYC3ky/TWQOQWOqydU2p/TJlsX8UVw=' 'sha256-OsnFlBR1Z22kaUGXI6zhFyqPXB++h9M4jfSOGdc8rHs=' 'sha256-PnnqsHGdLrw5VH9txKce80LPBNl0rQB9kNb2MYeU9KE=' 'sha256-UK6n2eu2Buqt2n5+IKddJOqFKBxq5n6FsUbIdo3amys=' 'sha256-UOhRVowBAj+2fmIftx+e3PEpB4vaG/rMyIfdcbVIbJs=' 'sha256-Ur7zuzbNNAZsC1tky+7sqtsGaK+I6GT0nymoDI0apgQ=' 'sha256-bgDQPJcuRzGf2J+/PjvmNhc0EhDYBMNKYJaAbTnoVSM=' 'sha256-fFB1v6iqVMZnVtEfMCJfqfYrKCf1zxVjUdLu1Oi/tiA=' 'sha256-j7860xPExEBHYmkcJp1gb63TzQQQOMs4l2wKco28Ils=' 'sha256-j9EVrNp/hs7p5KhZXXY8cYmrlOfJOyWvodhTdAvWOSs=' 'sha256-kjhYp0l1gvha4rONirWHZeoKDrYMng3hYiZ86UFk9Ls=' 'sha256-piKn/BMciMMX+j1n/XDhoTDVzdtV0nfAoYOn/FMWBPA=' 'sha256-rsyDFW1W7WcbgcWsCP36jHvlJtSqCNNXMo+yEWnzj38=' 'sha256-trVyIpoPg+HMqd7mrBPkTowWQe9HNLuzZ2MG4Lw+fcY=' 'sha256-w4Euu9hwZiKURm9SwGeCAAlP4aaRbDLJDlfRg6dg6ow=' 'sha256-yJdJWUO91yHebJzNc8q4f3STMry5vR/OO3oZ0LWnaJg=' 'sha256-zlnl3okIlL6j+kdPCOKcBQ2NL1N0NqLiLAHoVygfkqc=' 'sha256-zrsy1XcNzoxQgnPbPoC5+ncv2DCQ2B1tEEyci9Y5dLs='; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; media-src 'self' https:; worker-src 'self' blob:; child-src blob: https://*.daily.co https://challenges.cloudflare.com https://js.stripe.com; frame-src https://*.daily.co https://challenges.cloudflare.com https://js.stripe.com https://mc.yandex.ru https://mc.yandex.net https://mc.yandex.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://visa2au.mmportal.cloud; upgrade-insecure-requests`;

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

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const host = url.hostname;
  // Staging / preview deployments must never be indexed — they otherwise
  // compete with the production domain and split ranking signals.
  // Production hosts (visa2.au, www.visa2.au) never match these predicates.
  const isStaging = host.startsWith("staging.") || host.endsWith(".pages.dev");
  // Discovery JSON should always advertise the apex, never a www. host.
  const origin = host.startsWith("www.") ? url.protocol + "//" + host.slice(4) : url.origin;

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
  if (ORIGIN_REWRITE.includes(url.pathname) && ct.includes("json")) {
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
  return r;
};
