# Requirements

Each non-trivial change gets a trackable requirement file here before work starts, written by the `docs-maintainer` agent with the `doc-requirement` skill. After the change is committed or released, the same file records what shipped and which docs were updated.

To start one, copy [_template.md](_template.md) to `REQ-YYYYMMDD-<slug>.md`.

| ID                                                                            | Title                                                                | Owner                                       | Status                                     | Release                            |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------ | ---------------------------------- |
| [REQ-20261124-sharelink-platforms](REQ-20261124-sharelink-platforms.md)       | Sharelink top 20 social + Ask AI, copy/QR for app-only, Twitter is X | component-developer                         | in-progress                                | commit d76cda5 + follow-up, no tag |
| [REQ-20261124-map-auto-merge](REQ-20261124-map-auto-merge.md)                 | Map merges close pins into group pins with a list sheet              | component-developer                         | in-progress                                | `master`, not committed            |
| [REQ-20261124-dead-data-role-hooks](REQ-20261124-dead-data-role-hooks.md)     | Replace dead data-role hooks with Vue; form radius rule              | component-developer                         | docs-updated                               | commit 86ef412, no tag             |
| [REQ-20261120-autocomplete-directive](REQ-20261120-autocomplete-directive.md) | v-autocomplete directive and Header search suggestions               | component-developer                         | docs-updated (one developer question open) | commit 533865d, no tag             |
| [REQ-migration-end-cleanup](REQ-migration-end-cleanup.md)                     | Remove EJS and the legacy plugin runtime                             | component-developer + application-developer | in progress (server EJS removed)           |                                    |
