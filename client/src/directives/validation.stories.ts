import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import validation from './validation';

const meta = {
	title: 'Directives/Validation',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Pipe-separated rules: `required`, `email`, `phone`, `zipcode`, `price`. |',
					'| Markup | Put `v-validation` on the `input`, `textarea`, or `select`. '
						+ 'Error and success classes land on the closest `.input`, `.checkbox`, '
						+ '`.radio`, `.textarea`, or `.selectbox`. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { validation },
		template: `
<section class="section large">
	<div class="panel fixed fixed-max-xs grid grid-xs-1">
		<h2 class="f3">Validation</h2>
		<div>
			<label for="txtReq">Name (Required)</label>
			<div class="input">
				<input id="txtReq" name="username" placeholder="name" v-validation="'required'" />
			</div>
		</div>
		<div>
			<label for="txtMail">Mail</label>
			<div class="input">
				<input id="txtMail" name="email" placeholder="email" v-validation="'email'" />
			</div>
		</div>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const name = canvas.getByPlaceholderText('name');
		await userEvent.click(name);
		await userEvent.tab();
		name.dispatchEvent(new Event('change', { bubbles: true }));
		await expect(name.parentElement).toHaveClass('has-error');
	},
};
