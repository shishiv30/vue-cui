---
name: docs-sync
description: Audit and update vue-cui documentation so it matches the code — verify commands/paths/ports, fix broken links, archive outdated docs, keep docs/README.md and change-list.md current. Use after structural changes (renames, new routes, new scripts) and whenever writing or rewriting docs.
---

# Docs sync

## 1. Inventory

List `docs/*.md`. For each file, record its topic and status: current, historical, or legacy. Check it against the index in `docs/README.md`.

## 2. Verify claims against the code

For each doc, check every:

- **npm script**: it exists in `package.json` `scripts`.
- **file or directory path**: it exists (Glob).
- **function, class or export name**: Grep finds it where the doc says it is.
- **port or env var**: `server/config.ts`, `vite.config.ts`, `.env*` examples.
- **library or tool name**: the state store is **Pinia** (not Vuex) and the build tool is **Vite** (not webpack).

Fix wrong claims. When you can't tell what is true, flag it in your report instead of guessing.

## 3. Archive

A doc that describes the old webpack/EJS-property/AWS App Runner flow moves to `docs/archive/` with `git mv`. It keeps its "Historical" banner. Remove it from the main index, and list it in the archive section of `docs/README.md`.

## 4. Links

- Every relative link in `docs/`, `README.md` and `CLAUDE.md` resolves.
- No link points to the missing `docs/index.md`. The index is `docs/README.md`.
- Check with:

  ```bash
  grep -rnoE '\]\([^)#]+\.md' docs README.md CLAUDE.md
  ```

  then confirm each target exists.

## 5. Index and change list

- `docs/README.md` lists every current doc with a one-line purpose.
- `docs/change-list.md` gets an `open` row for every design that is documented but not built yet.

## 6. Report

Report the files you changed, the files you archived, the claims you fixed, and anything you couldn't verify.
