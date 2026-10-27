import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import tab from './tab';

const meta = {
	title: 'Directives/Tab',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Initial tab index. Default `0`. |',
					'| Markup | Put `v-tab` on the bar. Each button has `data-target`. '
						+ 'Each panel has a matching `data-id`. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { tab },
		template: `
<section class="section large">
	<div class="panel fixed fixed-max-xs grid grid-xs-1">
		<h2 class="f3">Tab</h2>
		<div>
			<div v-tab="0">
				<button type="button" class="tab default active" data-target="tab1">
					Tab1
				</button>
				<button type="button" class="tab default" data-target="tab2">Tab2</button>
				<button type="button" class="tab default" data-target="tab3">Tab3</button>
			</div>
			<div class="panel inline default tab-panel">
				<div data-id="tab1">Tab1</div>
				<div data-id="tab2" class="hide">Tab2</div>
				<div data-id="tab3" class="hide">Tab3</div>
			</div>
		</div>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Tab2' }));
		const panel = document.querySelector('[data-id="tab2"]');
		await expect(panel).not.toHaveClass('hide');
	},
};
