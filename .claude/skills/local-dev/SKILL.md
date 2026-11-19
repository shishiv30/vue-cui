---
name: local-dev
description: Run vue-cui locally — the dev server (Express :3000 + Vite :3001), Storybook (:6006), production-like builds per environment, and the Docker image (:3002). Use when starting the app, checking a page in a browser, debugging local SSR, or building the Docker image.
---

# Local development

| What | Command | URL |
| --- | --- | --- |
| App + Vite HMR | `npm run dev` | http://localhost:3000 (Vite assets on :3001) |
| Server only / client only | `npm run dev:server` / `npm run dev:client` | |
| Storybook | `npm run storybook` | http://localhost:6006 |
| Build, then serve like prod | `npm run build:dev` (loads `.env`) | http://localhost:3000 |
| Stage / prod build | `npm run build:stage` (`.env.stage`) / `npm run build:prod` (`.env.production`) | |
| Docker, dev | `npm run build-docker:dev` (uses `.env` only) | http://localhost:3002 |
| Docker, prod | `npm run build-docker:prod` (uses `.env.production`) | http://localhost:3002 |

- **Node version:** `>=25.6.0` (see `.nvmrc`). Run `npm install` first.
- **Secrets and local overrides** go in `.env.local`, which is gitignored. Never commit keys.
- **Ports:** `PORT` (3000), `WEBPACK_DEV_SERVER_PORT` (3001; the name is legacy, it is the Vite port), `DOCKER_PORT` (3002). They are read in `server/config.ts`.
- **Run long-lived servers in the background** (`run_in_background`) or the Browser pane's `preview_start`, never in the foreground.
- **Useful pages:**
  - `/`, `/document`: the document catalog
  - `/property/tx/austin`: geo search
  - `/property/sitemap`
  - `/api-docs`: Swagger UI.

## Docker

Use `npm run build-docker:*`. These run Docker Compose with the image name `pure`. `docker compose build` is fine when you only want to build. Do not use raw `docker build --target …`.

After a build, check three things: it completed without Dockerfile or compose errors; the right env file was used; and, if the container was started, the service responds.

## Tracing a request (charter §11)

- **Every server log line is JSON** with `requestId` and `step`. To follow one request: `npm run dev:server 2>&1 | grep '"requestId":"<id>"'`.
- **Replaying an upstream call:** take the logged `curl` for that request id and run it to see the raw response. Keys come from env vars and are never pasted into notes.
- **Reproducing a bug:** collect the URL with query, the `requestId`, the log lines, and the expected vs. actual result. Put them in the requirement, or in `notes/lessons.md` if the lesson outlives the bug.

## Debugging SSR

- **A server error** shows up in the `dev:server` output. Each request step logs with the same context: route → controller → SOA calls → mapping.
- **A hydration mismatch** means the server page model and the client Pinia state disagree. Compare the serialized state in the HTML with what `client/src/main.ts` hydrates.
