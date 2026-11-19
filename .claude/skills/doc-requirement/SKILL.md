---
name: doc-requirement
description: The docs side of every change in vue-cui. Before work starts, write a trackable requirement doc in notes/requirements/. After the change is committed or released, review what actually shipped, update the affected docs, and close the requirement. Use when a feature, fix or component is about to be built, and again after it is merged or released.
---

# Doc requirement: before and after a change

Every non-trivial change has one requirement file, `notes/requirements/REQ-YYYYMMDD-<slug>.md`, copied from `notes/requirements/_template.md`. `notes/requirements/README.md` is the index: one row per requirement with its status. Typo-sized fixes don't need one.

## A. Before the change: prepare the requirement

1. **Gather input.** Use the user's request, linked designs and tickets, and the relevant code. Read the code; don't guess how it works today.
2. **Fill in the template:**
   - **Why** and **Scope**: what is in and what is out.
   - **Requirements** as checkboxes (R1, R2, …).
   - **Acceptance criteria**, each testable by a command, a test, or a named human check. Keep visual and interaction checks in their own **For human verification** list.
   - **Related docs:** which `docs/*.md` files this change will make out of date.
   - **Owner:** `component-developer` for library, CSS, Storybook and PWA/performance work; `application-developer` for pages, server, mapping, SEO and Split.
3. **Fill knowledge gaps.** When you can't state how something works, or what a requirement should be, from the code alone, don't invent it. Add the questions to **Needs developer input**, each addressed to the owning developer agent, and set Status to `draft`.
4. **Index it.** Add the requirement to `notes/requirements/README.md`, and add an `open` row to `docs/change-list.md` that links to it.
5. **Report back** the file path, its status, and any open developer questions. The main session routes those questions to the developer agent. Set Status to `ready` once every question is answered and you have reviewed the answers.

## B. During the change (developers)

The owning developer reads the requirement first and ticks requirements as they are met. They set Status to `in-progress`, then `done`, and fill in Branch / PR. They also answer any **Needs developer input** questions directly in the file.

## C. After commit or release: review and update the docs

Trigger: the change is merged, or a release or tag is created.

1. **See what actually shipped:** `git log` / `git diff <base>..<head>` for the merge, or `<prev-tag>..<tag>` for a release. Compare it with the requirement. Note anything that shipped differently from the plan.
2. **Check every acceptance criterion.** Re-run the command checks you can. Do not tick human-verification items yourself; leave them for a person.
3. **Update the docs.** Edit every file listed under **Related docs**, plus any other doc the diff makes wrong. Find these by grepping the docs for the changed paths, exports, scripts and model fields. Follow the `docs-sync` skill for verification and links.
4. **Escalate gaps.** When the diff changes behavior you don't understand well enough to document (a mapping rule, an SSR detail, a performance trade-off):
   - Add a **Needs developer input** item asking the owning developer to draft or correct that section.
   - After they write it, **review** their text: it must be accurate against the code, consistent with the other docs, and readable by a newcomer. Edit for clarity, and send it back if a claim doesn't match the code.
5. **Close the requirement.** Set Status to `released` (or `done` if there is no release) and then `docs-updated`. Fill in Release, add a Changelog line, and update the index and `docs/change-list.md`.
6. **Report** which docs changed, any deviations from the requirement, the items still waiting on developer input, and the open human-verification checks.
