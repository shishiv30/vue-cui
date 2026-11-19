# REQ-migration-end-cleanup: Remove EJS and the legacy plugin runtime

| Field | Value |
| --- | --- |
| Status | draft (it waits until every plugin in `pluginCatalog.ts` is `vue`) |
| Owner (dev) | component-developer + application-developer |
| Requested by | the user |
| Related docs | `CLAUDE.md`, `docs/folder-ownership.md`, `docs/component-conversion.md`, `docs/change-list.md` |

## Why

The EJS templates, the `data-role` plugins and the conversion tooling exist only for the migration. Once it is done, they are dead weight.

## Steps

Run this only when the migration is finished. Do it as one change on a `chore/remove-ejs` branch, with the `verify` skill at the end.

**Precondition:** every entry in `client/src/components/pluginCatalog.ts` has status `vue`. In addition, `grep -rl "\.ejs" server` finds no page render outside the HTML shell.

1. **Move what Vue still uses out of the legacy runtime first.** Vue code imports from `client/js/core/`: `emitPhase.ts`, `Slider.vue`, `Player.vue`, `GroupDropdown.vue`, `Result.vue`, `ValueSlider.vue`, `sliderScale.ts`, and the `collapse`, `tooltip` and `validation` directives. Move the event bus (`event.js`) and the other utilities they use into `client/src/` as TypeScript, and update the imports. Do not delete the bus.
2. **Remove the legacy client runtime:**
   - `client/js/plugins/`
   - the rest of `client/js/core/`, including `renderEjs.js`
   - `client/js/index.js`
   - the `data-role` boot in `client/pages/*`
3. **Remove EJS from the server:**
   - the `server/ejs/comp_*.ejs` and `comp_*.ts` files
   - `helpers/ejs-client-loader.ts` and `helpers/ejsRenderContext.ts`
   - the EJS paths in `server/controllers/` (`configbase.ts`, `index.ts`, `page.ts`, the `sitemap*` controllers) and `server/page/sitemapUi.ts`
   - the `ejs` dependency in `package.json`
   - Also decide whether the HTML shell (`html_above.ejs` / `html_below.ejs`) moves into the Vue SSR template.
4. **Remove the tests for deleted code:** `test/ejsClientRender.test.js`, `test/ejsRenderContext.test.js`, `test/test-dialog-plugin.js`, the EJS cases in `basecontroller.config.test.js`, and the matching parts of `npm test`.
5. **Remove the migration tooling:**
   - `pluginCatalog.ts`
   - `.claude/skills/convert-ejs-to-vue/` and `.cursor/skills/convert-ejs-to-vue/`
   - `docs/component-conversion.md` (keep its component-design content in the component design doc)
   - every mention of conversion in `CLAUDE.md`, the `component-developer` agent, `code-reviewer` and `storybook-docs`
6. **Clean up folders:** `client/pages/` and `client/components/*.html` if nothing serves them anymore. Update the folder ownership tables in `CLAUDE.md` and `docs/folder-ownership.md`.
7. **Final check:** `rg -i "ejs|data-role|pluginCatalog|convert-ejs"` returns nothing outside `docs/archive/` and this list. Run `npm test`, `npm run build:vite` and `npm run build:lib`, and confirm the app still runs. Then mark this row done.

## Changelog

- 2026-11-19: created; moved here from `docs/change-list.md` (docs-maintainer)
