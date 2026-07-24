// POST /oauth/token — OAuth 2.0 client-credentials grant (RFC 6749 §4.4).
// Client authentication: HTTP Basic (client_secret_basic). Issues a compact
// HS256 JWT (iss/aud = staging.visa2.au, scope "content:read", 1h expiry).
// Clients: Pages secret AGENT_CLIENTS as JSON map {"client_id": "secret"}.
// Signing key: Pages secret AGENT_TOKEN_KEY. Staging-grade: static clients,
// no dynamic registration (see /auth.md).

import { signJwt, b64urlDecode } from "../lib/jwt";

interface Env {
  AGENT_CLIENTS?: string;
  AGENT_TOKEN_KEY?: string;
}

const ISSUER = "https://staging.visa2.au";
const AUDIENCE = "https://staging.visa2.au/api";
const TOKEN_TTL_S = 3600;

// Light per-IP rate limiting: 30 token requests / minute (in-memory,
// per-isolate — best effort on Pages).
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

// Constant-time string comparison (for client secrets).
function timingSafeStr(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

function json(obj: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      ...extraHeaders,
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (rateLimited(`token:${ip}`, 30)) {
    return json({ error: "rate_limited", error_description: "Too many requests" }, 429);
  }

  if (!env.AGENT_CLIENTS || !env.AGENT_TOKEN_KEY) {
    return json({ error: "server_error", error_description: "Token endpoint not configured" }, 500);
  }

  // HTTP Basic client authentication
  const auth = request.headers.get("Authorization") || "";
  const m = auth.match(/^Basic (.+)$/i);
  if (!m) {
    return json(
      { error: "invalid_client", error_description: "HTTP Basic client authentication required" },
      401,
      { "WWW-Authenticate": 'Basic realm="oauth"' }
    );
  }
  let clientId: string, clientSecret: string;
  try {
    const decoded = new TextDecoder().decode(b64urlDecode(m[1]));
    const sep = decoded.indexOf(":");
    if (sep < 0) throw new Error("bad");
    clientId = decodeURIComponent(decoded.slice(0, sep));
    clientSecret = decodeURIComponent(decoded.slice(sep + 1));
  } catch {
    return json({ error: "invalid_client", error_description: "Malformed Basic credentials" }, 401, {
      "WWW-Authenticate": 'Basic realm="oauth"',
    });
  }

  let clients: Record<string, string>;
  try {
    clients = JSON.parse(env.AGENT_CLIENTS);
  } catch {
    return json({ error: "server_error", error_description: "Client store misconfigured" }, 500);
  }
  const expected = clients[clientId];
  if (!expected || !timingSafeStr(expected, clientSecret)) {
    return json({ error: "invalid_client", error_description: "Unknown client or bad secret" }, 401, {
      "WWW-Authenticate": 'Basic realm="oauth"',
    });
  }

  // Parse grant request (form-encoded per RFC 6749)
  let form: URLSearchParams;
  try {
    form = new URLSearchParams(await request.text());
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  if (form.get("grant_type") !== "client_credentials") {
    return json({ error: "unsupported_grant_type" }, 400);
  }
  const scope = form.get("scope");
  if (scope && scope !== "content:read") {
    return json({ error: "invalid_scope", error_description: "Only scope content:read is supported" }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt(
    {
      iss: ISSUER,
      aud: AUDIENCE,
      sub: clientId,
      scope: "content:read",
      iat: now,
      exp: now + TOKEN_TTL_S,
    },
    env.AGENT_TOKEN_KEY
  );

  return json({
    access_token: token,
    token_type: "Bearer",
    expires_in: TOKEN_TTL_S,
    scope: "content:read",
  });
};

export const onRequestGet: PagesFunction = async () =>
  json({ error: "invalid_request", error_description: "POST required" }, 405, { Allow: "POST" });
