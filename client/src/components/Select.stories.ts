import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import Select from './Select.vue';
import { selectMock, type FormEnumOption } from './formEnumOption';

type SelectStoryArgs = {
	model: string;
	data: FormEnumOption[];
	label: string;
};

const meta = {
	title: 'Components/Select',
	component: Select,
	tags: ['autodocs'],
	parameters: {
		a11y: {
			config: {
				rules: [{ id: 'color-contrast', enabled: false }],
			},
		},
		docs: {
			description: {
				component:
					'Native select. Controls are the v-model string, the option list, and an optional field label.',
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
			description: 'Optional field heading.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
	args: {
		model: '',
		data: selectMock,
		label: 'normal textbox select',
	},
	render: (args) => ({
		components: { Select },
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
		template: '<Select v-model="model" :data="data" :label="label" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const select = canvas.getByRole('combobox', { name: 'normal textbox select' });
		await userEvent.selectOptions(select, 'Daily');
		await expect(select).toHaveValue('Daily');
	},
};
