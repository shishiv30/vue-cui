#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit): format and auto-fix the edited file with
 * scripts/fix-files.mjs (Prettier + ESLint --fix). Anything ESLint cannot fix is
 * fed back to Claude (exit 2). Same script as the git pre-commit hook.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { readInput, filePath } from './_lib.mjs';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const file = filePath(readInput());
if (!file) process.exit(0);

const result = spawnSync('node', ['scripts/fix-files.mjs', path.relative(root, file)], {
	cwd: root,
	encoding: 'utf8',
});
if (result.status !== 0) {
	process.stderr.write(`ESLint errors that need a manual fix:\n${result.stderr}`);
	process.exit(2);
}
process.exit(0);
