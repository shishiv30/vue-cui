import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import Sharelink from './Sharelink.vue';
import { SHARELINK_PLATFORM_IDS, sharelinkMock, type SharelinkUiModel } from './sharelinkModel';

type SharelinkStoryArgs = {
	url: string;
	text: string;
	subject: string;
	platforms: NonNullable<SharelinkUiModel['platforms']>;
	className: string;
	model?: SharelinkUiModel;
	open: string;
};

const meta = {
	title: 'Components/Sharelink',
	component: Sharelink,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Share bar for 20 platforms, top 10 by default: icon plus label on large screens, icon only on small. Adds a native Share item when the browser has the Web Share API. Each Controls row is one field of the model.',
			},
		},
	},
	argTypes: {
		model: { control: false, table: { disable: true } },
		url: {
			control: 'text',
			description: 'Page to share. Empty: the current location, read on click.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		text: {
			control: 'text',
			description: 'Share text for X, Threads, Bluesky, Telegram, WhatsApp, SMS and others.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		subject: {
			control: 'text',
			description: 'Email subject and native share title.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		platforms: {
			control: 'check',
			options: SHARELINK_PLATFORM_IDS,
			description: 'Platforms to show, in order. Empty: the top 10.',
			table: { category: 'props', type: { summary: 'SharelinkPlatformId[]' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class sharelink stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		open: {
			control: 'select',
			options: ['', 'native', ...SHARELINK_PLATFORM_IDS],
			description: 'Pick a platform to call open(id).',
			table: { category: 'exposed', type: { summary: '(id: string) => void' } },
		},
	},
} satisfies Meta<SharelinkStoryArgs>;

export default meta;
type Story = StoryObj<SharelinkStoryArgs>;

export const Default: Story = {
	args: {
		url: sharelinkMock.url ?? '',
		text: sharelinkMock.text ?? '',
		subject: sharelinkMock.subject ?? '',
		platforms: sharelinkMock.platforms ?? [],
		className: sharelinkMock.className ?? '',
		open: '',
	},
	render: (args) => ({
		components: { Sharelink },
		setup() {
			const sharelink = ref<{ open: (id: string) => void } | null>(null);
			const model = computed<SharelinkUiModel>(() => ({
				url: args.url,
				text: args.text,
				subject: args.subject,
				platforms: args.platforms,
				className: args.className,
			}));
			watch(
				() => args.open,
				(id) => {
					if (id) {
						sharelink.value?.open(id);
					}
				},
			);
			return { sharelink, model };
		},
		template: '<Sharelink ref="sharelink" :model="model" />',
	}),
	play: async ({ canvas }) => {
		await expect(canvas.getByRole('button', { name: 'Share on Facebook' })).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: 'Share on X' })).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: 'Share on Email' })).toBeInTheDocument();
		await expect(canvas.queryByRole('button', { name: 'Share on SMS' })).toBeNull();
	},
};

export const AllPlatforms: Story = {
	args: { ...Default.args, platforms: [...SHARELINK_PLATFORM_IDS] },
	render: Default.render,
	play: async ({ canvas }) => {
		await expect(canvas.getByRole('button', { name: 'Share on Hacker News' })).toBeInTheDocument();
	},
};
