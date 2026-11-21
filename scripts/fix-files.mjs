#!/usr/bin/env node
/**
 * The one entry point for code style. Used by the Claude hook (fix-on-edit) and by
 * .githooks/pre-commit, so humans and AI get the same result.
 *   Prettier formats (.prettierrc). ESLint --fix corrects (.eslintrc.cjs, js only).
 * Usage: node scripts/fix-files.mjs <file...>
 * Exit 1 and print the remaining ESLint errors when something cannot be auto-fixed.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';

const PRETTIER = /\.(js|mjs|cjs|ts|vue|scss|json|md)$/;
const ESLINT = /\.(js|mjs|cjs)$/;
const IGNORED = /(^|\/)(node_modules|dist|dist-lib|storybook-static)\//;

const files = process.argv.slice(2).filter((f) => fs.existsSync(f) && !IGNORED.test(f));
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
