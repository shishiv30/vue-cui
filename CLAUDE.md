# vue-cui (Pure)

`@shishiv30/vue-cui` is a performance-first Vue 3 UI component library. It lives inside a server-rendered real-estate demo app that uses the library and serves as its testbed.

**Team charter first:** `.claude/rules/team-charter.md` is always loaded and wins over anything else here.

## What the repo produces

| Output | Command | Where it goes |
| --- | --- | --- |
| The app (Express + Vue SSR) | `npm run build:vite`, then `npm start` | `dist/` + `dist/server/` |
| The npm library | `npm run build:lib` | `dist-lib/`, published by `.github/workflows/publish-npm.yml` on a GitHub release |
| Storybook | `npm run build:storybook` | GitHub Pages (`.github/workflows/storybook-pages.yml`) and GitLab S3/CloudFront (`.gitlab-ci.yml`) |

## Commands

- `npm run dev` runs Vite on :3001 and Express on :3000. Open `http://localhost:3000`.
- `npm run storybook` runs Storybook on :6006.
- `npm test`, `npm run test:storybook`, `npm run lint`.
- More (environments, Docker, tracing a request): the `local-dev` skill.

## Architecture in one screen

- **Server** (`server/`, TypeScript, Express): `index.ts` is the entry. The request goes through middleware (`middleware/`), then routes (`routes/`), then config-driven controllers (`controllers/`, `BaseController` + `configbase.ts`: `beforeGet` / `get` / `seo` / `preload`), then page models (`page/`). Vue SSR (`client/src/entry-server.ts`) renders inside the EJS shell (`ejs/html_above.ejs`, `html_below.ejs`). SOA upstreams are proxied in `routes/api.soa.*.ts`.
- **Mapping** (`helpers/`): pure transforms from upstream data to UI models. Seed and mock payloads live in `data/`.
- **Vue app and library** (`client/src/`): `components/` (`<Name>.vue`, `<name>Model.ts`, `<Name>.stories.ts`), `directives/`, `pages/`, `router.ts`, `store.ts` (Pinia), and `lib/index.ts` (the public exports).
- **Legacy runtime** (`client/js/`): the `data-role` plugin system. It is being converted to Vue, and `client/src/components/pluginCatalog.ts` tracks progress. This is temporary; see `notes/requirements/REQ-migration-end-cleanup.md`.
- **CSS** (`client/scss/`): one global stylesheet, `index.scss`.

## Folder ownership

| Folder | Owns | Must not contain |
| --- | --- | --- |
| `client/js/core/` | Runtime primitives (event, plugin, page, router, request, def) | Page-specific business logic |
| `client/js/plugins/` | One legacy widget per `_name.js` | Shared SOA mapping |
| `client/src/components/`, `directives/`, `lib/` | Library components, their models and stories | Page or API logic |
| `client/src/pages/`, `router.ts`, `store.ts` | App pages built from components | New one-off UI widgets |
| `helpers/` | Pure transforms and shared contracts | Express handlers, seed payloads |
| `data/` | Seed, mock and default payloads | Mapping logic |
| `server/routes/` | HTTP registration and thin adapters | Field mapping, seed data |
| `server/controllers/` | Page configs (`beforeGet`/`get`/`seo`/`preload`) | Raw SOA field parsing |
| `server/ejs/` | HTML only, reading mapped models | SOA parsing |
| `docs/` | Product docs: how things work | Tracking notes |
| `notes/` | Team memory: requirements, decisions, open questions, lessons | Product docs |

## Rules

Everything lives in `.claude/rules/`. The path-scoped ones load when you touch matching files.

- **No CSS in `.vue` files** (`global-css.md`; a hook enforces it).
- **One event bus:** `client/js/core/event.js`, used through `emitPhase` / `emit`.
- **Components never call `gtag` or Split.** Use the `add-ga-event` and `add-feature-flag` skills.

## Overrides of the global `~/.claude/CLAUDE.md`

- **Build check:** there is no `npm run build`. Run `npm run build:vite`, plus `npm run build:lib` when components or `client/src/lib` change (the `verify` skill).
- **Reference implementation for new pages:** `client/src/pages/*.vue` plus its controller in `server/controllers/` and its route in `server/routes/`. There is no `configs/routes.js`.
- **Branches:** use `conjee/{TICKET-ID}` only when a Jira URL is given. Otherwise use `feat/…`, `fix/…`, `chore/…` or `docs/…`.
- **Ignore the global consumer-web agents and skills** (`route-page-developer`, `vue-ssr-performance`, `run-local`, `run-tests`, `image-compression`). Use this repo's agents and skills.

## Change workflow

1. `docs-maintainer` (the PM) writes the requirement in `notes/requirements/` (`doc-requirement` skill).
2. If needed, `api-specialist` writes `docs/api/<name>.md` and `ui-ux-designer` writes the design proposal.
3. `component-developer` or `application-developer` builds it.
4. `code-reviewer` checks the logic, data and performance; `ui-ux-designer` checks the visuals; people sign off the human checks.
5. Commit and release.
6. `docs-maintainer` reviews what shipped, updates the docs, and closes the requirement.

## Docs and notes

Before you start, read `notes/lessons.md` and `notes/open-questions.md`. Product docs start at `docs/README.md`. Docs marked "Historical" or "Legacy" describe the old webpack/EJS/AWS setup: do not follow them.
