import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expectClassWhenSet } from './storyClass';

const columns = ['', '1', '2', '3', '4', '5', '6'];
const horizontal = ['', 'left', 'right', 'center'];
const vertical = ['', 'top', 'middle', 'bottom', 'baseline'];

function columnLabels(prefix: string) {
	return {
		'': 'none',
		'1': `${prefix}-1`,
		'2': `${prefix}-2`,
		'3': `${prefix}-3`,
		'4': `${prefix}-4`,
		'5': `${prefix}-5`,
		'6': `${prefix}-6`,
	};
}

const alignLabels = {
	'': 'none',
	left: 'left',
	right: 'right',
	center: 'center',
	top: 'top',
	middle: 'middle',
	bottom: 'bottom',
	baseline: 'baseline',
};

type GridArgs = {
	xs: string;
	sm: string;
	md: string;
	lg: string;
	alignHorizontal: string;
	alignVertical: string;
};

const meta = {
	title: 'CSS/Grid',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Put `grid` on the parent. Column classes set how many tracks that breakpoint uses, and each wider breakpoint keeps that count until a later class overrides it.',
					'',
					'Widths: xs is under 640px, sm is 640–959px, md is 960–1599px, lg is 1600–2560px, xl is 2561px and up. Resize the window to see a breakpoint class take effect.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `grid` | Display grid. Default tracks are 1 / 2 / 3 / 4 / 5 columns from xs through xl. |',
					'| `grid-xs-1` … `grid-xs-6` | Column count at every width, starting at xs. |',
					'| `grid-sm-1` … `grid-sm-6` | Column count from sm upward. |',
					'| `grid-md-1` … `grid-md-6` | Column count from md upward. |',
					'| `grid-lg-1` … `grid-lg-6` | Column count from lg upward. |',
					'| `grid-xl-1` … `grid-xl-6` | Column count at xl only. |',
					'| `wrap` | Child spans every column at every width. |',
					'| `wrap-xs` | Child spans every column under 640px. |',
					'| `wrap-sm` | Child spans every column from 640–959px. |',
					'| `wrap-md` | Child spans every column from 960–1599px. |',
					'| `wrap-lg` | Child spans every column from 960px upward. |',
					'| `left` / `right` / `center` | Horizontal alignment of each item in its cell. |',
					'| `top` / `middle` / `bottom` / `baseline` | Vertical alignment of each item in its cell. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
		xs: {
			control: { type: 'inline-radio', labels: columnLabels('grid-xs') },
			options: columns,
			description: 'Columns at every width. `grid-xs-1` through `grid-xs-6`. Empty leaves the default.',
			table: { category: 'props' },
		},
		sm: {
			control: { type: 'inline-radio', labels: columnLabels('grid-sm') },
			options: columns,
			description: 'Columns from 640px up. `grid-sm-1` through `grid-sm-6`.',
			table: { category: 'props' },
		},
		md: {
			control: { type: 'inline-radio', labels: columnLabels('grid-md') },
			options: columns,
			description: 'Columns from 960px up. `grid-md-1` through `grid-md-6`.',
			table: { category: 'props' },
		},
		lg: {
			control: { type: 'inline-radio', labels: columnLabels('grid-lg') },
			options: columns,
			description: 'Columns from 1600px up. `grid-lg-1` through `grid-lg-6`.',
			table: { category: 'props' },
		},
		alignHorizontal: {
			control: { type: 'inline-radio', labels: alignLabels },
			options: horizontal,
			description: 'Horizontal alignment. `left`, `right`, or `center`.',
			table: { category: 'props' },
		},
		alignVertical: {
			control: { type: 'inline-radio', labels: alignLabels },
			options: vertical,
			description: 'Vertical alignment. `top`, `middle`, `bottom`, or `baseline`.',
			table: { category: 'props' },
		},
	},
	args: {
		xs: '3',
		sm: '',
		md: '',
		lg: '',
		alignHorizontal: '',
		alignVertical: '',
	},
} satisfies Meta<GridArgs>;

export default meta;
type Story = StoryObj<GridArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<div
	class="grid"
	:class="[
		args.xs && 'grid-xs-' + args.xs,
		args.sm && 'grid-sm-' + args.sm,
		args.md && 'grid-md-' + args.md,
		args.lg && 'grid-lg-' + args.lg,
		args.alignHorizontal,
		args.alignVertical,
	]"
	style="height: 360px; grid-auto-rows: 1fr"
>
	<div v-for="n in 12" :key="n" class="panel outline" style="height: 50px">{{ n }}</div>
</div>
		`,
	}),
	play: async ({ canvas, args }) => {
		const grid = canvas.getByText('1').parentElement;
		if (!grid) {
			throw new Error('grid root missing');
		}
		await expectClassWhenSet(grid, 'grid');
		await expectClassWhenSet(grid, args.xs ? `grid-xs-${args.xs}` : '');
		await expectClassWhenSet(grid, args.sm ? `grid-sm-${args.sm}` : '');
		await expectClassWhenSet(grid, args.md ? `grid-md-${args.md}` : '');
		await expectClassWhenSet(grid, args.lg ? `grid-lg-${args.lg}` : '');
		await expectClassWhenSet(grid, args.alignHorizontal);
		await expectClassWhenSet(grid, args.alignVertical);
	},
};
