# Pi Lab (Pi Command Center)

**Live:** https://pi-command-center.vercel.app

> Cloudflare version: [pi-command-center-cloudflare](https://github.com/nikkimasani/pi-command-center-cloudflare) · https://pi-command-center-cloudflare.pages.dev — currently the more actively maintained copy.

Pi Lab is a beginner-friendly, instructor-style guided lab for Raspberry Pi projects — accurate step order, clear success checks, copyable commands, official sources, and visuals for each step. It starts with a **Raspberry Pi 5 Foundation** course (workbench, Imager, OS, Wi-Fi, SSH, first boot) and then builds full project courses such as a **Smart Mirror** (MagicMirror²).

## Features

- Ten project courses broken into guided phases with ordered actions, materials and safety notes
- Success gates, targeted troubleshooting, maintenance and recovery notes
- Local progress, action checklists and notes (saved in the browser)
- Installable PWA

## How it's built

A small static site — no framework, no build step.

| File | What it does |
|---|---|
| `index.html` | Loads the current Pi Lab engine and cache-busted assets |
| `lab-v20-content.js` | Course data (`window.PI_LAB`) |
| `lab-v20.js` | Renderer, navigation, completion state, content refinements |
| `lab-v20.css`, `lab-v20-layout.css` | Visual system |
| `assets/` | Photos and instructional visuals |
| `sw.js`, `manifest.json` | PWA |

Older `course-v*` / `V15_*` files are earlier iterations kept for reference; the v20 files above are what the site loads.

## Run locally

```bash
npx serve .
```

Check syntax before committing:

```bash
node --check lab-v20.js && node --check lab-v20-content.js
```

## Deploy

Push to `master`; Vercel runs the syntax checks in `vercel.json` and deploys. See `README-course-v2.md` for the earlier Course Engine V2 notes.
