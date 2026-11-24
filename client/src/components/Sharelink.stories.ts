import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import Sharelink from './Sharelink.vue';
import {
	SHARELINK_AI_IDS,
	SHARELINK_PLATFORM_IDS,
	sharelinkMock,
	type SharelinkUiModel,
} from './sharelinkModel';

type SharelinkStoryArgs = {
	url: string;
	text: string;
	subject: string;
	prompt: string;
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
					'Share bar for the top 20 social platforms plus Ask AI links (ChatGPT, Google AI, Claude, Perplexity, Copilot). Default: top 5 social and top 4 AI. Apps with no web share link (Instagram, TikTok…) copy the link; WeChat shows a QR code. Platforms the icon font lacks (X, TikTok, ChatGPT…) show their label only. Hover or focus fills an item with its brand color (`--color-brand-*`) and lifts it slightly; reduced motion turns the lift off. Icon plus label on large screens, icon only on small.',
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
		prompt: {
			control: 'text',
			description:
				'Prompt for the AI links; the page URL is added after it. Empty: "Summarize this page:".',
			table: { category: 'props', type: { summary: 'string' } },
		},
		platforms: {
			control: 'check',
			options: [...SHARELINK_PLATFORM_IDS, ...SHARELINK_AI_IDS],
			description: 'Platforms to show, in order. Empty: top 5 social and top 4 AI.',
			table: { category: 'props', type: { summary: 'SharelinkPlatformId[]' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class sharelink stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		open: {
			control: 'select',
			options: ['', 'native', ...SHARELINK_PLATFORM_IDS, ...SHARELINK_AI_IDS],
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
		prompt: sharelinkMock.prompt ?? '',
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
				prompt: args.prompt,
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
		await expect(canvas.getByRole('button', { name: 'Copy link for TikTok' })).toBeInTheDocument();
		await expect(
			canvas.getByRole('button', { name: 'Show QR code for WeChat' }),
		).toBeInTheDocument();
		await expect(
			canvas.getByRole('button', { name: 'Ask ChatGPT about this page' }),
		).toBeInTheDocument();
		await expect(canvas.queryByRole('button', { name: 'Share on X' })).toBeNull();
		await expect(canvas.getByRole('button', { name: 'Share on Facebook' })).toHaveClass(
			'sharelink-facebook',
		);
		await expect(canvas.queryByRole('button', { name: 'Ask Copilot about this page' })).toBeNull();
	},
};

export const AllPlatforms: Story = {
	args: { ...Default.args, platforms: [...SHARELINK_PLATFORM_IDS, ...SHARELINK_AI_IDS] },
	render: Default.render,
	play: async ({ canvas }) => {
		await expect(canvas.getByRole('button', { name: 'Share on SMS' })).toBeInTheDocument();
		const x = canvas.getByRole('button', { name: 'Share on X' });
		await expect(x).toHaveClass('sharelink-item', 'sharelink-x', 'text-only');
		await expect(x.querySelector('i')).toBeNull();
		await expect(
			canvas.getByRole('button', { name: 'Ask Copilot about this page' }),
		).toBeInTheDocument();
	},
};
