// POST /api/enquiry — validate → Turnstile verify → attachments to R2 →
// HMAC-signed 7-day download links → Resend email notification.
// Env: TURNSTILE_SECRET, RESEND_API_KEY, ENQUIRY_HMAC_SECRET, R2 binding ENQUIRIES,
// optional: NOTIFY_TO, FROM_EMAIL

interface Env {
  ENQUIRIES: R2Bucket;
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  ENQUIRY_HMAC_SECRET: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
}

const MAX_TOTAL = 90 * 1024 * 1024; // 90 MB (free-plan request ceiling)
const LINK_TTL_S = 7 * 24 * 3600;

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(secret: string, msg: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const dbg = new URL(request.url).searchParams.get("dbg");
  if (dbg === "entry") return new Response(JSON.stringify({ ok: true, step: "entry", hasR2: !!env.ENQUIRIES, hasHmac: !!env.ENQUIRY_HMAC_SECRET, hasResend: !!env.RESEND_API_KEY }), { headers: { "Content-Type": "application/json" } });
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data" }, 400);
  }

  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const topic = String(fd.get("topic") || "").trim();
  const message = String(fd.get("message") || "").trim();
  const token = String(fd.get("cf-turnstile-response") || "");

  if (!name || !email || !message) return json({ ok: false, error: "Name, email and message are required" }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: "Invalid email" }, 400);

  // Turnstile verify (if a response token was submitted)
  if (token) {
    const vr = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token }),
    });
    const v = (await vr.json()) as { success: boolean };
    if (!v.success) return json({ ok: false, error: "Bot check failed — please retry" }, 403);
  }

  let step = "r2-files";
  try {
  // Attachments → R2
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const total = files.reduce((s, f) => s + f.size, 0);
  if (total > MAX_TOTAL) return json({ ok: false, error: "Attachments exceed 90 MB total" }, 413);

  const enquiryId = crypto.randomUUID();
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_S;
  const links: { name: string; size: number; url: string }[] = [];

  for (const f of files) {
    const safeName = f.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
    const key = `${enquiryId}/${crypto.randomUUID()}-${safeName}`;
    await env.ENQUIRIES.put(key, f.stream(), {
      httpMetadata: { contentType: f.type || "application/octet-stream" },
      customMetadata: { originalName: f.name },
    });
    const sig = await sign(env.ENQUIRY_HMAC_SECRET, `${key}:${exp}`);
    const base = new URL(request.url).origin;
    links.push({ name: f.name, size: f.size, url: `${base}/api/file/${encodeURIComponent(key)}?exp=${exp}&sig=${sig}` });
  }

  // Store enquiry metadata
  step = "r2-meta";
  await env.ENQUIRIES.put(`${enquiryId}/_meta.json`, JSON.stringify({ name, email, topic, message, at: new Date().toISOString() }));

  // Notify via Resend
  const to = env.NOTIFY_TO || "info@visa2.au";
  const from = env.FROM_EMAIL || "noreply@visa2.au";
  const filesHtml = links.length
    ? `<p><b>Attachments (links valid 7 days):</b></p><ul>${links
        .map((l) => `<li><a href="${l.url}">${escapeHtml(l.name)}</a> (${Math.round(l.size / 1024)} KB)</li>`)
        .join("")}</ul>`
    : "<p><i>No attachments.</i></p>";
  const html = `
    <h2>New website enquiry — ${escapeHtml(topic || "General")}</h2>
    <p><b>Name:</b> ${escapeHtml(name)}<br><b>Email:</b> ${escapeHtml(email)}</p>
    <p><b>Message:</b></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    ${filesHtml}
    <p style="color:#888;font-size:12px">Enquiry ID: ${enquiryId}</p>`;

  step = "resend";
  const er = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Visa2AU Website <${from}>`,
      to: [to],
      reply_to: email,
      subject: `Website enquiry: ${topic || "General"} — ${name}`,
      html,
    }),
  });
  if (!er.ok) {
    const detail = await er.text();
    return json({ ok: false, error: "Email delivery failed", detail: detail.slice(0, 200) }, 502);
  }

  return json({ ok: true, id: enquiryId, files: links.length });
  } catch (err) {
    return json({ ok: false, error: "Internal error", step, detail: String(err).slice(0, 200) }, 500);
  }
};
