Developing a browser extension in 2026 requires navigating the matured **Manifest V3 (MV3)** ecosystem. Since your primary target is Chrome/Brave with a roadmap for Firefox and Safari, the architectural priority is **abstraction**. You want a codebase that handles the differing browser APIs (like Chrome's `chrome.*` vs. Firefox's `browser.*`) without manual porting.

## I. Technology Stack & Framework
For a cross-browser project, I recommend using **WXT** or **Plasmo**.
* **WXT (Recommended):** It is a modern, TypeScript-first framework that abstracts the manifest generation. It allows you to write one codebase and build specific targets for Chrome, Firefox, and Safari.
* **Language:** TypeScript (non-negotiable for stability in DOM-heavy extensions).
* **UI (Options/Popup):** React or Tailwind CSS. Since this is an ad-blocker, the UI should be minimal—likely just a toggle and a "stats" counter.

---

## II. Core Functional Architecture
Browser extensions operate in isolated worlds. Your plan needs to coordinate three main areas:

### 1. Content Scripts (The "Muscle")
This script is injected into pages like `chatgpt.com` or `claude.ai`. 
* **Ad Detection:** Unlike traditional web ads, AI ads are often first-party UI elements (e.g., "Sponsored" chat bubbles or recommendation cards).
* **MutationObserver:** You will need a robust `MutationObserver` to watch the chat DOM. AI interfaces are highly dynamic; ads may be injected long after the initial page load as the model "types" its response.

### 2. Background Service Worker (The "Brain")
In MV3, background scripts are ephemeral service workers.
* **State Management:** Stores user settings (Enabled/Disabled) using `chrome.storage.local`.
* **Network Interception:** Use the `declarativeNetRequest` API to block any external tracking pixels or ad-server calls that the AI platforms might start using.

### 3. Popup/Options (The "Interface")
A simple entry point for the user to whitelist specific AI sites or view how many ads have been blocked.



---

## III. Implementation Roadmap (Agent Hand-off)

### Phase 1: Environment & Scaffolding
* Initialize the project using WXT with TypeScript.
* Define the `manifest.json` permissions: `storage`, `declarativeNetRequest`, and host permissions for `*://*.chatgpt.com/*`, `*://*.claude.ai/*`, etc.

### Phase 2: The Detection Engine
* **Identify Selectors:** Create a configuration file mapping chat platforms to their specific ad-container CSS selectors or text patterns (e.g., elements containing the string "Sponsored").
* **Injection Logic:** Implement a content script that applies `display: none !important` via CSS injection (the most performant way) for known selectors.

### Phase 3: The Observation Loop
* Implement a `MutationObserver` that specifically watches the chat output container.
* Develop a "soft-match" logic to handle cases where ads are indistinguishable from regular text until the full message is rendered.

### Phase 4: Cross-Browser Packaging
* Configure the build pipeline to output a `.zip` for Chrome/Brave and a separate build for Firefox (handling the `browser` namespace shift).
* **Safari Note:** Prepare the agent to wrap the web extension in a lightweight macOS "App Wrapper" using Xcode for the eventual Safari release.

---

## IV. Critical Technical Trade-offs

| Feature | Trade-off | Recommendation |
| :--- | :--- | :--- |
| **DOM Hiding vs. Removal** | Removing nodes can break the AI's internal React/Next.js state. Hiding (`display:none`) is safer. | **Hiding** is the default; removal only for static sidebars. |
| **Declarative vs. Content Scripts** | `declarativeNetRequest` is faster but can't see "in-chat" text ads. Content scripts can see everything but have a performance hit. | Use a **Hybrid** approach. DNR for network calls, Scripts for UI. |
| **Update Frequency** | AI platforms update their DOM classes frequently (e.g., shifting from `.chat-ad` to a randomized `.css-1ag2k`). | Use **Remote Rule Syncing**. Have the extension fetch a JSON of selectors periodically so you don't have to push a store update for every UI change. |

---

## V. Questions to Inform the Implementation
Before handing this off to an implementation agent, we need to clarify a few strategic points:

1.  **Detection Aggression:** Should the agent block only "explicit" ads (clearly marked "Sponsored"), or should it also target "soft" ads (e.g., ChatGPT suggesting a specific GPT-store plugin in a way that feels promotional)?
2.  **Privacy Profile:** Do you want this to be "Zero-Data"? (i.e., no telemetry, no remote logging of what is being blocked).
3.  **Brave Integration:** Since Brave has "Brave Shields," do you want the extension to check if Shields are already active to avoid redundant processing, or should it operate entirely independently?
4.  **Update Logic:** Do you have a server/GitHub repo where we can host a `rules.json` file for the extension to "phone home" to for the latest CSS selectors?

**What is the primary "ad" behavior you've noticed in these interfaces that triggered this project?** (e.g., is it sidebars, or is the AI actually "recommending" products inside the text?)