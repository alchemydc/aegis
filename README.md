# Aegis

Ad-blocking for cloud AI chat interfaces, starting with ChatGPT.

## Current Focus

The active codebase in this repository is the marketing website in `website/`.

## Repository Layout

```text
.
├── docs/                 Product brief, design notes, implementation plan
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

## Blocking Technology (Placeholders)

These sections are intentionally placeholders while extension implementation is pending.

### Target Surfaces (Placeholder)

- ChatGPT web UI (initial target)
- Additional AI chat surfaces (future)

### Detection Strategy (Placeholder)

- Rule-based DOM pattern detection
- Sponsored element heuristics
- Resilience to UI/layout changes

### Neutralization Strategy (Placeholder)

- Remove or hide matched ad containers
- Preserve layout stability after removal
- Minimize visual flicker

### Privacy and Data Handling (Placeholder)

- Local-only processing in browser context
- No conversation exfiltration
- No telemetry by default

### Testing Approach (Placeholder)

- Snapshot tests for known ad patterns
- Regression checks against UI updates
- Manual verification in supported browsers

### Packaging and Distribution (Placeholder)

- Browser extension packaging plan
- Versioning and release checklist
- Store submission workflow
