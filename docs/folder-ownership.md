# Folder ownership

What each top-level area may contain. Normative coding rules: [`.claude/rules/project-standards.md`](../.claude/rules/project-standards.md). Map catalog: [index.md](index.md).

| Folder | Owns | Must not contain |
|--------|------|------------------|
| `client/js/core/` | Runtime primitives (event, plugin, page, router, request, def, DOM hooks) | Page-specific business (property detail fetch rules) |
| `client/js/plugins/` | One widget per `_name.js` (`data-role`) | Shared mapping of SOA data |
| `client/src/` | Vue 3 app for `/property` (router, Vuex, SSR entry) | Plugin widgets |
| `client/pages/<page>/` | Document and layout HTML plus their page boot | Generic helpers |
| `helpers/` | Pure transforms / shared contracts (geo, property, article, path, url, routes) | Express handlers, seed payloads |
| `helpers/routes/` | Shared route manifests (e.g. `propertySpaRoutes.js`) | HTTP handlers |
| `data/` | Seed/mock/default payloads only | Mapping logic |
| `server/routes/` | HTTP registration + thin adapters | Listing field mapping (`helpers/`), seed data (`data/`) |
| `server/controllers/` | `beforeGet` / `get` / `preload` page configs | Raw SOA field parsing (use helpers) |
| `server/page/` | Page models for Vue SSR (header, footer, filter, links, sitemap) | SOA parsing |
| `docs/` | Narrative maps | Executable logic |

When unsure: transforms → `helpers/`; seed shapes → `data/`; HTTP → `server/routes/`; page data assembly → `server/controllers/`; interactive DOM → `client/js/plugins/` or `client/pages/<page>/`.
