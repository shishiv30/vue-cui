import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import collapse from './collapse';

const meta = {
	title: 'Directives/Collapse',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Panel selector, for example `#panel`. |',
					'| Argument | `shown` starts the button and panel open. Omit it to start closed. |',
					'| Markup | A trigger element and a panel whose `id` matches the selector. '
						+ 'A click toggles class `shown` on both. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { collapse },
		template: `
<section class="section large">
	<div class="panel fixed fixed-max-xs grid grid-xs-1">
		<h2 class="f3">Collapse</h2>
		<div>
			<button type="button" v-collapse="'#caretPanel1'">
				<span>show content</span>
				<i class="icon-angle-left"></i>
			</button>
			<div id="caretPanel1" class="collapse-panel">
				This is a lightweight UI framework, the goal is to create a UI solution that
				simplifies the memory extension markup. The principle of code writing is to
				achieve as many UI components as possible through html standards so as to
				reduce unnecessary dependencies.
			</div>
		</div>
		<div>
			<div id="caretPanel2" class="collapse-line multiline-2">
				This is a lightweight UI framework, the goal is to create a UI solution that
				simplifies the memory extension markup. The principle of code writing is to
				achieve as many UI components as possible through html standards so as to
				reduce unnecessary dependencies.
			</div>
			<button class="link" type="button" v-collapse="'#caretPanel2'">
				<span>show more</span>
			</button>
		</div>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: /show content/ });
		await userEvent.click(trigger);
		await expect(trigger).toHaveClass('shown');
		await expect(document.querySelector('#caretPanel1')).toHaveClass('shown');
	},
};
