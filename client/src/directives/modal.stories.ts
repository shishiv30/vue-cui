import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, waitFor } from 'storybook/test';
import modal from './modal';

const meta = {
	title: 'Directives/Modal',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Template selector, for example `#popupPanel1`. A click copies its HTML into a new `div.modal` under `body`. |',
					'| Argument | Theme: `default`, `fullscreen` or `dropdown` (`v-modal:fullscreen`). Default `default`. |',
					'| Markup | A trigger and a `hidden` template. `[data-modal="close"]`, the overlay and Esc close it. One modal is open at a time. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { modal },
		template: `
<div class="flex">
	<a class="btn default small" href="javascript:;" v-modal="'#popupPanel1'">Modal Default</a>
	<div id="popupPanel1" hidden>
		<div class="grid grid-xs-1 large">
			<div class="h4">Welcome to CUI!</div>
			<div>A modal dialog is a window that forces the user to interact with it.</div>
		</div>
	</div>
	<a class="btn default small" href="javascript:;" v-modal:fullscreen="'#popupPanel0'">Modal Fullscreen</a>
	<div id="popupPanel0" hidden>
		<div data-modal="close">
			<div class="text-white">Welcome to CUI!</div>
		</div>
	</div>
	<a class="btn default small" href="javascript:;" v-modal:dropdown="'#popupPanel'">Modal Dropdown</a>
	<div id="popupPanel" hidden>
		<div class="f3">Hello World!</div>
		<ul>
			<li><a href="javascript:;">Apple</a></li>
			<li><a href="javascript:;">Banana</a></li>
		</ul>
	</div>
</div>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByText('Modal Default'));
		const root = document.querySelector('.modal.modal-default');
		await expect(root).toHaveClass('modal-active');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(document.querySelector('.modal')).toBeNull());
	},
};
