import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import Shifter from './Shifter.vue';
import { shifterMock, type ShifterUiModel } from './shifterModel';

type ShifterExposed = {
	next: () => void;
	prev: () => void;
};

type ShifterStoryArgs = {
	items: string[];
	step: number;
	className: string;
	model?: ShifterUiModel;
	next: number;
	prev: number;
};

const meta = {
	title: 'Components/Shifter',
	component: Shifter,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Horizontal scroller with prev/next arrows. Each Controls row is one field of the model. The next and prev controls call those methods.',
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
			description: 'Scroller children. An empty list renders nothing.',
			table: { category: 'props', type: { summary: 'string[]' } },
		},
		step: {
			control: 'number',
			description:
				'How far next/prev move. Greater than 0: that many cards. Otherwise the visible width.',
			table: { category: 'props', type: { summary: 'number' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class shifter stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		next: {
			control: 'number',
			description:
				'Scroll forward by step. Change this control to call next().',
			table: { category: 'exposed', type: { summary: '() => void' } },
		},
		prev: {
			control: 'number',
			description:
				'Scroll backward by step. Change this control to call prev().',
			table: { category: 'exposed', type: { summary: '() => void' } },
		},
	},
} satisfies Meta<ShifterStoryArgs>;

export default meta;
type Story = StoryObj<ShifterStoryArgs>;

export const Default: Story = {
	args: {
		items: shifterMock.items,
		step: shifterMock.step ?? 1,
		className: shifterMock.className ?? '',
		next: 0,
		prev: 0,
	},
	render: (args) => ({
		components: { Shifter },
		setup() {
			const shifter = ref<ShifterExposed | null>(null);
			const model = computed<ShifterUiModel>(() => ({
				items: args.items,
				step: args.step,
				className: args.className,
			}));
			watch(
				() => args.next,
				() => {
					shifter.value?.next();
				},
			);
			watch(
				() => args.prev,
				() => {
					shifter.value?.prev();
				},
			);
			return { shifter, model };
		},
		template: '<Shifter ref="shifter" :model="model" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const scroller = canvas.getByText('Item 1').parentElement;
		if (!scroller) {
			throw new Error('shifter scroller missing');
		}
		const before = scroller.scrollLeft;
		scroller.style.scrollBehavior = 'auto';
		await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
		await expect(scroller.scrollLeft).toBeGreaterThan(before);
	},
};
