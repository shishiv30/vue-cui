import { createStore } from 'vuex';
import type { ArticleUiModel } from './components/articleModel';
import type { GroupDropdownField } from './components/groupdropdownModel';
import type { HeaderUiModel } from './components/headerModel';

export type PageLink = {
	href: string;
	text: string;
};

export type LinkGroup = {
	title: string;
	links: PageLink[];
};

export type FooterLink = {
	href: string;
	text?: string;
	icon?: string;
	ariaLabel?: string;
};

export type FooterModel = {
	contact: {
		title: string;
		email: string;
		phone: string;
		address: string;
	};
	social: {
		title: string;
		links: FooterLink[];
	};
	menu: FooterLink[];
	appName: string;
	year: number;
};

export type BreadcrumbModel = {
	links: { text: string; href?: string }[];
};

export type PropertyKind = 'sitemap' | 'search' | '';

export type PropertyState = {
	title: string;
	marker: string;
	kind: PropertyKind;
	header: HeaderUiModel | null;
	footer: FooterModel | null;
	breadcrumb: BreadcrumbModel | null;
	groups: LinkGroup[];
	articles: ArticleUiModel[];
	filters: GroupDropdownField[];
};

export function createPropertyStore() {
	return createStore<PropertyState>({
		state: {
			title: 'Property',
			marker: 'vue-property',
			kind: '',
			header: null,
			footer: null,
			breadcrumb: null,
			groups: [],
			articles: [],
			filters: [],
		},
	});
}
