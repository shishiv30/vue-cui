import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed } from 'vue';
import Article from './Article.vue';
import {
	articleMock,
	type ArticleAttr,
	type ArticleTag,
	type ArticleUiModel,
} from './articleModel';

type ArticleStoryArgs = {
	title: string;
	href: string;
	path: string;
	id: string;
	img: string;
	fallbackImg: string;
	imgAlt: string;
	imgTag: string;
	attrs: ArticleAttr[];
	tags: ArticleTag[];
	className: string;
	model?: ArticleUiModel;
};

const meta = {
	title: 'Components/Article',
	component: Article,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Listing card. Each Controls row is one field of the model. The canvas is one article, centered in a frame with a 360px max width.',
			},
		},
	},
	argTypes: {
		model: {
			control: false,
			table: { disable: true },
		},
		title: {
			control: 'text',
			description: 'Address line shown in the card link.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		href: {
			control: 'text',
			description: 'Link href. When set, path is not used.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		path: {
			control: 'text',
			description: 'Link path used when href is empty.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'Appended to the link as ?id= when set.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		img: {
			control: 'text',
			description: 'Photo URL. Empty or failed to load uses fallbackImg.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		fallbackImg: {
			control: 'text',
			description: 'Image shown when img is empty or fails to load. Defaults to empty.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		imgAlt: {
			control: 'text',
			description: 'Image alt text.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		imgTag: {
			control: 'text',
			description: 'Caption over the photo.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		attrs: {
			control: 'object',
			description: 'Fact rows. Each item has key, value, desc, and className.',
			table: { category: 'props', type: { summary: 'ArticleAttr[]' } },
		},
		tags: {
			control: 'object',
			description: 'Status chips. Each item has text and className.',
			table: { category: 'props', type: { summary: 'ArticleTag[]' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the card. The article classes stay on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<ArticleStoryArgs>;

export default meta;
type Story = StoryObj<ArticleStoryArgs>;

export const Default: Story = {
	args: {
		title: articleMock.title,
		href: articleMock.href ?? '',
		path: articleMock.path ?? '',
		id: articleMock.id ?? '',
		img: articleMock.img ?? '',
		fallbackImg: articleMock.fallbackImg ?? '',
		imgAlt: articleMock.imgAlt ?? '',
		imgTag: articleMock.imgTag ?? '',
		attrs: articleMock.attrs ?? [],
		tags: articleMock.tags ?? [],
		className: articleMock.className ?? '',
	},
	render: (args) => ({
		components: { Article },
		setup() {
			const model = computed<ArticleUiModel>(() => ({
				title: args.title,
				href: args.href || undefined,
				path: args.path || undefined,
				id: args.id || undefined,
				img: args.img,
				fallbackImg: args.fallbackImg || undefined,
				imgAlt: args.imgAlt,
				imgTag: args.imgTag,
				attrs: args.attrs,
				tags: args.tags,
				className: args.className,
			}));
			return { model };
		},
		template: `<div class="article-frame">
			<Article :model="model" />
		</div>`,
	}),
};
