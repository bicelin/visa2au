// GET /api/file/:key?exp=&sig= — HMAC-signed R2 download, 7-day expiry.

interface Env {
  ENQUIRIES: R2Bucket;
  ENQUIRY_HMAC_SECRET: string;
}

async function sign(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const url = new URL(request.url);
  const key = decodeURIComponent(String(params.key || ""));
  const exp = Number(url.searchParams.get("exp") || 0);
  const sig = url.searchParams.get("sig") || "";

  if (!key || !exp || !sig) return new Response("Bad request", { status: 400 });
  if (Math.floor(Date.now() / 1000) > exp) return new Response("Link expired", { status: 410 });

  const expected = await sign(env.ENQUIRY_HMAC_SECRET, `${key}:${exp}`);
  if (sig !== expected) return new Response("Invalid signature", { status: 403 });

  const obj = await env.ENQUIRIES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const name = obj.customMetadata?.originalName || key.split("/").pop() || "file";
  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
    },
  });
};
