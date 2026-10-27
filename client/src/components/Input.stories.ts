import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const sizes = ['', 'normal', 'tiny', 'small', 'large'];
const colors = ['', 'default', 'gray', 'major', 'minor', 'danger', 'safe', 'tip'];
const active = ['', 'active'];
const side = ['', 'left', 'right'];
const status = ['', 'has-success', 'has-error'];

const sizeLabels = {
	'': 'none',
	normal: 'normal',
	tiny: 'tiny',
	small: 'small',
	large: 'large',
};

const colorLabels = {
	'': 'none',
	default: 'default',
	gray: 'gray',
	major: 'major',
	minor: 'minor',
	danger: 'danger',
	safe: 'safe',
	tip: 'tip',
};

const activeLabels = {
	'': 'none',
	active: 'active',
};

const sideLabels = {
	'': 'none',
	left: 'left',
	right: 'right',
};

const statusLabels = {
	'': 'none',
	'has-success': 'has-success',
	'has-error': 'has-error',
};

type InputArgs = {
	size: string;
	color: string;
	active: string;
	side: string;
	status: string;
};

const meta = {
	title: 'CSS/Input',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `input` on a wrapper around a text field.',
					'Size, color, and `active` come from the shared mixins.',
					'`left` and `right` reserve space for an icon.',
					'`has-error` with `data-tooltip` prints that text in the field.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `input` | Block wrapper. The inner field uses the size and color variables. |',
					'| `normal` | Same metrics as a bare `input`. |',
					'| `tiny` | Shortest field and smallest type. |',
					'| `small` | Between tiny and normal. |',
					'| `large` | Taller field and a 2px border weight token. |',
					'| `default` | Root text, border, and background. |',
					'| `gray` | Lighter root text, border, and background. |',
					'| `major` | Major text and border on a light major background. |',
					'| `minor` | Minor text and border on a light minor background. |',
					'| `danger` | Danger text and border on a light danger background. |',
					'| `safe` | Safe text and border on a light safe background. |',
					'| `tip` | Tip text and border on a light tip background. |',
					'| `active` | Swaps text and background. |',
					'| `left` | Pads the field on the left and pins the icon there. |',
					'| `right` | Pads the field on the right and pins the icon there. |',
					'| `has-success` | Uses the current text color. |',
					'| `has-error` | Danger text, background, and border. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
		size: {
			control: { type: 'inline-radio', labels: sizeLabels },
			options: sizes,
			description: 'Field height and type. `normal`, `tiny`, `small`, or `large`.',
			table: { category: 'props' },
		},
		color: {
			control: { type: 'inline-radio', labels: colorLabels },
			options: colors,
			description: 'Palette class. Empty keeps the body color variables.',
			table: { category: 'props' },
		},
		active: {
			control: { type: 'inline-radio', labels: activeLabels },
			options: active,
			description: 'Adds `active`, which swaps text and background.',
			table: { category: 'props' },
		},
		side: {
			control: { type: 'inline-radio', labels: sideLabels },
			options: side,
			description: 'Icon side. `left` or `right`.',
			table: { category: 'props' },
		},
		status: {
			control: { type: 'inline-radio', labels: statusLabels },
			options: status,
			description: '`has-success` or `has-error`. Error also sets `data-tooltip`.',
			table: { category: 'props' },
		},
	},
	args: {
		size: 'normal',
		color: 'default',
		active: '',
		side: '',
		status: '',
	},
} satisfies Meta<InputArgs>;

export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<div
	class="input"
	:class="[args.size, args.color, args.active, args.side, args.status]"
	:data-tooltip="args.status === 'has-error' ? 'Required' : null"
>
	<span v-if="args.side">*</span>
	<input type="text" placeholder="Input">
</div>
		`,
	}),
	play: async ({ canvas, userEvent, args }) => {
		const field = canvas.getByPlaceholderText('Input');
		const root = field.parentElement;
		if (!root) {
			throw new Error('input root missing');
		}
		await expectClassWhenSet(root, args.size);
		await expectClassWhenSet(root, args.color);
		await expectClassWhenSet(root, args.side);
		if (args.active) {
			await expectClassWhenSet(root, args.active);
		} else {
			await expectClassAbsent(root, 'active');
		}
		await userEvent.type(field, 'typed');
		await expect(field).toHaveValue('typed');
		if (args.status === 'has-error') {
			await expect(root).toHaveAttribute('data-tooltip', 'Required');
		} else {
			await expect(root).not.toHaveAttribute('data-tooltip');
		}
	},
};
