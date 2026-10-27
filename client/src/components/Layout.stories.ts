import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { useArgs } from 'storybook/preview-api';
import { ref, watch } from 'vue';
import Layout from './Layout.vue';
import { layoutMock, type LayoutArticle, type LayoutMode } from './layoutModel';

type LayoutExposed = {
	setModel: (mode: string) => void;
};

type ArticleView = 'default' | 'card' | 'thumbnail';

type LayoutStoryArgs = {
	model: LayoutMode;
	data?: LayoutArticle[];
	articleMode: ArticleView;
	imageRatio?: string;
	setModel: number;
};

const modes: LayoutMode[] = ['default', 'horizontal', 'grid', 'ring'];

function viewFor(model: LayoutMode, view: ArticleView): ArticleView {
	if (model === 'grid') {
		return view === 'thumbnail' ? 'thumbnail' : 'card';
	}
	return 'default';
}

let updateLayoutArgs: (patch: Partial<LayoutStoryArgs>) => void = () => {};

const meta = {
	title: 'Components/Layout',
	component: Layout,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Article layout. model is default, horizontal, grid, or ring. '
					+ 'data is the article list. Grid switches articleMode between card and thumbnail. '
					+ 'Other models keep articleMode at default. setModel calls that method.',
			},
		},
	},
	decorators: [
		(story, context) => {
			const [, updateArgs] = useArgs();
			updateLayoutArgs = (patch) => {
				updateArgs(patch);
			};
			const args = context.args as LayoutStoryArgs;
			const next = viewFor(args.model, args.articleMode);
			if (args.articleMode !== next) {
				updateArgs({ articleMode: next });
			}
			return story();
		},
	],
	argTypes: {
		data: {
			control: 'object',
			description: 'Cards rendered inside the layout. Edit this control to change the list.',
			table: { category: 'props', type: { summary: 'LayoutArticle[]' } },
		},
		articleMode: {
			control: 'inline-radio',
			options: ['card', 'thumbnail'],
			if: { arg: 'model', eq: 'grid' },
			description: 'Grid only. card adds article-card. thumbnail adds article-thumbnail. Other layout models use default.',
			table: { category: 'props', type: { summary: "'default' | 'card' | 'thumbnail'" } },
		},
		imageRatio: {
			control: 'text',
			description: 'Overrides --image-ratio. Example: 16/9. Empty keeps the card default.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		model: {
			control: 'inline-radio',
			options: modes,
			description:
				'default is a waterfall. horizontal is a sideways strip. '
				+ 'grid shares one card height. ring is a draggable carousel.',
			table: {
				category: 'props',
				type: { summary: "'default' | 'horizontal' | 'grid' | 'ring'" },
			},
		},
		setModel: {
			control: 'number',
			description:
				'Cycle default, horizontal, grid, and ring. Change this control to call setModel().',
			table: { category: 'exposed', type: { summary: '(mode: string) => void' } },
		},
	},
} satisfies Meta<LayoutStoryArgs>;

export default meta;
type Story = StoryObj<LayoutStoryArgs>;

export const Default: Story = {
	args: {
		model: 'default',
		data: layoutMock,
		articleMode: 'default',
		imageRatio: '',
		setModel: 0,
	},
	render: (args: LayoutStoryArgs) => ({
		components: { Layout },
		setup() {
			const layout = ref<LayoutExposed | null>(null);
			const shown = ref<LayoutMode>(args.model);
			const articleMode = ref<ArticleView>(viewFor(args.model, args.articleMode));

			function sync(model: LayoutMode, view: ArticleView) {
				const next = viewFor(model, view);
				shown.value = model;
				articleMode.value = next;
				if (args.model !== model || args.articleMode !== next) {
					updateLayoutArgs({ model, articleMode: next });
				}
			}

			watch(
				() => args.model,
				(value) => {
					sync(value, args.articleMode);
				},
			);
			watch(
				() => args.articleMode,
				(value) => {
					sync(shown.value, value);
				},
			);
			watch(
				() => args.setModel,
				() => {
					const index = modes.indexOf(shown.value);
					const next = modes[(index + 1) % modes.length];
					layout.value?.setModel(next);
					sync(next, args.articleMode);
				},
			);
			if (args.articleMode !== articleMode.value) {
				updateLayoutArgs({ articleMode: articleMode.value });
			}
			return { layout, model: shown, articleMode, args };
		},
		template: `<Layout
			ref="layout"
			:data="args.data"
			:model="model"
			:article-mode="articleMode"
			:image-ratio="args.imageRatio || undefined"
		/>`,
	}),
};
