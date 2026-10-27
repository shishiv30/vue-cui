import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import Slider from './Slider.vue';
import { sliderMock, type SliderImageMeta, type SliderUiModel } from './sliderModel';

type SliderExposed = {
	next: () => number;
	prev: () => number;
};

type SliderStoryArgs = {
	images: string[];
	initialIndex: number;
	alt: string;
	className: string;
	showProcess: boolean;
	duration: number;
	throttle: number;
	imagesMeta?: SliderImageMeta[];
	model?: SliderUiModel;
	next: number;
	prev: number;
	change?: (index: number) => void;
	changed?: (index: number) => void;
};

const meta = {
	title: 'Components/Slider',
	component: Slider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Image slider. Each Controls row is one field of the model. The next and prev controls call those methods. The Events table lists change and changed.',
			},
		},
	},
	argTypes: {
		model: {
			control: false,
			table: { disable: true },
		},
		images: {
			control: 'object',
			description: 'Image URLs. Required. An empty list renders nothing.',
			table: { category: 'props', type: { summary: 'string[]' } },
		},
		initialIndex: {
			control: 'number',
			description: 'Index of the first visible frame.',
			table: { category: 'props', type: { summary: 'number' } },
		},
		alt: {
			control: 'text',
			description: 'Accessible name for the images.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class slider stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		showProcess: {
			control: 'boolean',
			description: 'Dot buttons under the frames. Shown when omitted.',
			table: { category: 'props', type: { summary: 'boolean' } },
		},
		duration: {
			control: 'number',
			description: 'Snap animation length in seconds.',
			table: { category: 'props', type: { summary: 'number' } },
		},
		throttle: {
			control: 'number',
			description: 'Drag distance in pixels that changes the frame.',
			table: { category: 'props', type: { summary: 'number' } },
		},
		imagesMeta: {
			control: 'object',
			description: 'Optional caption for each image. Omitted in the default mock.',
			table: { category: 'props', type: { summary: 'SliderImageMeta[]' } },
		},
		next: {
			control: 'number',
			description:
				'Advance to the next image. Emits change then changed and returns the index. Change this control to call next().',
			table: { category: 'exposed', type: { summary: '() => number' } },
		},
		prev: {
			control: 'number',
			description:
				'Return to the previous image. Emits change then changed and returns the index. Change this control to call prev().',
			table: { category: 'exposed', type: { summary: '() => number' } },
		},
		change: {
			description:
				'Fires before the frame updates. The argument is the index being shown.',
			table: { category: 'events', type: { summary: 'index: number' } },
		},
		changed: {
			description:
				'Fires after the frame updates. The argument is the current index.',
			table: { category: 'events', type: { summary: 'index: number' } },
		},
	},
} satisfies Meta<SliderStoryArgs>;

export default meta;
type Story = StoryObj<SliderStoryArgs>;

export const Default: Story = {
	args: {
		images: sliderMock.images,
		initialIndex: sliderMock.initialIndex ?? 0,
		alt: sliderMock.alt ?? '',
		className: sliderMock.className ?? '',
		showProcess: sliderMock.showProcess ?? true,
		duration: sliderMock.duration ?? 0.2,
		throttle: sliderMock.throttle ?? 50,
		next: 0,
		prev: 0,
	},
	render: (args) => ({
		components: { Slider },
		setup() {
			const slider = ref<SliderExposed | null>(null);
			const model = computed<SliderUiModel>(() => ({
				images: args.images,
				initialIndex: args.initialIndex,
				alt: args.alt,
				className: args.className,
				showProcess: args.showProcess,
				duration: args.duration,
				throttle: args.throttle,
				...(args.imagesMeta ? { imagesMeta: args.imagesMeta } : {}),
			}));
			watch(
				() => args.next,
				() => {
					slider.value?.next();
				},
			);
			watch(
				() => args.prev,
				() => {
					slider.value?.prev();
				},
			);
			return { slider, model };
		},
		template: '<Slider ref="slider" :model="model" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const next = canvas.getByRole('button', { name: 'Go to 2' });
		await userEvent.click(next);
		await expect(next).toHaveClass('active');
	},
};
