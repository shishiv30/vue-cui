---
name: convert-ejs-to-vue
description: Convert one EJS + JS plugin pair into a Vue component (model, lifecycle, events, Storybook). Use when the user asks to convert a component, port an EJS/plugin to Vue, or follow docs/component-conversion.md.
---

# Convert EJS + JS to Vue

> **Temporary skill.** It exists only for the EJS → Vue migration. When every plugin in `pluginCatalog.ts` is `vue`, delete this skill along with the EJS and plugin runtime. Follow the migration-end cleanup requirement in `notes/requirements/`.

Source of truth: `docs/component-conversion.md`. Match Header and Slider. Do not invent a second model, CSS file, or event bus. Convert **one component at a time**. Pages keep the EJS and old plugin until a later swap.

After the Vue file exists, follow the `storybook-docs` skill for the story.

## Files

| Piece | Path |
| --- | --- |
| EJS | `server/ejs/comp_<name>.ejs` |
| Plugin | `client/js/plugins/_<name>.js` |
| Data | data builder (`getHeaderData`, `mapAlbumToComp`, or the object the template already receives) |
| Model | `client/src/components/<name>Model.ts` |
| Vue | `client/src/components/<Name>.vue` |
| Story | `client/src/components/<Name>.stories.ts` |
| Catalog | `client/src/components/pluginCatalog.ts` — set that component's `status` to `vue` |

Worked examples: Header (`comp_header.ejs`, `_header.js`, `getHeaderData`) and Slider (`comp_album.ejs`, `_slider.js`).

## Steps

Follow `docs/component-conversion.md` (steps 1-8, Events, "What goes on the model", CSS). It is the single source; this skill adds only:

- **Step 9, the library export** (when the component is public): export it from `client/src/lib/index.ts`, add the `.vue` file, its `<name>Model.ts` and any helper its types import to `dts.include` in `vite.lib.config.ts`, then run `npm run build:lib`.

## Check

Run the `verify` skill. In Storybook, exercise the component the way a user would (Header: menu, submenu, scroll; Slider: Controls, plus `next`/`prev` more than once). How it looks is checked by a person.
