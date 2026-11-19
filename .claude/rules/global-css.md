---
paths:
  - "**/*.vue"
  - "client/scss/**"
  - ".storybook/**"
---

# Global CSS

Do not add CSS to Vue components. No `<style>` blocks in `.vue` files, and no per-component stylesheet.

All styles live in `client/scss/index.scss` (it forwards `_theme.default.scss` and `base.scss`). Load that one file globally:

- App pages: the built bundle as the single `meta.css` link in `server/ejs/html_above.ejs`.
- Storybook: load the app sheet through `.storybook/app-layer.scss` (`layer(app)`) from `.storybook/preview.ts`. `.storybook/code-panel.css` then keeps `.docblock-source` out of those element styles.

Vue templates only use class names that already exist in that stylesheet.

## State classes (team charter §2)

CSS defines every UI state. JS only switches between them.

- **List the states up front.** Each state is a class combined with the component class: `.dropdown.active`, `.button.selected`, `.input.disabled`, `.list.loading`, `.result.empty`. Variants are modifier classes (`<root>-<variant>`).
- **Vue switches state** with class bindings (`:class="{ active: open }"`). Legacy code uses `defBool` / `defEnum` (`client/js/core/def.js`). No inline `style` writes to draw a state.
- **Animation is CSS** (transition, `@keyframes`, `@starting-style`, scroll-driven timelines). JS may toggle the class that starts it, but never compute frames or positions that CSS can handle.
- **Dynamic sizing is CSS too:** container queries with `cqw`/`cqh`, `svh`/`dvh`/`lvh`, `clamp()`, `min()`/`max()`, `aspect-ratio` and `:has()`, instead of measuring in JS.
- Check that a feature is supported in the browsers we target, and add a simple fallback where it isn't.
