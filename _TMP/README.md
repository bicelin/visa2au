# Visa2AU - Australian Immigration Services Website

A modern, responsive website for Visa2AU - an Australian immigration consultancy firm. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **SEO Optimized** - Meta tags, sitemap, and semantic HTML
- **Fast Performance** - Built with Vite for optimal loading times
- **Content Management** - TinaCMS integration for easy content updates
- **Modern UI** - Clean, professional design with navy, gold, and teal color scheme

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Content:** TinaCMS (Git-based CMS)
- **Deployment:** Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/bicelin/visa2au.git
cd visa2au

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## TinaCMS Integration

This project includes TinaCMS for content management.

### Local Development with TinaCMS

```bash
# Start development with TinaCMS admin
npm run tina-dev
```

Access the TinaCMS admin panel at `http://localhost:5173/_admin`

### TinaCMS Setup

1. Sign up at https://app.tina.io
2. Create a new project or connect to existing
3. Get your Client ID and Token
4. Add environment variables:

```env
TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token
```

## Deployment

### Cloudflare Pages

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - Build command: `npm run build`
   - Build output: `dist`
4. Add environment variables if needed

### Custom Domain

To add `test.visa2.au`:

1. Go to Cloudflare Pages Dashboard
2. Select the project
3. Go to Custom Domains
4. Add `test.visa2.au`
5. DNS will be configured automatically

## Project Structure

```
visa2au/
├── public/              # Static assets
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── content/        # Markdown content (for TinaCMS)
│   ├── App.tsx         # Main app component
│   └── main.tsx       # Entry point
├── tina/               # TinaCMS configuration
├── .github/            # GitHub workflows
└── GITHUB_MIGRATION_GUIDE.md  # Deployment guide
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run tina-dev` | Start with TinaCMS admin |

## License

Private - All rights reserved

## Contact

- **Email:** info@visa2.au
- **Phone:** +61 2 9136 2462 (voicemail)
- **Address:** Level 17, 1 Denison Street, North Sydney NSW 2060

## Useful Links

- [TinaCMS Documentation](https://tina.io/docs/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
