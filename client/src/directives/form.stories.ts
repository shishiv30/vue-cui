import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import form from './form';
import validation from './validation';

const meta = {
	title: 'Directives/Form',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Submit function. It runs only after every `v-validation` field passes. |',
					'| Markup | Put `v-form` on the `form`. Put `v-validation` on each control to check. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { form, validation },
		methods: {
			submit(payload: Record<string, unknown>) {
				alert(JSON.stringify(payload));
			},
		},
		template: `
<section class="section large">
	<form class="panel form fixed fixed-max-xs grid grid-xs-1 grid-sm-2 bottom" v-form="submit">
		<h2 class="f3 wrap">Forms</h2>
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
		<div>
			<label for="txtPhone">Phone (Required)</label>
			<div class="input">
				<input id="txtPhone" name="phone" placeholder="phone" value="1234567890"
					v-validation="'required|phone'" />
			</div>
		</div>
		<div>
			<label for="ddlFequence">Fequence (Required)</label>
			<div class="input">
				<select id="ddlFequence" name="fequence" v-validation="'required'">
					<option value="" selected disabled>select a fequence</option>
					<option value="Weekly">Weekly</option>
					<option value="Daily">Daily</option>
					<option value="Monthly">Monthly</option>
				</select>
			</div>
		</div>
		<div class="wrap">
			<label for="txtNote">Note (Required)</label>
			<div class="textarea">
				<textarea id="txtNote" name="note" placeholder="note" v-validation="'required'"></textarea>
			</div>
		</div>
		
		<div>
			<label>Select Gender</label>
			<div class="radio">
				<label for="chMale">
					<input id="chMale" name="gender" type="radio" checked value="Male" />
					<span>Male</span>
				</label>
				<label for="chkFemal">
					<input id="chkFemal" name="gender" type="radio" value="Female" />
					<span>Female</span>
				</label>
			</div>
		</div>
		<div>
			<label>Select Favor</label>
			<div class="checkbox">
				<label for="rbtnFavor1">
					<input id="rbtnFavor1" name="favor" checked type="checkbox" value="Dance" />
					<span>Dance</span>
				</label>
				<label for="rbtnFavor2">
					<input id="rbtnFavor2" name="favor" type="checkbox" value="Sing" />
					<span>Sing</span>
				</label>
			</div>
		</div>
		<div class="checkbox single">
			<label for="confirm">
				<input id="confirm" name="confirm" type="checkbox" v-validation="'required'" />
				<span>Confirm to submit</span>
			</label>
		</div>
		<div class="wrap text-center">
			<button type="submit" class="btn default">Submit</button>
		</div>
	</form>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const messages: string[] = [];
		const original = window.alert;
		window.alert = (message?: unknown) => {
			messages.push(String(message));
		};
		await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
		await expect(messages).toHaveLength(0);
		await userEvent.type(canvas.getByPlaceholderText('name'), 'Ada');
		await userEvent.type(canvas.getByPlaceholderText('note'), 'Hello');
		await userEvent.selectOptions(canvas.getByLabelText('Fequence (Required)'), 'Weekly');
		await userEvent.click(canvas.getByLabelText('Confirm to submit'));
		await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
		window.alert = original;
		await expect(messages).toHaveLength(1);
		const payload = JSON.parse(messages[0]);
		await expect(payload.username).toBe('Ada');
		await expect(payload.note).toBe('Hello');
		await expect(payload.fequence).toBe('Weekly');
		await expect(payload.gender).toBe('Male');
		await expect(payload.favor).toEqual(['Dance']);
		await expect(payload.confirm).toBe('on');
	},
};
