// Markdown content negotiation ("Markdown for Agents" without a Pro plan).
// For GET/HEAD requests whose Accept header prefers text/markdown over
// text/html, serve the deployed markdown twin (<path>.md) when one exists.
// Browsers always rank text/html first, so human traffic is unaffected.
// /api/* is never intercepted. Vary: Accept is added to every response.

function withVaryAccept(res: Response): Response {
  const headers = new Headers(res.headers);
  const vary = headers.get("Vary");
  const parts = vary ? vary.split(",").map((v) => v.trim().toLowerCase()) : [];
  if (!parts.includes("accept")) {
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

// Returns true when text/markdown outranks text/html per q-values.
function prefersMarkdown(accept: string): boolean {
  let md = 0;
  let htmlQ = 0;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";");
    let q = 1;
    for (const p of params) {
      const m = p.trim().match(/^q\s*=\s*([0-9.]+)/);
      if (m) q = parseFloat(m[1]);
    }
    const t = type.trim().toLowerCase();
    if (t === "text/markdown") md = Math.max(md, q);
    else if (t === "text/html") htmlQ = Math.max(htmlQ, q);
    else if (t === "text/*" || t === "*/*") htmlQ = Math.max(htmlQ, q);
  }
  return md > 0 && md > htmlQ;
}

export const onRequest: PagesFunction = async (context) => {
  const { request, env, next } = context;

  // Cheap early exit: only GET/HEAD that explicitly prefer markdown.
  const accept = request.headers.get("Accept") || "";
  if (
    (request.method !== "GET" && request.method !== "HEAD") ||
    !accept.toLowerCase().includes("text/markdown") ||
    !prefersMarkdown(accept)
  ) {
    return withVaryAccept(await next());
  }

  const url = new URL(request.url);
  // Never intercept API routes.
  if (url.pathname.startsWith("/api/")) {
    return withVaryAccept(await next());
  }

  // Map the requested page to its markdown twin path.
  let p = url.pathname;
  if (p.endsWith("/")) p += "index"; // "/" -> "/index.md"
  if (p.endsWith(".html")) p = p.slice(0, -".html".length);
  const mdUrl = new URL(p + ".md", url);

  const mdRes = await env.ASSETS.fetch(
    new Request(mdUrl.toString(), { method: "GET" })
  );
  if (mdRes.status === 404) {
    return withVaryAccept(await next());
  }

  const body = await mdRes.arrayBuffer();
  const headers = new Headers(mdRes.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("X-Markdown-Tokens", String(Math.ceil(body.byteLength / 4)));
  const vary = headers.get("Vary");
  const parts = vary ? vary.split(",").map((v) => v.trim().toLowerCase()) : [];
  if (!parts.includes("accept")) {
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }
  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers,
  });
};
