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
| open | .cursor/skills/property-listing-pipeline/ | Listing-pipeline skill removed. | Restore it when the Vue property reads SOA listing data again. |
| open | sw.js | Service worker file is copied, but Workbox packages are not installed. | Dependency list keeps only packages the app imports. |
| open | scripts/run-lighthouse.js | `npm run test:lighthouse` removed. | Lighthouse was a webpack-and-Docker perf check, not part of `test/`. |
| done | server/app.js | Removed. Startup is `server/index.ts`. | Swagger and SOA logs moved to `index.ts`. S3 HTML upload was dropped. |
| done | server/utils/localData.ts | Removed with `/page/:key`. | Only that route loaded `data/page/` and `data/comps/` by key. |
| done | server/ejs/ | All `comp_*.ejs` templates, the `sitemap*.ejs` and `page.ejs` pages, and the client EJS loader are removed. `/sitemap/*` 301s to `/property/sitemap/*`. | Vue already covered them. Left: the HTML shell and `toPage` (REQ-migration-end-cleanup). |
| open | docs/ | Several moved guides still describe EJS `/property/tx` or AWS. | They are marked historical instead of being rewritten in this slice. |
