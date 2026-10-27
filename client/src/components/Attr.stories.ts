import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const colors = ['', 'default', 'gray', 'major', 'minor', 'danger', 'safe', 'tip'];
const active = ['', 'active'];

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

type AttrArgs = {
	color: string;
	active: string;
};

const meta = {
	title: 'CSS/Attr',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `attr` on a short label. Color and `active` come from the shared color mixin.',
					'There is no size class.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `attr` | Single-line chip with padding, a small radius, and an inset border. |',
					'| `default` | Root text, border, and background. |',
					'| `gray` | Lighter root text, border, and background. |',
					'| `major` | Major text and border on a light major background. |',
					'| `minor` | Minor text and border on a light minor background. |',
					'| `danger` | Danger text and border on a light danger background. |',
					'| `safe` | Safe text and border on a light safe background. |',
					'| `tip` | Tip text and border on a light tip background. |',
					'| `active` | Swaps text and background. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
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
	},
	args: {
		color: 'default',
		active: '',
	},
} satisfies Meta<AttrArgs>;

export default meta;
type Story = StoryObj<AttrArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `<span class="attr" :class="[args.color, args.active]">Tag</span>`,
	}),
	play: async ({ canvas, args }) => {
		const tag = canvas.getByText('Tag');
		await expectClassWhenSet(tag, args.color);
		if (args.active) {
			await expectClassWhenSet(tag, args.active);
		} else {
			await expectClassAbsent(tag, 'active');
		}
	},
};
