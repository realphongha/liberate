# Liberate

Restore browser features that websites intentionally disable.

A Chrome Extension (Manifest V3) that restores browser functionality commonly disabled by websites.

## Features

- **Translate Unlock** — Remove `translate="no"`, `class="notranslate"`, and `<meta name="google" content="notranslate">`
- **Right Click Unlock** — Neutralize `contextmenu` event blockers
- **Selection Unlock** — Override `user-select: none` CSS and `selectstart` event blockers
- **Copy Unlock** — Neutralize `copy` event blockers
- **Drag Unlock** — Restore `dragstart` events for images, text, and links
- **Keyboard Unlock** — Protect `Ctrl+C/V/A/F/S/P` from site hijacking

## Philosophy

> The website is running on my computer. I decide how my browser behaves.

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
│   │   ├── right-click.js   # Right click unlock
│   │   ├── selection.js     # Selection unlock
│   │   ├── copy.js          # Copy unlock
│   │   ├── drag.js          # Drag unlock
│   │   └── keyboard.js      # Keyboard shortcut protection
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

## Architecture

Every capability is an independent module that can be enabled or disabled. Modules register with the core engine, which handles configuration, domain matching, and logging. The event interceptor wraps `EventTarget.prototype.addEventListener` before page scripts run, preventing blocked events from being registered.
