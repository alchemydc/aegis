# Plan: adblocked.ai Browser Extension v0 Scaffold

## Context

The marketing site for adblocked.ai (codename: Aegis) is built and live; `plugin/` is empty. This plan scaffolds the actual browser extension as a modular, rule-driven MV3 extension.

Two facts shaped the plan:

1. **Detection is solved out-of-band.** The team has already curated ad selectors for ChatGPT and will provide more. The extension is a *rule applier*, not a detector. No heuristics, semantic classification, or "soft-match" logic in scope.
2. **Telemetry posture for v0: zero outbound, with a seam.** A `reportBlocked()` hook lives in the service worker but only writes to `chrome.storage.local`. Keeps all four telemetry tiers (zero, opt-in, default-on, P3A) achievable in v0.1+ without architectural rework. Trade-offs are documented in `docs/design_decisions.md`.

The high-level design doc (`docs/high_level_design_prompt.md`) is correct on stack (WXT, TypeScript, MV3, hybrid DNR + content script) and on hide-don't-remove. Where it overreached — soft-ad detection, remote rule sync, an aggregate counter — those concerns are deferred from v0 by this plan. See `docs/design_decisions.md` for why.

## Architecture (v0)

**Stack:** WXT (file-based entrypoints, Vite build, cross-browser output) + TypeScript strict + Tailwind for popup/options. **No React** — a toggle and a counter don't justify it.

**Manifest (MV3) permissions:** `storage`, `alarms`, `declarativeNetRequest` (empty ruleset reserved for future). Host permissions: `*://chatgpt.com/*`, `*://*.chatgpt.com/*` to start.

**Three runtime surfaces:**
- **Content script** — loads bundled rules for the current host, injects a `<style>` tag at script-start with `display:none !important` (CSS-first hide before paint, no flicker), runs a `MutationObserver` scoped to the message-list container with rAF-batched single-pass matching. Sends a message to the SW per block.
- **Service worker** — message listener; `reportBlocked()` increments local counters; persists settings (enabled state, per-host whitelist) in `chrome.storage.local`. No `setInterval` (SW evicts ~30s); any future periodic work uses `chrome.alarms`.
- **Popup + Options** — popup: enable/disable toggle + counters. Options: whitelist, counter reset, build hash + commit link.

**Rule format** (`rules/<platform>.json`):
```json
{ "platform": "chatgpt", "version": 1, "selectors": ["..."] }
```
Versioned, keyed by hostname. Bundled in v0. Remote rule sync is deliberately out of scope for v0.

**Modular seams:**
- `lib/rules.ts` — `loadRulesForHost(hostname): Rule[]`
- `lib/blocker.ts` — applier (CSS injection + observer wiring); zero detection logic
- `lib/counter.ts` — `reportBlocked(platform, selectorId): Promise<void>` (single-function telemetry seam)

## Phase 0: Document design decisions

`docs/design_decisions.md` covers:
- The four telemetry postures (zero / opt-in / default-on / P3A) with trade-offs.
- v0 commitment: zero outbound + seam.
- Detection strategy: selector-based, externally curated; extension is a rule applier.
- Pointers back to `docs/high_level_design_prompt.md` for the original architecture proposal and the deltas this plan applies.

## Phase 1: Scaffold init

- Set up WXT with TypeScript strict in `plugin/`.
- `wxt.config.ts`: MV3 manifest fields, host permissions, `storage`/`alarms`/`declarativeNetRequest` permissions, build target Chrome only for v0.
- Verify `npm run dev` loads in a fresh Chrome instance.

## Phase 2: Rule engine + content script

- `plugin/rules/chatgpt.json` — placeholder file with 1–2 well-known selectors (real ones land later from the team).
- `plugin/lib/rules.ts` — host → rules lookup.
- `plugin/lib/blocker.ts` — `<style>` injection + scoped `MutationObserver` (`subtree:true, childList:true, attributes:false`), rAF-batched.
- `plugin/entrypoints/content.ts` — wire: load rules → inject CSS → start observer → message SW per block.
- Verify on chatgpt.com: placeholder element is hidden via DevTools.

## Phase 3: Service worker + counter seam

- `plugin/lib/counter.ts` — `reportBlocked()` writing to `chrome.storage.local` (atomic get→set, not module-global state).
- `plugin/entrypoints/background.ts` — `chrome.runtime.onMessage` listener routes block events to `reportBlocked()`; persists enabled-state + whitelist.

## Phase 4: Popup

- Tailwind config scoped to popup/options entrypoints.
- Toggle bound to `chrome.storage.local`.
- Counters: per-host and global.
- Link to Options.

## Phase 5: Options

- Per-host whitelist UI.
- Counter reset button.
- Build hash readout (manifest version + commit SHA injected at build via Vite `define`).

## Phase 6: Build for Chrome

- `npm run build` produces `plugin/.output/chrome-mv3/` + a zip artifact.
- README update: `## Local Development (Extension)` section with install-unpacked instructions.
- Web Store submission deferred.

## Out of scope for v0

- Firefox / Safari builds (WXT supports them; defer to v1.1).
- Remote rule sync (`rules.json` over the network).
- Telemetry beyond the local counter.
- Soft / native in-response ad detection.
- Brave Shields detection (no functional overlap; non-issue).

## Critical files (all new unless noted)

- `docs/design_decisions.md`
- `plugin/wxt.config.ts`
- `plugin/package.json`, `plugin/tsconfig.json`
- `plugin/entrypoints/content.ts`
- `plugin/entrypoints/background.ts`
- `plugin/entrypoints/popup/index.html`, `popup.ts`
- `plugin/entrypoints/options/index.html`, `options.ts`
- `plugin/lib/rules.ts`, `plugin/lib/blocker.ts`, `plugin/lib/counter.ts`
- `plugin/rules/chatgpt.json`
- `README.md` (update — add extension dev section)

## Verification

1. `cd plugin && npm install && npm run dev` — dev build loads in a fresh Chrome instance with the extension auto-attached.
2. Open chatgpt.com → confirm placeholder selector is hidden in the rendered DOM (DevTools).
3. Toggle off in popup → confirm the element renders normally; toggle on → hidden again.
4. Block counter increments and is visible in popup.
5. Whitelist chatgpt.com in Options → selectors stop applying on that host.
6. **Privacy mechanical test:** with DevTools Network tab open and filtered to the extension's content script + SW, exercise the extension and confirm **zero outbound requests**. This is the brand promise verified as code, not as copy.
7. `npm run build` produces a loadable extension under `plugin/.output/chrome-mv3/`.
