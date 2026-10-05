# Aegis

Ad-blocking for cloud AI chat interfaces, starting with ChatGPT.

## Current Focus

The marketing website (`website/`) is live at https://adblocked.ai; active development is on the browser extension (`plugin/`).

## Repository Layout

```text
.
├── docs/                 Product brief, design decisions
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

- Node.js 22+ (required by WXT 0.21)
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

WXT watches the source and rebuilds into `plugin/.output/chrome-mv3-dev/`. It does not launch a browser. Load that directory once as an unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked); the extension reloads itself after each rebuild. Open `chatgpt.com`, and elements matching the selectors in `rules/chatgpt.json` will be hidden.

Auto-launching a browser would require WXT's optional `web-ext` peer dependency. It is intentionally not installed because it pulls in vulnerable dependencies.

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

The extension is a modular rule applier — selectors are curated externally and consumed via `rules/<platform>.json`. See `docs/design_decisions.md` for telemetry posture, detection strategy, and stack rationale.

### Privacy mechanical test

The extension is committed to zero outbound telemetry in v0. To verify:

1. Open Chrome DevTools → Network tab.
2. Filter by the extension's IDs (content script + service worker).
3. Use the extension on `chatgpt.com`.
4. Confirm zero outbound requests.
