import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';

const status = ['', 'disable'];

const statusLabels = {
	'': 'none',
	disable: 'disable',
};

type LinkArgs = {
	status: string;
};

const meta = {
	title: 'CSS/Link',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'Anchors have no underline. Put `link` on an `a` or `button` for the link color.',
					'Hover underlines it. The muted state is the `disable` attribute.',
					'',
					'| Class | What it does |',
					'| --- | --- |',
					'| `a` | No underline or outline. Color is inherited in every link state. |',
					'| `[disable]` | Muted disabled color on an anchor. |',
					'| `link` | Medium weight and the link color. Hover underlines it. |',
				].join('\n'),
			},
		},
	},
	argTypes: {
		status: {
			control: { type: 'inline-radio', labels: statusLabels },
			options: status,
			description: '`disable` sets the attribute on the anchor.',
			table: { category: 'props' },
		},
	},
	args: {
		status: '',
	},
} satisfies Meta<LinkArgs>;

export default meta;
type Story = StoryObj<LinkArgs>;

export const Default: Story = {
	render: (args) => ({
		setup() {
			return { args };
		},
		template: `
<a
	class="link"
	href="#"
	:disable="args.status === 'disable' ? '' : null"
	@click.prevent
>Link</a>
		`,
	}),
	play: async ({ canvas, args }) => {
		const link = canvas.getByRole('link', { name: 'Link' });
		if (args.status === 'disable') {
			await expect(link).toHaveAttribute('disable');
		} else {
			await expect(link).not.toHaveAttribute('disable');
		}
	},
};
