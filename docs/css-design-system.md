# Pure CSS Design System: Variable Rules and Design Principles

> Version: reviewed against the current `client/scss/` code (2026-08)
> Purpose: the layering rules, naming conventions and base token list for the project's CSS custom properties (CSS vars), plus the known gaps. A baseline for a future "universally adaptive responsive approach".

---

## Summary

Pure's styles use no CSS framework (no Tailwind, no CSS-in-JS). Dart Sass compiles them through Vite into `[name].min.css`.

The core idea is not "writing styles". It is **a value-passing chain built from CSS custom properties, which any ancestor can re-route**. SCSS does only two compile-time jobs: media-query breakpoints (`$screen-*`) and icon code points (`$icon-*`). Everything else is a `--*` variable that can be overridden at runtime.

The project has **493 lines** of custom-property declarations in 26 source files. The authoritative file is `client/scss/_theme.default.scss` (263 lines).

---

## 1. Architecture: three token layers

Three layers exist. The lower the layer, the more semantic and the closer to the component:

```
Layer 1  Channel primitives          :root
         --color-root-major-hue: 165
         --color-root-major-saturation: 58%
         --color-root-major-lightness: 23%
                        ↓ assembled by hsl()
Layer 2  Semantic roles              body
         --color-major: hsl(hue, sat, light)
         --color / --color-bg / --color-border   ← context aliases
                        ↓ derived in bulk by comp-color() / comp-size()
Layer 3  Component contract          .btn / .input / ...
         --btn-color / --btn-color-bg / --btn-size / --btn-font-size
```

### Principle 1: the atom of color is the HSL channel, not the color value

The project **stores no colors, only hue / saturation / lightness channels**. `hsl()` assembles the final color in layer 2:

```scss
--color-major: hsl(
	var(--color-root-major-hue),
	var(--color-root-major-saturation),
	var(--color-major-lightness)
);
```

Benefit: re-theming means changing one `--color-root-major-hue` (declared in the theme SCSS under `client/scss/`). The server-side inline theme (`data/comps/theme.js` + `comp_theme`) was removed together with EJS.

Dark mode works the same way: it flips only the lightness channel and rewrites no color value.

### Principle 2: variables re-route through DOM inheritance, not selector stacking

A component never reads a global token directly. It reads its own `--<comp>-*`, and `--<comp>-*` points to the context aliases `--color` / `--color-bg`. Any ancestor that rewrites `--color` re-routes the whole subtree, with no extra selector specificity.

`comp-color($name)` keeps one set of `--<comp>-color*` tokens. `.active` points that same set at the active palette, so components do not restyle color, background, or border inside `&.active`.

```scss
@mixin comp-color($name) {
	.#{$name} {
		--#{$name}-border-weight: 1px;
		&:not(.active) {
			--#{$name}-color: var(--color);
			--#{$name}-color-bg: var(--color-bg);
			--#{$name}-color-border: var(--color-border);
			--#{$name}-color-hover: var(--color-hover);
			--#{$name}-color-border-hover: var(--color-border-hover);
			--#{$name}-color-bg-hover: var(--color-bg-hover);
		}
		&.active {
			--#{$name}-color: var(--color-active);
			--#{$name}-color-bg: var(--color-active-bg);
			--#{$name}-color-border: var(--color-active-border);
			--#{$name}-color-hover: var(--color-active-hover);
			--#{$name}-color-bg-hover: var(--color-active-bg-hover);
			--#{$name}-color-border-hover: var(--color-active-border-hover);
		}
	}
}
```

The companion `color()` mixin (`_mixins.scss:62-141`) defines 7 semantic classes `.default .gray .major .minor .danger .safe .tip`. Each class rewrites the `--color` alias family and derives the hover state with `color-mix()`:

```scss
--color-hover: color-mix(in srgb, var(--color) 90%, var(--color-root));
--color-bg-hover: color-mix(in srgb, var(--color-bg) 90%, var(--color-root-bg));
```

`_header.scss:28-72` is the fullest example of this principle. The dark header wires child-component tokens to its own tokens, so inputs and buttons invert automatically:

```scss
--input-color: var(--header-color);
--input-color-bg: var(--header-color-bg);
--btn-color: var(--header-color);
--btn-color-bg: var(--header-color-bg);
```

