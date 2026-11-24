import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import dialog from './dialog';

const meta = {
	title: 'Directives/Dialog',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Selector of a `<dialog>`, for example `#htmlDialogDemo`. A click calls `showModal()`. |',
					'| Markup | A trigger and a `dialog.dialog`. `[data-dialog="close"]`, a backdrop click and Esc close it. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { dialog },
		template: `
<div>
	<button type="button" class="btn default small" v-dialog="'#htmlDialogDemo'">Open dialog</button>
	<dialog id="htmlDialogDemo" class="dialog" aria-labelledby="htmlDialogTitle">
		<div class="dialog-body">
			<button type="button" class="dialog-title-close" data-dialog="close" aria-label="Close">
				<i class="icon-close" aria-hidden="true"></i>
			</button>
			<div id="htmlDialogTitle" class="h4">Dialog</div>
			<p>Uses the HTML <code>dialog</code> element. A backdrop click closes it.</p>
		</div>
	</dialog>
</div>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const el = document.querySelector('#htmlDialogDemo') as HTMLDialogElement;
		await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
		await expect(el.open).toBe(true);
		await userEvent.click(el.querySelector('[data-dialog="close"]') as HTMLElement);
		await expect(el.open).toBe(false);
	},
};
