# REQ-20261124-map-auto-merge: Map merges close pins into group pins with a list sheet

| Field        | Value                                         |
| ------------ | --------------------------------------------- |
| Status       | in-progress                                   |
| Owner (dev)  | component-developer                           |
| Requested by | the user                                      |
| Branch / PR  | `master`                                      |
| Release      | not released yet (no tag)                     |
| Related docs | `docs/client.md` (Map), `docs/change-list.md` |

## Why

Zoomed out, pins pile up and are hard to tap. Close pins should merge into one group pin, and a tap on it should list its pins.

## Scope

- In: auto merge on zoom (any pin type); merge and split animation; a group pin with `icon-th-list` and a count badge; a bottom sheet with `List` (`tiny`) of the group's pins; round single icon pins.
- Out: a zoom-to-expand click on group pins; panning the map so the group sits above the sheet.

## Requirements

- [ ] R1 `autoMerge` (default `true`), `mergeRadius` (px, default 48; `0` turns merging off), `mergeMaxZoom` (default 16) on `MapUiModel`.
- [ ] R2 Pins closer than `mergeRadius` px on screen merge. Groups are rebuilt when the whole zoom level or the markers change; panning only moves them. No merging above `mergeMaxZoom`.
- [ ] R3 A group sits at the count-weighted centroid of its members (Web Mercator). Groups nest: each level is built from the level below.
- [ ] R4 Zoom out: member pins fly into their group, and the group pops in. Zoom in: pins fly out of the old group's position. Reduced motion: no motion.
- [ ] R5 Group pin: a 44px circle with `icon-th-list` and a count badge (`99+` cap). It is `.on` when it holds `selectedId` and `.active` while its list is open.
- [ ] R6 Tapping a group pin (the only way to open) opens `.map-sheet`: full width, max 460px, 50% of the map height, slides up from the bottom, `List` `tiny`, scrolls on its own. Emits `group-click` with the members.
- [ ] R7 The open list follows the group: on zoom out it shows the bigger group. It closes when zoom in splits the group, when panning moves the group off the map, when all members are removed, or on close, Escape, an empty-map click or a single-pin tap.
- [ ] R8 A list row emits `marker-click` and `select`.
- [ ] R9 Single icon pins are 24px circles: no side padding, and the icon sized to the height.

## Acceptance criteria

- [ ] AC1 `test/mapMerge.test.js` passes: radius, max zoom, nesting, centroid, stable ids.
- [ ] AC2 `npm run build:vite`, `npm run build:lib`, `npm run lint` and `npm run test:storybook` pass.

For human verification (look and feel, interaction):

- [ ] Merge and split animations feel smooth in the `AutoMerge` story.
- [ ] The list stays open on zoom out and closes on zoom in or a pan off screen.
- [ ] The sheet looks right on mobile and desktop, in light and dark.

## Design and decisions

- Extend `Map`; reuse `List`. Merge logic is a pure module (`mapMerge.ts`) with no new dependency.
- The density setting is a pixel radius: it maps straight to "too close to tap" (a 44px touch target plus a gap).

## Changelog

- 2026-11-24: created (docs-maintainer)
