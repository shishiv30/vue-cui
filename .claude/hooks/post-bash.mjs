#!/usr/bin/env node
/**
 * PostToolUse (Bash): one process per Bash call, two reminders.
 * - A move or delete in a mapped folder → the rename checklist.
 * - A commit, merge or release → the docs-maintainer post-change review.
 * Pass "cursor" as argv[2] for Cursor's output format.
 */
import { readInput, command, addContext } from './_lib.mjs';

const cmd = command(readInput());
const notes = [];

if (
	/\b(git\s+mv|git\s+rm|mv|rm\s+-rf?|cp\s+-r)\s/i.test(cmd) &&
	/(client\/|helpers\/|data\/|server\/|scripts\/|vite\.(lib\.)?config|docs\/|notes\/|\.claude\/|\.storybook\/)/.test(cmd)
) {
	notes.push('Structural change: follow .claude/rules/rename-or-move-file.md.');
}
if (/\b(git\s+commit|git\s+merge|gh\s+pr\s+merge|gh\s+release\s+create|npm\s+version)\b/.test(cmd)) {
	notes.push(
		'Commit, merge or release: when this change is complete, run docs-maintainer for the ' +
			'post-change review (doc-requirement skill, part C). Skip for its own docs commits.',
	);
}
if (notes.length) addContext('PostToolUse', notes.join('\n'), process.argv[2]);
