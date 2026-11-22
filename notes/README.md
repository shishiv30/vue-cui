# Team notes: long-term memory

`docs/` explains how the product works. `notes/` records what the team decided, asked and learned, so the next person or agent doesn't start from zero. The docs-maintainer keeps this folder, and everyone reads it before starting work (team charter §8).

| File / folder                           | What goes in it                                                                                                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [requirements/](requirements/README.md) | One trackable requirement per change, from request to release (`doc-requirement` skill).                                                                                                       |
| [decisions.md](decisions.md)            | Decisions that outlive a single change, including approvals for changes to team-owned config (charter §9).                                                                                     |
| [open-questions.md](open-questions.md)  | Questions waiting on a person or a teammate. Each is yes/no or has options.                                                                                                                    |
| [lessons.md](lessons.md)                | Things learned the hard way: gotchas, upstream quirks, mistakes not to repeat. A `retro` marks each lesson `→ applied: <file>` or `→ kept`; more than 10 unmarked ones trigger the next retro. |

Rules:

- Use short entries, newest at the top, each dated `YYYY-MM-DD`.
- Link to the requirement, PR or file instead of copying content.
- Never write secrets or personal data here.
