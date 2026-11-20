import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import { computed } from 'vue';
import Header from './Header.vue';
import {
	headerMock,
	type HeaderMenuItem,
	type HeaderSearch,
	type HeaderUiModel,
} from './headerModel';

type HeaderStoryArgs = {
	name: string;
	sticky: 'true' | 'false';
	className: string;
	search?: HeaderSearch;
	menu: HeaderMenuItem[];
	model?: HeaderUiModel;
};

/** Sample answers for `/api/geo`, which only the Express app serves. */
const geoSample = [
	{ type: 'city', city: 'Dallas', state: 'TX', path: 'tx/dallas' },
	{ type: 'city', city: 'Glendale', state: 'AZ', path: 'az/glendale' },
	{ type: 'city', city: 'Scottsdale', state: 'AZ', path: 'az/scottsdale' },
	{ type: 'city', city: 'San Diego', state: 'CA', path: 'ca/san-diego' },
	{ type: 'city', city: 'San Jose', state: 'CA', path: 'ca/san-jose' },
	{ type: 'city', city: 'Austin', state: 'TX', path: 'tx/austin' },
];

/** Answers `/api/geo` in Storybook so the header search shows suggestions. */
function mockGeoApi() {
	const realFetch = window.fetch;
	window.fetch = async (input, init) => {
		const url = new URL(String(input), window.location.href);
		if (!url.pathname.endsWith('/api/geo')) {
			return realFetch(input, init);
		}
		const text = (url.searchParams.get('text') || '').toLowerCase();
		const data = geoSample.filter((geo) => geo.city.toLowerCase().includes(text));
		return new Response(JSON.stringify({ code: 200, data }), {
			headers: { 'Content-Type': 'application/json' },
		});
	};
	return () => {
		window.fetch = realFetch;
	};
}

const meta = {
	title: 'Components/Header',
	component: Header,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Site header. Each Controls row is one field of the model. Omit search and the search field is not rendered. '
					+ 'The search field uses `v-autocomplete` against `search.url` with `type`; picking a result opens `/property/<geo path>`. '
					+ 'In Storybook `/api/geo` answers with a few sample cities (try "dal" or "san"). On phones the list fills the screen below the header.',
			},
		},
	},
	beforeEach: mockGeoApi,
	argTypes: {
		model: {
			control: false,
			table: { disable: true },
		},
		name: {
			control: 'text',
			description: 'Component name from the data builder.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		sticky: {
			control: 'inline-radio',
			options: ['true', 'false'],
			description: "When 'true', the root gets the sticky class.",
			table: { category: 'props', type: { summary: "'true' | 'false'" } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class header stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		search: {
			control: 'object',
			description: 'Search field config. Omit it and the search input is not rendered.',
			table: { category: 'props', type: { summary: 'HeaderSearch' } },
		},
		menu: {
			control: 'object',
			description: 'Nav items. A children list renders a submenu.',
			table: { category: 'props', type: { summary: 'HeaderMenuItem[]' } },
		},
	},
} satisfies Meta<HeaderStoryArgs>;

export default meta;
type Story = StoryObj<HeaderStoryArgs>;

export const Default: Story = {
	args: {
		name: headerMock.name,
		sticky: headerMock.sticky,
		className: headerMock.className,
		search: headerMock.search,
		menu: headerMock.menu,
	},
	render: (args) => ({
		components: { Header },
		setup() {
			const model = computed<HeaderUiModel>(() => ({
				name: args.name,
				sticky: args.sticky,
				className: args.className,
				menu: args.menu,
				...(args.search ? { search: args.search } : {}),
			}));
			return { model };
		},
		template: '<Header :model="model" />',
	}),
	play: async ({ canvas, userEvent }) => {
		await expect(canvas.getByRole('link', { name: 'Document' })).toHaveAttribute('href', '/');
		await expect(canvas.getByRole('link', { name: 'Sitemap' })).toHaveAttribute(
			'href',
			'/property',
		);
		await expect(canvas.getByRole('link', { name: 'Search' })).toHaveAttribute(
			'href',
			'/property/search',
		);
		const input = canvas.getByRole('combobox');
		await userEvent.click(input);
		await userEvent.type(input, 'dal');
		const list = await within(document.body).findByRole('listbox');
		await waitFor(() => expect(list).toHaveClass('in'));
		await expect(within(list).getAllByRole('option').map((o) => o.textContent)).toEqual([
			'Dallas, TX',
			'Glendale, AZ',
			'Scottsdale, AZ',
		]);
		await expect(list).toHaveClass('header-autocomplete');
		await userEvent.keyboard('{Escape}');
		await expect(list).not.toHaveClass('in');
	},
};
