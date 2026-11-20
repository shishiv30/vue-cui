# Decisions

Newest first. Approval rule: team charter §9.

Entry format:

```
## YYYY-MM-DD: <title>
- Status: proposed / approved / rejected / superseded
- What: …
- Why: …
- Files: …
- Approvals: docs-maintainer ☐  component-developer ☐  application-developer ☐  user ☐ (optional)
```

## 2026-11-19: Remove EJS from the server
- Status: approved (requested by the user: "Yes, remove EJS")
- What: delete `server/ejs/` (all `.ejs` files, the `comp_theme` inline theme, `comp_article`), `toPage`, `staticHtml.ts`, the configs' `seo` hooks, the view engine and the `ejs` dependency. Move the header, footer, filter and links model builders to `server/page/`. Update the rules, skills and agents that named those paths. The `data-role` plugin runtime and `convert-ejs-to-vue` stay until the plugins are converted.
- Why: every HTML page is already Vue SSR with client-side routes; the EJS render path had no callers.
- Files: `CLAUDE.md`, `.claude/rules/global-css.md`, `.claude/rules/html-page-blueprint.md`, `.claude/rules/server-data.md`, `.claude/skills/perf-audit/SKILL.md`, `.claude/agents/application-developer.md`
- Approvals: user ☑

## 2026-11-19: /simplify cleanup of the team config
- Status: approved (the user ran /simplify, which applies the fixes)
- What: remove repeated text (the charter summary in CLAUDE.md, agent boilerplate, restated §2/§9/§10/§11, skill copies of `docs/component-conversion.md`), scope server-only rules by path, trim skill preloads, merge the two PostToolUse Bash hooks with a shared input helper, drop the hardcoded counts.
- Why: every rule in one place; less always-loaded context; fewer hook process spawns.
- Files: `CLAUDE.md`, `.claude/**`, `.cursor/rules/claude-canonical.mdc`, `docs/change-list.md`, `notes/**`
- Approvals: user ☑

## 2026-11-19: Charter §11, trackable and reproducible in dev
- Status: approved (requested by the user)
- What: add a charter principle: in dev, log every request step with a request id so issues are easy to track, reproduce and debug, building on `runWithSoaLogs` / `logStep` and `client/js/core/log.js`.
- Why: fast troubleshooting keeps delivery on time (§7).
- Files: `.claude/rules/team-charter.md`, `CLAUDE.md`, `.claude/agents/*-developer.md`, `.claude/agents/code-reviewer.md`, `.claude/skills/local-dev/SKILL.md`
- Approvals: user ☑

## 2026-11-19: Charter §10, reuse first
- Status: approved (requested by the user)
- What: add a charter principle: before implementing anything, ask what is needed and what already exists, then reuse, extend or follow an existing pattern before starting from zero.
- Why: maximum reuse keeps the codebase simple and consistent (§1).
- Files: `.claude/rules/team-charter.md`, `CLAUDE.md`, `.claude/agents/*-developer.md`, `.claude/agents/api-specialist.md`, `.claude/agents/code-reviewer.md`
- Approvals: user ☑

## 2026-11-19: Team charter, notes/ memory, config governance
- Status: approved (requested by the user)
- What: added `.claude/rules/team-charter.md` (9 principles); moved requirements to `notes/requirements/`; added the `notes/` memory files; added state-class and modern-CSS rules; gave each agent its principle; added the `guard-team-config` hook.
- Why: one shared set of principles for the whole team, long-term memory, and two-approval governance for team config.
- Files: `.claude/rules/*`, `.claude/agents/*`, `.claude/hooks/guard-team-config.mjs`, `.claude/settings.json`, `CLAUDE.md`, `notes/**`
- Approvals: user ☑

## 2026-11-19: Initial AI team setup
- Status: approved (by the user, who set it up directly)
- What: CLAUDE.md, `.claude/` with 6 agents, 13 skills, 7 rules, hooks and settings, and the `notes/` folder. `.cursor/` reduced to pointers.
- Why: one maintained source of guidance for every agent. It replaces the stale `.cursor/background.json`.
- Files: `CLAUDE.md`, `.claude/**`, `.cursor/**`, `notes/**`
- Approvals: user ☑
