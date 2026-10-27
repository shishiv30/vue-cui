import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expectClassAbsent, expectClassWhenSet } from './storyClass';

const forceVertical = ['', 'vertical-xs', 'vertical-sm', 'vertical-md', 'vertical-lg'];
const horizontal = ['', 'left', 'right', 'center', 'space-around', 'space-between'];
const vertical = ['', 'top', 'middle', 'bottom', 'baseline'];

type FlexArgs = {
	forceVertical: string;
	alignHorizontal: string;
	alignVertical: string;
};

const meta = {
	title: 'CSS/Flex',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `flex` on the parent. Children sit in a row. A `vertical-*` class stacks them at that breakpoint only.',
					'',
					'Widths: xs is under 640px, sm is 640–959px, md is 960–1599px, lg is 1600px and up. Resize the window to see a force-vertical class take effect. Several `vertical-*` classes can be combined on one element.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `flex` | Row, items packed to the start, aligned to the baseline. |',
					'| `vertical` | Column at every width. Direct `div` children become full width. |',
					'| `vertical-xs` | Column under 640px. |',
					'| `vertical-sm` | Column from 640–959px. |',
					'| `vertical-md` | Column from 960–1599px. |',
					'| `vertical-lg` | Column from 1600px up. |',
					'| `wrap` | Items wrap onto extra lines. |',
					'| `nowrap` | Children stay on one line. The last child ellipsizes. |',
					'| `noshrink` / `singleline` | That child does not shrink. |',
					'| `left` / `right` / `center` | Main-axis alignment. |',
					'| `space-around` / `space-between` | Main-axis spacing. |',
					'| `top` / `middle` / `bottom` / `baseline` | Cross-axis alignment. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
		forceVertical: {
			control: {
				type: 'inline-radio',
				labels: {
					'': 'none',
					'vertical-xs': 'vertical-xs',
					'vertical-sm': 'vertical-sm',
					'vertical-md': 'vertical-md',
					'vertical-lg': 'vertical-lg',
				},
			},
			options: forceVertical,
			description:
				'Stack at one breakpoint. `vertical-xs`, `vertical-sm`, `vertical-md`, or `vertical-lg`.',
			table: { category: 'props' },
		},
		alignHorizontal: {
			control: {
				type: 'inline-radio',
				labels: {
					'': 'none',
					left: 'left',
					right: 'right',
					center: 'center',
					'space-around': 'space-around',
					'space-between': 'space-between',
				},
			},
			options: horizontal,
			description:
				'Main-axis alignment. `left`, `right`, `center`, `space-around`, or `space-between`.',
			table: { category: 'props' },
		},
		alignVertical: {
			control: {
				type: 'inline-radio',
				labels: {
					'': 'none',
					top: 'top',
					middle: 'middle',
					bottom: 'bottom',
					baseline: 'baseline',
				},
			},
			options: vertical,
			description: 'Cross-axis alignment. `top`, `middle`, `bottom`, or `baseline`.',
			table: { category: 'props' },
		},
	},
	args: {
		forceVertical: '',
		alignHorizontal: '',
		alignVertical: '',
	},
} satisfies Meta<FlexArgs>;

export default meta;
type Story = StoryObj<FlexArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<div
	class="flex"
	:class="[args.forceVertical, args.alignHorizontal, args.alignVertical]"
	style="height: 360px"
>
	<div v-for="n in 12" :key="n" class="panel outline" style="height: 50px">{{ n }}</div>
</div>
		`,
	}),
	play: async ({ canvas, args }) => {
		const flex = canvas.getByText('1').parentElement;
		if (!flex) {
			throw new Error('flex root missing');
		}
		await expectClassWhenSet(flex, 'flex');
		await expectClassWhenSet(flex, args.forceVertical);
		await expectClassWhenSet(flex, args.alignHorizontal);
		await expectClassWhenSet(flex, args.alignVertical);
		if (!args.alignVertical) {
			await expectClassAbsent(flex, 'middle');
		}
	},
};
