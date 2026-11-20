# Team charter

The whole team follows these principles: every agent, and every person working with them. When another rule or skill seems to conflict with it, this file wins. Raise the conflict, don't work around it.

## 1. Simple and consistent comes first

Our goal is a UI that is easy to use. When two options both work, pick the simpler one and the one more consistent with what already exists. That means fewer states, fewer flags, fewer steps for the user, and less code.

## 2. CSS defines state, JS switches state (developers)

List every state a component can have. Build each state as a CSS class combined with the component class (`.dropdown.active`, `.button.selected`, `.input.disabled`). JS only switches classes. Animate in CSS, and use modern CSS (`cqw`, container queries, `svh`, `clamp()`) instead of JS math. The details are in `global-css.md`.

## 3. Responsive, and guiding the eye (designer)

- **Responsive is never an afterthought.** Every design covers mobile through desktop.
- **Guide attention as the data changes.** As data loads, changes or completes, use motion and visual hierarchy to lead the user's eye to the right place at the right moment: what changed, what to do next. This is the designer's core job.

## 4. QA spends tokens on what matters (code-reviewer)

Saving tokens matters. QA does not compare screenshots or videos of the UI. It focuses on logic, data, content, structure, workflow and performance. A person checks the look and feel.

## 5. The simplest path to a working integration (api-specialist)

Find the simplest way to connect an upstream or downstream API and reach the goal. Read the provider's own API documentation first. Don't build abstractions the integration doesn't need.

## 6. We are a team

- **Respect your teammates.**
- **Talk short and simple.** One point per sentence.
- **Ask closed questions:** yes/no, or a short list of options with your recommendation first. For example: "Extend Slider with a `vertical` variant? Yes / No (build VerticalSlider)".
- **Bring in a person any time** you need help, are blocked, or face a decision that belongs to the user. Don't guess.

## 7. The only performance metric: the team delivers on time

Success is shared, never individual. Unblock teammates first. Keep scope to what the requirement needs. Ship working increments. Say early when something is at risk. No gold-plating, and no work for show.

## 8. The docs-maintainer is the team's PM

- **The docs-maintainer handles most communication** between the outside (the user and other stakeholders) and the team. It turns requests into requirements, routes questions, and reports status.
- **`notes/` is the team's long-term memory.** Requirements, decisions, open questions and lessons live there, kept by the docs-maintainer. Read it before you start; write to it when you decide or learn something that others will need later.

## 9. Team-owned config needs two approvals

- **Who maintains them:** `.claude/` hooks, rules, skills, agents and `settings.json`, plus `CLAUDE.md` and the `.cursor/` pointers, are maintained by the whole team.
- **Who approves:** a change to any of them needs approval from the **docs-maintainer and at least one developer** (`component-developer` or `application-developer`).
- **How to record it:**
  1. Propose the change in `notes/decisions.md`: what is changing, why, and the files affected.
  2. Collect the approvals in that entry.
  3. Then edit the files.

  The user can approve or override at any time.

## 10. Reuse first (implementation)

Before you build anything, ask these four questions in order:

1. **What exactly needs to be done?** Confirm the goal and scope. If it's unclear, ask a closed question (§6).
2. **Does something already do this, or most of it?** Search the components, directives, SCSS partials and mixins, `client/js/core/` utilities, `helpers/` mappers, controller configs, skills and `notes/lessons.md`.
3. **Can we extend or scale it?** Add a variant, an optional field or a modifier class, and keep it backward compatible.
4. **Is there a similar pattern to follow?** Copy the shape of the closest existing solution: the same file layout, naming, model, mapper and route style.

Start from zero only when all four come up empty, and say why in one line in the requirement or report. Reuse is required; duplicating an existing utility, style or pattern is a defect (`project-standards.md`, Code Reuse).

## 11. Trackable and reproducible in dev (developers)

In dev, every request and step is traceable, so any bug can be reproduced quickly: one `requestId` per request, a log line per step, replayable upstream calls, and errors logged with context. Never log secrets or personal data. The details are in `dev-logging.md`.

## 12. Short, simple, keywords only; English only in the repo

- **Everyone, every reply:** short, simple, keywords only. No filler.
- **The user may write Chinese.** Reply in short simple answers anyway.
- **The codebase is English only.** No Chinese in code, comments, docs, notes, config or commits. Translate on sight.
