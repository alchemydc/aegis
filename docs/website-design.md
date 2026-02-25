# Aegis Marketing Website — Design Proposal v1

## 1. Framework: Astro + React Islands

**Recommendation:** Astro with selective React components (island architecture)

| Criteria | Astro + React | React + Vite | Next.js |
|----------|---------------|-------------|---------|
| Load Performance | ★★★★★ (HTML-first, minimal JS) | ★★★ (needs optimization) | ★★★★ (great, but heavier) |
| SEO Out-of-Box | ★★★★★ (static HTML native) | ★★★ (needs setup) | ★★★★★ |
| Build Speed | ★★★★★ (incredibly fast) | ★★★★ | ★★★ |
| Deployment Simplicity | ★★★★★ (static output) | ★★★★ | ★★★ |

**Why Astro:**
- Marketing sites are static content — no reason to ship bloated JS hydration for every page
- Islands architecture: React only for **interactive elements** (FAQ accordion, demo toggle, contact form)
- Deploy as static files to CDN — zero server, instant global delivery
- Built-in image optimization, code splitting, dark mode support
- Vite under the hood

---

## 2. Sitemap

```
/                       Landing/Home (primary conversion funnel)
/features               Detailed feature breakdown
/how-it-works           Step-by-step visual guide
/privacy-security       Privacy policy + security details + transparency
/faq                    Common questions
/download               Install instructions (mock for now → Chrome Web Store later)
/about                  Team, mission, why we built this
/contact                Simple contact form
/blog (future)          Articles on AI ad trends, user privacy
/404                    Error page
```

---

## 3. Visual Design

### Color Palette

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary (Trust) | Deep Navy | `#0F2B59` | Buttons, headers, CTAs |
| Secondary (Signal) | Vibrant Cyan | `#00D9FF` | Accents, hover states, shield glow |
| Accent (Blocking) | Coral Red | `#FF6B4A` | "Blocked ads" highlights, warnings |
| Success | Emerald Green | `#10B981` | Checkmarks, "protected" states |
| Background | Off-White | `#FAFBFC` | Page background (light mode) |
| Dark BG | Deep Charcoal | `#0D1117` | Dark mode alternate |
| Text (Primary) | Slate | `#1E293B` | Body text |
| Text (Secondary) | Gray | `#64748B` | Muted text, labels |
| Border | Light Gray | `#E2E8F0` | Dividers, UI elements |

### Typography (Google Fonts)

- **Headlines:** `Inter Bold` (700–900) — clean, geometric, tech-forward
- **Body:** `Inter Regular` (400–500) — same family for consistency
- **Monospace:** `JetBrains Mono` (400) — stats, technical context

### Logo

**Type:** Combination mark — icon + wordmark
- **Icon:** Stylized "A" built from circuit board traces (neural paths) with a glassmorphism shield at center
- **Wordmark:** "AEGIS" in clean, wide sans-serif with cyan-to-navy gradient
- **Native environment:** Dark backgrounds (`#0D1117`) — cyan glows and glassmorphism pop here
- **Light variant needed:** Remove outer glow, solid navy (`#0F2B59`) for wordmark/traces, solid cyan for shield icon

**Usage:**
- **Favicon / nav icon:** "A-Shield" icon standalone
- **Hero section:** Full combination mark (icon + wordmark)
- **Footer:** Full combination mark, smaller scale

**File:** `website/assets/aegis_logo.png` (2816×1536, PNG w/ alpha)
**TODO:** Generate light variant + extract standalone icon for favicon/nav

### Aesthetic: Modern Minimalist + Glassmorphism Accents

- Clean, spacious, uncluttered
- 12-column responsive grid; generous margins
- Subtle shadows: `0 2px 8px rgba(15,43,89,0.1)` for cards
- Thin borders (1px), rounded corners (8–12px)
- **Hero: dark-first** — dark charcoal (`#0D1117`) background so the logo glows natively; frosted-glass accents via `backdrop-filter: blur(10px)`
- Remaining sections on off-white (`#FAFBFC`) with light logo variant
- Auto dark mode flips remaining sections to dark as well
- **Icons:** Feather-style (stroke 1.5–2px), monochrome in brand colors
- **Illustrations:** Flat, geometric vector style with circuit/neural motifs echoing the logo

---

## 4. Landing Page Sections

### Nav (Fixed, sticky)
```
Logo + "AEGIS" | [Features] [How It Works] [Privacy] [FAQ] | [Download ▸]
```

