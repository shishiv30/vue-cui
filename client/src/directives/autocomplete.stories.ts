import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { expect, waitFor, within } from 'storybook/test';
import autocomplete from './autocomplete';

const cities = [
	{ city: 'San Francisco', state: 'CA' },
	{ city: 'San Jose', state: 'CA' },
	{ city: 'San Diego', state: 'CA' },
	{ city: 'Santa Monica', state: 'CA' },
	{ city: 'Sacramento', state: 'CA' },
	{ city: 'Seattle', state: 'WA' },
	{ city: 'Austin', state: 'TX' },
	{ city: 'Boston', state: 'MA' },
	{ city: 'New York', state: 'NY' },
];

const cityLabel = (item: unknown) => {
	const c = item as { city: string; state: string };
	return `${c.city}, ${c.state}`;
};

/** Stands in for an API: resolves after 300 ms with the matches. */
const fakeApi = (query: string, signal: AbortSignal) =>
	new Promise<unknown[]>((resolve, reject) => {
		const timer = setTimeout(() => {
			const q = query.toLowerCase();
			resolve(cities.filter((c) => cityLabel(c).toLowerCase().includes(q)));
		}, 300);
		signal.addEventListener('abort', () => {
			clearTimeout(timer);
			reject(new DOMException('aborted', 'AbortError'));
		});
	});

const listbox = () => within(document.body).findByRole('listbox');

const meta = {
	title: 'Directives/Autocomplete',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'## Input',
					'',
					'| Slot | What you provide |',
					'| --- | --- |',
					'| Value | A source, or `{ source, label, param, params, minLength, delay, limit, listClass }`. |',
					'| source | An array (filtered locally), a GET url string (`?text=` + `params`; reads an array or `{ data: [] }`), or `(query, signal) => items \\| Promise<items>`. |',
					'| label | Item field name or `(item) => string`. Default: `label`, `text`, `name`, or the item itself. |',
					'| Defaults | `param: "text"`, `minLength: 1`, `delay: 300` ms (url and function only), `limit: 10`. |',
					'| v-model | Bind the input text as usual. Selecting an item writes its label and fires `input`. |',
					'| Event | `@autocomplete-select` with the picked item in `event.detail`; bus `select.autocomplete`. |',
					'| Keys | Up / Down move, Enter picks, Esc closes. The list closes on blur. |',
					'| Focus mode | While the list is open, page scrolling is locked (`html.autocomplete-open`) and an overlay dims the page except the input. Clicking the overlay closes the list. |',
					'| Placement | Below the input, or above when there is more room above. The list sits flush on the input and copies its color, background, border and radius, so the two read as one box. While open the input gets `autocomplete-bottom` or `autocomplete-top`, which squares the corners where they join. |',
					'| listClass | Extra class on the shared list while this input owns it. The list is positioned through `--autocomplete-top`, `--autocomplete-bottom`, `--autocomplete-left` and `--autocomplete-width`, so the class can replace that layout. The Header uses `header-autocomplete` to fill the screen below the header on phones. |',
				].join('\n'),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const LocalData: Story = {
	render: () => ({
		directives: { autocomplete },
		setup() {
			const text = ref('');
			const picked = ref<unknown>(null);
			const opts = { source: cities, label: cityLabel };
			return { text, picked, opts };
		},
		template: `
<section class="section">
	<div class="fixed fixed-max-xs">
		<label class="f5" for="acLocal">City (local data)</label>
		<div class="input">
			<input id="acLocal" type="text" placeholder="Try san"
				v-model="text" v-autocomplete="opts" @autocomplete-select="picked = $event.detail" />
		</div>
		<p class="f6">Text: <span data-testid="text">{{ text }}</span></p>
		<p class="f6">Picked: <span data-testid="picked">{{ picked ? picked.city : '' }}</span></p>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('combobox');
		await userEvent.click(input);
		await userEvent.type(input, 'san');
		const list = await listbox();
		await waitFor(() => expect(list).toHaveClass('in'));
		await expect(within(list).getAllByRole('option')).toHaveLength(4);
		await expect(document.documentElement).toHaveClass('autocomplete-open');
		await expect(input).toHaveClass('autocomplete-bottom');
		await expect(list).toHaveClass('bottom');
		await userEvent.keyboard('{Escape}');
		await expect(input).not.toHaveClass('autocomplete-bottom');
		await expect(list).not.toHaveClass('in');
		await expect(document.documentElement).not.toHaveClass('autocomplete-open');
		// Down reopens the list, then two more move to the second item.
		await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
		await expect(input).toHaveValue('San Jose, CA');
		await expect(canvas.getByTestId('text')).toHaveTextContent('San Jose, CA');
		await expect(canvas.getByTestId('picked')).toHaveTextContent('San Jose');
		await expect(list).not.toHaveClass('in');
	},
};

export const Api: Story = {
	render: () => ({
		directives: { autocomplete },
		setup() {
			const text = ref('');
			const opts = { source: fakeApi, label: cityLabel, delay: 200 };
			return { text, opts };
		},
		template: `
<section class="section">
	<div class="fixed fixed-max-xs">
		<label class="f5" for="acApi">City (API)</label>
		<div class="input">
			<input id="acApi" type="text" placeholder="Try bo" v-model="text" v-autocomplete="opts" />
		</div>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('combobox');
		await userEvent.click(input);
		await userEvent.type(input, 'bo');
		const list = await listbox();
		await waitFor(() => expect(list).toHaveClass('in'));
		await expect(within(list).getByRole('option')).toHaveTextContent('Boston, MA');
		const overlay = document.querySelector('.autocomplete-overlay') as HTMLElement;
		await expect(overlay).toHaveClass('in');
		await userEvent.click(overlay);
		await expect(list).not.toHaveClass('in');
		await expect(overlay).not.toHaveClass('in');
		await expect(document.documentElement).not.toHaveClass('autocomplete-open');
	},
};

export const AboveWhenNoRoomBelow: Story = {
	render: () => ({
		directives: { autocomplete },
		setup() {
			return { text: ref(''), opts: { source: cities, label: cityLabel } };
		},
		template: `
<section class="section" style="min-height: 90vh; display: flex; align-items: flex-end;">
	<div class="fixed fixed-max-xs">
		<div class="input">
			<input type="text" placeholder="Try s" v-model="text" v-autocomplete="opts" />
		</div>
	</div>
</section>
		`,
	}),
	play: async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('combobox');
		input.scrollIntoView({ block: 'end' });
		await userEvent.click(input);
		await userEvent.type(input, 's');
		const list = await listbox();
		await waitFor(() => expect(list).toHaveClass('in'));
		await expect(list).toHaveClass('top');
		await expect(input).toHaveClass('autocomplete-top');
		await userEvent.keyboard('{Escape}');
	},
};
