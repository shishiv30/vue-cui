---
name: convert-ejs-to-vue
description: Convert one EJS + JS plugin pair into a Vue component (model, lifecycle, events, Storybook). Use when the user asks to convert a component, port an EJS/plugin to Vue, or follow docs/component-conversion.md.
---

# Convert EJS + JS to Vue

Source of truth: `docs/component-conversion.md`. Match Header and Slider. Do not invent a second model, CSS file, or event bus. Convert **one component at a time**. Pages keep the EJS and old plugin until a later swap.

After the Vue file exists, follow `.cursor/skills/storybook-docs/SKILL.md` for the story.

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

1. **Markup.** Keep the same class names from the EJS. No `<style>` block and no new stylesheet. Classes already live in `client/scss/index.scss`.
2. **Data.** The data-builder object is the UI model. Do not invent a second shape.
3. **Model file.** TypeScript interface plus `<name>Mock` for Storybook only. Comment each field.
4. **Component.** One prop: `model`. Root class stays in the template (`header`, `slider`). Extra classes and flags are fields (`className`, `sticky`). Watch a field when Storybook must change it after mount (`initialIndex`).
5. **Lifecycle.** Port plugin `init` into Vue. Remove listeners in `onBeforeUnmount`. Use `emitPhase` from `client/src/components/emitPhase.ts` (same names as `Plugin.emitPhase`).
   - Mount, in order: `init.<name>`, `initialed.<name>`, `load.<name>`, `loaded.<name>`, `render.<name>`, then the component's own setup, then `rendered.<name>`.
   - Unmount: `destroy.<name>`, cleanup, `destroyed.<name>`.
6. **Methods.** Plugin methods on the export object (`next`, `prev`) become `defineExpose`, each with a one-line comment. Do not pass them as props.
7. **Story.** One Controls arg per model field. `render` builds `model` from those args. Exposed methods: number-arg call trigger (see storybook-docs skill and **Exposed method controls** in the conversion doc). Canvas is only the component.
8. **Catalog.** Set `status` to `vue`.

## Events

Two channels, one bus (`client/js/core/event.js` via `emitPhase` / `emit`). Do not add a second event system.

**Lifecycle.** Name is `${phase}.${componentName}`. Payload is the root element.

**Behavior.** Add only when a caller must observe a change. Pair `change` (before state updates) and `changed` (after). Also emit bus `${event}.${componentName}`. Payload includes the value the caller needs. Slider `go()` is the example: bus `change.slider` / `changed.slider` with `[element, index]`, Vue `change` / `changed` with the index.

Declare Vue events with `defineEmits` and a JSDoc comment on each key. In stories, `argTypes` for events use `table.category` `events` and no control.

## What goes on the model

On the model: content from the data builder; markup options (`className`, `sticky: 'true' | 'false'`); optional blocks (omit `search` to hide search; empty `images` renders nothing).

Leave off: runtime state (menu open, current slide after user move); hooks for a different component (`data-role="autocomplete"`, `data-role="theme"`).

## CSS

No CSS in Vue. App: one `meta.css` from `server/ejs/html_above.ejs`. Storybook: `client/scss/index.scss` in `.storybook/preview.ts`, `document.body.id` = `body`.

## Check

`npm run storybook`. Exercise the converted component the way a user would (Header menu/submenu/scroll; Slider Controls plus `next`/`prev` more than once).
