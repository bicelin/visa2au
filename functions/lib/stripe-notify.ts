// Shared by the Stripe webhook and the catch-up job.
//
// Why this exists: a payment was previously known only inside Stripe. If the webhook
// was misconfigured or a delivery failed, nothing on our side showed it — no record and
// no email — so a real A$330 payment could go unnoticed. Every payment now leaves one
// JSON record in R2 and one email, and the catch-up job can find the ones that were
// missed because the record is the source of truth.

export interface NotifyEnv {
  RESEND_API_KEY?: string;
  NOTIFY_TO?: string;
  FROM_EMAIL?: string;
}

export interface SessionObject {
  id?: string;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  customer_details?: { email?: string | null; name?: string | null };
  metadata?: Record<string, string> | null;
  created?: number;
}

export interface PaymentRecord {
  session_id: string;
  event: string;
  event_id?: string;
  kind: "donation" | "invoice";
  paid: boolean;
  amount_total: number | null;
  currency: string | null;
  invoice: string | null;
  payer: string | null;
  email: string | null;
  stripe_created: number | null;
  recorded_at: string;
  notified: boolean;
  notify_error?: string;
}

export const money = (cents: number | null | undefined, currency: string | null | undefined) => {
  if (typeof cents !== "number") return "unknown";
  const cur = (currency || "aud").toUpperCase();
  return `${cur} ${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
};

// Names and emails come from Stripe, i.e. from whoever filled the checkout form.
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export interface Description {
  kind: "donation" | "invoice";
  isDonation: boolean;
  noun: string;
  paid: boolean;
  invoice: string;
  payer: string;
  email: string;
  total: string;
  invoiced: string;
  fee: string;
}

export function describe(s: SessionObject): Description {
  // Two checkouts feed this: /pay (an invoice) and /donate (a gift of any amount).
  // A donation carries kind=donation and no invoice number, so without this branch
  // the office was told "Payment received — (no invoice number)" for every gift.
  const isDonation = s.metadata?.kind === "donation";
  return {
    kind: isDonation ? "donation" : "invoice",
    isDonation,
    noun: isDonation ? "Donation" : "Payment",
    paid: s.payment_status === "paid",
    invoice: s.metadata?.invoice || "(no invoice number)",
    payer: s.customer_details?.name || s.metadata?.payer_name || "(no name)",
    email: s.customer_details?.email || "(no email)",
    total: money(s.amount_total, s.currency),
    invoiced: s.metadata?.invoice_amount_aud ? `A$${s.metadata.invoice_amount_aud}` : "unknown",
    fee: s.metadata?.card_fee_aud ? `A$${s.metadata.card_fee_aud}` : "unknown",
  };
}

export function subjectFor(d: Description): string {
  return d.isDonation
    ? d.paid
      ? `💚 Donation received — ${d.total} — ${d.payer}`
      : `⚠️ Donation not completed — ${d.total}`
    : d.paid
      ? `✅ Payment received — ${d.invoice} — ${d.total}`
      : `⚠️ Payment not completed — ${d.invoice}`;
}

export function htmlFor(d: Description, s: SessionObject, type: string): string {
  const rows: [string, string][] = d.isDonation
    ? [
        ["Type", "Donation"],
        ["Donor", d.payer],
        ["Email", d.email],
        ["Amount", d.total],
      ]
    : [
        ["Type", "Invoice payment"],
        ["Invoice", d.invoice],
        ["Payer", d.payer],
        ["Email", d.email],
        ["Invoice amount", d.invoiced],
        ["Card fee", d.fee],
        ["Total charged", d.total],
      ];
  if (type === "checkout.session.async_payment_succeeded") {
    rows.push(["Note", "Delayed payment method settled after checkout"]);
  }
  if (type === "reconciled") {
    rows.push(["Note", "Recorded by the catch-up job: no webhook delivery was received"]);
  }
  return `
      <h2>${d.paid ? `${d.noun} received` : `${d.noun} not completed`}</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
        ${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}
        <tr><td><b>Stripe session</b></td><td><code>${escapeHtml(s.id || "")}</code></td></tr>
        <tr><td><b>Status</b></td><td>${escapeHtml(s.payment_status || "")}</td></tr>
      </table>
      <p style="font-family:system-ui,sans-serif;font-size:13px;color:#555">
        Reconcile in the Stripe dashboard. This notification comes from the Stripe API,
        not from a browser redirect.
      </p>`;
}

export function toRecord(s: SessionObject, type: string, eventId?: string): PaymentRecord {
  const d = describe(s);
  return {
    session_id: s.id || "",
    event: type,
    event_id: eventId,
    kind: d.kind,
    paid: d.paid,
    amount_total: typeof s.amount_total === "number" ? s.amount_total : null,
    currency: s.currency ?? null,
    invoice: s.metadata?.invoice ?? null,
    payer: s.customer_details?.name || s.metadata?.payer_name || null,
    email: s.customer_details?.email ?? null,
    stripe_created: typeof s.created === "number" ? s.created : null,
    recorded_at: new Date().toISOString(),
    notified: false,
  };
}

export const recordKey = (sessionId: string) => `payments/${sessionId}.json`;

export async function readRecord(bucket: R2Bucket, sessionId: string): Promise<PaymentRecord | null> {
  const obj = await bucket.get(recordKey(sessionId));
  if (!obj) return null;
  try {
    return (await obj.json()) as PaymentRecord;
  } catch {
    return null;
  }
}

export async function writeRecord(bucket: R2Bucket, rec: PaymentRecord): Promise<void> {
  await bucket.put(recordKey(rec.session_id), JSON.stringify(rec, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
}

// Returns ok=false only when the provider rejected the message, so the caller can decide
// what to do. A mail failure must never look like a payment failure.
export async function sendPaymentEmail(
  env: NotifyEnv,
  s: SessionObject,
  type: string
): Promise<{ ok: boolean; error?: string; skipped?: string }> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) return { ok: true, skipped: "email not configured" };
  const d = describe(s);
  const from = env.FROM_EMAIL || "website@visa2.au";
  // Comma-separated so the office can notify several people (e.g. accounts + the agent).
  const recipients = env.NOTIFY_TO.split(",").map((t) => t.trim()).filter(Boolean);
  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Visa2AU Payments <${from}>`,
        to: recipients,
        subject: subjectFor(d),
        html: htmlFor(d, s, type),
      }),
    });
    if (!er.ok) return { ok: false, error: (await er.text()).slice(0, 200) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 200) };
  }
}
