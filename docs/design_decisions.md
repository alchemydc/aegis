# Design Decisions

This document captures architectural decisions for the **adblocked.ai** browser extension (codename: Aegis). It complements `docs/high_level_design_prompt.md` (the original architecture proposal) and `docs/plugin_implementation_plan.md` (the v0 implementation plan).

---

## 1. Detection strategy: rule applier, not detector

**Decision.** Ad detection is selector-based, with selectors curated externally by the team. The extension is a *modular rule applier*.

**Why.** The team has already captured ad selectors for ChatGPT and will provide more. Investing in detection heuristics, semantic classification, or "soft-match" logic inside the extension would duplicate work and add risk (false positives, fingerprintable signatures, larger attack surface for AI platforms to evade).

**How.**
- `rules/<platform>.json` — versioned selector lists keyed by hostname.
- `lib/rules.ts` — host → rules loader.
- `lib/blocker.ts` — CSS injection + scoped MutationObserver. **Zero detection logic.**

**Out of scope (deliberate).**
- Soft / native in-response ad detection (the model itself recommending a partner product mid-stream). Requires semantic classification that conflicts with the privacy posture.
- Brave Shields detection. No functional overlap — Shields is network-level, this product is cosmetic on first-party DOM.
- Remote rule sync. Bundled rules in v0; remote fetch deferred to v0.1+.

---

## 2. Telemetry posture (v0)

**Decision.** v0 ships **zero outbound telemetry**, with a single `reportBlocked()` seam in the service worker that today writes only to `chrome.storage.local`.

**Why.** Keeps four future tiers achievable in v0.1+ without architectural rework, while preserving the brand's privacy promise on day one. The marketing site currently states "No data ever leaves your browser" — v0 honors that literally.

### Tiers considered

#### Tier 0 — Zero telemetry (chosen for v0)

- Counter is local; popup shows the user's own blocked count.
- The marketing site's "2.3M+ ads blocked monthly" stat must be reframed (projection / footnote) or removed. Cannot be supported under this tier.
- **Strongest brand alignment** with the manifesto's privacy stance.
- **Cost:** marketing loses an aggregate growth signal.

#### Tier 1 — Opt-in aggregate ping

- Anonymous UUID generated at install, never linked to user identity.
- Daily flush of `{uuid, blocked_count}` to a logging-disabled endpoint (Cloudflare Worker is the leading candidate).
- Default off, surfaced as a settings toggle.
- **Cost:** small backend; coverage typically 10–30% (volunteer pool); marketing aggregate is real but footnoted as opt-in.

#### Tier 2 — Default-on aggregate

- Same plumbing as Tier 1, enabled by default with opt-out toggle.
- Industry standard for adblockers like AdBlock and Adblock Plus.
- **Cost:** brand-positioning conflict — would force softening the marketing copy from "no data ever leaves your browser" to "no behavioral data, anonymous counts only."

#### Tier 3 — Privacy-preserving aggregation (P3A-style)

- Brave-pioneered protocol; each report is statistically deniable via randomized response.
- Aggregate stays meaningful for large N.
- **Cost:** ~3–5× implementation effort; needs a careful explainer page; strongest defensible privacy story.

### MV3 mechanics that apply to all tiers

- Service workers evict ~30s after idle, so counters live in `chrome.storage.local`, not memory.
- Periodic flushes use `chrome.alarms` (min 30s interval), not `setInterval`.
- Outbound `fetch()` from the SW is unrestricted, but the telemetry host needs to be in `host_permissions`.
- Chrome Web Store / AMO / App Store all require declaring data collection at submission. Anonymized analytics is permitted everywhere with disclosure.

### IP / fingerprinting caveat (Tiers 1–3)

Even an anonymous payload reveals IP + UA at the network layer. To make the privacy promise watertight, the endpoint needs:
- Cloudflare Worker with explicit no-log config, or
- A privacy-preserving proxy.

### Architectural seam

The single function `reportBlocked(platform, selectorId)` in `lib/counter.ts` is the only telemetry surface. Any future change to telemetry tier should go through this seam — no scattered `fetch()` calls in the content script or SW for analytics.

---

## 3. Stack: WXT + TypeScript, no React in popup/options

**Decision.** WXT (file-based MV3 entrypoints, Vite build, cross-browser output) + TypeScript strict. **No React** in the popup or options pages.

**Why.**
- WXT abstracts manifest generation and the Chrome/Firefox/Safari API differences; this project will eventually target all three.
- TypeScript is non-negotiable for DOM-heavy extensions where runtime errors silently break ad-blocking.
- A toggle and a counter don't justify a UI framework. Vanilla DOM keeps the bundle small and easier to audit, which matters for an open-source privacy tool.

**Trade-off considered.** Plasmo (the original alternative) has had visibly slower release cadence through 2024–2025. WXT has the momentum. Vanilla MV3 + `webextension-polyfill` is also viable but re-implements manifest-per-target builds and Safari packaging — not worth it for a small surface area.

---

## 4. Cross-browser scope (v0)

**Decision.** v0 ships Chrome only. Brave is Chromium and gets it free.

**Roadmap.**
- v1.1: Firefox (separate AMO listing, event-page differences from MV3 SW).
- v1.2: Safari macOS (requires Xcode wrapper, Apple Developer account, App Store review).
- **Not on roadmap:** iOS Safari (no practical extension surface for this style of blocker).

---

## 5. Distribution and verification

**Decision.** v0 ships as a sideloadable unpacked extension via GitHub Releases. Web Store submission deferred until rules are stable and the rule-update mechanism is in place.

**Open-source verification.** Build hash (commit SHA + version) is surfaced in the Options page so users can verify their installed extension against the tagged release.

---

## References

- `docs/high_level_design_prompt.md` — original architecture proposal.
- `docs/plugin_implementation_plan.md` — v0 implementation plan.
- `docs/projectbrief.md` — product brief.
