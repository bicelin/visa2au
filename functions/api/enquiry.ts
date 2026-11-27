// POST /api/enquiry — validate → Turnstile verify → attachments to R2 →
// HMAC-signed 7-day download links → Resend email notification.
// Files up to 20 MB in total are attached to the email itself, so the agent can
// open them straight from the inbox; R2 and the signed links still cover the
// larger cases and anything the mail provider refuses.
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
const MAX_INLINE = 20 * 1024 * 1024; // attach to the email up to 20 MB total
const LINK_TTL_S = 90 * 24 * 3600; // stored files and their links live 90 days

// Base64 of a whole file. Built in chunks: spreading a 20 MB buffer into
// String.fromCharCode would overflow the argument limit and throw.
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  let bin = "";
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

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
  const phone = String(fd.get("phone") || "").trim();
  const messenger = String(fd.get("messenger") || "").trim();
  const visa = String(fd.get("visa") || "").trim();
  const location = String(fd.get("location") || "").trim();
  const timeline = String(fd.get("timeline") || "").trim();
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
  const inline: { filename: string; content: string }[] | null =
    total > 0 && total <= MAX_INLINE ? [] : null;

  for (const f of files) {
    const safeName = f.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
    const key = `${enquiryId}/${crypto.randomUUID()}-${safeName}`;
    // Read once: the bytes go to R2 and, when the enquiry is small enough, are
    // base64'd for the email too. A consumed stream cannot be read twice.
    const buf = await f.arrayBuffer();
    await env.ENQUIRIES.put(key, buf, {
      httpMetadata: { contentType: f.type || "application/octet-stream" },
      customMetadata: { originalName: f.name },
    });
    const sig = await sign(env.ENQUIRY_HMAC_SECRET, `${key}:${exp}`);
    const base = new URL(request.url).origin;
    links.push({ name: f.name, size: f.size, url: `${base}/api/file/${encodeURIComponent(key)}?exp=${exp}&sig=${sig}` });
    if (inline) inline.push({ filename: safeName, content: toBase64(buf) });
  }

  // Store enquiry metadata
  step = "r2-meta";
  await env.ENQUIRIES.put(`${enquiryId}/_meta.json`, JSON.stringify({ name, email, phone, messenger, topic, visa, location, timeline, message, at: new Date().toISOString() }));

  // Notify via Resend
  const to = env.NOTIFY_TO || "info@visa2.au";
  const from = env.FROM_EMAIL || "noreply@visa2.au";

  // Files under 20 MB in total ride along with the email; everything else, and
  // anything the provider refuses, is reached through a signed link.
  const renderFiles = (attached: number) =>
    links.length
      ? `<p><b>Attachments:</b> ${
          attached
            ? `${attached} file(s) attached to this email`
            : `download below — links valid 90 days`
        }</p><ul>${links
          .map((l) => `<li><a href="${l.url}">${escapeHtml(l.name)}</a> (${Math.round(l.size / 1024)} KB)</li>`)
          .join("")}</ul>`
      : "<p><i>No attachments.</i></p>";

  const renderHtml = (attached: number) => `
    <h2>New website enquiry — ${escapeHtml(topic || "General")}</h2>
    <p><b>Name:</b> ${escapeHtml(name)}<br><b>Email:</b> ${escapeHtml(email)}</p>
    <p><b>Phone:</b> ${escapeHtml(phone || "—")}<br><b>Messenger:</b> ${escapeHtml(messenger || "—")}</p>
    <p><b>Interested in:</b> ${escapeHtml(visa || "—")}<br><b>Currently:</b> ${escapeHtml(location || "—")}<br><b>Timeline:</b> ${escapeHtml(timeline || "—")}</p>
    <p><b>Message:</b></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    ${renderFiles(attached)}
    <p style="color:#888;font-size:12px">Enquiry ID: ${enquiryId}</p>`;

  const sendEmail = (payload: Record<string, unknown>) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const payload: Record<string, unknown> = {
    from: `Visa2AU Website <${from}>`,
    to: [to],
    reply_to: email,
    subject: `Website enquiry: ${topic || "General"}${visa ? ` · ${visa}` : ""} — ${name}`,
    html: renderHtml(inline ? inline.length : 0),
  };
  if (inline && inline.length) payload.attachments = inline;

  step = "resend";
  let er = await sendEmail(payload);
  if (!er.ok && inline && inline.length) {
    // The provider refused the payload (attachment size cap). The enquiry must
    // still reach the agent, so resend it with 90-day links instead.
    const why = (await er.text()).slice(0, 200);
    await env.ENQUIRIES.put(`${enquiryId}/_attachments-rejected.json`, JSON.stringify({ why, at: new Date().toISOString() }));
    delete payload.attachments;
    payload.html = renderHtml(0);
    er = await sendEmail(payload);
  }
  if (!er.ok) {
    const detail = await er.text();
    return json({ ok: false, error: "Email delivery failed", detail: detail.slice(0, 200) }, 502);
  }

  return json({ ok: true, id: enquiryId, files: links.length });
  } catch (err) {
    return json({ ok: false, error: "Internal error", step, detail: String(err).slice(0, 200) }, 500);
  }
};
