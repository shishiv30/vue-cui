module.exports = {
	env: {
		browser: true,
		es6: true,
		jquery: true,
		node: true,
	},
	globals: {
		window: true,
		Mustache: true,
		browser: true,
		console: true,
		workbox: true,
		importScripts: true,
	},
	plugins: ['unused-imports'],
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		// Auto-fixable: removes unused imports. Unused variables are still reported.
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': 'error',
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
};
