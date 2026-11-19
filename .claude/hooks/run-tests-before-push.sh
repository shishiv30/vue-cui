#!/usr/bin/env bash
# PreToolUse (Bash): block `git push` when `npm test` fails.
# Claude Code: exit 2 + stderr blocks the call. Cursor (arg "cursor"): JSON permission reply.
set -uo pipefail

MODE="${1:-claude}"
LIB="$(cd "$(dirname "$0")" && pwd)/_lib.mjs"
CMD="$(node -e 'import(process.argv[1]).then(l=>process.stdout.write(l.command(l.readInput())))' "$LIB" 2>/dev/null)"
allow() { [[ "$MODE" == cursor ]] && echo '{ "permission": "allow" }'; exit 0; }

[[ "$CMD" =~ (^|[;&|[:space:]])git[[:space:]]+push([[:space:]]|$) ]] || allow

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
OUT="$(npm test 2>&1)" && allow

if [[ "$MODE" == cursor ]]; then
	echo '{ "permission": "deny", "user_message": "Push blocked: npm test failed." }'
	exit 0
fi
printf 'Push blocked: `npm test` failed. Last lines:\n%s\n' "$(tail -30 <<<"$OUT")" >&2
exit 2
