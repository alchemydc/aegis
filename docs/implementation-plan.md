# Aegis Marketing Website — Implementation Plan

> **Purpose:** Step-by-step instructions for scaffolding and building the Aegis marketing site.
> An implementation agent should be able to execute this plan top-to-bottom without design decisions.
> All design decisions are finalized in `docs/website-design.md`.

---

## Phase 1: Project Scaffold

### 1.1 Initialize Astro project

Run from `/Users/dc/Projects/aegis/website/`:

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

- Use the `website/` directory as the project root (it already exists with `assets/`)
- `--no-git` because the parent repo already has git
- `--typescript strict` for type safety

### 1.2 Install dependencies

```bash
npm install react react-dom @astrojs/react
npm install tailwindcss @astrojs/tailwind autoprefixer postcss
npm install classnames
npm install -D prettier eslint
```

Do NOT install `react-hook-form`, `plausible-tracker`, or `lottie-react` yet — defer until those features are built.

### 1.3 Configure Astro

**`website/astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  site: 'https://aegis.dev', // placeholder — update when domain is set
});
```

### 1.4 Configure Tailwind

**`website/tailwind.config.js`:**
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        navy: '#0F2B59',
        cyan: '#00D9FF',
        coral: '#FF6B4A',
        emerald: '#10B981',
        charcoal: '#0D1117',
        'off-white': '#FAFBFC',
        slate: '#1E293B',
        'gray-muted': '#64748B',
        'border-light': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### 1.5 Move logo into public/

```bash
mkdir -p website/public/images
cp website/assets/aegis_logo.png website/public/images/aegis_logo.png
```

Keep `website/assets/` as the source-of-truth for originals. `public/images/` is Astro's static serving directory.

### 1.6 Create global styles

**`website/src/styles/global.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply font-sans text-slate antialiased;
  }
}
```

### 1.7 Verify scaffold

```bash
cd website && npm run dev
```

Confirm: dev server starts, Tailwind classes work, no errors.

---

## Phase 2: Layouts & Shared Components

### 2.1 Base Layout — `src/layouts/Base.astro`

Responsibilities:
- `<html>` shell with `lang="en"`, meta charset, viewport
- `<head>`: page title (prop), meta description (prop), Open Graph tags, favicon link
- Import `global.css`
- Render `<Navbar />` above `<slot />`
- Render `<Footer />` below `<slot />`

Props: `{ title: string, description?: string }`

### 2.2 Navbar — `src/components/Navbar.astro`

Spec:
- Fixed position, sticky top, z-50
- Left: logo image (`/images/aegis_logo.png`, height 40px) — link to `/`
- Center/right: nav links — Features, How It Works, Privacy, FAQ
- Far right: CTA button "Download" → `/download` — cyan bg, navy text, rounded-lg
- **Mobile:** hamburger menu (can use a simple `<details>` element — no React needed)
- Background: semi-transparent with backdrop blur (`bg-charcoal/90 backdrop-blur-md`)
- Border bottom: `border-border-light/10`

Data source: hardcode nav links in the component (only 5 items, no need for JSON).

### 2.3 Footer — `src/components/Footer.astro`

Spec:
- Dark background (`bg-charcoal`), light text
- 3-column grid (Product / Company / Legal) with link lists per the design doc
- Bottom bar: copyright "© 2026 Aegis. Open Source." + social icon links (GitHub, X, Reddit — use inline SVGs or text links for now)
- Responsive: stack columns vertically on mobile

### 2.4 CTAButton — `src/components/CTAButton.astro`

Reusable button/link component.

Props: `{ href: string, variant?: 'primary' | 'secondary', size?: 'sm' | 'lg' }`

- **Primary:** `bg-cyan text-navy font-bold` + hover glow effect
- **Secondary:** `border border-cyan text-cyan` transparent bg + hover fill
- Renders an `<a>` tag (not `<button>`) since all CTAs are navigation links

---

## Phase 3: Landing Page (`src/pages/index.astro`)

Build each section as a separate Astro component, composed in `index.astro` inside `<Base>`.

### 3.1 Hero — `src/components/Hero.astro`

- Full viewport height (`min-h-screen`), flex centered
- Background: `bg-charcoal`
- Content stack (centered, max-w-4xl):
  1. Logo image: `aegis_logo.png`, max-width 480px, centered
  2. Headline: `<h1>` — "Block Ads on ChatGPT. Instantly." — `text-4xl md:text-6xl font-black text-white`
  3. Subheadline: `<p>` — "AI platforms are injecting ads..." — `text-lg md:text-xl text-gray-muted mt-4`
  4. Tagline: `<p>` — "Ads Off. Conversations On." — `text-cyan font-semibold text-lg mt-2`
  5. CTA row: flex gap-4, primary + secondary CTAButtons
- Optional: subtle radial gradient behind logo (`radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%)`) to echo the logo glow

### 3.2 StatsSection — `src/components/StatsSection.astro`

