# Lessons

Newest first. One or two lines each, with a link to the source.

- 2026-11-20: The Vue app does not load the legacy `client/js` runtime. A Vue component that still relies on a `data-role` plugin silently does nothing (the Header search had no suggestions). Replace the hook with a directive or component. Source: [REQ-20261120-autocomplete-directive](requirements/REQ-20261120-autocomplete-directive.md).
- 2026-11-20: `html` is the scrolling element in this app, so `overflow: hidden` on `body` does not lock page scroll. Lock on `html` (as `html.autocomplete-open` in `client/scss/_autocomplete.scss` does).
- 2026-11-20: `dts.include` applies to directives too. Only `client/src/directives/autocomplete.ts` is listed; `collapse`, `lazyload`, `tab` and `tooltip` are exported but ship no `.d.ts` (open row in `docs/change-list.md`). List the directive whenever you export it or its types.
- 2026-11-19: `vite.lib.config.ts` `dts.include` is a hand-kept list. A component exported from `client/src/lib/index.ts` but missing from that list (as `Map.vue` is) ships with no types. Check both whenever you export a component.
- 2026-11-19: Some `prefers-reduced-motion` fallbacks in `client/scss/_article.scss` are commented out. Don't copy that pattern.
