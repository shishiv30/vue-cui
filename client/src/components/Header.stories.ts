import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import Header from './Header.vue';
import {
	headerMock,
	type HeaderMenuItem,
	type HeaderSearch,
	type HeaderUiModel,
} from './headerModel';

type HeaderStoryArgs = {
	name: string;
	sticky: 'true' | 'false';
	className: string;
	search?: HeaderSearch;
	menu: HeaderMenuItem[];
	model?: HeaderUiModel;
};

const meta = {
	title: 'Components/Header',
	component: Header,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Site header. Each Controls row is one field of the model. Omit search and the search field is not rendered.',
			},
		},
	},
	argTypes: {
		model: {
			control: false,
			table: { disable: true },
		},
		name: {
			control: 'text',
			description: 'Component name from the data builder.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		sticky: {
			control: 'inline-radio',
			options: ['true', 'false'],
			description: "When 'true', the root gets the sticky class.",
			table: { category: 'props', type: { summary: "'true' | 'false'" } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class header stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		search: {
			control: 'object',
			description: 'Search field config. Omit it and the search input is not rendered.',
			table: { category: 'props', type: { summary: 'HeaderSearch' } },
		},
		menu: {
			control: 'object',
			description: 'Nav items. A children list renders a submenu.',
			table: { category: 'props', type: { summary: 'HeaderMenuItem[]' } },
		},
	},
} satisfies Meta<HeaderStoryArgs>;

export default meta;
type Story = StoryObj<HeaderStoryArgs>;

export const Default: Story = {
	args: {
		name: headerMock.name,
		sticky: headerMock.sticky,
		className: headerMock.className,
		search: headerMock.search,
		menu: headerMock.menu,
	},
	render: (args) => ({
		components: { Header },
		setup() {
			const model = computed<HeaderUiModel>(() => ({
				name: args.name,
				sticky: args.sticky,
				className: args.className,
				menu: args.menu,
				...(args.search ? { search: args.search } : {}),
			}));
			return { model };
		},
		template: '<Header :model="model" />',
	}),
	play: async ({ canvas }) => {
		const expand = canvas.getByRole('button', { name: 'Expand Property' });
		const item = expand.closest('li');
		expand.click();
		await expect(item).toHaveClass('hover');
	},
};
