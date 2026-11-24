import type { Meta, StoryObj } from '@storybook/vue3-vite';
import scrollto from './scrollto';

const meta = {
	title: 'Directives/ScrollTo',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | Target selector (`v-scrollto="\'#welcome\'"`), or `{ target, offsetTop, container }`. Empty: the trigger `href`. |',
					'| Markup | A trigger. A click scrolls the page, or `container`, to the target. Smooth unless reduced motion is on. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		directives: { scrollto },
		template: `
<div>
	<div id="scrollBox" style="height: 200px; overflow: auto">
		<p id="scrollTop">Top</p>
		<div style="height: 600px"></div>
		<button type="button" class="btn default small" v-scrollto="{ target: '#scrollTop', container: '#scrollBox' }">
			Scroll to top
		</button>
	</div>
</div>
		`,
	}),
};
