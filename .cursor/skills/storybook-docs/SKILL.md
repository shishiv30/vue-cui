---
name: storybook-docs
description: Add or update Storybook docs, stories, and Controls for Vue components. Use when the user asks to add or update a Storybook document, story, autodocs, Controls, or Docs page for a component, or when finishing the story step of a component conversion.
---

# Storybook docs

Source of truth: `docs/component-conversion.md` (Storybook and Exposed method controls). Match `client/src/components/Slider.stories.ts`. Do not invent a second pattern.

## When editing a story

1. File: `client/src/components/<Name>.stories.ts`. `title` is `Components/<Name>`. `tags: ['autodocs']`.
2. One Controls arg per model field in `client/src/components/<name>Model.ts`. Each `argTypes` entry has a `description` and `table.category` `props`.
3. `render` builds `model` from those args and passes only `:model`. Do not pass `defineExpose` methods as props.
4. Canvas template is only the component. No method buttons in the story template.
5. `parameters.docs.description.component` states what the Docs page shows (fields, exposed methods, events).
6. Do not set per-story `docs.source.code`. Show code comes from `.storybook/preview.ts`: a `v-model` tag, `<Name :model="{ ... }" />`, or the directive template.

## Directives

File: `client/src/directives/<name>.stories.ts`. `title` is `Directives/<Name>`. No model Controls.

`parameters.docs.description.component` is the **Input** table in `docs/component-conversion.md` (Directive docs). One row for the value, one row per modifier group (`modifier once`, `modifier trigger`, `modifier placement`) with what it does, the default, and a `v-tooltip.once` example, then markup. Omit an unused argument. Do not merge every modifier into one cell.

The usage template is the story `template`. Preview shows it in the [code panel](https://storybook.js.org/docs/writing-docs/code-panel) and the Docs source block, including `v-tab`, `v-tab="0"`, and `v-collapse`. Do not set `docs.source` on the story.

## Exposed methods

Storybook has no button control. A radio cannot fire the same value twice. Use a number arg as a call trigger.

1. Name the arg after the method (`next`, `prev`). Type it as `number`.
2. `control: 'number'`, `table.category` `'exposed'`, `table.type.summary` the real signature (`'() => number'`). Description says what the method does and that changing the control calls it.
3. Default the arg to `0`.
4. In `render`, `ref` the component. `watch` the arg (not `immediate`) and call `slider.value?.next()`. Do not bind the arg onto `model`.

## Events

Behavior events are a `change` / `changed` pair (name before the state changes, named after). Declare them with `defineEmits` and a JSDoc comment on each key so `vue-component-meta` lists them.

In `argTypes`, describe each event with `table.category` `events` and no control. Do not add a radio for an event.

## CSS

No `<style>` in `.vue` files. Styles stay in `client/scss/index.scss`. Storybook already imports it in `.storybook/preview.ts` and sets `document.body.id` to `body`.

Every docs example is inline with `min-height: 300px` from `docs.story` in `.storybook/preview.ts`. Preview padding is `layout: 'padded'` plus one rule in `.storybook/code-panel.css`: `.sb-show-main.sb-main-padded` for the story canvas and `#storybook-docs .docs-story` for each docs preview, both `padding: var(--g2)`. Do not set that height or padding on a single story.

Docs theme follows the browser: `prefers-color-scheme: dark` uses `themes.dark`, otherwise `themes.light`. That switch lives in `SystemDocsContainer` in `.storybook/preview.ts`. Do not set `textColor` or `appContentBg` to a CSS variable — Storybook parses those tokens as colors and the docs page fails to render. Do not add CSS to fight `.sbdocs-wrapper` background.

## Check

`npm run storybook`. Docs is **Components / Name / Docs**. Controls is the bottom bar. Change a field, then change each exposed-method number more than once.
