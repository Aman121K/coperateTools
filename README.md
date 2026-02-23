# Corporate Tools Portal

A unified platform with tools for **12 departments** across the corporate office. All tools run client-side for privacy and speed.

## Login & Access

- **Demo Login** – Works without setup. Click "Demo Login" to try the app.
- **Google / Facebook / GitHub** – Add Firebase config (see below) for social login.
- **Department & Role** – After login, select your department and role. Tools are filtered by your selection.

## Departments & Tools

### Finance
Currency Converter, Tax Calculator, EMI Calculator, Number to Words, Percentage Calculator, Invoice Generator

### Admin
QR Code Generator, Barcode Generator, PDF Merger, PDF Splitter, Unit Converter, Date Calculator

### HR
Leave Calculator, Salary Slip Generator, Employee ID Generator, Attendance Calculator, Org Chart Generator

### Legal
Word Counter, Case Number Generator, Document ID Generator

### Marketing
Meta Tags Generator (SEO), Character Counter (Twitter/LinkedIn limits), Social Media Preview

### Sales
Commission Calculator (flat/tiered), Discount Calculator, Quote Generator

### Customer Support
Ticket ID Generator, FAQ Generator (Q&A → JSON/HTML), Response Template (snippets)

### Operations
Inventory Calculator, Capacity Calculator, Shipping Cost Estimator

### Procurement
Purchase Order Generator, Vendor Comparison (price, rating, delivery)

### Quality Assurance
Bug Report Template, Test Case Generator, Release Notes Generator

### Developer
JSON Formatter/Validator/Minifier/Flatten/TypeScript/CSV, JSON↔YAML/XML/CSV, Base64, URL Encode, JWT Decoder, Hash, UUID, Regex, Cron, Diff, cURL→Fetch/Axios, Dummy Data/Images/Videos, Image Compressor/Resizer, PDF→Images

## Features

- **⌘K / Ctrl+K** – Search tools by name or department
- **11 departments** – Finance, Admin, HR, Legal, Marketing, Sales, Support, Operations, Procurement, QA, Developer
- **Copy / Download** – One-click actions
- **Dark mode** – Toggle in header
- **Offline-first** – Works in browser, LocalStorage history

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Firebase Setup (optional, for Google/Facebook/GitHub login)

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → **Sign-in method** → enable **Google**, **Facebook**, **GitHub**
3. Copy `.env.example` to `.env` and fill in your Firebase config values
4. For Facebook: add your app to [Facebook Developers](https://developers.facebook.com/) and add the App ID/Secret in Firebase

## Build

```bash
npm run build
npm run preview
```

### MP4↔MP3 / MP3→MP4 Tools

These tools use FFmpeg.wasm and require **cross-origin isolation** (SharedArrayBuffer). Add these headers to your server config if the tools fail:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`
