# Liberate

Restore browser features that websites disable.

A Chrome Extension (Manifest V3) that restores browser functionality commonly disabled by websites.

## Features

- **Allow Translate** — Remove `translate="no"`, `class="notranslate"`, and `<meta name="google" content="notranslate">`
- **Allow Selection** — Override `user-select: none` CSS and `selectstart` event blockers
- **Allow Copy** — Neutralize `copy` event blockers
- **Allow Right Click** — Neutralize `contextmenu` event blockers

## Philosophy

> Websites should not prevent users from reading, translating, selecting, copying, or interacting with content.

## How It Works

The extension runs at `document_start` and uses:
- **Event Interceptor** — Wraps `addEventListener`/`removeEventListener` to filter blocked events
- **MutationObserver** — Handles dynamically injected content in SPAs
- **CSS Injection** — Overrides restrictive styles

All processing is local. No external requests, no data collection, no telemetry.

## Permissions

- `storage` — saves your preferences (enable/disable, per-module toggles, per-site settings)
- `activeTab` — displays the current site domain in the popup

## Development

### Project Structure

```
Liberate
├── manifest.json
├── src/
│   ├── core/
│   │   ├── engine.js       # Module registration, config, domain matching
│   │   ├── events.js        # Event interceptor (addEventListener wrapper)
│   │   └── mutation.js      # Shared MutationObserver
│   ├── modules/
│   │   ├── translate.js     # Translate unlock
│   │   ├── selection.js     # Selection unlock
│   │   ├── copy.js          # Copy unlock
│   │   └── right-click.js   # Right click unlock
│   ├── content/
│   │   └── content.js       # Main content script entry point
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── storage/
│       └── settings.js      # chrome.storage.sync wrapper
├── icons/
├── privacy-policy.md
└── README.md
```

### Loading the Extension

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the `Liberate` directory

(or just install the published version from the Chrome Web Store 😹)

## Architecture

Every capability is an independent module that can be enabled or disabled. Modules register with the core engine, which handles configuration, domain matching, and logging. The event interceptor wraps `EventTarget.prototype.addEventListener` before page scripts run, preventing blocked events from being registered.

## FAQ

Q: Can you add feature X?
A: Maybe. PRs are welcome.

Q: I found a bug.
A: Please open an issue with reproduction steps.

Q: The code quality seems questionable.
A: Correct.

Q: Is this AI-generated?
A: Parts of it are. The bugs are handcrafted.
