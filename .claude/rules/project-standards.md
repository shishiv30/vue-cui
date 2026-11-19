# Project standards

The normative coding standards. If a skill or doc says otherwise, follow this file. The team charter (`team-charter.md`) still wins over both.

## Formatting

`.prettierrc` and `.eslintrc.cjs` are the source of truth: tabs, single quotes, semicolons, trailing commas, 100-column lines. TypeScript is preferred for new or heavily changed modules.

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Function** | ^[a-z][a-zA-Z0-9]*$ | appleTree |
| **CSS Class** | ^[a-z][a-z0-9-]*$ | apple-tree |
| **Class Name** | ^[A-Z][a-zA-Z0-9]*$ | AppleTree |
| **Constant** | ^[A-Z][A-Z0-9_]*$ | APPLE_TREE |

## Coding style

**Default: simple over clever.** The most important rule: do not make code complex—especially for hotfixes, naming, and templates.

### Before every fix

Ask: **hotfix or root cause?**

| Choose root cause when | A hotfix is acceptable when |
|------------------------|-----------------------------|
| The bug will recur without fixing the real path | Cause is unknown and investigation is costly |
| One config, condition, or missing field explains it | Change is tiny, scoped, and reversible |
| You are adding layers (helpers, loops, rewriters) to mask a symptom | Production is blocked and you will follow up |

Prefer the **smallest change that fixes the real cause**, not the most general framework.

### Simplicity

- **One name, one source of truth** — e.g. a single `welcomeImage` in config reused by preload and EJS; avoid string-matching in templates.
- **Extract a function only when** the logic is genuinely common **and** used in **at least two places**. One call site → inline it; do not wrap.
- **Names match the domain** — avoid overloading `context`, `ctx`, and `exportObj` without checking what each layer already means.
- **Reuse existing utilities** (`getSrc`, `getHref`, config fields) instead of parallel logic.

### Anti-patterns

- Template loops or regex to find data that should live on `data` or config.
- New pipelines (`basePath` rewriters, extra env flags) when Vite `base` or env loading is wrong.
- Duplicating the same path or URL in two places without a shared constant.

## Reuse

Follow charter §10. The utilities to check first live in `client/js/core/` (format, validate, query, log, load, def, scroll…) and `helpers/` (geo, path, url, property, article, filter, fuse…). When you add a new utility, document it.

## Docs alignment

A change to architecture, routes, scripts, ports, theme conventions or any documented path updates the matching doc in `docs/` (indexed in `docs/README.md`) in the same pass. Also update `CLAUDE.md` and `.claude/skills/` where they name it. For moves, see `rename-or-move-file.md`.
