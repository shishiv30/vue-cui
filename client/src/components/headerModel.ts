export interface HeaderMenuItem {
	text: string;
	href: string;
	children?: HeaderMenuItem[];
}

export interface HeaderSearch {
	inputId: string;
	placeholder: string;
	method: string;
	url: string;
	keys: string;
	type: string;
	autocomplete: string;
	autocorrect: string;
	spellcheck: boolean;
}

/** Same shape as `getHeaderData` in server/ejs/comp_header.js. */
export interface HeaderUiModel {
	name: string;
	sticky: 'true' | 'false';
	className: string;
	search?: HeaderSearch;
	menu: HeaderMenuItem[];
}

export const headerMock: HeaderUiModel = {
	name: 'Header',
	sticky: 'true',
	className: 'major active',
	search: {
		inputId: 'headerInput',
		placeholder: 'Search for ...',
		method: 'GET',
		url: '/api/geo',
		keys: 'type',
		type: 'city',
		autocomplete: 'off',
		autocorrect: 'off',
		spellcheck: false,
	},
	menu: [
		{ text: 'Document', href: '/' },
		{ text: 'Sitemap', href: '/property' },
		{ text: 'Search', href: '/property/search' },
	],
};
