---
paths:
  - "client/scss/**"
  - "client/src/**/*.vue"
  - "client/src/**/*.stories.ts"
  - "data/comps/theme*.js"
  - "notes/requirements/**"
---

# Design principles

The top rule is team charter §1: **simple and consistent, easy to use.** Everything below serves it.

These are the visual and UX rules that `ui-ux-designer` designs within, and that developers use when they review a design proposal. Change a principle on purpose, with the user's OK. Don't drift away from one by accident.

## The system

- **Color comes from tokens only.** The HSL root system in `client/scss/_theme.default.scss`:
  - Hue, saturation and lightness sources: `--color-root-*`
  - Role aliases on `body`
  - Themes in `data/comps/theme-*.js`

  Never use a raw hex value in a component. A new color is a new hue or role token, and it must work in both `theme-light` and `theme-dark`.
- **Spacing, size and radius** use the existing tokens and mixins (`_gap.scss`, `comp-size`, the `border-*-radius` mixins). No one-off pixel values.
- **Type** uses `--cui-font` and the scale in `_typograph.scss`.
- **States** are designed one by one (default, hover, focus, active, selected, disabled, loading, empty, error) and built as CSS state classes (`global-css.md`).
- **Motion** uses `--animation-time` and the patterns in `_animation.scss`. It is CSS only, and it is used to guide attention along the data flow: what changed, and what to do next.
  - Animate `transform` and `opacity` only, not layout properties.
  - Every animation must have a `prefers-reduced-motion: reduce` fallback. Some partials have this commented out; that is a known gap to fix.
- **Layout** is mobile first, with breakpoints from `_var.screen.scss` (mirrored in `--screen-*`). Use the existing grid, flex and layout utilities.
- **Images** use lazy loading (`v-lazyload`) and a fixed aspect ratio, with no layout shift. Only the LCP image is preloaded.

## Consistency

- The same job looks and behaves the same everywhere: one button style per role, one dropdown pattern, one empty state, one loading skeleton (`_skeleton.scss`).
- Extend an existing component's variants before you invent a new look (see the `design-to-component` skill).
- A component's class names, model and events stay stable. A visual change must not need an API change unless it truly adds capability.

## UX quality bar

- **Fewer steps.** Remove an operation before you decorate it. Use sensible defaults, inline actions and progressive disclosure.
- **Clear and direct.** One primary action per view, visible state (selected, loading, error, empty), and copy that says what happens.
- **Accessible.** WCAG 2.1 AA contrast in both themes, visible focus, 44×44px touch targets, and meaning never carried by color alone.
- **Fast.** No design may regress LCP, CLS or INP (see the `perf-audit` skill).

## Proposals and push-back

- **Developers may push back** on a design proposal when it would:
  - break a rule above,
  - make components inconsistent with each other, or
  - add complexity out of proportion to the benefit (new tokens, flags or variants used once, heavy animation, new dependencies).

  The push-back must name the rule or the cost.
- **Respect proposals that clearly improve UX:** simpler, clearer, fewer operations, more beautiful, without breaking these rules. Adopt them even when they mean extra work.
- **When a clear UX improvement conflicts with a rule,** neither side wins by default. Write up both positions in the requirement and ask the user. If the user agrees, update this file first, then build.
