# REQ-20261124-dead-data-role-hooks: Replace dead data-role hooks with Vue; form radius rule

| Field        | Value                                                                              |
| ------------ | ---------------------------------------------------------------------------------- |
| Status       | docs-updated                                                                       |
| Owner (dev)  | component-developer                                                                |
| Requested by | the user                                                                           |
| Branch / PR  | committed directly on `master` (86ef412)                                           |
| Release      | not released yet (no tag); shipped in commit 86ef412                               |
| Related docs | `docs/component-conversion.md`, `docs/css-design-system.md`, `docs/change-list.md` |

Written after the fact: no requirement existed before the work.

## Why

The Vue app never loads the legacy `client/js` plugin runtime, so `data-role` hooks in Vue files (modal, dialog, scrollto, theme, sharelink, list-dict) did nothing. Form controls also used the container radius scale, which made them too round.

## Scope

- In: `v-modal`, `v-dialog`, `v-scrollto`, `v-theme` directives; `Sharelink` component; removal of every `data-role` in `client/src`; `comp-size()` `$radius` rule.
- Out: removing the legacy plugins and their styles (REQ-migration-end-cleanup); `dts.include` for `Map.vue`, `collapse`, `lazyload`, `tab`, `tooltip`.

## Requirements

- [x] R1 Directives `client/src/directives/{modal,dialog,scrollto,theme}.ts` with stories.
- [x] R2 `Sharelink.vue`, `sharelinkModel.ts`, `Sharelink.stories.ts`; native share item added after mount (SSR hydration safe).
- [x] R3 Registered in `client/src/app.ts`, `.storybook/preview.ts`, `client/src/lib/index.ts`, `vite.lib.config.ts` `dts.include`.
- [x] R4 No `data-role` left in `client/src` (Header, Shifter, Welcome, GroupDropdown, Document); list-dict is pure CSS.
- [x] R5 `pluginCatalog.ts`: Modal, Dialog, ScrollTo, Sharelink, ListDict, Theme are `vue`.
- [x] R6 Modal state via `modal-active` + `@starting-style`, reduced-motion fallback, scroll lock on `html.modal-model`.
- [x] R7 `comp-size($name, $width, $radius)`: `'container'` (default) or `'form'`; form controls use `'form'`; selectbox reads `--selectbox-radius`.

## Acceptance criteria

- [x] AC1 `rg data-role client/src` finds nothing.
- [x] AC2 `npm run build:lib` passes and emits `dist-lib/directives/{dialog,modal,scrollto,theme}.d.ts` and `dist-lib/components/Sharelink.vue.d.ts` (checked 2026-11-24).
- [x] AC3 `rg "comp-size\(.*'form'" client/scss` lists btn, input, selectbox, checkbox, radio, group-btn, group-dropdown-button, suggestion-list, autocomplete-list.

For human verification (look and feel, interaction):

- [ ] Storybook: modal opens/closes (button, overlay, Esc), fades in and out, page does not scroll while open.
- [ ] Storybook: dialog opens, closes on backdrop and `[data-dialog="close"]`.
- [ ] `/document`: scrollto smooth scroll; theme toggle on Header logo persists after reload.
- [ ] Sharelink: each platform opens; native share item appears on supporting browsers; no hydration warning.
- [ ] Form controls: radius looks right at tiny / small / normal / large.

## Design and decisions

- Reuse: directives follow the `autocomplete` / `collapse` shape (WeakMap state, `mounted` / `unmounted`). Sharelink follows the component + model + story layout.
- Theme uses the same `localStorage.theme` key and classes as the inline script in `client/src/index.html`.
- Version impact: new library exports (minor).

## Needs developer input

None.

## Changelog

- 2026-11-24: created after the fact and closed (docs-maintainer). Docs checked; `css-design-system.md` §2.3 table and the `dts.include` row in `change-list.md` corrected.
