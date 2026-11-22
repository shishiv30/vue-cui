import { defineStore } from 'pinia';
import type { ArticleUiModel } from './components/articleModel';
import type { PropertyDetailModel } from './components/detailModel';
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
	states: PageLink[];
	articles: ArticleUiModel[];
	filters: GroupDropdownField[];
	detail: PropertyDetailModel | null;
};

export type UiData = {
	seo?: { title?: string; h1?: string; description?: string };
	data?: Partial<PropertyState>;
};

const emptyState = (): PropertyState => ({
	title: 'Property',
	marker: 'vue-property',
	kind: '',
	header: null,
	footer: null,
	breadcrumb: null,
	groups: [],
	states: [],
	articles: [],
	filters: [],
	detail: null,
});

export const usePropertyStore = defineStore('property', {
	state: emptyState,
	actions: {
		hydrate(next: Partial<PropertyState>) {
			const current = emptyState();
			(Object.keys(current) as (keyof PropertyState)[]).forEach((key) => {
				if (key in next) {
					this[key] = next[key] as never;
				}
			});
		},
		applyUi(ui: UiData) {
			if (ui.seo?.title) {
				this.title = ui.seo.title;
			}
			const data = ui.data;
			if (!data) {
				return;
			}
			if (Array.isArray(data.articles)) {
				this.articles = data.articles;
			}
			if (Array.isArray(data.groups)) {
				this.groups = data.groups;
			}
			if (data.footer) {
				this.footer = data.footer;
			}
			if (data.header) {
				this.header = data.header;
			}
			if (data.breadcrumb) {
				this.breadcrumb = data.breadcrumb;
			}
			if (data.detail) {
				this.detail = data.detail;
			}
			if (data.kind) {
				this.kind = data.kind;
			}
		},
		async loadPage(url: string) {
			const response = await fetch(url);
			if (!response.ok) {
				return null;
			}
			const ui = (await response.json()) as UiData;
			this.applyUi(ui);
			return ui;
		},
	},
});
