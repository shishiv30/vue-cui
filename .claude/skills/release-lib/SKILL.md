---
name: release-lib
description: Release the @shishiv30/vue-cui npm library — check exports and types, build dist-lib, bump the version, and publish through the GitHub release workflow. Use when the user asks to release, publish, or cut a version of the component library.
---

# Release the library

How publishing works: on a GitHub **release** (or a manual run), `.github/workflows/publish-npm.yml` runs `npm ci` and then `npm publish --provenance`. `prepack` runs `npm run build:lib`. Do not run `npm publish` locally unless the user asks for it explicitly.

## Steps

1. **Check the public API.**
   - `client/src/lib/index.ts` exports every component and directive meant to be public, and `install()` registers them.
   - Each exported `.vue` file, directive and `*Model.ts` (plus any helper their types import) is listed in `dts.include` in `vite.lib.config.ts`. Type-only imports are not in the Vite module graph, so an unlisted model ships no `.d.ts`.
   - TypeScript consumers need `@types/google.maps` (optional peer dependency) for the Map types.
2. **Build:** `npm run build:lib`. Then check `dist-lib/index.js`, `dist-lib/style.css`, and that every relative import in `dist-lib/**/*.d.ts` has a matching `.d.ts` file.
3. **Smoke test the package:** `npm pack --dry-run`. The package must contain only `dist-lib/`.
4. **Bump the version** with `npm version patch|minor|major --no-git-tag-version`. Use semver:
   - A removed or renamed export, model field, prop, event or CSS class is **major**.
   - A new component or a new optional field is **minor**.
   - A fix is **patch**.
5. **Summarize the changes** since the last tag (`git log <last-tag>..HEAD -- client/src client/scss`). Call out breaking changes.
6. **Ask the user before publishing.** They commit, push, and create the GitHub release (`gh release create vX.Y.Z`), which triggers the workflow. Never push or create the release without their go-ahead.
