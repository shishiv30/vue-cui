# Lessons

Newest first. One or two lines each, with a link to the source.

- 2026-11-19: `vite.lib.config.ts` `dts.include` is a hand-kept list. A component exported from `client/src/lib/index.ts` but missing from that list (as `Map.vue` is) ships with no types. Check both whenever you export a component.
- 2026-11-19: Some `prefers-reduced-motion` fallbacks in `client/scss/_article.scss` are commented out. Don't copy that pattern.
