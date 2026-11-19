---
name: create-api
description: Build new APIs from a Swagger/OpenAPI document. Use when the user wants to create API routes from an external API spec, proxy SOA/Geoarea endpoints, or add documented API handlers from a swagger document.
---

# Create API from Swagger Document

Build new API routes from a provided Swagger/OpenAPI document. Covers config, docs, fetch layer, mappers, and router registration.

Start from `docs/api/<name>.md`, written by `api-specialist` with the `api-investigation` skill. It already has the spec, the verified contract, the mapping table and example code. If it doesn't exist yet, run that investigation first.

## Workflow

### 1. Add config

In `server/config.ts` add:

- Base URL (e.g. `geoareaApiDomain` from `GEOAREA_API_DOMAIN`)
- API key (e.g. `soaAPIKey` from `SOA_API_KEY`)

Add env vars to `.env.local` and comment them under the API section.

### 2. Create fetch layer

In `server/controllers/<name>.ts` (e.g. `realestate.ts`):

- `getHeaders()` – build auth headers (e.g. `X-MData-Key`)
- `fetchFromApi(method, path, options)` – generic fetch with:
  - `options.query` → query string
  - `options.body` → JSON for POST/PUT
- Optional specific fetchers (e.g. `fetchStatesFromApi`) when logic differs

Use `config.<baseUrl>` and `config.<apiKey>` for the upstream API.

### 3. Create mapper (helpers)

**Property / listing fields (SOA Pure):** normalize in `helpers/property.ts` via `mapSOADataToMetadata` first. Presentation and comp shapes (`album`, `tags`, `timeline`, etc.) belong in `helpers/article.ts` (`mapPropertyToArticle`, `mapPropertyDetailToArticle`, `mapXToComp`). Do not map listing display fields only in routers or EJS.

In `helpers/geo.ts` (SOA response mappers) or a dedicated helper when not geo-related:

- **Item mappers**: `mapSoaXxxToGeo(item)` – one raw item → UI model
- **Response mappers**: `mapSoaXxxResponse(raw)` – raw response → UI array/object
- **ensureArray(raw)** – handle `array`, `{ data: array }`, `{ list: array }`

Response mappers encapsulate `ensureArray` + item mappers. Keep all mapping logic in the mapper; the router only calls the response mappers.

### 4. Add router

Create `server/routes/api.<name>.ts` (e.g. `api.soa.ts`):

- Import `fetchFromApi` (and specific fetchers) from config
- Import response mappers from the mapper helper
- Define exported handlers: `fetch → mapXxxResponse(raw) → res.json(result)`
- Register routes before any catch-all
- Optional catch-all proxy for other paths (GET/POST/DELETE)
- Add `router.use(express.json())` only if POST body parsing is needed

Do **not** put `ensureArray`, `map*ToGeo`, or other mapping logic in the router. The router focuses on registering APIs and delegating to fetch + mapper.

### 5. Mount router

In `server/routes/index.ts`:

```js
import apiSoaRouter from './api.soa.js'; // .js suffix: ESM import of the .ts file
router.use('/api/soa', apiSoaRouter);
```

Add the new routes file to `server/swaggerConfig.ts` `apis` array if you use JSDoc Swagger.

### 6. Add Swagger JSDoc

Above each route, add `@swagger` blocks:

- **Parameters**: `in: path`, `required`, `description`, `schema` with `type`, `example`, `pattern` where relevant
- **Responses**: `content.application/json.schema` with `type`, `items`, `properties`, `required`, `description`
- **400/500**: Error responses

Use the UI model shape in response schemas, not the raw upstream shape.

### 7. SOA proxy routes (semantic names + input remap)

When adding explicit SOA proxy endpoints (e.g. Property, School):

- **Semantic route names**: Use handler names as paths (e.g. `/getPropertyByPath`) instead of raw SOA paths (e.g. `/mlsPublicRecordAssociations/url`).
- **Input remapping**: Map client params to SOA format in the handler (e.g. `path` → `url`, `propertyId` from query or path).
- **Full Swagger input/output** for each endpoint:
  - **Input**: All parameters (query, path) with `schema`, `description`, `required`; for POST, add `requestBody` with `application/json` schema.
  - **Output**: `responses.200.content.application/json.schema` with `type: object`, `additionalProperties: true` for passthrough SOA responses.
  - **Errors**: `400`, `404`, `503` with `schema: { type: object, properties: { error: { type: string } } }`.
- **Path variants**: When an ID can be passed via query or path (e.g. `?propertyId=123` vs `/getXById/123`), add separate `@swagger` path entries for each variant so both appear in Swagger UI.
- **Shared proxy helper**: Use a helper like `proxyToPropertyPath(req, res, method, path, overrides)` to avoid duplication; `overrides` can include `query` or `body` for remapped inputs.

Reference: `server/routes/api.soa.property.ts`.

## Example handler

```js
export async function getCountiesByStateCode(req, res) {
  try {
    const { stateCode } = req.params;
    const data = await fetchFromGeoarea('GET', `/state/${stateCode}/counties`, {
      query: req.query,
    });
    sendJson(res, mapSoaCountiesResponse(data));
  } catch (error) {
    handleSoaError(res, error);
  }
}
```

## Done checklist

- Built from `docs/api/<name>.md`, which is updated if reality differed
- Config/env keys were added or verified
- Route handlers delegate to fetch + mapper layers
- Swagger docs represent UI-facing response shape
- Router is mounted and reachable from `server/routes/index.ts`
