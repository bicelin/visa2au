# Visa2AU GitHub & Cloudflare Migration Guide

This guide provides step-by-step instructions to migrate your Visa2AU website to GitHub and deploy via Cloudflare Pages with TinaCMS integration.

---

## 1. Required Permissions & Access

### GitHub Repository Setup
**Repository URL:** https://github.com/bicelin/visa2au

**Permissions Needed:**
1. **GitHub Account Access**
   - Owner or admin access to the `bicelin` GitHub account
   - If repo doesn't exist, you need to create it

2. **Cloudflare Account**
   - Access to Cloudflare Pages dashboard
   - Access to DNS settings for `visa2.au` domain
   - Ability to add custom domains

3. **TinaCMS Setup**
   - Tina Cloud account (tenancy code: `a559a388-750d-4edb-9522-705642263b4c`)
   - GitHub OAuth app integration

---

## 2. Step-by-Step Migration Process

### Step 1: Push Code to GitHub

```bash
# Navigate to project directory
cd /workspace/visa2au

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Visa2AU website with TinaCMS"

# Add remote repository
git remote add origin https://github.com/bicelin/visa2au.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Configure TinaCMS

TinaCMS requires the following setup. I've prepared the configuration files:

**Files to create:**

1. `tina/config.ts` - TinaCMS configuration
2. `.tinaignore` - Files to ignore
3. `content/` - Directory for markdown content

### Step 3: Cloudflare Pages Setup

**Build Settings:**
- **Build command:** `npm run build` or `pnpm build`
- **Build output directory:** `dist`
- **Environment variables:**
  ```
  NODE_VERSION=20
  ```

**Custom Domain Setup:**
- Domain: `test.visa2.au`
- Add CNAME record in DNS pointing to Cloudflare Pages

---

## 3. Configuration Files

### TinaCMS Configuration (`tina/config.ts`)

The project needs a content management layer. Here's the recommended structure:

```typescript
import { defineConfig } from 'tinacms'

export default defineConfig({
  branch: 'main',
  clientId: 'YOUR_TINA_CLIENT_ID',
  organization: 'YOUR_ORGANIZATION',
  // Use existing tenancy code for authentication
})
```

### Content Structure

```
content/
├── blog/
│   ├── visitor-visa-2024.md
│   ├── partner-visa-guide.md
│   └── work-holiday-tips.md
├── visas/
│   ├── partner-820.md
│   ├── visitor-600.md
│   └── skills-482.md
└── team/
    └── agents.md
```

---

## 4. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: visa2au
          directory: dist
```

---

## 5. Required Secrets (GitHub Repository Settings)

Add these secrets to your GitHub repository:

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | Cloudflare Dashboard > My Profile > API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Cloudflare Dashboard > Pages > Overview |

---

## 6. DNS Configuration for test.visa2.au

### In Cloudflare Dashboard:

1. **Go to:** DNS Settings for visa2.au
2. **Add Record:**
   - **Type:** CNAME
   - **Name:** test
   - **Target:** your-cloudflare-pages-subdomain.pages.dev
   - **Proxy:** DNS only (grey cloud) initially, then proxy later

3. **Or use Pages Dashboard:**
   - Go to Pages > visa2au project
   - Custom Domains > Add domain
   - Cloudflare will automatically add the DNS record

---

## 7. TinaCMS Authentication

### Option A: Tina Cloud (Recommended)
Use your existing tenancy code: `a559a388-750d-4edb-9522-705642263b4c`

1. Go to https://app.tina.io
2. Sign in / Create account
3. Create a new project or connect existing
4. Get the Client ID from the project settings

### Option B: Self-hosted Tina
For self-hosted, you'll need:
- A backend service (usually a serverless function)
- Database for content storage

---

## 8. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/bicelin/visa2au.git
cd visa2au

# Install dependencies
npm install

# Start development server
npm run dev

# Start TinaCMS admin (if configured)
npm run tina-dev
```

---

## 9. Environment Variables

Create a `.env` file for local development:

```env
# TinaCMS (get from app.tina.io)
TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_token_here

# Optional: Analytics
VITE_GA_ID=G-XXXXXXXXXX
```

---

## 10. Deployment Checklist

- [ ] Push code to GitHub
- [ ] Enable GitHub Actions
- [ ] Configure Cloudflare Pages
- [ ] Add custom domain (test.visa2.au)
- [ ] Configure DNS
- [ ] Set up TinaCMS authentication
- [ ] Test deployment
- [ ] Verify TinaCMS editor works
- [ ] Update production domain (when ready)

---

## 11. Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# TinaCMS
npm run tina-dev    # Start with TinaCMS admin

# Git operations
git add .            # Stage changes
git commit -m ""     # Commit with message
git push             # Push to GitHub
```

---

## 12. Support Resources

- **TinaCMS Docs:** https://tina.io/docs/
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **GitHub Actions:** https://docs.github.com/en/actions
- **React + Vite:** https://vitejs.dev/guide/

---

## 13. Important Notes

1. **Current Stack:** React + TypeScript + Vite + Tailwind CSS v3
2. **Deployment:** The project uses standard React build (not Next.js), so it's fully compatible with Cloudflare Pages
3. **Content:** TinaCMS integrates with the content/ folder for markdown-based content management

---

## Next Steps After This Document

1. Run the GitHub push commands from Step 1
2. Set up Cloudflare Pages and add the secrets to GitHub
3. Configure TinaCMS and get your Client ID
4. Test the deployment pipeline

For any issues or questions, refer to the official documentation links above or contact the development team.
