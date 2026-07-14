/**
 * Visa2AU Contact Form API
 * Handles form submission, file uploads to R2, database storage, and email delivery via Resend
 *
 * POST /api/contact
 * Content-Type: multipart/form-data
 */

// Environment bindings (injected by Cloudflare — must match wrangler.toml)
export interface Env {
  visa2au_db: D1Database;       // D1 database binding
  visa2au_files: R2Bucket;      // R2 bucket binding
  RESEND_API_KEY: string;       // Set via: wrangler pages secret put RESEND_API_KEY
  SITE_URL: string;             // Public var from wrangler.toml
  ADMIN_TOKEN: string;          // Set via: wrangler pages secret put ADMIN_TOKEN
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;   // 10 MB per file
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

// GET /api/contact — Health check endpoint (diagnostics)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const checks: Record<string, string> = {};

  // Check D1 binding
  try {
    await env.visa2au_db.prepare("SELECT 1").run();
    checks.d1_database = 'OK';
  } catch (e: any) {
    checks.d1_database = `FAIL: ${e.message}`;
  }

  // Check R2 binding
  try {
    await env.visa2au_files.list();
    checks.r2_bucket = 'OK';
  } catch (e: any) {
    checks.r2_bucket = `FAIL: ${e.message}`;
  }

  // Check secrets (just check they exist, don't expose values)
  checks.resend_api_key = env.RESEND_API_KEY ? 'SET' : 'MISSING';
  checks.admin_token = env.ADMIN_TOKEN ? 'SET' : 'MISSING';

