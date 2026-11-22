#!/usr/bin/env node
/**
 * Stop: format and auto-fix every changed file (git) with scripts/fix-files.mjs --changed.
 * Catches edits made outside Edit/Write (Bash, sed). Unfixable ESLint errors are fed back
 * to Claude once (exit 2); stop_hook_active prevents a loop.
 */
import { spawnSync } from 'child_process';
import { readInput } from './_lib.mjs';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const input = readInput();

const result = spawnSync('node', ['scripts/fix-files.mjs', '--changed'], {
	cwd: root,
	encoding: 'utf8',
});
if (result.status !== 0 && !input.stop_hook_active) {
	process.stderr.write(`ESLint errors that need a manual fix:\n${result.stderr}`);
	process.exit(2);
}
process.exit(0);
