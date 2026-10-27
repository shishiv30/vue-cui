import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const colors = ['', 'default', 'gray', 'major', 'minor', 'danger', 'safe', 'tip'];
const active = ['', 'active'];
const inline = ['', 'inline'];
const outline = ['', 'outline'];

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

const flagLabels = {
	'': 'none',
	inline: 'inline',
	outline: 'outline',
};

type PanelArgs = {
	color: string;
	active: string;
	inline: string;
	outline: string;
};

const meta = {
	title: 'CSS/Panel',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `panel` on a block. Color and `active` come from the shared color mixin.',
					'`inline` drops the outer vertical margin. `outline` draws an inset border.',
					'Those two classes can be combined.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `panel` | Padded block. Text and background follow the color variables. |',
					'| `inline` | Removes the outer vertical margin and keeps the padding. |',
					'| `outline` | Inset border using the panel border color. |',
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
		inline: {
			control: { type: 'inline-radio', labels: flagLabels },
			options: inline,
			description: 'Adds `inline`.',
			table: { category: 'props' },
		},
		outline: {
			control: { type: 'inline-radio', labels: flagLabels },
			options: outline,
			description: 'Adds `outline`.',
			table: { category: 'props' },
		},
	},
	args: {
		color: 'default',
		active: '',
		inline: '',
		outline: 'outline',
	},
} satisfies Meta<PanelArgs>;

export default meta;
type Story = StoryObj<PanelArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<div class="panel" :class="[args.color, args.active, args.inline, args.outline]">
	Panel
</div>
		`,
	}),
	play: async ({ canvas, args }) => {
		const panel = canvas.getByText('Panel');
		await expectClassWhenSet(panel, args.color);
		await expectClassWhenSet(panel, args.inline);
		await expectClassWhenSet(panel, args.outline);
		if (args.active) {
			await expectClassWhenSet(panel, args.active);
		} else {
			await expectClassAbsent(panel, 'active');
		}
	},
};
