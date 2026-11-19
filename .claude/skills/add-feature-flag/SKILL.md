---
name: add-feature-flag
description: Add or use a Split (split.io) feature flag at the application layer in vue-cui — evaluate treatments server-side in controllers, pass them through the page model and Pinia so SSR and hydration agree, and keep components flag-agnostic. Use when gating a feature, running an experiment, or connecting the app to Split.
---

# Split feature flags (application layer)

**Status:** there is no Split code in the repo yet. The first time you use this skill, do step 1 and add a `done` row to `docs/change-list.md`.

## Principle

Flags are an application decision. The server evaluates them once per request, and the result flows down as plain data. Components never import the Split SDK. They receive a model field, such as `variant: 'a' | 'b'` or `showMap: boolean`.

## 1. Connect to Split (one time)

- Install the Node SDK: `npm i @splitsoftware/splitio`. Ask the user before adding the dependency.
- **Config:** add `splitApiKey` from `SPLIT_API_KEY` to `server/config.ts`, plus an example in `.env.local`. Never commit keys.
- **Client:** create `server/utils/split.ts`, which initializes one SDK factory at startup (`server/index.ts`). It waits for `SDK_READY` with a timeout, and has `getTreatments(key, flags, attributes)` with a fallback to `control`.
  - **Local mode:** when no key is set, use `localhost` mode with a YAML or object file in `data/split/` so dev works offline.
- **Traffic key:** a stable anonymous ID from the session (`server/middleware/session.ts`). Attributes are things like `page_type`, `geo_state` and `device`.
- **Shutdown:** call `client.destroy()` on process exit.

## 2. Gate a feature

1. **Name the flag** in snake_case with a team prefix, e.g. `app_property_map_view`. List it in one constant file, `server/utils/splitFlags.ts`.
2. **Evaluate it in the controller config** (`get()`, or `beforeGet()` when it changes routing or redirects): `const t = await getTreatments(key, [FLAG], attrs)`.
3. **Map the treatment to a plain model field** in the page model, e.g. `model.flags = { mapView: t[FLAG] === 'on' }`. `control` or an error means the default (off) experience.
4. **Pass it to the client.** Serialize it with the page model, then hydrate it into Pinia (`client/src/store.ts`). SSR and the client must render the same variant, with no flicker.
5. **Components** receive the derived field through `model`. Never pass a raw treatment string to a component.
6. **Impressions:** Split records impressions on the server. If an experiment needs GA, emit a `track.experiment` bus event with `{ flag, treatment }` (see the `add-ga-event` skill).

## Clean up

When a flag reaches 100%, remove it from Split, from `splitFlags.ts`, from the controller and from the model field, in one change.

## Check

- Test the controller with the treatment stubbed `on`, `off` and `control`.
- Run the `verify` skill.
