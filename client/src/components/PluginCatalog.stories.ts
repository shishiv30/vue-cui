import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, h } from 'vue';
import { pluginCatalog } from './pluginCatalog';

const Catalog = defineComponent({
	name: 'PluginCatalog',
	setup() {
		return () =>
			h(
				'ul',
				{ style: 'padding: 24px; font: 16px/1.6 sans-serif;' },
				pluginCatalog.map((item) =>
					h('li', `${item.name}: ${item.status === 'vue' ? 'Vue component' : 'JS plugin, not in Storybook yet'}`),
				),
			);
	},
});

const meta = {
	title: 'Components/Catalog',
	component: Catalog,
} satisfies Meta<typeof Catalog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};
