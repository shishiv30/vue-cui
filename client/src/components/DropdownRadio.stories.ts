import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import DropdownRadio from './DropdownRadio.vue';
import { radioMock, type FormEnumOption } from './formEnumOption';

type DropdownRadioStoryArgs = {
	model: string;
	data: FormEnumOption[];
	label: string;
};

const meta = {
	title: 'Components/DropdownRadio',
	component: DropdownRadio,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Radio list in a dropdown. The button shows the selected text, or the label when empty.',
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
			description: 'Button text when nothing is selected.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<DropdownRadioStoryArgs>;

export default meta;
type Story = StoryObj<DropdownRadioStoryArgs>;

export const Default: Story = {
	args: {
		model: '',
		data: radioMock,
		label: 'Select Gender',
	},
	render: (args) => ({
		components: { DropdownRadio },
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
		template: '<DropdownRadio v-model="model" :data="data" :label="label" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const button = canvas.getByRole('button', { name: 'Select Gender' });
		await userEvent.click(button);
		await userEvent.click(canvas.getByText('Female'));
		await expect(button).toHaveTextContent('Female');
	},
};
