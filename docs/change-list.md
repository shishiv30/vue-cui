# Change list

Work that is still unfinished after the TypeScript, Vite, and Vue SSR slice. Done items stay in this file.

| Status | Path | Unfinished | Why |
| --- | --- | --- | --- |
| open | client/js/plugins/ | Plugins other than header are still JavaScript `data-role` widgets. | Header is the first Vue component in Storybook (`client/src/components/Header.vue`). Convert the next plugin, add a `*.stories.ts`, and mark it `vue` in `pluginCatalog.ts`. |
| open | server/controllers/, server/ejs/, server/routes/ | Controllers, EJS templates, and SOA routes are still JavaScript. | Only the process entry moved to TypeScript. |
| open | server/routes/property.js | Listing detail (`/property/detail/...`) is still EJS. | Sitemap and geo search render in `Property.vue`. |
| done | client/src/pages/Document.vue | Document catalog is Vue SSR (`/document`). Modal, dialog, sharelink, list-dict, and scrollto stay hardcoded HTML. | No Storybook Vue for those plugins yet. |
| open | .cursor/skills/property-listing-pipeline/ | Listing-pipeline skill removed. | Restore it when the Vue property reads SOA listing data again. |
| open | sw.js | Service worker file is copied, but Workbox packages are not installed. | Dependency list keeps only packages the app imports. |
| open | scripts/run-lighthouse.js | `npm run test:lighthouse` removed. | Lighthouse was a webpack-and-Docker perf check, not part of `test/`. |
| open | server/app.js | Old Express entry is unused. Startup is `server/index.ts`. | Left in place so existing JS imports of startup-only side effects are not required. |
| done | server/utils/localData.js | Page and comp loads read `data/` only. | Host config and the old data loader are removed. |
| open | docs/ | Several moved guides still describe EJS `/property/tx` or AWS. | They are marked historical instead of being rewritten in this slice. |
