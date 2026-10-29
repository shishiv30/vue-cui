import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { computed } from 'vue';
import List from './List.vue';
import { listMock, type ListItem, type ListSize, type ListUiModel } from './listModel';
import { expectClassWhenSet } from './storyClass';

const sizes = ['', 'normal', 'tiny', 'small', 'large'];

const sizeLabels = {
	'': 'none',
	normal: 'normal',
	tiny: 'tiny',
	small: 'small',
	large: 'large',
};

type ListStoryArgs = {
	items: ListItem[];
	size: ListSize | '';
	className: string;
	model?: ListUiModel;
	click?: (item: ListItem, index: number) => void;
};

const meta = {
	title: 'Components/List',
	component: List,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Clickable rows of icon, title, and description. Size uses `comp-size`. Theme is a palette class on the icon well. Click emits the row and its index.',
			},
		},
	},
	argTypes: {
		model: {
			control: false,
			table: { disable: true },
		},
		items: {
			control: 'object',
			description: 'Rows. Each has icon, title, desc, and optional theme.',
			table: { category: 'props', type: { summary: 'ListItem[]' } },
		},
		size: {
			control: { type: 'inline-radio', labels: sizeLabels },
			options: sizes,
			description: 'Height and type from `comp-size`: `normal`, `tiny`, `small`, or `large`.',
			table: { category: 'props', type: { summary: "ListSize | ''" } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root `ul`.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		click: {
			description: 'Fires when a row is clicked. Arguments are the item and its index.',
			table: { category: 'events', type: { summary: 'item: ListItem, index: number' } },
		},
	},
	args: {
		items: listMock.items,
		size: 'normal',
		className: '',
		click: fn(),
	},
} satisfies Meta<ListStoryArgs>;

export default meta;
type Story = StoryObj<ListStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		components: { List },
		setup() {
			const model = computed<ListUiModel>(() => ({
				items: args.items,
				size: args.size,
				className: args.className,
			}));
			return { args, model };
		},
		template: `<List :model="model" @click="args.click" />`,
	}),
	play: async ({ canvas, args }) => {
		const list = canvas.getByRole('list');
		await expectClassWhenSet(list, args.size);
		const first = canvas.getByRole('button', { name: /home/i });
		await userEvent.click(first);
		await expect(args.click).toHaveBeenCalled();
	},
};

/** Free random photo from picsum.photos, 80x80; `random` varies the picture. */
const thumb = (random: number) => `https://picsum.photos/80/80?random=${random}`;

const imageItems: ListItem[] = [
	{
		image: thumb(1),
		imageAlt: 'House',
		title: 'Access up to $327k of your home equity',
		desc: 'My Home',
		sup: 'Get started now',
	},
	{
		image: thumb(2),
		imageAlt: 'Map',
		title: 'Explore schools, commute and local activity',
		desc: 'Neighborhood',
		sup: 'See now',
	},
	{
		image: thumb(3),
		imageAlt: 'Agent',
		title: 'Talk with a local expert about your next move',
		desc: 'Your Agent',
		sup: 'Connect now',
	},
];

export const WithImage: Story = {
	args: { items: imageItems },
	render: Default.render,
	play: async ({ canvas }) => {
		await expect(canvas.getByAltText('House')).toBeInTheDocument();
		await expect(canvas.getByText('Get started now')).toBeInTheDocument();
	},
};

export const WithSubAndSup: Story = {
	args: {
		items: imageItems.map((item, index) => ({
			...item,
			sub: ['Equity', 'Explore', 'Support'][index],
		})),
	},
	render: Default.render,
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Equity')).toBeInTheDocument();
		await expect(canvas.getByText('See now')).toBeInTheDocument();
	},
};

export const IconWithSup: Story = {
	args: {
		items: [
			{ icon: 'icon-folder-o', theme: 'major', title: 'Documents', desc: 'Contracts and disclosures', sup: 'Open folder' },
			{ icon: 'icon-user', sub: 'Account', title: 'Profile', desc: 'Update your details', sup: 'Edit profile' },
		],
	},
	render: Default.render,
};
