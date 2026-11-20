# REQ-20261120-autocomplete-directive: v-autocomplete directive and Header search suggestions

| Field | Value |
| --- | --- |
| Status | docs-updated |
| Owner (dev) | component-developer |
| Requested by | the user |
| Branch / PR | committed directly on `master` (533865d) |
| Release | not released yet (no tag); shipped in commit 533865d |
| Related docs | `docs/component-conversion.md`, `docs/change-list.md`, `notes/lessons.md` |

Written after the fact: no requirement existed before the work. It records what shipped in 533865d so the change can be tracked.

## Why

The Header search used the legacy `data-role="autocomplete"` plugin. The Vue app never loads the legacy `client/js` runtime, so the search showed no suggestions. Autocomplete was also still a `plugin` in `pluginCatalog.ts`.

## Scope

- In: a `v-autocomplete` directive, its styles and stories; the Header search on that directive; library export and types.
- Out: removing `client/js/plugins/_autocomplete.js` and the legacy `.suggestion-*` styles (REQ-migration-end-cleanup).

## Requirements

- [x] R1 `client/src/directives/autocomplete.ts`: source is an array (filtered locally), a GET url (`?text=` + `params`, reads an array or `{ data: [] }`), or `(query, signal) => items | Promise`. Options `label`, `param`, `params`, `minLength`, `delay`, `limit`, `listClass`.
- [x] R2 Keys Up / Down / Enter / Esc; closes on blur; one shared list and overlay under `<body>`; placed below or above the input.
- [x] R3 While open: `html.autocomplete-open` locks scrolling, the overlay dims the page except the input (click closes), and the list joins the input as one box.
- [x] R4 Emits DOM event `autocomplete-select` (`detail` = item) and bus events `show.autocomplete`, `hide.autocomplete`, `select.autocomplete`.
- [x] R5 Header search uses `v-autocomplete`; a pick opens `/property/<getPathByGeo(item)>`. On phones the list fills the screen below the header (`listClass: 'header-autocomplete'`).
- [x] R6 `HeaderSearch` drops the unused `method` and `keys` fields.
- [x] R7 `pluginCatalog.ts` marks Autocomplete `vue`.
- [x] R8 Exported from `client/src/lib/index.ts` with its types; listed in `vite.lib.config.ts` `dts.include`.
- [x] R9 Storybook: `Directives/Autocomplete` stories; the Header story answers `/api/geo` with sample cities.

## Acceptance criteria

- [x] AC1 `client/src/components/Header.vue` has no `data-role="autocomplete"` and binds `v-autocomplete` (grep, 2026-11-20).
- [x] AC2 `pluginCatalog.ts` has `{ name: 'Autocomplete', status: 'vue' }` (grep, 2026-11-20).
- [x] AC3 The library build emits `directives/autocomplete.d.ts`, and `lib/index.d.ts` exports the `Autocomplete*` types (`vite build -c vite.lib.config.ts` into a scratch folder, 2026-11-20).
- [x] AC4 No code reads `search.method` or `search.keys` (grep of `server/`, `client/src/`, `helpers/`, 2026-11-20).
- [ ] AC5 `npm run test:storybook` passes the `Directives/Autocomplete` play tests. Not run by the docs-maintainer (needs a running Storybook).

For human verification (look and feel, interaction):

- [ ] `npm run dev`, open `http://localhost:3000`: type a city in the Header search, see suggestions, pick one with the keyboard and with the mouse, land on `/property/<path>`.
- [ ] Desktop: the list and input read as one box (colors, border, square corners where they meet), below or above the input.
- [ ] While open, the page does not scroll and the overlay dims everything but the input; clicking the overlay closes the list.
- [ ] Phone width (≤ 640px): the list fills the screen below the header and the input keeps its round corners.
- [ ] Storybook `Directives/Autocomplete` and `Header` stories work at `npm run storybook`.

## Design and decisions

- Reuse: the directive shape follows `client/src/directives/tooltip.ts` (one shared node under `body`). Styles live in `client/scss/_autocomplete.scss`; the legacy `.suggestion-*` rules stay until the cleanup.
- Public type change: `HeaderSearch.method` and `HeaderSearch.keys` were removed. Breaking for any consumer that sets them in TypeScript.
- `$header-height` Sass variable added in `client/scss/_header.scss` so the phone list can sit below the header.

## Deviations from the conversion guide

- `docs/component-conversion.md` says a directive must not add bus events the plugin never fired. The legacy `_autocomplete.js` imports the bus but never calls `emit`, so `show` / `hide` / `select.autocomplete` are new events. See the question below.
- `v-autocomplete` is registered in `client/src/app.ts` but not in `.storybook/preview.ts`; the stories and `Header.vue` register it locally. `form` and `validation` already do the same, so no change is needed.

## Needs developer input

- [ ] → component-developer: Keep the new bus events `show` / `hide` / `select.autocomplete`? Yes, and I add an exception line to the conversion guide (recommended, they are useful for GA via the bus) / No, remove them and keep only the DOM event `autocomplete-select`.

## Changelog

- 2026-11-20: created after the fact from commit 533865d; acceptance checks AC1–AC4 re-run; docs updated; status `docs-updated` (docs-maintainer)
