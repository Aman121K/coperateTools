# DevTool Workspace

DevTool is a browser-based internal tools workspace designed for operations, business, and engineering teams. It includes calculators, document generators, converters, and productivity utilities in one interface.

## Highlights

- Department and role-based tool access
- Fast global search (`Ctrl + F`)
- Bookmarks and recent history
- Shareable tool state links
- Responsive UI with dark/light themes
- Client-side processing for most tool workflows

## Authentication

- Login is optional for using and sharing tools.
- Demo workspace access (no setup required)
- Local username/email + password accounts (stored in browser local storage)
- Google Sign-In (when Firebase is configured)

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Add Firebase values if you want Google Sign-In and realtime activity logging.
3. Leave Firebase values as placeholders to run in local/demo mode only.

## Build for Production

```bash
npm run build
npm run preview
```

## Deployment Note for FFmpeg Tools

Media conversion features using `ffmpeg.wasm` may require cross-origin isolation. If needed, configure:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`