### Principle 3: sizes use T-shirt steps, not per-property tweaks

`comp-size($name, $width, $radius)` (`mixins/_size.scss`) gives every component four steps, `tiny / small / normal / large`, and rewrites gap, font-size, size, line-height and radius at once. `$radius` picks the radius rule, `'container'` (default) or `'form'` (see §2.3):

```scss
&,
&.normal {
	--#{$name}-gap: var(--g1);
	--#{$name}-font-size: var(--font-size-5);
	--#{$name}-size: var(--comp-size-3);
	--#{$name}-line-height: var(--line-height-3);
}
&.tiny {
	--gap: 0;
	--font-size: var(--font-size-6);
	--size: var(--comp-size-1);
}
&.small {
	--gap: var(--gxs);
	--font-size: var(--font-size-5);
	--size: var(--comp-size-2);
}
&.large {
	--gap: var(--g1);
	--font-size: var(--font-size-4);
	--size: var(--comp-size-4);
	--border-weight: 2px;
}
```

The component itself only consumes tokens, with no hard-coded sizes (`_button.scss:48-59`):

```scss
font-size: var(--btn-font-size);
height: var(--btn-size);
padding: var(--btn-gap) var(--g2);
border-radius: calc(var(--btn-size) / 2);
box-shadow: inset 0 0 0 var(--btn-border-weight) var(--btn-color-border);
```

### Principle 4: responsive design changes the variable's value, not the property's value

**This is the responsive idea most worth keeping.** Media queries never write `width` / `font-size`. They only reassign tokens, so each declaration stays unique:

```scss
// client/scss/property.scss:9-43
.page-property {
	--item-width: 260px;
	--detail-max-width: 60%;

	@media (max-width: $screen-xs-max) {
		--item-width: 260px;
	}
	@media (min-width: $screen-sm-min) and (max-width: $screen-sm-max) {
		--item-width: 280px;
	}
	@media (min-width: $screen-md-min) and (max-width: $screen-md-max) {
		--item-width: 340px;
	}
	@media (min-width: $screen-lg-min) {
		--item-width: 360px;
	}
	@media (orientation: portrait) {
		--detail-max-width: 56%;
	}
	@media (orientation: landscape) {
		--detail-max-width: 40%;
	}
}
```

`_grid.scss:4-16` uses the same pattern to turn grid tracks into tokens:

```scss
--grid-col-1: repeat(1, minmax(80%, 1fr));
--grid-col-2: repeat(2, minmax(40%, 1fr));
--grid-col-3: repeat(3, minmax(30%, 1fr));
--grid-col-4: repeat(4, minmax(20%, 1fr));

--grid-xs: var(--grid-col-1);
--grid-sm: var(--grid-col-2);
--grid-md: var(--grid-col-3);
--grid-lg: var(--grid-col-4);
--grid-xl: var(--grid-col-5);
```

`_layout.scss:338/477` does the same (`--record-xs/sm/md`, `--market-overview-xs/sm/md/lg`).

### Principle 5: spacing and font size are two projections of one sequence

Each `--g*` step states its relation to font size in a comment. Spacing is not picked at random. It is half a font size, or the sum of the previous two steps (Fibonacci-style accumulation):

```scss
--gxs: 0.125rem; // half of gs
--g0: 0.25rem; // half of f7
--g1: 0.5rem; // half of f5
--g2: 0.75rem; // half of f3 or g0 + g1
--g3: 1rem; // g1 + g2
--g4: 1.75rem; // g2 + g3
--g5: 2.75rem; // g3 + g4
--g6: 4.5rem; // g4 + g5
```

`--comp-size-*` also documents its derivation (golden ratio 1.618):

```scss
--comp-size-1: 1.75rem; // f3 (f5 × 1.618)
--comp-size-2: 2rem; // gxs + f3 + gxs
--comp-size-3: 2.75rem; // 1.75 + .5 × 2
--comp-size-4: 3.2rem; // 1.25 × 1.25 + 0.5 × 2
```

---

## 2. Base token list

### 2.1 Typography

