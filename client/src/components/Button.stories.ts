import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const sizes = ['', 'normal', 'tiny', 'small', 'large'];
const colors = ['', 'default', 'gray', 'major', 'minor', 'danger', 'safe', 'tip'];
const active = ['', 'active'];
const status = ['', 'loading', 'disabled'];

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
	loading: 'loading',
	disabled: 'disabled',
};

type ButtonArgs = {
	size: string;
	color: string;
	active: string;
	status: string;
	isPill: boolean;
};

const meta = {
	title: 'CSS/Button',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `btn` on a `button`. Size, color, and `active` come from the shared mixins.',
					'`loading` is a class. Disabled is the `disabled` attribute.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `btn` | Inline flex control. Height, type, and padding follow the size variables. |',
					'| `normal` | Same metrics as a bare `btn`. |',
					'| `tiny` | Smallest height and type. |',
					'| `small` | Between tiny and normal. |',
					'| `large` | Taller control and a 2px border. |',
					'| `default` | Root text, border, and background. |',
					'| `gray` | Lighter root text, border, and background. |',
					'| `major` | Major text and border on a light major background. |',
					'| `minor` | Minor text and border on a light minor background. |',
					'| `danger` | Danger text and border on a light danger background. |',
					'| `safe` | Safe text and border on a light safe background. |',
					'| `tip` | Tip text and border on a light tip background. |',
					'| `active` | Swaps text and background. |',
					'| `loading` | Cursor is wait. |',
					'| `[disabled]` | Forces the muted root colors. |',
					'| `pill` | Sets `--btn-radius` to half the button size. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
		size: {
			control: { type: 'inline-radio', labels: sizeLabels },
			options: sizes,
			description: 'Height and type. `normal`, `tiny`, `small`, or `large`.',
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
			description: '`loading` adds that class. `disabled` sets the attribute.',
			table: { category: 'props' },
		},
		isPill: {
			control: 'boolean',
			description: 'Adds `pill`, which sets `--btn-radius` to half the button size.',
			table: { category: 'props' },
		},
	},
	args: {
		size: 'normal',
		color: 'default',
		active: '',
		status: '',
		isPill: false,
	},
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<button
	type="button"
	class="btn"
	:class="[
		args.size,
		args.color,
		args.active,
		args.isPill && 'pill',
		args.status === 'loading' && 'loading',
	]"
	:disabled="args.status === 'disabled' ? '' : null"
>Button</button>
		`,
	}),
	play: async ({ canvas, args }) => {
		const button = canvas.getByRole('button', { name: 'Button' });
		await expectClassWhenSet(button, args.size);
		await expectClassWhenSet(button, args.color);
		if (args.active) {
			await expectClassWhenSet(button, args.active);
		} else {
			await expectClassAbsent(button, 'active');
		}
		if (args.status === 'disabled') {
			await expect(button).toHaveAttribute('disabled');
		} else {
			await expect(button).not.toHaveAttribute('disabled');
		}
		if (args.status === 'loading') {
			await expectClassWhenSet(button, 'loading');
		} else {
			await expectClassAbsent(button, 'loading');
		}
		if (args.isPill) {
			await expectClassWhenSet(button, 'pill');
		} else {
			await expectClassAbsent(button, 'pill');
		}
	},
};
