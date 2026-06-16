# Visa2AU — Cloudflare Deployment Guide (Mac, Existing Repo)

> Your setup: GitHub repo `bicelin/visa2au` ✓ | Cloned locally ✓ | GitHub Desktop authenticated ✓
> What's left: Cloudflare staging + production projects, secrets, D1 migration.

---

## Architecture

```
GitHub Desktop / Terminal
    │
    ├── GitHub: bicelin/visa2au
    │      ├── develop branch → https://visa2au-staging.pages.dev  (TEST FIRST)
    │      └── main branch    → https://visa2au-prod.pages.dev     (LIVE SITE)
    │
    └── Wrangler CLI → D1 DB + R2 Bucket (shared by both)
```

---

## ONE-TIME SETUP

### 1. Install Wrangler CLI

Open Terminal:

```bash
npm install -g wrangler
wrangler login          # opens browser, authorize with bicelin@gmail.com
wrangler whoami         # confirm: shows your Cloudflare account
```

### 2. Create `develop` Branch

**In GitHub Desktop:**
1. Make sure you're on `main`
2. Branch menu → "New Branch" → name: `develop` → Create
3. Click "Publish branch"

Verify at https://github.com/bicelin/visa2au/branches — both `main` and `develop` shown.

### 3. Create Cloudflare Pages: Staging

Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**

| Setting | Value |
|---------|-------|
| Project name | `visa2au-staging` |
| Production branch | `develop` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Click **Save and Deploy**. Your staging URL: `https://visa2au-staging.pages.dev`

### 4. Create Cloudflare Pages: Production

Same process, but:

| Setting | Value |
|---------|-------|
| Project name | `visa2au-prod` |
| Production branch | `main` |

Your production URL: `https://visa2au-prod.pages.dev` (custom domain `visa2.au` later)

### 5. Set Secrets (Both Projects)

**Staging:**
```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=visa2au-staging
# paste: re_EKX6VAXp_24vXCC8tTd99fQ95eNPhmdn3

npx wrangler pages secret put ADMIN_TOKEN --project-name=visa2au-staging
# paste: rTc2KMivpFAz9nHAJ/IKwWjFhiEWTlGuUki4FaxhGJA=
```

**Production:**
```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=visa2au-prod
# paste: re_EKX6VAXp_24vXCC8tTd99fQ95eNPhmdn3

npx wrangler pages secret put ADMIN_TOKEN --project-name=visa2au-prod
# paste: rTc2KMivpFAz9nHAJ/IKwWjFhiEWTlGuUki4FaxhGJA=
```

### 6. Bind D1 + R2 (Both Projects)

For EACH project (`visa2au-staging` and `visa2au-prod`):

Dashboard → project → **Settings** → **Functions**:

- **D1 database bindings** → Add:
  - Variable name: `visa2au_db`
  - D1 database: `visa2au-db`

- **R2 bucket bindings** → Add:
  - Variable name: `visa2au_files`
  - Bucket name: `visa2au-files`

- Click **Save**

### 7. Run D1 Migration

**Important:** Run these commands from INSIDE your project folder (where `wrangler.toml` is). Also add `--remote` to target the live Cloudflare database.

```bash
# Navigate to your project (adjust path to your clone)
cd ~/visa2au

# Execute schema on the REMOTE database
npx wrangler d1 execute visa2au-db --file=./functions/_db/schema.sql --remote

# Verify tables were created
npx wrangler d1 execute visa2au-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
# Expected: submissions, submission_files
```

> **Why `--remote`?** Wrangler 4.x defaults to a local SQLite file. `--remote` executes against your live Cloudflare D1 database.
>
> **Why `cd ~/visa2au`?** Wrangler reads `wrangler.toml` from the current directory to resolve the database binding. Running from `~` (home) won't find it.

### 8. Verify Resend Domain

https://resend.com/domains → Add `visa2.au` → Add DNS records in Cloudflare → Verify

---

## DAILY WORKFLOW

### Making Changes

**GitHub Desktop:**
1. Switch to `develop` branch
2. Edit code in your editor
3. Review changes in GitHub Desktop sidebar
4. Write commit summary → **Commit to develop** → **Push origin**

Cloudflare auto-deploys to staging in ~1 minute.

### Test on Staging

```
https://visa2au-staging.pages.dev/#/contact          (submit test form)
https://visa2au-staging.pages.dev/#/admin/submissions?token=rTc2KMivpFAz9nHAJ/IKwWjFhiEWTlGuUki4FaxhGJA=
```

### Promote to Production

**GitHub Desktop:**
1. Switch to `main`
2. Branch menu → **Merge into Current Branch** → select `develop` → **Create merge commit**
3. **Push origin**

Cloudflare auto-deploys `main` to production.

---

## TEST CHECKLIST (Staging First)

| # | Test | Expected |
|---|------|----------|
| 1 | Submit form (no files) | Success message |
| 2 | Submit form (with PDF) | Success + email to sergey@visa2.au |
| 3 | Check email | HTML email with details + file download link |
| 4 | Download file | Works, correct file |
| 5 | Admin dashboard loads | Submission list visible |
| 6 | Status updates | Mark Read / Replied / Archive works |
| 7 | Dark/light theme | Both work correctly |

---

## QUICK COMMANDS

```bash
# All commands assume you're in the project directory:
cd ~/visa2au

# Check D1 (remote)
npx wrangler d1 execute visa2au-db --command="SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5;" --remote

# Check R2 files
npx wrangler r2 object list visa2au-files

# Staging logs
npx wrangler pages deployment tail --project-name=visa2au-staging

# Manual deploy (if needed)
npx wrangler pages deploy dist --project-name=visa2au-staging
npx wrangler pages deploy dist --project-name=visa2au-prod
```

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "Unauthorized" on admin | Check ADMIN_TOKEN secret is set for that project |
| Emails not sending | Check RESEND_API_KEY secret; verify domain at resend.com |
| "Internal Server Error" | Check Functions bindings (D1 + R2) match `visa2au_db` / `visa2au_files` |
| Build fails | Run `npm run build` locally first — fix any errors |
| 404 on `/api/contact` | Ensure Functions + D1/R2 bindings are configured in that Pages project |
