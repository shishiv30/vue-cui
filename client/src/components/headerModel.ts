export interface HeaderMenuItem {
	text: string;
	href: string;
	children?: HeaderMenuItem[];
}

export interface HeaderSearch {
	inputId: string;
	placeholder: string;
	/** Geo API used by `v-autocomplete`; called as GET `url?text=…&type=…`. */
	url: string;
	/** Geo type to search, for example `city`. */
	type: string;
	autocomplete: string;
	autocorrect: string;
	spellcheck: boolean;
}

/** Same shape as `headerData()` in server/page/header.ts. */
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
		url: '/api/geo',
		type: 'city',
		autocomplete: 'off',
		autocorrect: 'off',
		spellcheck: false,
	},
	menu: [
		{ text: 'Document', href: '/' },
		{ text: 'Property', href: '/property' },
		{ text: 'Search', href: '/property/search' },
	],
};
