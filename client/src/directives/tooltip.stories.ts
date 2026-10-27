import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import tooltip from './tooltip';

const meta = {
	title: 'Directives/Tooltip',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Tip text. |',
					'| modifier once | Show and hide one time, then stop listening. No default; omit it to keep listening. `v-tooltip.once` |',
					'| modifier trigger | How the tip opens. Default is `hover`. `v-tooltip.hover`, `v-tooltip.click`, `v-tooltip.focus` |',
					'| modifier placement | Which side of the trigger the tip uses. Default is `top`. `v-tooltip.top`, `v-tooltip.bottom`, `v-tooltip.left`, `v-tooltip.right` |',
					'| Markup | Put `v-tooltip` on the trigger. One shared tip node is used for every trigger. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { tooltip },
		template: `
<section class="section" id="tipPanel">
	<div class="fixed fixed-max-xs grid grid-xs-3">
		<h2 class="f3 wrap">Tips</h2>

		<div class="text-left">
			<a href="javascript:;" class="link"
				v-tooltip.bottom="'show on bottom side, not enough space focus left'">bottom left</a>
		</div>
		<div class="text-center">
			<a href="javascript:;" class="link"
				v-tooltip.bottom="'show on bottom side, enough space align center'">bottom center</a>
		</div>
		<div class="text-right">
			<a href="javascript:;" class="link"
				v-tooltip.bottom="'show on bottom side, not enough space focus right'">bottom right</a>
		</div>
		<div class="text-left">
			<a href="javascript:;" class="link"
				v-tooltip.click.right="'show on right side'">right (click)</a>
		</div>
		<div class="text-center">
			<a href="javascript:;" class="link"
				v-tooltip.click.once="'show once then clear'">once</a>
		</div>
		<div class="text-right">
			<a href="javascript:;" class="link"
				v-tooltip.click.left="'show on left side'">left (click)</a>
		</div>
		<div class="text-left">
			<a href="javascript:;" class="link"
				v-tooltip="'show on top side, not enough space focus left'">top left</a>
		</div>
		<div class="text-center">
			<a href="javascript:;" class="link"
				v-tooltip="'show on top side, enough space align center'">top center</a>
		</div>
		<div class="text-right">
			<a href="javascript:;" class="link"
				v-tooltip="'show on top side, not enough space focus right'">top right</a>
		</div>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.hover(canvas.getByRole('link', { name: 'top center' }));
		await expect(document.body).toHaveTextContent(
			'show on top side, enough space align center',
		);
	},
};
