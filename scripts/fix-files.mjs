#!/usr/bin/env node
/**
 * The one entry point for code style. Used by the Claude hook (fix-on-edit) and by
 * .githooks/pre-commit, so humans and AI get the same result.
 *   Prettier formats (.prettierrc). ESLint --fix corrects (.eslintrc.cjs, js only).
 * Usage: node scripts/fix-files.mjs <file...>
 *        node scripts/fix-files.mjs --changed   (all modified and untracked files in git)
 * Exit 1 and print the remaining ESLint errors when something cannot be auto-fixed.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';

const PRETTIER = /\.(js|mjs|cjs|ts|vue|scss|json|md)$/;
const ESLINT = /\.(js|mjs|cjs)$/;
const IGNORED = /(^|\/)(node_modules|dist|dist-lib|storybook-static)\//;

const git = (args) => spawnSync('git', args, { encoding: 'utf8' }).stdout.split('\n');
const args = process.argv.slice(2);
const input = args.includes('--changed')
	? [
			...git(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD']),
			...git(['ls-files', '--others', '--exclude-standard']),
		].filter(Boolean)
	: args;
const files = input.filter((f) => fs.existsSync(f) && !IGNORED.test(f));
const run = (bin, args) => spawnSync('npx', ['--no-install', bin, ...args], { encoding: 'utf8' });

const format = files.filter((f) => PRETTIER.test(f));
if (format.length) run('prettier', ['--write', '--log-level', 'silent', ...format]);

const lint = files.filter((f) => ESLINT.test(f));
if (lint.length) {
	const result = run('eslint', ['--fix', ...lint]);
	if (result.status !== 0) {
		process.stderr.write(result.stdout + result.stderr);
		process.exit(1);
	}
}
