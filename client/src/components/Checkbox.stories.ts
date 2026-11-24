import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import Checkbox from './Checkbox.vue';
import { checkboxMock, type FormEnumOption } from './formEnumOption';

type CheckboxStoryArgs = {
	model: string[];
	data: FormEnumOption[];
	label: string;
	groupClass: string;
};

const meta = {
	title: 'Components/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Multi-choice checkboxes. Controls are the v-model string array, the option list, and an optional group label.',
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
			description: 'Optional group heading.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		groupClass: {
			control: 'text',
			description: 'Extra classes on the option group, such as `group-btn default`.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxStoryArgs>;

export const Default: Story = {
	args: {
		model: ['Dance'],
		data: checkboxMock,
		label: 'Select Favor',
		groupClass: '',
	},
	render: (args) => ({
		components: { Checkbox },
		setup() {
			const model = computed({
				get: () => args.model,
				set: (value: string[]) => {
					args.model = value;
				},
			});
			const data = computed(() => args.data);
			const label = computed(() => args.label);
			const groupClass = computed(() => args.groupClass);
			return { model, data, label, groupClass };
		},
		template: '<Checkbox v-model="model" :data="data" :label="label" :group-class="groupClass" />',
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByText('Sing'));
		const sing = canvas.getAllByRole('checkbox', { hidden: true })[1];
		await expect(sing).toBeChecked();
	},
};

export const GroupButton: Story = {
	args: {
		model: ['Dance'],
		data: checkboxMock,
		label: 'Select Favor',
		groupClass: 'group-btn default',
	},
	render: Default.render,
	play: Default.play,
};
