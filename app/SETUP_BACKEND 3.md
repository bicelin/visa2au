# Visa2AU Backend Setup Guide

## Overview

The contact form now submits directly to a Cloudflare Pages Function which:
1. Receives the form data + file attachments
2. Stores files in Cloudflare R2 (S3-compatible storage)
3. Saves submission records in Cloudflare D1 (SQLite database)
4. Sends a beautifully formatted HTML email to `sergey@visa2.au` via Resend

---

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Login to your Cloudflare account:
```bash
npx wrangler login
```
This will open a browser to authenticate with your Cloudflare account (bicelin@gmail.com).

---

## Step 2: Create D1 Database

```bash
npx wrangler d1 create visa2au-db
```

This outputs a database ID. Copy it and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "visa2au-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### Run the schema migration:

```bash
npx wrangler d1 execute visa2au-db --file=./functions/_db/schema.sql
```

---

## Step 3: Create R2 Bucket

```bash
npx wrangler r2 bucket create visa2au-files
```

This bucket name is already set in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "FILES_BUCKET"
bucket_name = "visa2au-files"
```

---

## Step 4: Set Up Resend (Email)

1. Go to https://resend.com and sign up with **info@visa2.au**
2. Add and verify your domain (visa2.au) in Resend dashboard
   - Add DNS records (SPF, DKIM, DMARC) to your domain's DNS in Cloudflare
   - Wait for verification (usually instant if DNS is in Cloudflare)
3. Get your API key from Resend dashboard → API Keys

### Set the API key as a secret:

```bash
npx wrangler pages secret put RESEND_API_KEY
# Enter your Resend API key when prompted
```

---

## Step 5: Set Admin Token

This protects the submissions dashboard:

```bash
npx wrangler pages secret put ADMIN_TOKEN
# Enter a secure random string (e.g., use: openssl rand -base64 32)
```

Save this token — you'll need it to access `/admin/submissions`.

---

## Step 6: Deploy to Cloudflare Pages

### Option A: Deploy from local (quick test)

```bash
# Build the project first
npm run build

# Deploy (run from project root)
npx wrangler pages deploy dist --project-name=visa2au
```

### Option B: Connect Git (recommended for production)

1. Push your code to GitHub
2. In Cloudflare dashboard → Pages → "Create a project"
3. Connect to your GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add environment variables (same as secrets above)
6. Deploy

---

## Step 7: Verify Email Domain (Critical)

Before emails will send, you MUST verify your domain in Resend:

1. In Resend dashboard → Domains → Add Domain
2. Enter: `visa2.au`
3. Resend will show DNS records to add
4. Go to Cloudflare dashboard → DNS → Add the records
5. Wait for verification (usually instant)

---

## Step 8: Verify Everything Works

1. Visit your deployed site
2. Go to Contact page
3. Fill out the form with test data
4. Submit without files → check if sergey@visa2.au receives email
5. Submit with a small PDF → check file upload + email with download link
6. Go to `/admin/submissions?token=YOUR_ADMIN_TOKEN` → verify dashboard loads

---

## File Structure

```
├── functions/
│   ├── api/
│   │   ├── contact.ts          # POST /api/contact — form submission handler
│   │   └── submissions.ts      # GET/PATCH /api/submissions — admin API
│   └── _db/
│       └── schema.sql          # D1 database schema
├── src/pages/
│   ├── Contact.tsx             # Updated form (submits to API)
│   └── AdminSubmissions.tsx    # Admin dashboard
├── wrangler.toml               # Cloudflare configuration
└── SETUP_BACKEND.md            # This file
```

---

## Troubleshooting

### "Internal Server Error" on form submit
- Check D1 database ID in wrangler.toml is correct
- Verify D1 migration was run successfully
- Check R2 bucket exists

### Emails not sending
- Verify Resend API key is set as a secret
- Check domain verification status in Resend dashboard
- Check that `from` email uses your verified domain

### Admin dashboard shows "Unauthorized"
- Verify ADMIN_TOKEN secret is set
- Make sure you're passing token as query param: `?token=YOUR_TOKEN`

### File uploads failing
- Check R2 bucket exists and name matches wrangler.toml
- Verify individual files are under 10MB
- Total upload must be under 20MB

---

## Costs (as of 2025)

All services have generous free tiers:

| Service | Free Tier | Paid |
|---------|-----------|------|
| Cloudflare Pages | 500 builds/month | $0.50/extra 1000 builds |
| Cloudflare Functions | 100,000 requests/day | $0.50/million |
| D1 Database | 5M rows read/day, 100K write/day | $1/million reads |
| R2 Storage | 10 GB/month | $0.015/GB/month |
| Resend Email | 3,000 emails/day | $0.001/email |

**Your expected usage**: Well within free tiers (likely <100 submissions/month).
