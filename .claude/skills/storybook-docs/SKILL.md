---
name: storybook-docs
description: Add or update Storybook docs, stories, and Controls for Vue components. Use when the user asks to add or update a Storybook document, story, autodocs, Controls, or Docs page for a component, or when finishing the story step of a component conversion.
---

# Storybook docs

The story, Controls, exposed-method, event and directive conventions are in `docs/component-conversion.md` (sections Storybook, Show code, Exposed method controls and Directive docs). That doc is the single source. Match `client/src/components/Slider.stories.ts`. Do not invent a second pattern.

Quick reference: `title: 'Components/<Name>'` (or `'Directives/<Name>'`), `tags: ['autodocs']`, one control per model field, `render` passes only `:model`, exposed methods are triggered by number args (category `exposed`), events use category `events` with no control, and there is no per-story `docs.source`.

## CSS

No `<style>` in `.vue` files. Styles stay in `client/scss/index.scss`. Storybook already imports it in `.storybook/preview.ts` and sets `document.body.id` to `body`.

Every docs example is inline with `min-height: 300px` from `docs.story` in `.storybook/preview.ts`. Preview padding is `layout: 'padded'` plus one rule in `.storybook/code-panel.css`: `.sb-show-main.sb-main-padded` for the story canvas and `#storybook-docs .docs-story` for each docs preview, both `padding: var(--g2)`. Do not set that height or padding on a single story.

Docs chrome follows the browser: `prefers-color-scheme: dark` uses `themes.dark`, otherwise `themes.light`. That switch lives in `SystemDocsContainer` in `.storybook/preview.ts`. The canvas theme follows the Preview background toolbar: selecting light or dark sets `theme-light` or `theme-dark` on `html` and `body` in the preview decorator. Do not set `textColor` or `appContentBg` to a CSS variable — Storybook parses those tokens as colors and the docs page fails to render. Do not add CSS to fight `.sbdocs-wrapper` background.

## Check

`npm run storybook`. The Docs page is **Components / Name / Docs**. Change a field, and change each exposed-method number more than once.
