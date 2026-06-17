# Visa2AU — Cloudflare Deployment Guide (Mac, Existing Repo)

> Your setup: GitHub repo `bicelin/visa2au` ✓ | GitHub Desktop authenticated ✓

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

Both staging and production share the **same** D1 database and R2 bucket.

---

## ONE-TIME SETUP

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login          # opens browser, authorize with bicelin@gmail.com
wrangler whoami         # confirm: shows your Cloudflare account
```

### 2. Create `develop` Branch (in GitHub Desktop)

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

Your production URL: `https://visa2au-prod.pages.dev`

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

**Important:** Run from INSIDE your project folder. Add `--remote` to target the live Cloudflare database.

```bash
# Navigate to your project (adjust path to your actual clone location)
cd ~/Documents/GitHub/visa2au

# Execute schema on the REMOTE database
npx wrangler d1 execute visa2au-db --file=./functions/_db/schema.sql --remote

# Verify tables were created
npx wrangler d1 execute visa2au-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
# Expected: submissions, submission_files
```

> **Why `--remote`?** Wrangler 4.x defaults to local SQLite. `--remote` executes against your live Cloudflare D1 database.
>
> **Why `cd` first?** Wrangler reads `wrangler.toml` from the current directory.

### 8. Verify Resend Domain

https://resend.com/domains → Add `visa2.au` → Add DNS records in Cloudflare → Verify

---

## DEPLOYING CODE: GitHub → Cloudflare

Cloudflare Pages does NOT build from your Mac. It builds from **GitHub**. So every deploy follows this flow:

```
Your Mac → GitHub (push) → Cloudflare (auto-build & deploy)
```

### Step A: Ensure Your Local Folder Is a Proper Git Clone

If you see `fatal: not a git repository` when running `git` commands, your folder isn't a proper clone. Fix it:

**In GitHub Desktop:**
1. File menu → "Clone Repository"
2. Select `bicelin/visa2au` from the list
3. Choose a local path (e.g., `~/Documents/GitHub/visa2au`)
4. Click "Clone"

**In Terminal, verify:**
```bash
cd ~/Documents/GitHub/visa2au
git status   # should show "On branch main" — NOT "fatal: not a git repository"
```

### Step B: Copy Latest Source Code Into the Clone

You have a "v36 archive" — extract it and copy ALL files into your clone folder, replacing existing files. The key files Cloudflare needs:

```
functions/                  ← Backend API (REQUIRED)
functions/_db/schema.sql    ← Database schema
functions/api/contact.ts    ← Form submission handler
functions/api/submissions.ts ← Admin API
src/                        ← Frontend React code
public/                     ← Static assets (images)
content/                    ← Blog posts
index.html                  ← HTML entry point
package.json                ← Dependencies
vite.config.ts              ← Build config
wrangler.toml               ← Cloudflare bindings (REQUIRED)
tsconfig.json               ← TypeScript config
```

**After copying, your clone should contain `functions/` and `wrangler.toml`.**

### Step C: Commit and Push to GitHub

**In GitHub Desktop:**
1. Open your `visa2au` repository
2. You should see changed files in the left sidebar
3. Write a commit summary: "Add backend: contact form, admin dashboard, file uploads"
4. Click **Commit to main**
5. Click **Push origin**

### Step D: Deploy to Staging

**In GitHub Desktop:**
1. Switch to `develop` branch (dropdown at top)
2. Branch menu → **Merge into Current Branch** → select `main` → **Create merge commit**
3. Click **Push origin**

This pushes the latest code to the `develop` branch. Cloudflare automatically detects the push and starts a build.

### Step E: Verify Deploy

1. Go to Cloudflare Dashboard → `visa2au-staging` → **Deployments**
2. Wait for the build to complete (1-2 minutes)
3. Visit: `https://visa2au-staging.pages.dev/#/contact`
4. The page should show the **new** contact form with file upload, expanded fields, etc.

If it still shows the old version, check the build log in Cloudflare for errors.

---

## DAILY WORKFLOW (After Setup)

### Making Changes

**GitHub Desktop:**
1. Switch to `develop` branch
2. Edit code in your editor
3. Review changes in GitHub Desktop sidebar
4. Write commit summary → **Commit to develop** → **Push origin**

Cloudflare auto-deploys to staging in ~1 minute.

### Promoting to Production

**GitHub Desktop:**
1. Switch to `main`
2. Branch menu → **Merge into Current Branch** → select `develop` → **Create merge commit**
3. **Push origin**

Cloudflare auto-deploys `main` to production.

---

## TEST CHECKLIST (Staging First)

| # | Test | URL on Staging |
|---|------|----------------|
| 1 | Contact page shows new form | `/#/contact` |
| 2 | Submit form (no files) | Success message shown |
| 3 | Submit form (with PDF) | Success + email to sergey@visa2.au |
| 4 | Check email at sergey@visa2.au | HTML email with details + download link |
| 5 | Download file from email | Works, correct file |
| 6 | Admin dashboard loads | `/#/admin/submissions?token=YOUR_TOKEN` |
| 7 | Status updates | Mark Read / Replied / Archive works |

---

## QUICK COMMANDS

All commands assume you're in the project directory:

```bash
cd ~/Documents/GitHub/visa2au

# Check D1 (remote)
npx wrangler d1 execute visa2au-db --command="SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5;" --remote

# Check R2 files
npx wrangler r2 object list visa2au-files

# Staging logs
npx wrangler pages deployment tail --project-name=visa2au-staging

# Manual deploy (if needed)
npx wrangler pages deploy dist --project-name=visa2au-staging
```

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "fatal: not a git repository" | Clone the repo properly via GitHub Desktop (File → Clone Repository) |
| Staging shows old version | Code wasn't pushed to `develop` branch on GitHub. Check GitHub Desktop → Push origin |
| "Internal Server Error" on form | Check Functions bindings (D1 + R2) are configured in that Pages project |
| "Unauthorized" on admin | ADMIN_TOKEN secret not set for that project |
| Emails not sending | RESEND_API_KEY secret not set, or domain not verified in Resend |
| Build fails in Cloudflare | Check build log. Usually: missing `functions/` folder or `wrangler.toml` |
| `functions/_db/schema.sql` not found | File wasn't committed to GitHub. Check it's in your clone, then commit + push |
