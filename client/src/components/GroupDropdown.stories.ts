import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import GroupDropdown from './GroupDropdown.vue';
import {
	groupdropdownMock,
	groupdropdownMockValue,
	type GroupDropdownField,
	type GroupDropdownValue,
} from './groupdropdownModel';

type GroupDropdownExposed = {
	open: (id: string) => void;
	close: () => void;
};

type GroupDropdownStoryArgs = {
	model: GroupDropdownValue;
	data: GroupDropdownField[];
	open: number;
	close: number;
	input?: (value: GroupDropdownValue) => void;
	change?: (value: GroupDropdownValue) => void;
	openEvent?: (id: string) => void;
	closeEvent?: () => void;
};

const meta = {
	title: 'Components/GroupDropdown',
	component: GroupDropdown,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Listing filter. `v-model` is the value object and `data` is the field list. open and close call those methods. Events are input, change, open, and close.',
			},
		},
	},
	argTypes: {
		model: {
			control: 'object',
			description:
				'Values keyed by field id. Range is [min, max]. single is a string. multi and tags are string arrays.',
			table: { category: 'props', type: { summary: 'GroupDropdownValue' } },
		},
		data: {
			control: 'object',
			description: 'Panels. The default is the listing filter (price, bed, bath, type, status, tags).',
			table: { category: 'props', type: { summary: 'GroupDropdownField[]' } },
		},
		open: {
			control: 'number',
			description:
				'Open the first field. Calling it on the open panel closes the list. Change this control to call open().',
			table: { category: 'exposed', type: { summary: '(id: string) => void' } },
		},
		close: {
			control: 'number',
			description: 'Close the list. Change this control to call close().',
			table: { category: 'exposed', type: { summary: '() => void' } },
		},
		input: {
			name: 'input',
			description: 'Fires while a control changes. The argument is the value object.',
			table: { category: 'events', type: { summary: 'value: GroupDropdownValue' } },
		},
		change: {
			description:
				'Fires when a panel is reset or the list closes. The argument is the value object.',
			table: { category: 'events', type: { summary: 'value: GroupDropdownValue' } },
		},
		openEvent: {
			name: 'open',
			description: 'Fires when a panel opens. The argument is the field id.',
			table: { category: 'events', type: { summary: 'id: string' } },
		},
		closeEvent: {
			name: 'close',
			description: 'Fires after the list finishes closing.',
			table: { category: 'events' },
		},
	},
} satisfies Meta<GroupDropdownStoryArgs>;

export default meta;
type Story = StoryObj<GroupDropdownStoryArgs>;

export const Default: Story = {
	args: {
		model: groupdropdownMockValue,
		data: groupdropdownMock,
		open: 0,
		close: 0,
	},
	render: (args) => ({
		components: { GroupDropdown },
		setup() {
			const group = ref<GroupDropdownExposed | null>(null);
			const model = computed({
				get: () => args.model,
				set: (value: GroupDropdownValue) => {
					args.model = value;
				},
			});
			const data = computed(() => args.data);
			watch(
				() => args.open,
				() => {
					const id = args.data[0]?.id;
					if (id) {
						group.value?.open(id);
					}
				},
			);
			watch(
				() => args.close,
				() => {
					group.value?.close();
				},
			);
			return { group, model, data };
		},
		template: '<GroupDropdown ref="group" v-model="model" :data="data" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const price = canvas.getByRole('button', { name: 'Price' });
		await userEvent.click(price);
		await expect(price).toHaveClass('opened');
		const track = price.closest('.group-dropdown')?.querySelector('.range-slider-track');
		await expect(track).toBeTruthy();
		const box = track!.getBoundingClientRect();
		await expect(box.width).toBeGreaterThan(10);
		await userEvent.pointer({
			keys: '[MouseLeft]',
			target: track!,
			coords: { x: Math.round(box.width * 0.45), y: 4 },
		});
		const output = track!.parentElement?.querySelector('output');
		await expect(output?.textContent || '').not.toContain('no min');
		await expect(price).toHaveTextContent('Price:');
	},
};
