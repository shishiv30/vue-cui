---
paths:
  - "server/**"
  - "helpers/**"
  - "data/**"
---

# Server, mapping and data rules

## data/ vs helpers/

`data/` is the only home for hardcoded seed data: defaults, mocks, fixtures, sample payloads, CSV sources. `helpers/` holds mapping and transform logic only. Do not put payload objects in `helpers/`, in `server/controllers/`, or inline in routes.

| Need | Put it in |
| --- | --- |
| Page section array (hero, points, gallery, …) | `data/page/<page-key>.js`, default export, ordered. See `data/page/README.md`. |
| Reusable comp seed (header, footer, theme) | `data/comps/<name>.js`. Themes are `data/comps/theme-<name>.js` with default and dark CSS vars. |
| Mock API or list payload | `data/mock/<name>.js`, shaped like the real mapped model. |
| Geo source data | `data/csv/*.csv`. `data/index.js` turns it into `dist/*.json` and caches it (`getGeoData()`). |

Pages and comps are read through `server/utils/localData.ts`.

## Preload (`meta.preload` / route `preload` hook)

- Each entry must use **`href` as an absolute URL with host** (e.g. `https://cdn.example.com/images/foo.webp`).
- **Do not** pass path-only values (`/images/foo.webp`) or rely on EJS/`html_above.ejs` to add the domain.
- Build the full URL once in config `get()` (e.g. `getImgCdnUrl(cdnHost, path)`), reuse the same string for preload and template `src`.

## Listing data pipeline

- Architecture: `docs/listing-data-pipeline.md` (historical, but the trace still applies).
- Controllers: after `mapPropertyDetailToArticle` (or list mappers), use **`detail.metadata`**, **`detail.*` comp fields**, and **`buildDetailSeo(detail)`** only — not raw SOA listing for SEO or EJS.

## SOA Pure listing data

- Treat **SOA Pure** fields as the source of truth after `mapSOADataToMetadata` (list cards: `mapPropertyToArticle`; detail page: `mapPropertyDetailToArticle`).
- **Do not** add `??` / `||` fallbacks to alternate field names, legacy shapes, or synthetic defaults unless the user explicitly asks.
- If a required SOA field is missing, return empty / omit the UI piece — do not substitute `propertyId`, `fullAddress`, or guessed aliases.

## Anti-patterns

- Preload entries with `path` and no host (templates read `href` only).
- Fallback chains on SOA-mapped metadata (e.g. `fullAddress || propertyId` for display text).
