> Historical. This guide describes the previous EJS property or AWS deploy flow. Current behavior is in README.md and change-list.md.

# Routes Reference

## Top-Level Router

Mounted from `server/routes/index.ts`:

- Page/default routes: `default.ts`, `propertySitemap.ts`, `property.ts`, `sitemap.ts`, `page.ts`
- API routes: `/api` -> `api.ts`
- SOA proxy routes: `/api/soa` -> `api.soa.ts`

## API Ownership

### `/api/*`

Owned by `server/routes/api.ts`:

- app-specific endpoints (geo/properties/media-oriented handlers)
- mappings and response shaping for client consumption

### `/api/soa/*`

Owned by `server/routes/api.soa.ts` and mounted children:

- `/api/soa/property/*` -> `api.soa.property.ts`
- `/api/soa/school/*` -> `api.soa.school.js`
- `/api/soa/poi/*` -> `api.soa.poi.js`
- `/api/soa/*` fallback and geoarea routes -> `api.soa.geoarea.js`

## Route Ordering Notes

- Specific prefixes are mounted before fallback handlers to prevent broad matches from shadowing specific endpoints.
- SOA routes are intended as adapters/proxies to upstream services with selective normalization.

## Property routes (HTML + JSON parity)

Sitemap HTML routes are defined in [`server/routes/propertySitemap.ts`](../server/routes/propertySitemap.ts).

**SPA URL patterns** (detail, map, geo grid) are the single source of truth in [`helpers/routes/propertySpaRoutes.js`](../helpers/routes/propertySpaRoutes.js), used by:

- [`server/routes/property.ts`](../server/routes/property.ts) — `detail` and `geo` handlers (map URLs use `geo` on the server)
- [`client/pages/property/index.js`](../client/pages/property/index.js) — client `Router` rules (`detail`, `map`, `geo`)
- Client `Router` `push` / `replace` / `goto` contract: [`docs/client-js-lifecycle.md`](client-js-lifecycle.md#4-client-router-contract)

When changing property SPA URL shapes, update `propertySpaRoutes.js` and its tests first.

Handler: `BaseController(req, res, 'property')` → [`server/controllers/property.ts`](../server/controllers/property.ts).

| Route pattern | Purpose | Query / params |
|---------------|---------|----------------|
| `/property/sitemap` | State sitemap | — |
| `/property/sitemap/:state` | City/county sitemap | `state` |
| `/property/detail/:state/:zip/:prId` | Property detail (SSR) | Sets `req.query.geoPath`, `req.query.prId` |
| `/property/:state/:city/:id_school` | Homes inside that school boundary | School id is the `baseInfo` id (NCES id works). Search is `POST /listings/schools/v2` |
| `/property/:state/:geoSlug/@lat,lng` | Map view (client SPA) | Server uses geo catch-all |
| `/property/search` | IP-based listing search | `req.ip` / `?ip=`; no geo path |
| `/property/:geoPath(*)` | Geo grid (catch-all) | Canonical redirect when path normalizes |

JSON (same `property.get()` model, `toData`):

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/api/property/detail/:prId` | SPA detail fetch; optional `geoPath` query |
| `GET` | `/api/property/search` | IP geo search (`req.ip` or `?ip=`) |
| `GET` | `/api/property/search/:path` | Geo path search (`tx/austin`); `search` falls back to IP |

SOA transport for property: direct imports from `server/routes/api.soa.property.ts` inside the controller (not an internal hop to `/api/soa`). HTTP proxy for external clients: `/api/soa/property/*`.

Pipeline: [`listing-data-pipeline.md`](listing-data-pipeline.md).

## Documentation Contract

When adding or changing a route:

1. Update route module.
2. Update this file.
3. If externally consumed, update `docs/soa-api.md` as well.
