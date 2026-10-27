import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import DropdownCheckbox from './DropdownCheckbox.vue';
import { checkboxMock, type FormEnumOption } from './formEnumOption';

type DropdownCheckboxStoryArgs = {
	model: string[];
	data: FormEnumOption[];
	label: string;
};

const meta = {
	title: 'Components/DropdownCheckbox',
	component: DropdownCheckbox,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Checkbox list in a dropdown. The button joins selected texts, or shows the label when empty.',
			},
		},
	},
	argTypes: {
		model: {
			control: 'object',
			description: 'Selected option values. Empty array is unselected.',
			table: { category: 'props', type: { summary: 'string[]' } },
		},
		data: {
			control: 'object',
			description: 'Options. value is submitted; text is the label.',
			table: { category: 'props', type: { summary: 'FormEnumOption[]' } },
		},
		label: {
			control: 'text',
			description: 'Button text when nothing is selected.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<DropdownCheckboxStoryArgs>;

export default meta;
type Story = StoryObj<DropdownCheckboxStoryArgs>;

export const Default: Story = {
	args: {
		model: ['Dance'],
		data: checkboxMock,
		label: 'Select Favor',
	},
	render: (args) => ({
		components: { DropdownCheckbox },
		setup() {
			const model = computed({
				get: () => args.model,
				set: (value: string[]) => {
					args.model = value;
				},
			});
			const data = computed(() => args.data);
			const label = computed(() => args.label);
			return { model, data, label };
		},
		template: '<DropdownCheckbox v-model="model" :data="data" :label="label" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const button = canvas.getByRole('button');
		await userEvent.click(button);
		await userEvent.click(canvas.getByText('Sing'));
		await expect(button).toHaveTextContent('Dance');
		await expect(button).toHaveTextContent('Sing');
	},
};
