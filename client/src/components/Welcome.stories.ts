import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, waitFor } from 'storybook/test';
import { computed } from 'vue';
import Welcome from './Welcome.vue';
import {
	welcomeAnimations,
	welcomeMock,
	welcomePositions,
	type WelcomeAnimationMode,
	type WelcomeData,
	type WelcomePanelPosition,
	type WelcomeSrc,
	type WelcomeUiModel,
} from './welcomeModel';

type WelcomeStoryArgs = {
	ratio: string;
	animation: WelcomeAnimationMode;
	positions: WelcomePanelPosition[];
	interval: number;
	data: WelcomeData;
	src: WelcomeSrc;
	alt: string;
	className: string;
	model?: WelcomeUiModel;
};

const meta = {
	title: 'Components/Welcome',
	component: Welcome,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Full-bleed hero that keeps its ratio. A CSS shimmer shows until the image has loaded. Then the image covers the container and the panels animate in. Each Controls row is one field of the model. Replay an animation by changing the animation control.',
			},
		},
	},
	argTypes: {
		model: { control: false, table: { disable: true } },
		ratio: {
			control: 'select',
			options: ['16/9', '4/3', '1/1', '21/9'],
			description: 'Width/height of the container. Defaults to 16/9.',
			table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: '16/9' } },
		},
		animation: {
			control: 'select',
			options: [...welcomeAnimations, 'random'],
			description: 'Entrance of each panel after the image loads. random picks one per panel.',
			table: { category: 'props', type: { summary: "'fadein' | 'flyin' | 'jumpin' | 'rotatein' | 'zoomin' | 'random'" } },
		},
		positions: {
			control: 'check',
			options: welcomePositions,
			description: 'Corners the panels may use: ne, nw, se, sw. With more panels than corners they take turns.',
			table: { category: 'props', type: { summary: "('ne' | 'nw' | 'se' | 'sw')[]" } },
		},
		interval: {
			control: { type: 'number', min: 1, step: 0.5 },
			description: 'Seconds between switches when there are more panels than corners.',
			table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '4' } },
		},
		data: {
			control: 'object',
			description: 'Panels in list, plus the caption title and subTitle.',
			table: { category: 'props', type: { summary: 'WelcomeData' } },
		},
		src: {
			control: 'object',
			description: 'Image per breakpoint: xs (fallback), sm from 640px, md from 960px, lg from 1600px.',
			table: { category: 'props', type: { summary: 'WelcomeSrc' } },
		},
		alt: {
			control: 'text',
			description: 'Alt text. Defaults to data.title.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class welcome stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<WelcomeStoryArgs>;

export default meta;
type Story = StoryObj<WelcomeStoryArgs>;

function render(args: WelcomeStoryArgs) {
	return {
		components: { Welcome },
		setup() {
			const model = computed<WelcomeUiModel>(() => ({
				ratio: args.ratio,
				animation: args.animation,
				positions: args.positions,
				interval: args.interval,
				data: args.data,
				src: args.src,
				alt: args.alt,
				className: args.className,
			}));
			return { model };
		},
		// Keyed on the animation so changing the control replays the entrance.
		template: '<Welcome :key="model.animation + model.ratio" :model="model" />',
	};
}

const baseArgs: WelcomeStoryArgs = {
	ratio: welcomeMock.ratio ?? '16/9',
	animation: 'random',
	positions: welcomePositions,
	interval: 4,
	data: welcomeMock.data,
	src: welcomeMock.src,
	alt: '',
	className: '',
};

export const Default: Story = {
	args: baseArgs,
	render,
	play: async ({ canvasElement }) => {
		const root = canvasElement.querySelector<HTMLElement>('.welcome');
		if (!root) {
			throw new Error('welcome root missing');
		}
		await waitFor(() => expect(root).toHaveClass('welcome-loaded'), { timeout: 5000 });
		await expect(root.querySelectorAll('.welcome-panel')).toHaveLength(welcomeMock.data.list.length);
	},
};

export const Fadein: Story = { args: { ...baseArgs, animation: 'fadein' }, render };
export const Flyin: Story = { args: { ...baseArgs, animation: 'flyin' }, render };
export const Jumpin: Story = { args: { ...baseArgs, animation: 'jumpin' }, render };
export const Rotatein: Story = { args: { ...baseArgs, animation: 'rotatein' }, render };
export const Zoomin: Story = { args: { ...baseArgs, animation: 'zoomin' }, render };

export const Ratio4x3: Story = {
	args: { ...baseArgs, ratio: '4/3', animation: 'jumpin' },
	render,
};

/** An unreachable image keeps the shimmer placeholder and no panels animate. */
export const Loading: Story = {
	args: {
		...baseArgs,
		src: { xs: 'http://127.0.0.1:1/never.jpg' },
	},
	render,
};

const extraPanels = [
	{ sup: 'Walk score', title: '92', sub: 'Very walkable', icon: 'icon-home', iconStyle: 'safe' },
	{ sup: 'Days on market', title: '12 days', label: '-3', labelStyle: 'danger' },
	{ sup: 'Price per sqft', title: '$412', sub: 'Above area average' },
	{ sup: 'Schools nearby', title: '4 rated 8+', icon: 'icon-star', iconStyle: 'major' },
];

/** More panels than corners: the oldest leaves and the next one enters its corner, in a loop. */
export const Rotating: Story = {
	args: {
		...baseArgs,
		interval: 3,
		positions: ['nw', 'se'],
		data: { ...welcomeMock.data, list: [...welcomeMock.data.list, ...extraPanels] },
	},
	render,
};

export const TwoCorners: Story = {
	args: { ...baseArgs, positions: ['ne', 'sw'] },
	render,
};
