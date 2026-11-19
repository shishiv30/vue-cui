#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write): a .vue file must not contain a <style> block.
 * Rule: .claude/rules/global-css.md. Exit 2 feeds the message back to Claude.
 */
import fs from 'fs';
import { readInput, filePath } from './_lib.mjs';

const file = filePath(readInput());
if (!file.endsWith('.vue') || !fs.existsSync(file)) process.exit(0);

if (/<style[\s>]/i.test(fs.readFileSync(file, 'utf8'))) {
	process.stderr.write(
		`${file} has a <style> block. No CSS in .vue files: move the styles to ` +
			'client/scss/ (see .claude/rules/global-css.md) and remove the block.\n',
	);
	process.exit(2);
}
process.exit(0);
