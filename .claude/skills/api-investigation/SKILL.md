---
name: api-investigation
description: Investigate an upstream or downstream API for vue-cui and write a verified API document with example code in docs/api/. Use when connecting a new API, when an upstream contract changes, when an integration misbehaves, or when someone needs to know how to call one of our /api endpoints.
---

# API investigation

The output is one file, `docs/api/<name>.md`, that an `application-developer` can implement from without re-investigating. Link it from `docs/README.md`.

## 1. Collect

- **Spec:** fetch the OpenAPI document (`/v3/api-docs`, `/swagger.json`, `/api-docs`) and list its paths, methods and schemas. The `create-api` skill has a one-liner for this.
- **Our side:**
  - `server/config.ts` (base URL and key env vars)
  - existing fetchers (`server/controllers/realestate.ts`)
  - routes (`server/routes/api*.ts`)
  - mappers (`helpers/`)
  - Swagger JSDoc
- **Downstream:** grep for the callers of our routes, `rg "/api/soa|/api/" client server helpers`.

## 2. Verify live

- Run real calls with `curl -s -m 15`, passing keys from env vars. Never echo the keys.
- **Cover these cases:** a happy path, empty results, a bad input (400), not found (404), and a slow or large response.
- Record the status, headers that matter, latency and a **trimmed** sample body. Mask anything personal (names, emails, phone numbers, exact addresses).
- If the API is unreachable, mark each fact as `spec-only` and ask the user for a sample.

## 3. Write the doc

`docs/api/<name>.md` has these sections:

1. **Summary.** What the API is for, who owns it, and its base URL per environment (as env var names).
2. **Auth and config.** Headers, env vars, and the `config.*` keys.
3. **Endpoints.** A table of method, path, purpose, and whether it is used by us (yes / planned / no).
4. **Contract.** The request params and response schema for each endpoint we use, marked `verified` or `spec-only`.
5. **Behavior notes.** Errors, pagination, limits, timeouts, nullable fields, and quirks.
6. **Mapping table.** Upstream field → our model field → transform → the helper (existing or new).
7. **Example code.** All of it must run or type-check against this repo's patterns:
   - `curl` for one core call.
   - A TypeScript fetch through the existing fetch layer (`fetchFromApi` style, using `config.*`).
   - A mapper sketch in `helpers/`, using `ensureArray` and the item and response mappers.
   - Our route handler that does fetch → map → `res.json`, plus its Swagger JSDoc block.
   - The downstream client call that uses our route.
8. **Downstream impact.** The callers that depend on each field, and what breaks if a field changes.
9. **Open questions and risks.**

## 4. Hand off

Report:
- the doc path
- which facts are verified and which are spec-only
- the risks
- the ordered steps for `application-developer`, normally the `create-api` skill steps

Update the matching requirement in `notes/requirements/` if there is one.