| Token                   | Value      | Note                                                        |
| ----------------------- | ---------- | ----------------------------------------------------------- |
| `--cui-font`            | `'Roboto'` | The only token with a vendor prefix                         |
| `--font-size-1`         | `2rem`     | Note: **a smaller number is a larger size** (reverse order) |
| `--font-size-2`         | `1.75rem`  |                                                             |
| `--font-size-3`         | `1.5rem`   |                                                             |
| `--font-size-4`         | `1.25rem`  |                                                             |
| `--font-size-5`         | `1rem`     | Base body size                                              |
| `--font-size-6`         | `0.875rem` |                                                             |
| `--font-size-7`         | `0.75rem`  |                                                             |
| `--line-height-1`       | `1`        |                                                             |
| `--line-height-2`       | `1.25`     | Global default in `_reset.scss`                             |
| `--line-height-3`       | `1.75`     | Component default                                           |
| `--font-weight-regular` | `400`      |                                                             |
| `--font-weight-medium`  | `400`      | ⚠ Same value as regular                                     |
| `--font-weight-bold`    | `700`      |                                                             |

The root font size is **hard-coded to `16px`** in `_reset.scss:49` and is not a token. This is the biggest blocker for fluid typography.

Aliases: mixins `f1`…`f7` (`_mixins.scss:484-510`) and utility classes `.h1/.f1` … `.h7/.f7` (`_typograph.scss:5-50`).

### 2.2 Spacing

Atoms: `--gxs --g0 --g1 --g2 --g3 --g4 --g5 --g6` (see above)

Layout semantic layer (`_theme.default.scss:193-197`, scoped to `body`):

```scss
--section-gap-x: var(--g3);
--section-gap-y: var(--g4);
--panel-gap-x: var(--g2);
--panel-gap-y: var(--g3);
```

The `gap-size()` mixin (`_mixins.scss:452-482`) remaps these four values per `tiny/small/normal/large`.

Utility classes (`_gap.scss`, 330 lines): `.m-{x,y,t,b,l,r}-{0,xs,1,2,3,4}`, with `.p-…` built the same way.

### 2.3 Radius

```scss
--radius-0: 0.25rem;
--radius-1: 0.5rem; // default of --comp-border-radius
--radius-2: 1rem;
--radius-3: 1.5rem;
--radius-4: 2rem;
```

Utility classes `.corner-0..3` (`_utilities.scss:51-65`, no `.corner-4`).

`comp-size($name, $width, $radius)` (`mixins/_size.scss`) sets `--<name>-radius` per size:

| `$radius`               | Used by                                                                                                  | tiny         | small        | normal       | large        |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------ | ------------ | ------------ | ------------ |
| `'container'` (default) | list, breadcrumb, circle, tab, panels                                                                    | `--radius-0` | `--radius-1` | `--radius-2` | `--radius-3` |
| `'form'`                | btn, input, selectbox, checkbox, radio, group-btn, group-dropdown-button, autocomplete / suggestion list | `--radius-0` | `--radius-0` | `--radius-0` | `--radius-1` |

### 2.4 Color

**Global channels**

```scss
--color-root-lightness: 23%;
--color-root-l1-lightness: 95%;
--color-root-saturation: 1%;
--color-root-bg-saturation: 100%;
--color-root-bg-saturation: 100%;
--color-root-lightness: 30%;
```

**Semantic roles (5)**: each role has 5 channel tokens + 4 assembled tokens

| Role   | hue | saturation                   | lightness | l1  |
| ------ | --- | ---------------------------- | --------- | --- |
| major  | 165 | 58%                          | 23%       | 99% |
| minor  | 169 | 100%                         | 31%       | 99% |
| safe   | 179 | `--color-root-bg-saturation` | 25%       | 99% |
| danger | 10  | same as above                | 48%       | 99% |
| tip    | 321 | same as above                | 24%       | 99% |

**Context aliases (the layer components actually read)**

```scss
--color: var(--color-root);
--color-bg: var(--color-root-bg);
--color-border: var(--color-root-border);
--color-hover: var(--color-root-l1);
--color-bg-hover: var(--color-root-bg-l1);
--color-l1: var(--color-root-l1);
--color-bg-l1: var(--color-root-bg-l1);
--color-active: var(--color-root-bg);
--color-active-bg: var(--color-root);
--color-active-border: var(--color-root);
--color-disabled: var(--color-root-l1);
```