  return jsonResponse({
    status: 'diagnostics',
    timestamp: new Date().toISOString(),
    checks,
    note: 'If D1 or R2 shows FAIL, check bindings in Cloudflare Dashboard → Pages → Settings → Functions. If secrets show MISSING, run: wrangler pages secret put',
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Parse multipart form data
    const formData = await request.formData();

    // --- Extract and validate fields ---
    const firstName = getString(formData, 'firstName');
    const lastName = getString(formData, 'lastName');
    const email = getString(formData, 'email');
    const phone = getString(formData, 'phone') || null;
    const country = getString(formData, 'country') || null;
    const citizenship = getString(formData, 'citizenship') || null;
    const enquiryType = getString(formData, 'enquiryType');
    const visaType = getString(formData, 'visaType') || null;
    const preferredDate = getString(formData, 'preferredDate') || null;
    const applicants = parseInt(getString(formData, 'applicants') || '1', 10) || 1;
    const message = getString(formData, 'message');

    // Validation
    const errors: string[] = [];
    if (!firstName || firstName.length < 1) errors.push('First name is required');
    if (!lastName || lastName.length < 1) errors.push('Last name is required');
    if (!email || !isValidEmail(email)) errors.push('Valid email is required');
    if (!enquiryType) errors.push('Enquiry type is required');
    if (!message || message.length < 10) errors.push('Message must be at least 10 characters');

    if (errors.length > 0) {
      return jsonResponse({ success: false, errors }, 400);
    }

    // --- Handle file uploads ---
    const uploadedFiles: { name: string; size: number; type: string; key: string; url: string }[] = [];
    let totalSize = 0;

    const files = formData.getAll('attachments') as File[];

    for (const file of files) {
      if (!file || !(file instanceof File) || file.size === 0) continue;

      if (file.size > MAX_FILE_SIZE) {
        return jsonResponse({
          success: false,
          errors: [`File "${file.name}" exceeds 10 MB limit`]
        }, 400);
      }

      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        return jsonResponse({
          success: false,
          errors: ['Total attachment size exceeds 20 MB limit']
        }, 400);
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return jsonResponse({
          success: false,
          errors: [`File type "${file.type}" not allowed for "${file.name}"`]
        }, 400);
      }

      // Generate unique key for R2
      const key = `submissions/${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;

      // Upload to R2
      await env.visa2au_files.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          contentDisposition: `attachment; filename="${file.name}"`,
        },
      });

      // Generate signed URL (7 day expiry)
      const signedUrl = await env.visa2au_files.createSignedUrl(key, {
        method: 'GET',
        expiresIn: 7 * 24 * 60 * 60, // 7 days
      });

      uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        key,
        url: signedUrl.toString(),
      });
    }

    // --- Store submission in D1 ---
    const dbResult = await env.visa2au_db.prepare(
      `INSERT INTO submissions (
        first_name, last_name, email, phone, country, citizenship,
        enquiry_type, visa_type, preferred_date, applicants, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
    ).bind(
      firstName, lastName, email, phone, country, citizenship,
      enquiryType, visaType, preferredDate, applicants, message
    ).run();

    const submissionId = dbResult.meta?.last_row_id;

    // Store file records
    for (const file of uploadedFiles) {
      await env.visa2au_db.prepare(
        `INSERT INTO submission_files (
          submission_id, file_name, file_size, file_type, r2_key, r2_url
        ) VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        submissionId, file.name, file.size, file.type, file.key, file.url
      ).run();
    }

    // --- Send email via Resend (non-blocking) ---
    let emailSent = true;
    let emailError = '';
    try {
      await sendNotificationEmail(env, {
        firstName, lastName, email, phone, country, citizenship,
        enquiryType, visaType, preferredDate, applicants, message,
        submissionId,
        files: uploadedFiles,
      });
    } catch (emailErr: any) {
      emailError = emailErr?.message || String(emailErr) || 'Unknown email error';
      console.error('Email sending failed (but data saved):', emailError);
      emailSent = false;
    }

    // Return success
    return jsonResponse({
      success: true,
      message: emailSent
        ? 'Your enquiry has been submitted successfully. We will contact you within 24 hours.'
        : 'Your enquiry has been saved, but email notification failed. Our team will still review it.',
      submissionId,
      emailSent,
    });

  } catch (err: any) {
    console.error('Contact form error:', err);
    const errorMessage = err?.message || String(err) || 'Unknown error';
    return jsonResponse({
      success: false,
      errors: [`Error: ${errorMessage}. If this persists, email us directly at info@visa2.au`]
    }, 500);
  }
};

// --- Helpers ---

function getString(formData: FormData, key: string): string | null {
  const val = formData.get(key);
  if (!val) return null;
  return String(val).trim() || null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// --- Resend Email ---

interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  citizenship: string | null;
  enquiryType: string;
  visaType: string | null;
  preferredDate: string | null;
  applicants: number;
  message: string;
  submissionId: number;
  files: { name: string; size: number; type: string; key: string; url: string }[];
}

async function sendNotificationEmail(env: Env, data: EmailData): Promise<void> {
  const fullName = `${data.firstName} ${data.lastName}`;

  // Build file list HTML
  const filesHtml = data.files.length > 0
    ? `<h3 style="color:#b45309;font-size:16px;margin:20px 0 10px;">Attached Files (${data.files.length})</h3>
       <table style="width:100%;border-collapse:collapse;font-size:14px;">
         <thead><tr style="background:#f5f2ec;">
           <th style="padding:8px 12px;text-align:left;border:1px solid #e0d9cf;">File Name</th>
           <th style="padding:8px 12px;text-align:left;border:1px solid #e0d9cf;">Size</th>
           <th style="padding:8px 12px;text-align:left;border:1px solid #e0d9cf;">Download Link</th>
         </tr></thead>
         <tbody>
           ${data.files.map(f => `<tr>
             <td style="padding:8px 12px;border:1px solid #e0d9cf;">${f.name}</td>
             <td style="padding:8px 12px;border:1px solid #e0d9cf;">${formatBytes(f.size)}</td>
             <td style="padding:8px 12px;border:1px solid #e0d9cf;">
               <a href="${f.url}" style="color:#b45309;text-decoration:underline;">Download</a> (7 days)
             </td>
           </tr>`).join('')}
         </tbody>
       </table>`
    : '<p style="color:#666;font-size:14px;"><em>No files attached.</em></p>';

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#ede8e0;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ede8e0;padding:30px 0;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:#faf8f4;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(80,60,40,0.08);max-width:95vw;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1714,#2d2925);padding:30px 40px;text-align:center;">
          <img src="https://visa2.au/imgs/logo.png" alt="Visa2AU" style="height:40px;margin-bottom:10px;" />
          <h1 style="color:#fbbf24;font-size:22px;margin:0;font-weight:700;">New Website Enquiry</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">Submission #${data.submissionId} &middot; ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
        </td></tr>
        <!-- Client Details -->
        <tr><td style="padding:30px 40px;">
          <h2 style="color:#1a1714;font-size:18px;margin:0 0 16px;border-bottom:2px solid #fbbf24;padding-bottom:8px;display:inline-block;">Client Details</h2>
          <table style="width:100%;font-size:14px;line-height:1.8;color:#444;">
            <tr><td style="width:160px;color:#888;font-weight:500;">Full Name</td><td style="color:#1a1714;font-weight:600;">${fullName}</td></tr>
            <tr><td style="color:#888;font-weight:500;">Email</td><td><a href="mailto:${data.email}" style="color:#b45309;text-decoration:none;">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="color:#888;font-weight:500;">Phone</td><td>${data.phone}</td></tr>` : ''}
            ${data.country ? `<tr><td style="color:#888;font-weight:500;">Current Country</td><td>${data.country}</td></tr>` : ''}
            ${data.citizenship ? `<tr><td style="color:#888;font-weight:500;">Citizenship</td><td>${data.citizenship}</td></tr>` : ''}
            <tr><td style="color:#888;font-weight:500;">Enquiry Type</td><td><span style="background:#fbbf24;color:#1a1714;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;">${data.enquiryType}</span></td></tr>
            ${data.visaType ? `<tr><td style="color:#888;font-weight:500;">Visa Interest</td><td>${data.visaType}</td></tr>` : ''}
            ${data.preferredDate ? `<tr><td style="color:#888;font-weight:500;">Preferred Date</td><td>${data.preferredDate}</td></tr>` : ''}
            <tr><td style="color:#888;font-weight:500;">Applicants</td><td>${data.applicants}</td></tr>
          </table>
        </td></tr>
        <!-- Message -->
        <tr><td style="padding:0 40px 30px;">
          <h2 style="color:#1a1714;font-size:18px;margin:0 0 12px;border-bottom:2px solid #fbbf24;padding-bottom:8px;display:inline-block;">Message</h2>
          <div style="background:#f5f2ec;border-radius:12px;padding:20px;font-size:14px;line-height:1.7;color:#444;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
        </td></tr>
        <!-- Files -->
        <tr><td style="padding:0 40px 30px;">${filesHtml}</td></tr>
        <!-- Footer -->
        <tr><td style="background:#1a1714;padding:20px 40px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">Visa2AU &middot; MARN Registered Migration Agents &middot; <a href="https://visa2.au" style="color:#fbbf24;text-decoration:none;">visa2.au</a></p>
          <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:8px 0 0;">Submission ID: #${data.submissionId}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const textBody = `New Enquiry from ${fullName}

Submission ID: #${data.submissionId}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Country: ${data.country || 'N/A'}
Citizenship: ${data.citizenship || 'N/A'}
Enquiry Type: ${data.enquiryType}
Visa Type: ${data.visaType || 'N/A'}
Preferred Date: ${data.preferredDate || 'N/A'}
Applicants: ${data.applicants}

Message:
${data.message}

${data.files.length > 0 ? `Files (${data.files.length}):\n${data.files.map(f => `- ${f.name} (${formatBytes(f.size)}): ${f.url}`).join('\n')}` : 'No files attached.'}
`;

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Visa2AU Enquiries <enquiries@visa2.au>',
      to: 'sergey@visa2.au',
      reply_to: data.email,
      subject: `New Enquiry #${data.submissionId}: ${data.enquiryType} — ${fullName}`,
      html: htmlBody,
      text: textBody,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Resend API error:', res.status, errorText);
    throw new Error(`Email delivery failed: ${res.status} — ${errorText}`);
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escapeHtml(text: string): string {
  const div = { toString: () => '' };
  // Manual HTML escaping
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
