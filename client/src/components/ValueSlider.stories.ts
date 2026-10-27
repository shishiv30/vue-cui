import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import type { FormEnumOption } from './formEnumOption';
import { rangeSliderMock } from './formEnumOption';
import { scaleStops, type SliderFormat } from './sliderScale';
import ValueSlider from './ValueSlider.vue';

type ValueSliderExposed = {
	get: () => string;
};

type ValueSliderStoryArgs = {
	model: number | string;
	data?: FormEnumOption[];
	min?: number;
	max?: number;
	step?: number;
	format: SliderFormat;
	get: number;
	change?: (value: string) => void;
	changed?: (value: string) => void;
};

const numberStops: FormEnumOption[] = [
	{ value: '0', text: '0' },
	{ value: '25', text: '25' },
	{ value: '50', text: '50' },
	{ value: '75', text: '75' },
	{ value: '100', text: '100' },
];

const sqftStops: FormEnumOption[] = [
	{ value: '500', text: '500' },
	{ value: '1000', text: '1000' },
	{ value: '1500', text: '1500' },
	{ value: '2000', text: '2000' },
	{ value: '3000', text: '3000' },
	{ value: '5000', text: '5000' },
];

const meta = {
	title: 'Components/ValueSlider',
	component: ValueSlider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Single-thumb slider. format is number (default), price, or sqft. Pass data, or min, max, and step to build stops such as 0, 5, 10 … 100.',
			},
		},
	},
	argTypes: {
		model: {
			control: 'text',
			description: 'Selected stop value.',
			table: { category: 'props', type: { summary: 'number | string' } },
		},
		data: {
			control: 'object',
			description: 'Stops. Changing min, max, or step replaces this list.',
			table: { category: 'props', type: { summary: 'FormEnumOption[]' } },
		},
		min: {
			control: 'number',
			description: 'First generated stop when data is omitted.',
			table: { category: 'props', type: { summary: 'number | string' } },
		},
		max: {
			control: 'number',
			description: 'Last generated stop when data is omitted.',
			table: { category: 'props', type: { summary: 'number | string' } },
		},
		step: {
			control: 'number',
			description: 'Distance between generated stops.',
			table: { category: 'props', type: { summary: 'number | string' } },
		},
		format: {
			control: 'inline-radio',
			options: ['number', 'price', 'sqft'],
			description: 'number is the default. price uses k/m. sqft uses sqft or acres.',
			table: { category: 'props', type: { summary: "'number' | 'price' | 'sqft'" } },
		},
		get: {
			control: 'number',
			description: 'Return the current stop. Change this control to call get().',
			table: { category: 'exposed', type: { summary: '() => string' } },
		},
		change: {
			description: 'Fires while the thumb moves. The argument is the stop value.',
			table: { category: 'events', type: { summary: 'string' } },
		},
		changed: {
			description: 'Fires on pointer release. The argument is the stop value.',
			table: { category: 'events', type: { summary: 'string' } },
		},
	},
} satisfies Meta<ValueSliderStoryArgs>;

export default meta;
type Story = StoryObj<ValueSliderStoryArgs>;

function renderStops(args: ValueSliderStoryArgs) {
	const valueSlider = ref<ValueSliderExposed | null>(null);
	const model = computed({
		get: () => args.model,
		set: (value: number | string) => {
			args.model = value;
		},
	});
	const data = computed(() => args.data);
	const min = computed(() => args.min);
	const max = computed(() => args.max);
	const step = computed(() => args.step);
	const format = computed(() => args.format);
	const opened = { min: args.min, max: args.max, step: args.step };
	watch(
		() => [args.min, args.max, args.step] as const,
		([nextMin, nextMax, nextStep]) => {
			if (
				nextMin === opened.min
				&& nextMax === opened.max
				&& nextStep === opened.step
			) {
				return;
			}
			opened.min = nextMin;
			opened.max = nextMax;
			opened.step = nextStep;
			if (
				!Number.isFinite(nextMin)
				|| !Number.isFinite(nextMax)
				|| !Number.isFinite(nextStep)
			) {
				return;
			}
			args.data = scaleStops(nextMin, nextMax, nextStep);
		},
	);
	watch(
		() => args.get,
		() => {
			valueSlider.value?.get();
		},
	);
	return { valueSlider, model, data, min, max, step, format };
}

export const Default: Story = {
	name: 'Number',
	args: {
		model: '50',
		data: numberStops,
		min: undefined,
		max: undefined,
		step: undefined,
		format: 'number',
		get: 0,
	},
	render: (args) => ({
		components: { ValueSlider },
		setup() {
			return renderStops(args);
		},
		template:
			'<ValueSlider ref="valueSlider" v-model="model" :data="data" :min="min" :max="max" :step="step" :format="format" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const output = canvas.getByRole('status');
		const before = output.textContent ?? '';
		const track = canvas.getByRole('button', { name: 'value' }).parentElement;
		if (!track) {
			throw new Error('value slider track missing');
		}
		await userEvent.pointer({
			keys: '[MouseLeft]',
			target: track,
			coords: { x: track.clientWidth - 2, y: 4 },
		});
		await expect(output.textContent ?? '').not.toBe(before);
	},
};

export const Price: Story = {
	args: {
		model: '500000',
		data: rangeSliderMock,
		min: undefined,
		max: undefined,
		step: undefined,
		format: 'price',
		get: 0,
	},
	render: Default.render,
};

export const Sqft: Story = {
	args: {
		model: '1500',
		data: sqftStops,
		min: undefined,
		max: undefined,
		step: undefined,
		format: 'sqft',
		get: 0,
	},
	render: Default.render,
};

export const Steps: Story = {
	args: {
		model: 5,
		min: 0,
		max: 100,
		step: 5,
		format: 'number',
		get: 0,
	},
	render: Default.render,
};
