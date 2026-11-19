---
name: add-ga-event
description: Add Google Analytics (GA4) event tracking at the component-library level in vue-cui — components emit tracking intents on the existing event bus and a single GA adapter sends them. Use when a component needs analytics, when wiring GA into an app, or when defining event names/params.
---

# GA events (component-library level)

**Status:** there is no GA code in the repo yet. The first time you use this skill, build the adapter (step 1) and add a `done` row to `docs/change-list.md`.

## Principle

Components never call `gtag` or `dataLayer`. They describe *what happened* on the one bus (`client/js/core/event.js`). A single adapter, shipped by the library, turns those bus events into GA4 events. Apps opt in once. This keeps components SSR-safe, testable in Storybook, and free of any analytics vendor.

## 1. The adapter (one time)

- Create `client/src/lib/analytics.ts`, exported from `client/src/lib/index.ts`. It provides:
  - `installGa({ measurementId, debug?, consent? })`: loads gtag on the client only (guard with `typeof window`), then subscribes with `on('track', …)` / namespaced `track.*` events.
  - `track(name, params)`: a helper that emits `track.<component>` on the bus.
- Map each bus payload `{ event, params }` to `gtag('event', event, params)`.
- Respect consent: queue events until consent is granted if `consent` is set.
- The app calls `installGa` once, in `client/src/main.ts`, with the measurement ID from env (`server/config.ts` → page model). The ID is never hardcoded.

## 2. Make a component trackable

- **Model.** Add an optional `track?: { event: string; params?: Record<string, string | number> }` field to `<name>Model.ts`. Add per-action fields only if the component has several actions, e.g. `trackClick`, `trackChange`.
- **Component.** When the action happens, after the `changed` event, `emit('track.<name>', { event, params: { ...model.track.params, component: '<name>', value } })`. No tracking fires when the model has no `track` field.
- **Story.** Add `track` as a Controls arg. Storybook actions show the bus event, and GA is never loaded in Storybook.

## Naming

- **Event names:** snake_case `<object>_<action>`, such as `filter_change`, `slider_next`, `listing_click`. Keep within GA4 limits: 40 characters or fewer, no reserved names.
- **Standard params:** `component`, `value`, `page_type`, `geo_path`. Never send PII (emails, phone numbers, full addresses).

## Check

- Add a unit test that the adapter maps a bus event to the right `gtag` call (stub `window.gtag`).
- Run the `verify` skill.
