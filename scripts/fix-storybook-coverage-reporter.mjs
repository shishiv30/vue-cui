import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const file = require.resolve('@storybook/addon-vitest/internal/coverage-reporter');
const source = readFileSync(file, 'utf8');
const broken = 'StorybookCoverageReporter as "module.exports"';
const fixed = `${broken},\n  StorybookCoverageReporter as default`;

if (source.includes('StorybookCoverageReporter as default')) {
	process.exit(0);
}

if (!source.includes(broken)) {
	console.error('Storybook coverage reporter export changed; skip the patch.');
	process.exit(0);
}

writeFileSync(file, source.replace(broken, fixed));
