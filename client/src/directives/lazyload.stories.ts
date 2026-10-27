import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
	title: 'Directives/Lazyload',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Image URL. The directive stores it in data-src and loads it when the image enters the viewport. |',
					'| Markup | Put `v-lazyload` on an `img`. `v-lazyload="\'https://picsum.photos/800/500\'"` |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		template: `
<article class="article default shadow corner">
	<figure>
		<img v-lazyload="'https://picsum.photos/800/500?random=3'" alt="" />
	</figure>
</article>`,
	}),
};