**Neutral scale** `--color-0..9` (lightness 100% → 10%, step 10%) + **rainbow scale** `--color-r0..r9` (10 fixed hues). Neither has a consumer today.

**Selection**

```scss
--selection-background: color-mix(in srgb, var(--color-major) 40%, var(--color-bg));
--selection-color: var(--color-root);
```

### 2.5 Component size

```scss
--comp-size-1: 1.75rem;
--comp-size-2: 2rem;
--comp-size-3: 2.75rem;
--comp-size-4: 3.2rem;

--comp-height: var(--comp-size-3);
--comp-font-size: var(--font-size-5);
--comp-border-radius: var(--radius-1);
--comp-max-width: auto;
--comp-line-height: var(--line-height-3);
```

### 2.6 Z-index

**The only dimension fully tokenized** (`_reset.scss:52-66`; note the scope is `html`, not `:root`):

```scss
--ui-tooltip-index: 1000;
--ui-popover-index: 1050;
--ui-buttongroup-index: 1100;
--ui-pin-index: 1930;
--ui-pin-hover-index: 1940;
--ui-stick-index: 1960;
--ui-header-overlay: 1990;
--ui-header-index: 2000;
--ui-header-list-index: 2010;
--ui-datepicker-index: 2100;
--ui-gautocomplete-index: 3000;
--ui-dropdown-index: 3100;
--ui-modal-overlay: 10000;
--ui-modal-index: 10010;
```

### 2.7 Motion

Only one token: `--animation-time: 0.1s`, and **only `_button.scss:14` uses it**. All other transitions are magic numbers (0.15s / 0.2s / 0.3s / 0.5s / 1s, scattered across 20+ places). No easing token, no `prefers-reduced-motion`.

`_section-animation.scss` already uses modern scroll-driven animation, `animation-timeline: scroll() / view()` (8 places), also without tokens.

### 2.8 Breakpoints

`:root` now mirrors them as CSS variables (`--screen-xs-min` … `--screen-lg-max`), for `var()` and JS. `@media` conditions must still use the compile-time `$` variables below, so **the two places must be kept in sync by hand**.

```scss
// client/scss/_var.screen.scss
$screen-xs-min: 340px; // phone
$screen-sm-min: 459px; // tablet
$screen-md-min: 1279px; // desktop
$screen-lg-min: 1919px; // wide desktop
$screen-xl-min: 2559px; // HD+

$screen-xs-max: $screen-sm-min - 1; // 640px
$screen-sm-max: $screen-md-min - 1; // 1280px
$screen-md-max: $screen-lg-min - 1; // 1920px
$screen-lg-max: $screen-xl-min - 1; // 2560px
```

The strategy is **range-based (min + max in pairs)**, not a mobile-first cascade. The canonical form (`_grid.scss:23-41`):

```scss
@media (max-width: $screen-xs-max)                                  { … }
@media (min-width: $screen-sm-min) and (max-width: $screen-sm-max)  { … }
@media (min-width: $screen-md-min) and (max-width: $screen-md-max)  { … }
@media (min-width: $screen-lg-min) and (max-width: $screen-lg-max)  { … }
@media (min-width: $screen-xl-min)                                  { … }
```

The cost of ranges: all five branches must be declared. Miss one and that width has no value. Mobile-first only declares the change points. This is the main source of today's boilerplate.

### 2.9 Load order

```
index.scss
├── _theme.default.scss        ← all token definitions
└── base.scss
    ├── _font.roboto.scss      fonts
    ├── _icon.scss             icons
    ├── _reset.scss            reset + z-index tokens
    ├── _responsive.scss       .hidden-xs/sm/md/lg
    ├── _text.scss / _typograph.scss / _color.scss / _gap.scss / _utilities.scss
    ├── _grid.scss / _flex.scss
    └── 30+ component partials
```

No `@layer`. The cascade is forced by a `#body` id-selector prefix (`_typograph.scss` / `_color.scss` / `_gap.scss` / `_utilities.scss`).

---

## 3. Known gaps (direct impact on the responsive approach)

### 3.1 Four structural gaps blocking "universal adaptivity"

