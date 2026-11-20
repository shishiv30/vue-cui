# Requirements

Each non-trivial change gets a trackable requirement file here before work starts, written by the `docs-maintainer` agent with the `doc-requirement` skill. After the change is committed or released, the same file records what shipped and which docs were updated.

To start one, copy [_template.md](_template.md) to `REQ-YYYYMMDD-<slug>.md`.

| ID | Title | Owner | Status | Release |
| --- | --- | --- | --- | --- |
| [REQ-migration-end-cleanup](REQ-migration-end-cleanup.md) | Remove EJS and the legacy plugin runtime | component-developer + application-developer | in progress (server EJS removed) | |
