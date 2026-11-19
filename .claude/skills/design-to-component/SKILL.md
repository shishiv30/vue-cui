---
name: design-to-component
description: Build a new vue-cui component, or extend an existing one, from a design source — a Figma link, a design image or screenshot, or a live web demo URL. Starts with a reuse decision (reuse / extend / compose / new), then builds the component to the library's model, story, CSS and export conventions. Use whenever the user shares a design, mockup, Figma frame or demo site and wants it in the component library.
---

# Design → component

The main job of the component library: turn designs into **our own** components. Always decide whether to reuse, extend or compose **before** you write anything new.

## 1. Read the design

| Source | How to read it |
| --- | --- |
| **Figma link** | Use the Figma MCP tools if they are connected. If they need sign-in, tell the user to authorize Figma through `/mcp`, or to export the frame as an image. Pull the frame structure, spacing, colors, type and variants. |
| **Image or screenshot** | Read the image file. Ask for the missing states (hover, empty, loading, error, mobile) when the image doesn't show them. |
| **Web demo URL** | Open it in the Browser pane (`preview_start` with the URL). Use `read_page` / `get_page_text` for structure and screenshots for visuals. Check its behavior at mobile and desktop widths. |

Write a short **spec** before building:

- purpose
- content fields
- variants
- states
- interactions and events
- responsive behavior
- tokens it implies (colors, spacing, radius, type)

For a web demo: rebuild the behavior with our markup, classes and tokens. **Never copy the demo's code, CSS, images, icons or text.**

## 2. Inventory what exists

Look in all of these before deciding:

- **Vue components:** `client/src/components/*.vue` and their `<name>Model.ts` files. Public ones are exported from `client/src/lib/index.ts`.
- **Directives:** `client/src/directives/` (tab, collapse, tooltip, lazyload, form, validation).
- **Legacy plugins not yet converted:** `client/src/components/pluginCatalog.ts`, entries with `status: 'plugin'`. If one matches the design, convert it with the `convert-ejs-to-vue` skill instead of building it from scratch.
- **CSS:** `client/scss/_<name>.scss` partials, the utilities (`_flex`, `_gap`, `_grid`, `_utilities`), tokens (`_theme.default.scss`) and mixins (`_mixins.scss`).
- **Storybook:** run `npm run storybook` and browse it to see what each component already does.

## 3. Decide: reuse, extend, compose or new

| Decision | When | What you do |
| --- | --- | --- |
| **Reuse** | An existing component already covers the design. The difference is content, or tokens and a theme. | Nothing new. Document which model and theme produce the design. At most, add a theme or token value. |
| **Extend** | Same purpose and structure, plus a variant, an optional block, an option or a new state. The existing model stays backward compatible. | Add **optional** model fields with defaults, plus a modifier class (`<root>-<variant>`) in its partial. Never change the meaning of existing fields. Update the story Controls. This is a minor version bump. |
| **Compose** | The design is a pattern made of existing pieces (e.g. a filter bar = `GroupDropdown` + `DropdownCheckbox` + `RangeSlider`). | Build it in the app layer, or as a thin wrapper component only if it will be reused. Do not copy the children's markup. |
| **New** | A different purpose or interaction model, *or* extending would mean a breaking change, more than ~3 boolean flags, or a model where most fields only apply to one variant. | Build a new component (step 4). If it replaces an old one, mark the old one deprecated rather than breaking it. |

**Signs that an extension has gone too far** (choose new or compose instead):
- the template fills up with `v-if` branches per variant
- the model's fields are mostly mutually exclusive
- the component would need to know about page or API logic

**When the call is close**, write the trade-off in two or three lines and ask the user before you build.

Write the decision down. Put it in the story's `parameters.docs.description.component` and in your report: what you found, the decision, and why.

## 4. Build

Follow the library conventions (the `storybook-docs` skill and `.claude/rules/global-css.md`):

1. **Model.** `client/src/components/<name>Model.ts`: an interface with every field commented, plus `<name>Mock` for Storybook.
2. **Component.** `client/src/components/<Name>.vue`:
   - a single `model` prop
   - semantic HTML (`html-page-blueprint.md`)
   - lifecycle through `emitPhase`
   - behavior events as `change`/`changed` pairs on the one bus
   - `defineExpose` for methods
   - SSR-safe (no `window` outside `onMounted`)
   - an optional `track` field for GA (`add-ga-event` skill)
   - no `<style>` block
3. **CSS.** A new `client/scss/_<name>.scss`, forwarded from `index.scss`.
   - Use the existing tokens and mixins.
   - Add a token only when the design introduces a real new value, and put it in the theme layer, not inline.
   - Mobile first, with breakpoints from `_var.screen.scss`.
4. **Story.** `<Name>.stories.ts`: one control per model field, one story per variant or state from the spec.
5. **Export.** If the component is public: add it to `client/src/lib/index.ts` and to `dts.include` in `vite.lib.config.ts`.
6. **Run the `verify` skill**, including `npm run build:lib`.

## 5. Report

- The design source.
- The spec.
- The decision (reuse / extend / compose / new) and why.
- The files you changed.
- The model API (fields, events, exposed methods).
- The version impact (patch / minor / major).
- **For human verification:** compare the story with the design (pixel fit, states, responsive widths, keyboard and click behavior). A person signs off on how it looks.