1. **No fluid typography.** `clamp()` appears **0 times** in the whole SCSS tree. Font size is identical at 320px and 2561px. Everything relies on fixed `rem` and a hard-coded `16px` root, so a 320px phone and a 4K display share one type scale.
2. ~~**Breakpoints have no CSS-variable counterpart.**~~ **Fixed.** `:root` now mirrors all 9 breakpoints as `--screen-*`, readable by `var()` and `getComputedStyle()`. The 4 references that silently failed (`_popover` `_layout` `_dialog` `_modal`) now work. **`@media` still only accepts the compile-time `$screen-*`**, so keep the two in sync by hand.
3. **No container queries.** No `@container` / `container-type`. All responsiveness is viewport-based, so the same component cannot adapt between a sidebar and the main area.
4. **Spacing does not scale with breakpoints.** `--g*` is constant globally. Only the manual steps of `gap-size()` can change it. There is no automatic shrink by viewport.

### 3.2 Missing token categories

| Category       | Status                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Shadow         | No `--shadow-*`. 3 mixins + 10 hard-coded `box-shadow`                                                         |
| Motion         | Only `--animation-time` (used once). No duration scale, no easing                                              |
| Letter spacing | No token. Only one `0.08em` in `_autoscroller.scss:69`                                                         |
| Border         | No width/style token, only component-level `--<comp>-border-weight`                                            |
| Opacity / blur | None                                                                                                           |
| Focus ring     | None. `_reset.scss:118` sets `outline: none` on all form controls with no replacement: an accessibility defect |

### 3.3 Confirmed bugs: all fixed

See "Appendix 2: Fix log" at the end.

| Location                                                                        | Problem                                                                                                                                                                                                          | Status |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `_theme.default.scss`                                                           | `--color-root-lightness: 750%` should be `75%`                                                                                                                                                                   | ✅     |
| `_theme.default.scss`                                                           | Dark mode rewrites `--color-root-major-lightness`, but the `--color-major-lightness` alias was already resolved on `:root`, so **the 5 semantic colors major/minor/safe/danger/tip did not darken in dark mode** | ✅     |
| `_button.scss` `_input.scss` and 5 more                                         | Consume `var(--<comp>-font-weight)`, but `comp-size()` never produces that token                                                                                                                                 | ✅     |
| `_typograph.scss` `_mixins.scss`                                                | Consume `--font-weight-light`, never defined → `.text-light` was a no-op                                                                                                                                         | ✅     |
| `_font.roboto.scss`                                                             | `font-weight: 700` pointed at `Roboto-Regular.woff2`; the browser saw a real bold and **skipped synthesis** → bold looked identical to regular                                                                   | ✅     |
| `_layout.scss` ×4                                                               | Consume the undefined `var(--color-f)`                                                                                                                                                                           | ✅     |
| `_layout.scss` ×3                                                               | Consume the undefined `var(--color-link-default)`                                                                                                                                                                | ✅     |
| `_header.scss`                                                                  | `var(--head--color-active-border)`: double-dash typo                                                                                                                                                             | ✅     |
| `_popover.scss` `_layout.scss` `_dialog.scss` `_modal.scss`                     | `var(--screen-xs-min/max)` silently failed                                                                                                                                                                       | ✅     |
| `_layout.scss` `_dropdownmenu.scss` `_tooltip.scss` `_animation.scss`, 7 places | `content: var(--icon-*)`: icons are SCSS `$icon-*`, not custom properties, so icons never showed                                                                                                                 | ✅     |
| `_slider.scss` `_shifter.scss`                                                  | Consume the undefined `--line-height-normal`                                                                                                                                                                     | ✅     |
| `_autoscroller.scss` ×4                                                         | Consume invented tokens `--g0-5` `--g1-5` `--color-bg-l2` `--color-fg-2` `--color-text-2`                                                                                                                        | ✅     |
| `_sharelink.scss`                                                               | `var(--radius, …)` has no such token; and the fallback in `var(--g1, 0.25rem)` does not match `--g1` (0.5rem)                                                                                                    | ✅     |
| `_theme.default.scss` vs `_mixins.scss`                                         | `--section-gap-y` default differs (`--g4` / `--g5`)                                                                                                                                                              | ✅     |

