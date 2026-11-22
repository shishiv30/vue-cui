---
name: retro
description: Team retrospective for vue-cui. Review notes/ (lessons, decisions, requirements, open questions) since the last retro, find what keeps going wrong or what the config no longer matches, and turn it into the smallest change to a rule, skill, agent or hook, or remove what is stale. Use when notes/lessons.md has more than 10 unmarked lessons (the post-commit hook says so), or when the user asks for a retro or for the team to improve itself.
---

# Retro: turn notes into better rules, skills and agents

The docs-maintainer runs it (charter §8). Changes follow charter §9: proposed, two approvals, then edited.

## When

More than 10 **unmarked** lessons in `notes/lessons.md`: lines with neither `→ applied: <file>` nor `→ kept`. The post-commit hook counts them and says when a retro is due. Or the user asks.

## 1. Find the cursor

The newest `## YYYY-MM-DD: Retro:` entry in `notes/decisions.md`. Review the unmarked lessons, and the other notes dated after that entry. No entry yet: review everything.

## 2. Collect signals (read, don't guess)

| Source                                          | Look for                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `notes/lessons.md`                              | Unmarked lessons                                                                        |
| `notes/requirements/` (closed since the cursor) | Deviations, **Needs developer input** items, acceptance criteria that failed first time |
| `notes/open-questions.md` "Answered"            | Answers that are really a rule ("always…", "never…")                                    |
| `notes/decisions.md`                            | Decisions not yet reflected in a rule or skill                                          |
| `git log` since the cursor date                 | Fix-up commits, reverts, the same file fixed twice                                      |

## 3. Pick what to change

A signal is worth acting on when it **repeated**, **cost real time**, or **will recur** without a rule. One-off gotchas stay as lessons.

For each, choose the smallest home (charter §1, §10):

| The problem                                           | Change                                                                 |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| A step got skipped                                    | Add it to the skill's steps or to `verify`                             |
| A rule was unknown or unclear                         | Edit the existing rule; path-scope it if it only applies to some files |
| Wrong agent did the work, or work fell between agents | Edit the agents' "You own" / "Hand off"                                |
| A check a script can do                               | A hook (cheap, deterministic) instead of more prose                    |
| A rule, skill line or hook no longer matches the code | Fix or delete it                                                       |
| Two places say the same thing                         | Keep one, link from the other                                          |

**Budget:** always-loaded text (`CLAUDE.md`, `team-charter.md`, `project-standards.md`) must not grow. If you add a line there, cut one.

## 4. Propose and approve

1. Add one `notes/decisions.md` entry, newest first, titled `Retro: <short summary>`, Status `proposed`. List each change: signal → file → change, with links to the lessons or requirements.
2. Ask for approval: the docs-maintainer plus the developer who owns the area (`component-developer` or `application-developer`). The main session sends the proposal; keep it to yes/no per change. The user can approve or override.
3. Set Status `approved` with the approvals ticked. Drop the changes that were rejected and say why in one line.

## 5. Apply

- Edit only the approved files. Follow `rename-or-move-file.md` for moves.
- Mark **every** reviewed lesson, so the count resets: `→ applied: <file>` if it became a change, `→ kept` if it stays a lesson. Keep the line.
- Run the hook self-checks if a hook changed, and `npm test`.

## 6. Report

Short, keywords only (charter §12):

- the retro entry
- changes made (file, one line each)
- changes rejected or deferred
- signals left as lessons
