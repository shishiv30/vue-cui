import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const colors = ['', 'default', 'gray', 'major', 'minor', 'danger', 'safe', 'tip'];
const active = ['', 'active'];
const inline = ['', 'inline'];

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

const inlineLabels = {
	'': 'none',
	inline: 'inline',
};

type SectionArgs = {
	color: string;
	active: string;
	inline: string;
};

const meta = {
	title: 'CSS/Section',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `section` on a landmark. Color and `active` come from the shared color mixin.',
					'`inline` paints the background and drops the outer margin.',
					'The other classes are page layouts and are not controls on this demo.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `section` | Block with vertical margin from the section gap. |',
					'| `inline` | No outer margin. Adds padding, text color, and background. |',
					'| `default` | Root text, border, and background. |',
					'| `gray` | Lighter root text, border, and background. |',
					'| `major` | Major text and border on a light major background. |',
					'| `minor` | Minor text and border on a light minor background. |',
					'| `danger` | Danger text and border on a light danger background. |',
					'| `safe` | Safe text and border on a light safe background. |',
					'| `tip` | Tip text and border on a light tip background. |',
					'| `active` | Swaps text and background. |',
					'| `section-hero` | Full-viewport hero with a cover picture and centered content. |',
					'| `section-points` | Centered column of feature rows with a cover image. |',
					'| `section-banner` | Banner picture and content slots. |',
					'| `section-gallery` | Full-viewport slider gallery. |',
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
			control: { type: 'inline-radio', labels: inlineLabels },
			options: inline,
			description: 'Adds `inline`.',
			table: { category: 'props' },
		},
	},
	args: {
		color: 'default',
		active: '',
		inline: 'inline',
	},
} satisfies Meta<SectionArgs>;

export default meta;
type Story = StoryObj<SectionArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<section class="section" :class="[args.color, args.active, args.inline]">
	Section
</section>
		`,
	}),
	play: async ({ canvas, args }) => {
		const section = canvas.getByText('Section');
		await expectClassWhenSet(section, args.color);
		await expectClassWhenSet(section, args.inline);
		if (args.active) {
			await expectClassWhenSet(section, args.active);
		} else {
			await expectClassAbsent(section, 'active');
		}
	},
};
