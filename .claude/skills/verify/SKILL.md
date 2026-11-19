---
name: verify
description: The pre-done quality gate for vue-cui. Run before reporting a change as done, before committing, and before opening a PR — tests, lint, app build, library build and Storybook tests as the change requires, then check the output.
---

# Verify

Run what applies to the change. Report each command's real result: if something fails, show the failing output. Never say "done" over a red check.

| Changed | Run |
| --- | --- |
| Anything | `npm test` |
| `client/js/core/router.js`, `client/js/index.js` (the files ESLint covers) | `npm run lint` |
| Anything under `client/`, `server/`, `helpers/`, `vite.config.ts` | `npm run build:vite` |
| `client/src/components`, `directives`, `lib`, `vite.lib.config.ts` | `npm run build:lib` |
| Components, directives, stories, `.storybook/` | `npm run test:storybook` (needs Playwright browsers) |

## After building, check the output

- **`build:vite`**: `dist/` has the page bundles and `dist/server/entry-server.js`. Grep the built output for the changed code or class names, so you know the change really shipped.
- **`build:lib`**: `dist-lib/index.js`, `dist-lib/style.css` and `dist-lib/lib/index.d.ts` exist. Every component exported from `client/src/lib/index.ts` has a `.d.ts` file. A missing one means the `dts.include` list in `vite.lib.config.ts` is out of date.
- **UI changes**: load the page or story (`local-dev` skill) and look at it. A build passing is not proof the UI works.

## Report

Write one line per check: the command, then pass/fail. If anything was skipped, say why.
