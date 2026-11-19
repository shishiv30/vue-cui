#!/usr/bin/env node
/**
 * PreToolUse (Edit|Write|MultiEdit): team-owned config needs an approved decision
 * first (team charter §9). If the newest entry in notes/decisions.md is not
 * "Status: approved", ask the user before the edit goes through.
 */
import fs from 'fs';
import path from 'path';

import { readInput, filePath } from './_lib.mjs';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const file = path.relative(root, filePath(readInput()));
const GUARDED = /^(CLAUDE\.md$|\.claude\/(agents|hooks|rules|skills)\/|\.claude\/settings\.json$|\.cursor\/)/;
if (!GUARDED.test(file)) process.exit(0);

let newest = '';
try {
	const log = fs.readFileSync(path.join(root, 'notes/decisions.md'), 'utf8');
	// Real entries start with a dated heading; the format template uses YYYY-MM-DD.
	newest = log.split(/^(?=## \d{4}-\d{2}-\d{2})/m)[1] ?? '';
} catch {
	/* no log yet: treat as unapproved */
}
if (/Status:\s*approved/i.test(newest)) process.exit(0);

process.stdout.write(
	JSON.stringify({
		hookSpecificOutput: {
			hookEventName: 'PreToolUse',
			permissionDecision: 'ask',
			permissionDecisionReason:
				`${file} is team-owned config. The newest notes/decisions.md entry is not ` +
				'approved (team charter §9). Allow only if you approve this change.',
		},
	}),
);
process.exit(0);