- Light background (`bg-off-white`), py-16
- 3-column grid (responsive: stack on mobile)
- Each stat: large number in `font-mono text-3xl text-navy font-bold` + label in `text-gray-muted text-sm`
- Data hardcoded: `["2.3M+", "ads blocked monthly"]`, `["50K+", "active users"]`, `["99.9%", "uptime & privacy"]`
- Subtle top border to separate from dark hero

### 3.3 FeaturesSection — `src/components/FeaturesSection.astro` + `FeatureCard.astro`

- Section heading: "Key Features" — centered, `text-3xl font-bold text-navy`
- 3-column card grid (stack on mobile)
- Each `FeatureCard`: icon placeholder (use emoji or inline SVG for now), title (`font-semibold text-lg`), description (`text-gray-muted`)
- Cards: `bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`
- Feature data:
  1. icon: shield, title: "Real-Time Blocking", desc: "Detects and removes ads the moment they appear—no lag, no manual intervention."
  2. icon: zap, title: "Zero-Click Installation", desc: "One-click install from the Chrome Web Store. No configuration needed."
  3. icon: eye-off, title: "Transparent Privacy", desc: "No data collection. Runs entirely on your device. Open source and community audited."

### 3.4 HowItWorks — `src/components/HowItWorks.astro`

- Section heading: "How It Works" — centered
- Light gray background (`bg-gray-50`) for contrast
- 3 steps, alternating layout (text-left/image-right, then image-left/text-right)
- Each step: step number badge (`bg-cyan text-navy rounded-full w-8 h-8`), title, description
- Image/visual side: placeholder boxes (`bg-border-light rounded-lg aspect-video`) — replace with screenshots later
- On mobile: stack vertically, all left-aligned

### 3.5 TrustSection — `src/components/TrustSection.astro`

- Heading: "Your Privacy Is Sacred" — centered, `text-3xl font-bold`
- 3-column grid of trust points:
  1. "No Data Collection" — "Aegis runs entirely on your device. No servers logging your conversations."
  2. "Open Source" — "Code is fully transparent. Community audited."
  3. "GDPR Compliant" — "Respects all privacy laws."
- Each: icon + title + description. Similar card style to features but no shadow.

### 3.6 FAQ — `src/components/FAQAccordion.jsx` (React island)

This is a **React component** rendered with `client:load` in the page.

- Receives FAQ data as props (array of `{ question: string, answer: string }`)
- Accordion behavior: click question to toggle answer visibility
- Only one item open at a time
- Styling: `border-b border-border-light`, question is `font-semibold cursor-pointer py-4`, answer is `text-gray-muted pb-4`
- Use `useState` — no external libraries needed

FAQ data (pass from the Astro page):
```json
[
  { "question": "Does Aegis slow down ChatGPT?", "answer": "No. Aegis operates with negligible overhead. It intercepts ad elements before they render, so you won't notice any difference in performance." },
  { "question": "What data does Aegis collect?", "answer": "None. Aegis runs 100% on your device. No data ever leaves your browser. No analytics, no tracking, no servers." },
  { "question": "Does it work on mobile?", "answer": "Not yet. Aegis currently supports desktop Chrome. Mobile browser support is on our roadmap." },
  { "question": "Can I use it on other AI platforms?", "answer": "We're starting with ChatGPT. Support for other AI platforms is planned for future releases." },
  { "question": "Is it free forever?", "answer": "Yes. Aegis is free and open source. No premium tiers, no paywalls." }
]
```

### 3.7 FinalCTA — `src/components/FinalCTA.astro`

- Dark background (`bg-navy`), py-20, text centered
- Heading: "Protect Your Conversations Today" — `text-3xl font-bold text-white`
- Subtext: "No credit card. No tracking." — `text-gray-muted mt-2`
- Primary CTAButton (large): "Install Free Extension"

### 3.8 Compose in `index.astro`

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import StatsSection from '../components/StatsSection.astro';
import FeaturesSection from '../components/FeaturesSection.astro';
import HowItWorks from '../components/HowItWorks.astro';
import TrustSection from '../components/TrustSection.astro';
import FAQAccordion from '../components/FAQAccordion.jsx';
import FinalCTA from '../components/FinalCTA.astro';

const faqData = [ /* ... FAQ items ... */ ];
---

<Base title="Aegis — Block Ads on ChatGPT" description="Aegis shields your AI conversations from intrusive advertising. Free, open source, private.">
  <Hero />
  <StatsSection />
  <FeaturesSection />
  <HowItWorks />
  <TrustSection />
  <section class="max-w-3xl mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-center text-navy mb-8">Frequently Asked Questions</h2>
    <FAQAccordion client:load items={faqData} />
  </section>
  <FinalCTA />