### Hero (Full viewport, dark background `#0D1117`)
- **Background:** Dark charcoal — logo's native environment, cyan glows pop
- **Logo:** Full combination mark ("A-Shield" icon + AEGIS wordmark), centered above headline
- **Headline:** "Block Ads on ChatGPT. Instantly."
- **Subheadline:** "AI platforms are injecting ads into your conversations. Aegis shields you—silently, instantly, for free."
- **Tagline (below subheadline):** "Ads Off. Conversations On."
- **Primary CTA:** "Install Free Extension" → /download
- **Secondary CTA:** "See How It Works" → scroll
- **Visual:** Auto-playing demo video (muted, looping) — ad being blocked in real-time
- **Text color:** White/light gray for contrast against dark background

### Stats / Social Proof
```
[ 2.3M+ ads blocked ] [ 50K+ active users ] [ 99.9% uptime ]
```
*(Placeholder numbers for MVP)*

### Features (3-column cards)
1. **Real-Time Blocking** — Detects and removes ads instantly
2. **Zero-Click Installation** — One-click install, no config
3. **Transparent Privacy** — No data collection, open-source

### How It Works (3 steps, alternating layout)
1. **Install** — One-click from Chrome Web Store
2. **Browse** — Visit ChatGPT, use it normally
3. **Protected** — Ads blocked in real-time, silently

### Trust / Privacy
- **Headline:** "Your Privacy Is Sacred"
- No Data Collection — runs entirely on your device
- Open Source — community audited
- GDPR Compliant — download & review privacy policy

### FAQ (Accordion, React island)
- Does Aegis slow down ChatGPT?
- What data does Aegis collect?
- Does it work on mobile?
- Can I use it on other platforms?
- Is it free forever?

### Final CTA
```
"Protect Your Conversations Today"
[Install Free] — No credit card. No tracking.
```

### Footer
```
PRODUCT          COMPANY        LEGAL
· Features       · About        · Privacy
· How It Works   · Blog (soon)  · Terms
· Download       · Contact      · Transparency
· FAQ            · Roadmap

© 2026 Aegis. Open Source.
[GitHub] [Twitter/X] [Reddit]
```

---

## 5. Messaging

### Tagline
**"Ads Off. Conversations On."** ✓ confirmed

*Rationale: Punchy, action-oriented, matches the "intercept and clean" vibe of the circuit-based logo.*

### Value Propositions
1. **Block Every Ad in Real-Time** — detects and removes the moment it appears
2. **Zero Data Collection. Pure Privacy.** — runs 100% on your device, no servers, no logging
3. **Free. Open. Always.** — open source, transparent, community-driven
4. **Works Out of the Box** — one-click install, no configuration

### Tone of Voice
- **Confident:** Own the solution — don't hedge
- **Protective:** "shield," "protect," "defend," "reclaim"
- **Approachable:** Clear, human language — no jargon
- **Direct:** Lead with benefit. Short sentences.

✅ "We block ads instantly."
❌ "Aegis may help reduce some ad experiences."

---

## 6. Technical Architecture

### Project Structure
```
aegis/
├── public/
│   ├── images/           (hero demo, logo, icons, illustrations)
│   └── fonts/
│
├── src/
│   ├── layouts/
│   │   └── Base.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── features.astro
│   │   ├── how-it-works.astro
│   │   ├── privacy-security.astro
│   │   ├── faq.astro
│   │   ├── download.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── FeatureCard.astro
│   │   ├── StatsSection.astro
│   │   ├── CTAButton.astro
│   │   ├── FAQAccordion.jsx    (React island)
│   │   ├── ContactForm.jsx     (React island)
│   │   └── HeroVideo.jsx       (React island)
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   └── data/
│       ├── features.json
│       ├── faq.json
│       └── navigation.json
│
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Key Dependencies
- **Core:** `astro@4.x`, `react@18.x`, `tailwindcss@3.x`
- **Utilities:** `autoprefixer`, `postcss`, `react-hook-form` (forms), `classnames`
- **Analytics:** `plausible-tracker` (privacy-first)

### Deployment: GitHub Pages (primary) / Vercel (fallback)

**Primary — GitHub Pages:**
- Astro outputs pure static files → perfect fit, zero extra services
- Use GitHub Actions to build (`astro build`) and deploy `dist/` on push to `main`
- Free, fast CDN, custom domain support
- No additional accounts or config needed

**Fallback — Vercel (already set up):**
- Use if we need preview deploys per PR, edge functions, or server-side form handling later
- Connect repo → auto-deploy, zero config for Astro
