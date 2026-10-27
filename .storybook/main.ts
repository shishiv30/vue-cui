import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
	stories: ['../client/src/**/*.stories.@(ts|vue)'],
	addons: [
		'@storybook/addon-docs',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@chromatic-com/storybook',
	],
	docs: {
		autodocs: 'tag',
	},
	framework: {
		name: '@storybook/vue3-vite',
		options: {
			docgen: 'vue-component-meta',
		},
	},
	staticDirs: ['../client/assets'],
	async viteFinal(config) {
		const publicPath = process.env.STORYBOOK_BASE || process.env.PUBLIC_PATH;
		if (publicPath) {
			config.base = publicPath;
		}
		return config;
	},
};

export default config;
