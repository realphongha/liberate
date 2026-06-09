# Translate Anyway

A Chrome Extension (Manifest V3) that enables browser translation on websites that intentionally disable it using `translate="no"`, `class="notranslate"`, or `<meta name="google" content="notranslate">`.

## How It Works

The extension runs at document start and removes translation-blocking attributes and elements before the page renders. A MutationObserver continuously handles dynamically injected content, ensuring compatibility with SPAs and modern web frameworks.

- **Zero external requests** — all processing is local
- **No data collection** — privacy-first design
- **Install and forget** — no configuration required
- Works on static sites, React, Vue, Angular, Next.js, and more

## Installation

1. Download from the Chrome Web Store (pending)
2. No setup needed — translation blocking is automatically removed

## Permissions

- `storage` — saves your preferences (enable/disable, per-site settings)
- `activeTab` — displays the current site domain in the popup

## Development

### Project Structure

```
translate-anyway/
├── manifest.json
├── src/
│   ├── content/
│   │   ├── scanner.js      # DOM scanning and attribute removal
│   │   ├── observer.js      # MutationObserver for dynamic content
│   │   └── content.js       # Main content script entry point
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── storage/
│       └── settings.js
├── icons/
├── privacy-policy.md
└── README.md
```

### Loading the Extension

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the `translate-anyway` directory
