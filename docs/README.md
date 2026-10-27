# Pure UI

Express server in TypeScript, Vite for client assets, Vue 3 with vue-router and Vuex for `/property` and `/document`. Layout still boots the JavaScript plugin runtime.

## Quick start

```bash
npm install
npm run dev
```

Local URLs:

- App server: `http://localhost:3000`
- Vite dev server: `http://localhost:3001`
- Vue property: `http://localhost:3000/property`
- Vue document: `http://localhost:3000/` and `http://localhost:3000/document`

## Commands

- `npm run dev` runs Vite and `tsx server/index.ts` together.
- `npm run dev:client` and `npm run dev:server` run one side.
- `npm run build:dev`, `npm run build:stage`, and `npm run build:prod` load `.env`, `.env.stage`, and `.env.production`.
- `npm test` runs the suite in `test/`.

## Pages

Vite builds `layout` from `client/pages.config.js`. `/property` and `/document` are server-rendered Vue, not static HTML pages.

## Layout

- `client/src/` Vue app
- `client/pages/layout` plugin page
- `client/src/pages/Document.vue` Vue document catalog
- `client/scss/` CSS framework
- `server/index.ts` process entry
- `data/` content payloads
- `docs/` guides
- `test/` tests

Open work is listed in [change-list.md](change-list.md).

Storybook on GitLab (S3 and CloudFront, not App Runner): [storybook-ci.md](storybook-ci.md).
