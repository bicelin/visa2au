// GET /api/content — agent content API over the deployed markdown twins.
//   ?path=/blog/<slug>&lang=en|ru|fr  → the raw markdown twin (text/markdown)
//   ?list=1                           → JSON index of all posts (all langs)
// Protected by Bearer JWT (RFC 6750) issued by /oauth/token
// (client_credentials, HS256 via WebCrypto — see functions/lib/jwt.ts).
// Env secrets: AGENT_TOKEN_KEY. Discovery: /.well-known/oauth-authorization-server.

import { verifyJwt } from "../lib/jwt";

interface Env {
  ASSETS: Fetcher;
  AGENT_TOKEN_KEY?: string;
}

const ISSUER = "https://staging.visa2.au";
const AUDIENCE = "https://staging.visa2.au/api";
const REALM = 'Bearer realm="api", authorization_uri="https://staging.visa2.au/oauth/token"';

const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string, limit: number): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.reset <= now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    if (hits.size > 10_000) hits.clear();
    return false;
  }
  e.count++;
  return e.count > limit;
}

function json(obj: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function unauthorized(desc: string): Response {
  return json(
    { error: "invalid_token", error_description: desc },
    401,
    { "WWW-Authenticate": `${REALM}, error="invalid_token", error_description="${desc}"` }
  );
}

const LANGS = new Set(["en", "ru", "fr"]);

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (rateLimited(`content:${ip}`, 60)) {
    return json({ error: "rate_limited", error_description: "60 requests/minute exceeded" }, 429);
  }

  // RFC 6750 Bearer token check
  if (!env.AGENT_TOKEN_KEY) {
    return json({ error: "server_error", error_description: "API not configured" }, 500);
  }
  const auth = request.headers.get("Authorization") || "";
  const m = auth.match(/^Bearer (.+)$/i);
  if (!m) {
    return json(
      { error: "unauthorized", error_description: "Bearer token required (see /auth.md)" },
      401,
      { "WWW-Authenticate": REALM }
    );
  }
  const claims = await verifyJwt(m[1].trim(), env.AGENT_TOKEN_KEY, ISSUER, AUDIENCE);
  if (!claims) {
    return unauthorized("Token is invalid, expired, or wrong issuer/audience");
  }
  const scopes = String(claims.scope || "").split(/\s+/);
  if (!scopes.includes("content:read")) {
    return json(
      { error: "insufficient_scope", error_description: "Scope content:read required" },
      403,
      { "WWW-Authenticate": `${REALM}, error="insufficient_scope", scope="content:read"` }
    );
  }

  // ?list=1 → JSON index of all posts
  if (url.searchParams.get("list") === "1") {
    const idxRes = await env.ASSETS.fetch(new Request(new URL("/content-index.json", url).toString()));
    if (!idxRes.ok) return json({ error: "not_found", error_description: "Content index unavailable" }, 404);
    return new Response(idxRes.body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        Vary: "Authorization",
      },
    });
  }

  // ?path=/blog/<slug>&lang=xx → markdown twin via ASSETS (same mapping as _middleware)
  const path = url.searchParams.get("path");
  if (!path) {
    return json(
      { error: "invalid_request", error_description: "Provide ?path=/blog/<slug> or ?list=1" },
      400
    );
  }
  if (!/^\/blog\/[a-z0-9-]+$/.test(path)) {
    return json(
      { error: "invalid_request", error_description: "Only /blog/<slug> paths are served by this API" },
      400
    );
  }
  const lang = url.searchParams.get("lang") || "en";
  if (!LANGS.has(lang)) {
    return json({ error: "invalid_request", error_description: "lang must be en, ru or fr" }, 400);
  }
  const mdPath = (lang === "en" ? "" : `/${lang}`) + path + ".md";
  const mdRes = await env.ASSETS.fetch(new Request(new URL(mdPath, url).toString()));
  if (mdRes.status === 404) {
    return json({ error: "not_found", error_description: `No markdown twin for ${lang}${path}` }, 404);
  }
  const body = await mdRes.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Markdown-Tokens": String(Math.ceil(body.byteLength / 4)),
      "Content-Language": lang,
      Vary: "Authorization",
    },
  });
};
