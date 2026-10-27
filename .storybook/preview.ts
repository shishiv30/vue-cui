import { DocsContainer } from '@storybook/addon-docs/blocks';
import { setup } from '@storybook/vue3';
import type { Preview } from '@storybook/vue3-vite';
import React, { useEffect, useState } from 'react';
import { themes } from 'storybook/theming';
import collapse from '../client/src/directives/collapse';
import lazyload from '../client/src/directives/lazyload';
import tab from '../client/src/directives/tab';
import tooltip from '../client/src/directives/tooltip';
import './app-layer.scss';
import './code-panel.css';

setup((app) => {
	app.directive('collapse', collapse);
	app.directive('lazyload', lazyload);
	app.directive('tab', tab);
	app.directive('tooltip', tooltip);
});

type DocsArgType = {
	table?: {
		category?: string;
		disable?: boolean;
	};
};

type DocsSourceContext = {
	title: string;
	args?: Record<string, unknown>;
	argTypes?: Record<string, DocsArgType>;
	component?: { __name?: string };
	parameters?: {
		docs?: {
			source?: {
				language?: string;
			};
		};
	};
	originalStoryFn?: (args?: Record<string, unknown>, context?: unknown) => unknown;
};

function isShownArg(key: string, context: DocsSourceContext) {
	const table = context.argTypes?.[key]?.table;
	if (table?.disable) {
		return false;
	}
	if (table?.category === 'exposed' || table?.category === 'events') {
		return false;
	}
	const value = context.args?.[key];
	return typeof value !== 'function' && value !== undefined;
}

function propArgs(context: DocsSourceContext) {
	const args = context.args ?? {};
	const props: Record<string, unknown> = {};
	for (const key of Object.keys(args)) {
		if (key === 'model' || !isShownArg(key, context)) {
			continue;
		}
		props[key] = args[key];
	}
	return props;
}

function vueAttr(key: string, value: unknown) {
	if (typeof value === 'string' && !/['"\n<&]/.test(value)) {
		return `${key}="${value}"`;
	}
	return `:${key}='${JSON.stringify(value)}'`;
}

function templateFromStory(fn: unknown) {
	if (typeof fn !== 'function') {
		return '';
	}
	const source = Function.prototype.toString.call(fn);
	const match = source.match(/template\s*:\s*`([\s\S]*?)`/);
	return match?.[1]?.trim() ?? '';
}

function storyTemplate(context: DocsSourceContext) {
	if (typeof context.originalStoryFn !== 'function') {
		return templateFromStory(context.originalStoryFn);
	}
	const rendered = context.originalStoryFn(context.args, context);
	if (
		rendered &&
		typeof rendered === 'object' &&
		'template' in rendered &&
		typeof rendered.template === 'string'
	) {
		return rendered.template.trim();
	}
	return templateFromStory(context.originalStoryFn);
}

function componentName(context: DocsSourceContext) {
	return context.component?.__name || context.title.split('/').at(-1) || 'Component';
}

function usageTag(name: string, attrs: string[]) {
	if (attrs.length === 0) {
		return `<${name} />`;
	}
	if (attrs.length === 1 && !attrs[0].includes('\n')) {
		return `<${name} ${attrs[0]} />`;
	}
	return `<${name}\n${attrs.map((attr) => `\t${attr}`).join('\n')}\n/>`;
}

function plainDocsSource(_source: string, context: DocsSourceContext) {
	const sourceParams = context.parameters?.docs?.source;
	if (sourceParams) {
		sourceParams.language = 'html';
	}
	const template = storyTemplate(context);
	if (context.title.startsWith('Directives/') && template) {
		return template;
	}
	const name = componentName(context);
	if (template.includes('v-model')) {
		const model = context.args?.model;
		const attrs = [`v-model='${JSON.stringify(model ?? '')}'`];
		for (const [key, value] of Object.entries(propArgs(context))) {
			attrs.push(vueAttr(key, value));
		}
		return usageTag(name, attrs);
	}
	const modelArg = context.argTypes?.model;
	if (modelArg?.table?.disable) {
		const model = JSON.stringify(propArgs(context), null, 2);
		return usageTag(name, [`:model='${model}'`]);
	}
	return template;
}

const COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';

function SystemDocsContainer(props: React.ComponentProps<typeof DocsContainer>) {
	const [dark, setDark] = useState(() => window.matchMedia(COLOR_SCHEME_DARK).matches);

	useEffect(() => {
		const query = window.matchMedia(COLOR_SCHEME_DARK);
		const apply = () => {
			setDark(query.matches);
		};
		apply();
		query.addEventListener('change', apply);
		return () => query.removeEventListener('change', apply);
	}, []);

	return React.createElement(DocsContainer, {
		...props,
		theme: dark ? themes.dark : themes.light,
	});
}

const preview: Preview = {
	parameters: {
		layout: 'padded',

		docs: {
			container: SystemDocsContainer,
			story: {
				inline: true,
				height: '300px',
			},
			codePanel: true,
			source: {
				type: 'dynamic',
				format: false,
				transform: plainDocsSource,
			},
		},

		a11y: {
			test: 'error',
		},
	},
	decorators: [
		(story) => {
			document.body.id = 'body';
			return story();
		},
	],
};

export default preview;
