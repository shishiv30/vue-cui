# Build system

Vite builds client assets. Express serves them and renders `/property` and `/document`.

## Config

- `vite.config.ts` builds `layout` and the Vue client entry.
- `client/pages.config.js` lists the static MPA pages (`layout`).
- `server/config.js` loads `.env` then `.env.local` in development, `.env.stage` for stage, and `.env.production` for production.

## Commands

```bash
npm run dev
npm run build:dev
npm run build:stage
npm run build:prod
```

`build:prod` and `build:stage` run `vite build`, then an SSR build of `client/src/entry-server.ts` into `dist/server`.

## Dev

- Node listens on port 3000.
- Vite listens on port 3001 and proxies `/api`, `/property`, `/document`, and `/llms.txt` to Node.
- The TypeScript server also starts Vite in middleware mode so `/property` and `/document` can render during development.

## Docker

- `npm run build-docker:dev` uses `.env`.
- `npm run build-docker:prod` uses `.env.production`.
- Host port is 3002.

## Output

- `dist/layout.html`
- `layout.min.js`, `property.min.js`, and one `index.min.css` linked from the Vue shell
- `dist/llms.txt`, `dist/images/`, `dist/sw.js`, `dist/manifest.webmanifest`
