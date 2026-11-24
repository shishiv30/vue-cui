import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import theme from './theme';

const meta = {
	title: 'Directives/Theme',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Markup | `v-theme` on a trigger. A click switches `theme-light` / `theme-dark` on `html` and `body` and saves it in `localStorage.theme`. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { theme },
		template: '<button type="button" class="btn default small" v-theme>Toggle theme</button>',
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle theme' }));
		const mode = localStorage.getItem('theme');
		await expect(document.body).toHaveClass(`theme-${mode}`);
	},
};
