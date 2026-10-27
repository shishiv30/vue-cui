import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import Radio from './Radio.vue';
import { radioMock, type FormEnumOption } from './formEnumOption';

type RadioStoryArgs = {
	model: string;
	data: FormEnumOption[];
	label: string;
};

const meta = {
	title: 'Components/Radio',
	component: Radio,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Single-choice radios. Controls are the v-model string, the option list, and an optional group label.',
			},
		},
	},
	argTypes: {
		model: {
			control: 'text',
			description: 'Selected option value. Empty string is unselected.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		data: {
			control: 'object',
			description: 'Options. value is submitted; text is the label.',
			table: { category: 'props', type: { summary: 'FormEnumOption[]' } },
		},
		label: {
			control: 'text',
			description: 'Optional group heading.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<RadioStoryArgs>;

export default meta;
type Story = StoryObj<RadioStoryArgs>;

export const Default: Story = {
	args: {
		model: 'Male',
		data: radioMock,
		label: 'Select Gender',
	},
	render: (args) => ({
		components: { Radio },
		setup() {
			const model = computed({
				get: () => args.model,
				set: (value: string) => {
					args.model = value;
				},
			});
			const data = computed(() => args.data);
			const label = computed(() => args.label);
			return { model, data, label };
		},
		template: '<Radio v-model="model" :data="data" :label="label" />',
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByText('Female'));
		const female = canvas.getAllByRole('radio', { hidden: true })[1];
		await expect(female).toBeChecked();
	},
};
