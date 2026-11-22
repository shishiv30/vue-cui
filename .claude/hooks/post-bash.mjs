#!/usr/bin/env node
/**
 * PostToolUse (Bash): one process per Bash call, two reminders.
 * - A move or delete in a mapped folder → the rename checklist.
 * - A commit, merge or release → the docs-maintainer post-change review,
 *   plus a retro reminder when notes/lessons.md has more than 10 unmarked lessons.
 * Pass "cursor" as argv[2] for Cursor's output format.
 */
import fs from 'fs';
import { readInput, command, addContext } from './_lib.mjs';

const RETRO_THRESHOLD = 10;

const cmd = command(readInput());
const notes = [];

if (
	/\b(git\s+mv|git\s+rm|mv|rm\s+-rf?|cp\s+-r)\s/i.test(cmd) &&
	/(client\/|helpers\/|data\/|server\/|scripts\/|vite\.(lib\.)?config|docs\/|notes\/|\.claude\/|\.storybook\/)/.test(
		cmd,
	)
) {
	notes.push('Structural change: follow .claude/rules/rename-or-move-file.md.');
}
if (
	/\b(git\s+commit|git\s+merge|gh\s+pr\s+merge|gh\s+release\s+create|npm\s+version)\b/.test(cmd)
) {
	notes.push(
		'Commit, merge or release: when this change is complete, run docs-maintainer for the ' +
			'post-change review (doc-requirement skill, part C). Skip for its own docs commits.',
	);
	const unmarked = unmarkedLessons();
	if (unmarked > RETRO_THRESHOLD) {
		notes.push(
			`notes/lessons.md has ${unmarked} unmarked lessons: run docs-maintainer with the retro skill.`,
		);
	}
}

/** Lesson lines with neither "→ applied" nor "→ kept"; 0 when the file is missing. */
function unmarkedLessons() {
	try {
		return fs
			.readFileSync(`${process.env.CLAUDE_PROJECT_DIR ?? '.'}/notes/lessons.md`, 'utf8')
			.split('\n')
			.filter((line) => line.startsWith('- ') && !/→ (applied|kept)/.test(line)).length;
	} catch {
		return 0;
	}
}
if (notes.length) addContext('PostToolUse', notes.join('\n'), process.argv[2]);