</Base>
```

---

## Phase 4: Secondary Pages (stub with real content)

Each page uses `<Base>` layout. For MVP, these are simple content pages — no interactive components needed.

### 4.1 `/features` — `src/pages/features.astro`
- Expanded version of the landing page features section
- 2-column layout: icon/visual left, text right for each feature
- Same 3 features but with longer descriptions + additional detail

### 4.2 `/how-it-works` — `src/pages/how-it-works.astro`
- Expanded 3-step guide with placeholder screenshots
- Each step gets its own section with more detail

### 4.3 `/privacy-security` — `src/pages/privacy-security.astro`
- Full privacy policy text
- "What we collect" → "Nothing" section
- Open source transparency section with link to GitHub repo
- GDPR compliance statement

### 4.4 `/faq` — `src/pages/faq.astro`
- Full-page version of the FAQ accordion (reuse the same React component + data)

### 4.5 `/download` — `src/pages/download.astro`
- Hero-style section: "Install Aegis"
- Mock install instructions (3 steps with screenshot placeholders)
- "Coming soon to Chrome Web Store" badge
- CTAButton disabled/styled as "coming soon"

### 4.6 `/about` — `src/pages/about.astro`
- Mission statement: why we built this
- "AI platforms are monetizing your conversations" narrative
- Team section (placeholder for now)

### 4.7 `/contact` — `src/pages/contact.astro`
- Simple contact form (React island: `ContactForm.jsx`)
- Fields: name, email, message
- For MVP: `mailto:` link or static form (no backend)
- Defer `react-hook-form` until this page is built

### 4.8 `/404` — `src/pages/404.astro`
- "Page not found" with animated shield icon (CSS only)
- Link back to home

---

## Phase 5: Responsive & Polish

### 5.1 Responsive breakpoints
Tailwind defaults are fine:
- `sm:` 640px — mobile landscape
- `md:` 768px — tablet
- `lg:` 1024px — desktop
- `xl:` 1280px — large desktop

Test every component at each breakpoint. Key areas to verify:
- Navbar hamburger menu on mobile
- Feature cards stack to 1 column on mobile, 2 on tablet, 3 on desktop
- Hero text sizes scale down properly
- Footer columns stack on mobile

### 5.2 Dark mode
- Tailwind `darkMode: 'media'` handles OS preference
- Hero is always dark (no change needed)
- Light sections: add `dark:bg-charcoal dark:text-white` variants
- Cards: `dark:bg-charcoal/50 dark:border-border-light/10`
- Stats numbers: `dark:text-cyan`

### 5.3 Animations (CSS only, no libraries)
- Navbar: `transition-all duration-300` on scroll (add slight shadow)
- Feature cards: `hover:shadow-md hover:-translate-y-1 transition-all duration-200`
- Stats: fade-in on scroll using CSS `@keyframes` + `IntersectionObserver` (small inline `<script>`)
- FAQ: `transition-[max-height] duration-300` for accordion expand

### 5.4 SEO & Meta
- Each page: unique `<title>` and `<meta name="description">`
- Open Graph image: use logo or create a 1200x630 OG image
- Add `robots.txt` and `sitemap.xml` (Astro has `@astrojs/sitemap` integration)

---

## Phase 6: Deployment (GitHub Pages)

### 6.1 Install Astro GitHub Pages adapter

```bash
npm install @astrojs/sitemap
```

Update `astro.config.mjs`:
```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  output: 'static',
  site: 'https://aegis.dev',
});
```

### 6.2 GitHub Actions workflow

Create `.github/workflows/deploy.yml` in the **repo root** (not inside `website/`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths: ['website/**']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: website/package-lock.json
      - run: cd website && npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 6.3 Enable GitHub Pages
- Repo Settings → Pages → Source: "GitHub Actions"

---

## Build Order Summary

| Step | What | Depends on | Verify |
|------|------|-----------|--------|
| 1.1–1.7 | Scaffold + config | Nothing | `npm run dev` starts clean |
| 2.1 | Base layout | 1.x | Pages render with `<head>` |
| 2.2–2.4 | Navbar, Footer, CTAButton | 2.1 | Nav + footer visible on all pages |
| 3.1 | Hero | 2.x | Landing page hero renders, logo shows |
| 3.2–3.5 | Stats, Features, HowItWorks, Trust | 2.x | Sections render in order |
| 3.6 | FAQ accordion | 2.x | React island hydrates, accordion works |
| 3.7–3.8 | FinalCTA + compose index | 3.1–3.6 | Full landing page scrolls correctly |
| 4.x | Secondary pages | 2.x | All routes resolve, content displays |
| 5.x | Responsive + polish | 3.x + 4.x | Test all breakpoints, dark mode |
| 6.x | Deploy | 5.x | Site live on GitHub Pages |

---

## Key Reminders for the Implementing Agent

1. **Do not over-engineer.** This is a marketing site. No state management libraries, no complex routing, no SSR.
2. **React is ONLY for:** FAQAccordion, ContactForm, and HeroVideo (if added). Everything else is Astro components.
3. **Use `client:load`** for React islands (not `client:only` or `client:visible`) — these components are above the fold or user-expected.
4. **All copy/content** is defined in the design doc (`docs/website-design.md`). Do not invent new copy.
5. **Placeholder images:** Use colored `<div>` boxes with `aspect-video rounded-lg bg-border-light` for any screenshot/illustration placeholder.
6. **Logo file** is at `website/assets/aegis_logo.png` — copy to `public/images/` during scaffold.
7. **Do NOT install** packages that aren't needed yet (lottie, plausible, react-hook-form). Install when the feature is built.
8. **Test after each phase** — run `npm run dev`, verify in browser, then move on.
