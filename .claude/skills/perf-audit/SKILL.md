---
name: perf-audit
description: Application-level performance and PWA audit for vue-cui — Lighthouse / Core Web Vitals, SSR payload and hydration cost, bundle sizes, resource hints (preload/prefetch), service worker (Workbox) and web manifest. Use when tuning performance, before and after a perf-related change, or when working on PWA features.
---

# Performance audit

Measure first, change second, then measure again. Report the numbers before and after.

## 1. Lighthouse

- `scripts/run-lighthouse.js` builds the Docker dev image, waits for the app on `DOCKER_PORT` (3002), and runs Lighthouse on `LIGHTHOUSE_URL` (default `/document`). It writes `LIGHTHOUSE_OUTPUT` (default `dist/lighthouse-report`).
  - The npm script for it was removed (see `docs/change-list.md`), so run it directly: `node scripts/run-lighthouse.js`.
  - If Lighthouse or Docker isn't available, say so. Do not guess scores.
- **Pages to check:** `/document`, a geo search page (`/property/tx/austin`), and a detail page.
- **Targets (mobile):**
  - Performance ≥ 90
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms
  - TTFB < 800ms

## 2. SSR and hydration

- Size of the serialized state in the HTML: keep the page model minimal and send no raw SOA payloads.
- Hydration mismatches: the server page model and the client Pinia state must agree.
- Work done in `onMounted` that could be lazy (maps, players, sliders that are off-screen).

## 3. Bundles

- `npm run build:vite`: record the size of each `dist/` asset (`du -h` / `ls -l`). Flag a jump of more than 10%.
- `npm run build:lib`: record the size of `dist-lib/index.js` and `dist-lib/style.css`. `vue` must stay external.

## 4. Resource hints

- `preload` entries come from the controller `preload(req, model)` (`server/controllers/configbase.ts`) and are rendered in `server/ejs/html_above.ejs`.
- Each `href` must be an absolute URL with a host, built once in `get()`.
- Preload only the LCP image, critical fonts and the critical CSS. Use `prefetch` for likely next navigations, and `preconnect` for the CDN and SOA hosts.

## 5. PWA

- `sw.js` imports Workbox, but Workbox is **not installed**. In dev, `vite.config.ts` serves a stub that unregisters the service worker. The build copies `sw.js` into `dist/`.
- `manifest.webmanifest` is generated in `vite.config.ts`. Check its name, icons, `theme_color` and `start_url` for each environment.
- **Installing Workbox:** precache the build assets; cache images with cache-first; SOA API calls with stale-while-revalidate; HTML with network-first. Bump the cache version on deploy.

## Report

A table of metric, before, after and target, followed by the change you made and any regressions.
