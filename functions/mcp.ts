// MCP (Model Context Protocol) server — Streamable HTTP, stateless, JSON responses.
// POST /mcp speaks JSON-RPC 2.0 over plain JSON (no SSE; this endpoint is
// stateless and every response is a single JSON object, which is permitted
// for servers that do not stream). No auth: tools expose read-only public
// content only (blog markdown twins + content index).
//
// Methods: initialize, notifications/initialized (202), ping, tools/list,
// tools/call (search_posts, get_post). Unknown method → -32601.
// Server card: /.well-known/mcp/server-card.json (SEP-1649).

interface Env {
  ASSETS: Fetcher;
}

const PROTOCOL_VERSION = "2025-03-26";
const SERVER_INFO = { name: "visa2au-content", version: "0.1.0" };

interface IndexEntry {
  slug: string;
  lang: string;
  title: string;
  date: string;
  category: string;
  description?: string;
}

const TOOLS = [
  {
    name: "search_posts",
    description:
      "Search Visa2AU blog posts by keyword against titles and descriptions. Returns matching posts with slug, lang, title, date, category.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword(s), case-insensitive substring match" },
        lang: { type: "string", enum: ["en", "ru", "fr"], description: "Filter by language (default: all)" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_post",
    description:
      "Fetch the full markdown source of a blog post by slug. Returns raw markdown (front matter intact).",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Post slug, e.g. visa-fee-increases-july-2026" },
        lang: { type: "string", enum: ["en", "ru", "fr"], description: "Language (default: en)" },
      },
      required: ["slug"],
    },
  },
];

async function loadIndex(env: Env, origin: string): Promise<IndexEntry[]> {
  const res = await env.ASSETS.fetch(new Request(`${origin}/content-index.json`));
  if (!res.ok) return [];
  const data = (await res.json()) as { posts?: IndexEntry[] };
  return data.posts || [];
}

function rpcResult(id: unknown, result: unknown): Response {
  return new Response(JSON.stringify({ jsonrpc: "2.0", id, result }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function rpcError(id: unknown, code: number, message: string): Response {
  return new Response(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function textContent(text: string, isError = false) {
  return { content: [{ type: "text", text }], ...(isError ? { isError: true } : {}) };
}

async function callTool(
  env: Env,
  origin: string,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  if (name === "search_posts") {
    const query = String(args.query || "").toLowerCase().trim();
    if (!query) return textContent("query is required", true);
    const lang = typeof args.lang === "string" ? args.lang : undefined;
    const index = await loadIndex(env, origin);
    const terms = query.split(/\s+/);
    const matches = index
      .filter((p) => !lang || p.lang === lang)
      .filter((p) => {
        const hay = `${p.title} ${p.description || ""} ${p.category}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      });
    return textContent(JSON.stringify({ query, count: matches.length, results: matches }, null, 2));
  }
  if (name === "get_post") {
    const slug = String(args.slug || "").trim();
    const lang = String(args.lang || "en");
    if (!/^[a-z0-9-]+$/.test(slug)) return textContent("invalid slug", true);
    if (!["en", "ru", "fr"].includes(lang)) return textContent("lang must be en, ru or fr", true);
    const path = (lang === "en" ? "" : `/${lang}`) + `/blog/${slug}.md`;
    const res = await env.ASSETS.fetch(new Request(`${origin}${path}`));
    if (res.status === 404) return textContent(`No markdown twin for ${path}`, true);
    return textContent(await res.text());
  }
  return textContent(`Unknown tool: ${name}`, true);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const origin = new URL(request.url).origin;

  let msg: {
    jsonrpc?: string;
    id?: unknown;
    method?: string;
    params?: { name?: string; arguments?: Record<string, unknown> };
  };
  try {
    msg = await request.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return rpcError(msg.id ?? null, -32600, "Invalid Request");
  }

  // Notifications have no id → acknowledge with 202, no body.
  if (msg.id === undefined) {
    if (msg.method === "notifications/initialized" || msg.method.startsWith("notifications/")) {
      return new Response(null, { status: 202 });
    }
    return new Response(null, { status: 202 });
  }

  switch (msg.method) {
    case "initialize":
      return rpcResult(msg.id, {
        protocolVersion: PROTOCOL_VERSION,
        serverInfo: SERVER_INFO,
        capabilities: { tools: {} },
      });
    case "ping":
      return rpcResult(msg.id, {});
    case "tools/list":
      return rpcResult(msg.id, { tools: TOOLS });
    case "tools/call": {
      const name = msg.params?.name;
      if (typeof name !== "string") return rpcError(msg.id, -32602, "params.name required");
      const result = await callTool(env, origin, name, msg.params?.arguments || {});
      return rpcResult(msg.id, result);
    }
    default:
      return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
};

export const onRequestGet: PagesFunction = async () =>
  new Response(
    JSON.stringify({
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      protocol: "mcp",
      transport: "streamable-http",
      note: "POST JSON-RPC 2.0 requests to this endpoint. Stateless, no auth (read-only public content).",
      server_card: "/.well-known/mcp/server-card.json",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
