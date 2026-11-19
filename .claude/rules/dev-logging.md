---
paths:
  - "server/**"
  - "helpers/**"
  - "client/js/core/**"
  - "client/src/**"
  - "test/**"
---

# Dev logging (team charter §11)

In the dev environment, every request and every important step should be traceable, so any bug can be reproduced and debugged quickly.

- **One request, one id.** Server work runs inside `runWithSoaLogs` (`server/controllers/realestate.ts`), which gives each request an `AsyncLocalStorage` context with a `requestId`. Log each step with `logStep(name, detail)`: payload, every upstream call, each mapper, the page model, SSR, and the response. Write one JSON line per step, all sharing that `requestId`. Don't add a second logging system.
- **Reproducible upstream calls.** In dev, record each upstream call as a ready-to-run `curl` (already collected by `runWithSoaLogs`) along with its status, latency and a trimmed response. Then anyone can replay the exact call.
- **Clear errors.** Catch errors with context: the `requestId`, the step, the inputs, and the upstream status. Never swallow an error silently. Prefer `logStep` over a bare `console.error`.
- **Client side.** Use `client/js/core/log.js`: it is dev-only and a no-op in production. Log lifecycle phases and bus events (`emitPhase`, `change`/`changed`) while developing, so the event order can be followed.
- **Easy repro.** A bug report or requirement includes: the URL with query, the `requestId`, the relevant log lines or curl, and the expected vs. actual result. Turn every fixed bug into a test in `test/` where practical.
- **Safe and quiet.** Detailed logs are dev-only; production logs step names and errors without the detail. Never log keys, tokens, cookies or personal data. Mask them in curls and responses.