### 3.4 Consistency issues

- **Tokens are spread over three root scopes with no rule**: `:root` (raw channels), `html` (z-index), `body` (assembled colors + spacing + component sizes). Result: contexts outside `<body>`, such as `::backdrop` and the `html` scrollbar, **cannot read any color token**. (Note: the semantic colors' `-lightness` aliases **must** stay on `body`, see the dark-mode bug in 3.3. When unifying scopes, move the `-root-` sources together with them, not just the aliases.)
- `_goldenratio.scss` hard-codes `992px / 640px / 639px`, unrelated to `_var.screen.scss`.
- `--logo` points to `../assets/img/` in SCSS but `/assets/images/` in the JS theme: two directories.
- Dead tokens: `--color-r0..r9` (20 declarations, 0 consumers), `--color-0..9` (20, 0 consumers), `--line-height-1`, `--comp-font-size`, `--comp-max-width`, `--color-disabled`, `--color-root-bg-l1-lightness`, `--color-root-l1-lightness`.
- `.csscomb.json` requires 4-space indent + double quotes, but the code uses tabs + single quotes: the config is dead.

---

## 4. Conclusion

**What the system already has:** a well-disciplined three-layer value chain; HSL channels that cut re-theming to a few numbers; `comp-color()` / `comp-size()` that keep the component contract uniform; and, most important, the responsive pattern **"media queries change variables, never declarations"**, proven repeatedly in `_grid.scss`, `property.scss` and `_layout.scss`.

**What is not connected yet:** the chain is broken on one axis, "size changes continuously with the viewport". Font size, spacing and root font size are all breakpoint-independent constants. Responsiveness shows up only in grid column counts and a few widths. To look good on every device, the missing piece is not more breakpoints but:

1. Upgrade `--font-size-*` and `--g*` from constants to `clamp()` expressions (or make them follow a fluid root font size);
2. Add a CSS-variable mirror of the breakpoints, and fix the 4 silent `var(--screen-*)` failures on the way;
3. Add `@container` for "same component in different containers", replacing some viewport breakpoints;
4. Unify token scope on `:root`, so contexts like `::backdrop` can use them.

The first three can land **without touching any component SCSS**, because components never read the font-size and spacing atoms directly, only `--<comp>-font-size` and `--<comp>-gap`. This is the biggest room the current architecture leaves.

---

## Appendix: File index

| File                              | Lines | Role                                                         |
| --------------------------------- | ----- | ------------------------------------------------------------ |
| `client/scss/_theme.default.scss` | 263   | Authoritative token definitions + dark overrides             |
| `client/scss/_mixins.scss`        | 500+  | `comp-color()` `comp-size()` `color()` `gap-size()` `f1..f7` |
| `client/scss/_var.screen.scss`    | 32    | Breakpoint SCSS variables                                    |
| `client/scss/_reset.scss`         | 120+  | Reset + z-index tokens + `color-scheme`                      |
| `client/scss/_grid.scss`          | 227   | Grid tokens + `.grid-{xs..xl}-{1..6}` matrix                 |
| `client/scss/_gap.scss`           | 330   | Spacing utility classes                                      |
| `client/scss/_color.scss`         | 117   | Color utility classes                                        |
| `client/scss/_typograph.scss`     | 60+   | Typography utility classes                                   |
| `client/scss/_responsive.scss`    | 30    | Show/hide utility classes                                    |

---

## Appendix 2: Fix log (2026-08-29)

13 SCSS files changed. **No component style declaration was touched**: only token definitions and references were corrected.

### 1. Dark semantic colors not applied (most severe)

Root cause is a CSS custom-property rule: `var()` substitution inside a custom property happens **on the element that declares it**, after the cascade ends. The old code put the alias on `:root`:

```scss
:root {
	--color-major-lightness: var(--color-root-major-lightness);
} /* frozen to light 23% on html */
body.theme-dark {
	--color-root-major-lightness: 50%;
} /* changes body, too late */
```

`body` inherits the `23%` already computed on html, so the dark override had **no effect on any of major/minor/safe/danger/tip**.

Fix: move the 10 `--color-<role>-lightness` / `-lightness-l1` aliases from `:root` to `body`, onto the same element as the `-root-` sources, so the aliases re-resolve after the cascade. Comments at both `:root` and `body` explain why.

Resolution check (`body.theme-dark`):

| token              | before                | after                 |
| ------------------ | --------------------- | --------------------- |
| `--color-major`    | `hsl(165, 58%, 23%)`  | `hsl(165, 58%, 50%)`  |
| `--color-minor`    | `hsl(169, 100%, 31%)` | `hsl(169, 100%, 50%)` |
| `--color-safe`     | `hsl(179, 100%, 25%)` | `hsl(179, 100%, 50%)` |
| `--color-danger`   | `hsl(10, 100%, 48%)`  | `hsl(10, 100%, 50%)`  |
| `--color-tip`      | `hsl(321, 100%, 24%)` | `hsl(321, 100%, 50%)` |
| `--color-major-l1` | `hsl(165, 58%, 99%)`  | `hsl(165, 58%, 10%)`  |

Light-mode values were compared one by one: no change.

### 2. New tokens

```scss
--font-weight-light: 300;      /* was undefined, .text-light was a no-op */
--font-weight-medium: 500;     /* was 400, same as regular */
--screen-xs-min … --screen-lg-max;   /* CSS-variable mirror of the 9 breakpoints */
```

The `.normal` branch of `comp-size()` now adds `--#{$name}-font-weight: var(--font-weight-regular)`. This fixes 7 components at once (btn / input / checkbox / radio / selectbox / tab / group-btn) that read an undefined font-weight.

### 3. Reference fixes

| Old reference                                                                      | Changed to                          | Count |
| ---------------------------------------------------------------------------------- | ----------------------------------- | ----- |
| `var(--color-f)`                                                                   | `var(--color-root-bg)`              | 4     |
| `var(--color-link-default)`                                                        | `var(--color-link)`                 | 3     |
| `var(--head--color-active-border)`                                                 | `var(--header-color-active-border)` | 1     |
| `content: var(--icon-*)`                                                           | `content: $icon-*`                  | 7     |
| `var(--line-height-normal)`                                                        | `var(--line-height-2)`              | 2     |
| `var(--g1-5, var(--g2))` / `var(--g0-5, var(--g1))`                                | `var(--g2)` / `var(--g1)`           | 2     |
| `var(--color-text-2, var(--color-fg-2))`                                           | `var(--color-l1)`                   | 1     |
| `var(--color-border, var(--color-bg-l2))`                                          | `var(--color-border)`               | 1     |
| `var(--radius, 0.25rem)`                                                           | `var(--radius-0)`                   | 1     |
| `var(--g1, 0.25rem)` / `var(--g2, 0.5rem)` (fallbacks do not match the real token) | `var(--g1)` / `var(--g2)`           | 4     |
| `var(--input-size, 2.5rem)`                                                        | `var(--input-size)`                 | 1     |

The 7 icon references were the widest hidden bug: `$icon-*` is a SCSS compile-time variable, so writing `var(--icon-*)` made `content` invalid. Pagination arrows, dropdown arrows, tooltip info/warning/error icons and loading spinner icons **all failed to show**. Write `content: $icon-x` (keeps the quotes, outputs `"\f104"`), not `content: #{$icon-x}` (interpolation strips the quotes and outputs an invalid identifier).

### 4. Fonts

Removed the weight-700 `@font-face` that pointed at `Roboto-Regular.woff2`. Declaring a "real" bold makes the browser skip synthesis and use the regular glyphs, so bold looked identical to regular. With 700 left undeclared, the engine synthesizes a faux bold from 400. The repo has no `Roboto-Bold.woff2` (only Regular and Thin). A comment in the file explains how to restore it when the font file is added.

### 5. Consistency

The body-level default of `--section-gap-y` changed `--g4` → `--g5`, matching the `.normal` branch of `gap-size()` (`.section` `.panel` `.grid` `.flex` all include it, and `.normal` is the effective value).

### Verification

- All 5 SCSS entries (`index` `base` `property` `property.article` `animation`) compile.
- Full token audit: **custom properties consumed but undefined dropped from 27 to 0**.
- Custom-property resolution simulation: no `INVALID` result on `body` in light or dark.
