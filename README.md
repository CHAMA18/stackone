# StackOne | Engineering the Extraordinary

A world-class, dark premium landing page for StackOne — a software agency building extraordinary digital products across Africa and beyond. Built with Next.js 16, React 19, Tailwind CSS 4, and framer-motion.

![StackOne](public/images/stackone-logo.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Animations | framer-motion, CSS Keyframes |
| Components | Radix UI, shadcn/ui |
| Language | TypeScript |
| Fonts | Satoshi (fontshare), JetBrains Mono (Google Fonts) |
| Icons | Material Symbols Outlined |
| Build | Bun runtime |
| Output | Static HTML (easy deployment anywhere) |

---

## Features

- **Canvas Particle Network** — Interactive hero particles with mouse repulsion
- **Mouse-Tracking Gradient** — Dynamic radial gradient that follows cursor position
- **Custom Animated Cursor** — Glow ring + dot cursor with hover state changes
- **Scroll Progress Bar** — Fixed progress indicator for page scroll position
- **Scroll Reveal Animations** — Intersection Observer-powered staggered entrance animations
- **framer-motion Expertise Carousel** — Spring-physics carousel for services section
- **Animated Counters** — Number count-up animations for stats
- **Trust Marquee** — Infinite scrolling client logos
- **Tech Stack Grid** — Interactive hover-glow tech capabilities grid
- **Testimonials Carousel** — Auto-playing testimonial slider
- **Text Reveal** — Word-by-word scroll-triggered text animation
- **Parallax Images** — Scroll-speed offset image components
- **Glass Morphism Panels** — Backdrop-blur cards with inner glow borders
- **Logo-Featured Case Studies** — 6 African-focused ventures with branded logos
- **Dark Premium Theme** — Custom design tokens with gradient text and glow effects

---

## Project Structure

```
stackone/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main landing page (all sections)
│   │   ├── layout.tsx          # Root layout with fonts & metadata
│   │   ├── globals.css         # Custom properties, animations, glass effects
│   │   └── api/route.ts        # API route
│   ├── components/
│   │   ├── hero-particles.tsx  # Canvas particle network
│   │   ├── mouse-gradient.tsx  # Cursor-following gradient
│   │   ├── premium-cursor.tsx  # Custom animated cursor
│   │   ├── scroll-progress.tsx # Scroll progress bar
│   │   ├── scroll-reveal.tsx   # Scroll-triggered animations
│   │   ├── expertise-carousel.tsx # framer-motion carousel
│   │   ├── animated-counter.tsx   # Number count-up
│   │   ├── trust-marquee.tsx      # Infinite logo scroll
│   │   ├── tech-stack.tsx         # Interactive tech grid
│   │   ├── testimonials.tsx       # Testimonial carousel
│   │   ├── text-reveal.tsx        # Word-by-word reveal
│   │   ├── parallax-image.tsx     # Parallax scroll images
│   │   ├── aurora-background.tsx  # Aurora gradient bg
│   │   ├── spotlight-card.tsx     # Hover spotlight card
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/
│   └── lib/
├── public/
│   └── images/                 # Logos, team portraits, venture images
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.17 (or Bun >= 1.0)
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/CHAMA18/stackone.git
cd stackone

# Install dependencies
npm install
# or with bun
bun install
```

### Development

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
# Static files output to: out/
```

---

## Deployment

This project exports as **static HTML** (`out/` directory). Deploy it anywhere that serves static files — no Node.js server needed.

**Publish Directory:** `out`

---

### Deploy on Render

1. Go to [render.com](https://render.com) → **New** → **Static Site**
2. Connect your GitHub repo `CHAMA18/stackone`
3. Set:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `out`
4. Click **Create Static Site**

Your site will be live at `https://stackone-xxxx.onrender.com`

---

### Deploy on Vercel

Vercel is the official platform from the creators of Next.js and offers zero-config deployment.

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"** and select the `stackone` repository
3. **Framework Preset:** Next.js (auto-detected)
4. **Click "Deploy"** — Vercel handles the rest
5. Your site will be live at `https://stackone-<hash>.vercel.app`

> **Custom Domain:** In Vercel dashboard → Settings → Domains → Add your custom domain

---

### Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
2. Select the `stackone` GitHub repo
3. Set:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `out`
4. Click "Deploy"

---

### Deploy on Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a project
2. Connect GitHub → Select `stackone`
3. Set:
   - **Build Command:** `npm run build`
   - **Build output directory:** `out`
4. Click "Save and Deploy"

---

### Deploy on GitHub Pages

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
```

2. Go to repo Settings → Pages → Source: GitHub Actions

---

### Deploy Anywhere (FTP, S3, Firebase, etc.)

```bash
npm install && npm run build
# Upload the "out/" folder to any static host
```

---

## Environment Variables

Create a `.env.local` file for any environment-specific configuration:

```env
# Example — add your own keys as needed
NEXT_PUBLIC_SITE_URL=https://stackone.africa
```

> **Note:** The landing page runs without any required environment variables. All data is statically generated.

---

## Customization

### Change Brand Colors

Edit the CSS custom properties in `src/app/globals.css`:

```css
:root {
  --primary-h: 220;       /* Hue */
  --primary-s: 80%;       /* Saturation */
  --primary-l: 55%;       /* Lightness */
}
```

### Update Content

All section content lives in `src/app/page.tsx` as typed constants at the top of the file:

- `STATS` — Hero statistics
- `VENTURES` — Case studies with logos, descriptions, and metrics
- `APPROACH_STEPS` — Methodology steps
- `TEAM` — Team members with portraits
- Navigation links and footer content

### Replace Images

Drop your images into `public/images/` and update the corresponding paths in the data constants.

---

## License

MIT

---

Built by [Chungu Chipimo Chama](https://github.com/CHAMA18) — StackOne
