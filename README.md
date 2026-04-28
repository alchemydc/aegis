# Aegis

Ad-blocking for cloud AI chat interfaces, starting with ChatGPT.

## Current Focus

The active codebase in this repository is the marketing website in `website/`.

## Repository Layout

```text
.
├── docs/                 Product brief, design notes, design decisions, implementation plan
├── plugin/               Browser extension (WXT + TypeScript, MV3)
├── website/              Astro marketing site
└── README.md             This file
```

## Local Development (Website)

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
cd website
npm install
```

### 2. Start dev server

```bash
npm run dev
```

Default URL: `http://localhost:4321`

### 3. Build for production

```bash
npm run build
```

Build output is generated in `website/dist/`.

### 4. Preview production build locally

```bash
npm run preview
```

## Deployment

GitHub Pages deploys are automated via GitHub Actions using `.github/workflows/deploy.yml`.

## Local Development (Extension)

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
cd plugin
npm install
```

### 2. Start dev mode

```bash
npm run dev
```

WXT launches a Chromium window with the extension auto-loaded. Open `chatgpt.com`; placeholder selectors from `rules/chatgpt.json` will be hidden.

### 3. Type-check

```bash
npm run compile
```

### 4. Production build

```bash
npm run build
```

Output is generated in `plugin/.output/chrome-mv3/`. Load it as an unpacked extension in Chrome via `chrome://extensions` → Developer mode → Load unpacked.

### Architecture overview

The extension is a modular rule applier — selectors are curated externally and consumed via `rules/<platform>.json`. See:
- `docs/plugin_implementation_plan.md` — implementation plan and phase breakdown
- `docs/design_decisions.md` — telemetry posture, detection strategy, stack rationale
- `docs/high_level_design_prompt.md` — original architecture proposal

### Privacy mechanical test

The extension is committed to zero outbound telemetry in v0. To verify:

1. Open Chrome DevTools → Network tab.
2. Filter by the extension's IDs (content script + service worker).
3. Use the extension on `chatgpt.com`.
4. Confirm zero outbound requests.
