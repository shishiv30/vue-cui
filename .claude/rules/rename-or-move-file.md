# Rename or move a file

When you rename or move a file or path:

1. Create the new file and update the paths it mentions.
2. `rg` the old name and path, then update every reference: imports, tests, `vite.config.ts` / `vite.lib.config.ts`, scripts, routes, `CLAUDE.md`, `docs/` and `.claude/skills/`.
3. Delete the old file only when `rg` finds no stale references.
