import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const sizes = ['', 'normal', 'tiny', 'small', 'large'];
const colors = ['', 'default', 'gray', 'major', 'minor', 'danger', 'safe', 'tip'];
const active = ['', 'active'];
const status = ['', 'disabled'];

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

const statusLabels = {
	'': 'none',
	disabled: 'disabled',
};

type CircleArgs = {
	size: string;
	color: string;
	active: string;
	status: string;
};

const meta = {
	title: 'CSS/Circle',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `circle` on an inline element. It is a square with a round border.',
					'Size, color, and `active` come from the shared mixins.',
					'Disabled is the `disabled` attribute.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `circle` | Centers its content in a circle the size of the current metrics. |',
					'| `normal` | Same metrics as a bare `circle`. |',
					'| `tiny` | Smallest circle and type. |',
					'| `small` | Between tiny and normal. |',
					'| `large` | Larger circle and a 2px border. |',
					'| `default` | Root text, border, and background. |',
					'| `gray` | Lighter root text, border, and background. |',
					'| `major` | Major text and border on a light major background. |',
					'| `minor` | Minor text and border on a light minor background. |',
					'| `danger` | Danger text and border on a light danger background. |',
					'| `safe` | Safe text and border on a light safe background. |',
					'| `tip` | Tip text and border on a light tip background. |',
					'| `active` | Swaps text and background. |',
					'| `[disabled]` | Forces the muted root colors. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
		size: {
			control: { type: 'inline-radio', labels: sizeLabels },
			options: sizes,
			description: 'Diameter and type. `normal`, `tiny`, `small`, or `large`.',
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
		status: {
			control: { type: 'inline-radio', labels: statusLabels },
			options: status,
			description: '`disabled` sets the attribute.',
			table: { category: 'props' },
		},
	},
	args: {
		size: 'normal',
		color: 'default',
		active: '',
		status: '',
	},
} satisfies Meta<CircleArgs>;

export default meta;
type Story = StoryObj<CircleArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<span
	class="circle"
	:class="[args.size, args.color, args.active]"
	:disabled="args.status === 'disabled' ? '' : null"
>1</span>
		`,
	}),
	play: async ({ canvas, args }) => {
		const circle = canvas.getByText('1');
		await expectClassWhenSet(circle, args.size);
		await expectClassWhenSet(circle, args.color);
		if (args.active) {
			await expectClassWhenSet(circle, args.active);
		} else {
			await expectClassAbsent(circle, 'active');
		}
		if (args.status === 'disabled') {
			await expect(circle).toHaveAttribute('disabled');
		} else {
			await expect(circle).not.toHaveAttribute('disabled');
		}
	},
};
