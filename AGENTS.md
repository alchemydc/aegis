# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Overview

Aegis (product name **adblocked.ai**) blocks ads in cloud AI chat interfaces, starting with ChatGPT. Two independent npm projects with no shared root package — always `cd` into one first:

- `plugin/` — MV3 browser extension (WXT + TypeScript strict, no React)
- `website/` — Astro static marketing site (Tailwind, React islands), deployed to https://adblocked.ai
- `docs/` — product brief, design decisions, implementation plans. `docs/design_decisions.md` is the authoritative source for extension architecture choices.

Node 20+, npm 10+.

## Commands

Extension (`cd plugin`):
- `npm install` — also runs `wxt prepare` (generates `.wxt/` types)
- `npm run dev` — launches Chromium with the extension loaded; open chatgpt.com
- `npm run compile` — type-check (`tsc --noEmit`)
- `npm run build` — output in `plugin/.output/chrome-mv3/` (load unpacked via chrome://extensions)
- `npm run zip` — packaged build
- `COMMIT_SHA` env var is injected at build time as the `__COMMIT_SHA__` global (defaults to `dev`).

Website (`cd website`):
- `npm run dev` (http://localhost:4321), `npm run build` (→ `website/dist/`), `npm run preview`

There is no test suite and no lint script in either project.

## Extension architecture

The extension is a **rule applier, not a detector** — do not add detection heuristics or semantic classification. Ad selectors are curated externally by the team and bundled as JSON.

Flow:
1. `entrypoints/content.ts` (runs at `document_start` on chatgpt.com) calls `lib/rules.ts#loadRulesForHost` to map hostname → `Platform` → `rules/<platform>.json`.
2. If settings allow (`lib/storage.ts`: `enabled` flag + hostname `whitelist` in `browser.storage.local`), `lib/blocker.ts` injects a single `<style id="adblocked-ai-style">` hiding all selectors with `display: none !important`, and starts a rAF-throttled `MutationObserver` that only *counts* newly matched elements (hiding is done purely by CSS).
3. Each new match sends a `BlockEvent` message (`lib/messages.ts`) to `entrypoints/background.ts`, which calls `lib/counter.ts#reportBlocked` to increment `counter:total` and `counter:host:<host>` in storage.
4. Popup/options (`entrypoints/popup`, `entrypoints/options`) are plain TS + DOM, reading/writing the same storage keys and reacting via `onSettingsChange`.

Adding a platform requires touching: a new `rules/<platform>.json`, the `Platform` union in `lib/messages.ts`, `PLATFORM_BY_HOST`/`RULES_BY_PLATFORM` in `lib/rules.ts`, `host_permissions` in `wxt.config.ts`, and `matches` in `entrypoints/content.ts`.

Key constraints (from `docs/design_decisions.md`):
- **Zero outbound telemetry in v0.** The marketing site promises no data leaves the browser. `reportBlocked()` in `lib/counter.ts` is the *only* telemetry seam — never add `fetch()` calls elsewhere for analytics.
- MV3 service workers are evicted when idle: keep state in `browser.storage.local`, not memory; use `chrome.alarms`, not `setInterval`.
- Bundled rules only; remote rule sync is deferred.
- Use `browser` from `wxt/browser`, not the `chrome` global.

## Website

Astro static output with `@astrojs/react`, `@astrojs/tailwind` (v3), `@astrojs/sitemap`. Pages in `src/pages/` compose components from `src/components/` inside `src/layouts/Base.astro`. React is used only for interactive islands (e.g. `FAQAccordion.jsx` with `client:load`). Brand colors (`navy`, `cyan`, `coral`, etc.) are defined in `tailwind.config.js`; dark mode is `media`-based.

Deployment: `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on pushes to `main` that touch `website/**`. Custom domain via `website/public/CNAME`.
