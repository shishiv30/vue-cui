import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed } from 'vue';
import Textbox from './Textbox.vue';

type TextboxStoryArgs = {
	model: string;
	type: 'input' | 'textarea';
	label: string;
};

const meta = {
	title: 'Components/Textbox',
	component: Textbox,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Floating label field. `type` is `input` or `textarea`. v-model is the field value. Class `focus` is on while the field is focused or filled.',
			},
		},
	},
	argTypes: {
		model: {
			control: 'text',
			description: 'Field value.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		type: {
			control: 'radio',
			options: ['input', 'textarea'],
			description: 'Renders `.input > input` or `.textarea > textarea` inside `.textbox`.',
			table: { category: 'props', type: { summary: "'input' | 'textarea'" } },
		},
		label: {
			control: 'text',
			description: 'Floating label.',
			table: { category: 'props', type: { summary: 'string' } },
		},
	},
} satisfies Meta<TextboxStoryArgs>;

export default meta;
type Story = StoryObj<TextboxStoryArgs>;

export const Default: Story = {
	args: {
		model: '',
		type: 'input',
		label: 'Email',
	},
	render: (args) => ({
		components: { Textbox },
		setup() {
			const model = computed({
				get: () => args.model,
				set: (value: string) => {
					args.model = value;
				},
			});
			const type = computed(() => args.type);
			const label = computed(() => args.label);
			return { model, type, label };
		},
		template: '<Textbox v-model="model" :type="type" :label="label" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const field = canvas.getByRole('textbox', { name: 'Email' });
		await userEvent.type(field, 'ada@example.com');
		await expect(field).toHaveValue('ada@example.com');
	},
};
