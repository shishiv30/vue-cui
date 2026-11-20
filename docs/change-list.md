# Change list

Work that is still unfinished after the TypeScript, Vite, and Vue SSR slice. Done items stay in this file.

| Status | Path | Unfinished | Why |
| --- | --- | --- | --- |
| open | client/js/plugins/ | Plugins other than header are still JavaScript `data-role` widgets. | Header is the first Vue component in Storybook (`client/src/components/Header.vue`). Convert the next plugin, add a `*.stories.ts`, and mark it `vue` in `pluginCatalog.ts`. |
| done | server/ | Controllers, routes, middleware, and utils are TypeScript. EJS templates stay `.ejs`. | Process entry is `server/index.ts`. |
| done | server/index.ts | Listing detail HTML is Vue SSR only. The EJS property routes and `property*.ejs` templates are removed. | `Property.vue` / `PropertySitemap.vue` |
| done | client/src/pages/Document.vue | Document catalog is Vue SSR (`/document`). Modal, dialog, sharelink, list-dict, and scrollto stay hardcoded HTML. | No Storybook Vue for those plugins yet. |
| done | client/src/pages/Property.vue | Geo search and detail. | Sitemap lives in `PropertySitemap.vue`. |
| done | client/src/pages/PropertySitemap.vue | `/property/sitemap` Vue SSR. | Split from `Property.vue`. |
| open | .claude/skills/property-listing-pipeline/ | Listing-pipeline skill removed. | Restore it when the Vue property reads SOA listing data again. |
| open | sw.js | Service worker file is copied, but Workbox packages are not installed. | Dependency list keeps only packages the app imports. |
| open | scripts/run-lighthouse.js | `npm run test:lighthouse` removed. | Lighthouse was a webpack-and-Docker perf check, not part of `test/`. |
| done | server/app.js | Removed. Startup is `server/index.ts`. | Swagger and SOA logs moved to `index.ts`. S3 HTML upload was dropped. |
| done | server/utils/localData.ts | Removed with `/page/:key`. | Only that route loaded `data/page/` and `data/comps/` by key. |
| done | server/ejs/ | All `comp_*.ejs` templates, the `sitemap*.ejs` and `page.ejs` pages, and the client EJS loader are removed. `/sitemap/*` 301s to `/property/sitemap/*`. | Vue already covered them. The HTML shell and `toPage` followed in `chore/remove-ejs`. |
| done | server/ejs/ | Folder removed. No `.ejs` file, no `ejs` dependency, no view engine. `toPage`, `staticHtml.ts`, the configs' `seo` hooks and the unused `data/comps/theme.js` inline theme are gone. The header, footer, filter and links model builders moved to `server/page/`. | Every HTML page is Vue SSR with client-side routes. The plugin runtime is still open (REQ-migration-end-cleanup). |
| open | docs/ | Several moved guides still describe EJS `/property/tx` or AWS. | They are marked historical instead of being rewritten in this slice. |
| done | .claude/ | AI agent setup: CLAUDE.md, `.claude/` (team charter, rules, agents, skills, hooks) and the `notes/` memory. `.cursor/` now points to `.claude/`. | One maintained copy of the rules for every agent. |
| done | notes/requirements/ | A trackable requirement per change: `_template.md`, an index, and the `doc-requirement` skill. | `docs-maintainer` writes it before a change and closes it after release. |
| open | docs/ | Docs redo: the new index, the 8 topic docs (component design, request lifecycle, data mapping, CSS design system, performance/PWA, SEO/sitemap, GA analytics, Split flags), and `docs/archive/`. | Phase 2 of the `.claude` setup. The `docs-maintainer` agent runs it. |
| open | client/src/lib/analytics.ts | GA4 adapter: bus `track.*` events → gtag. | Design in the `add-ga-event` skill. No GA code exists yet. |
| open | server/utils/split.ts | Split SDK integration, evaluated server-side and passed through the page model and Pinia. | Design in the `add-feature-flag` skill. No Split code exists yet. |
| open | vite.lib.config.ts | `Map.vue` and the `collapse`, `lazyload`, `tab` and `tooltip` directives are exported from `client/src/lib/index.ts` but missing from `dts.include`, so they ship with no `.d.ts` (`lib/index.d.ts` imports files that are not in the package). `autocomplete` is listed. | Map found during the `.claude` setup; the directives found while reviewing 533865d. |
| done | client/src/directives/autocomplete.ts | `v-autocomplete` directive; the Header search uses it instead of the legacy `data-role="autocomplete"` plugin, which the Vue app never loaded. `HeaderSearch` lost `method` and `keys`. The legacy `_autocomplete.js` and `.suggestion-*` styles stay until REQ-migration-end-cleanup. | [REQ-20261120-autocomplete-directive](../notes/requirements/REQ-20261120-autocomplete-directive.md), commit 533865d. |
| open | EJS → Vue migration end | Temporary work: once every plugin in `pluginCatalog.ts` is `vue` and no page renders EJS, run [REQ-migration-end-cleanup](../notes/requirements/REQ-migration-end-cleanup.md). | The EJS and plugin runtime, and the tools that convert them, exist only for the migration. |
| open | client/scss/_article.scss | The `prefers-reduced-motion` fallbacks are commented out. Motion rules require a reduced-motion fallback for every animation. | Found while writing `.claude/rules/design-principles.md`. |
