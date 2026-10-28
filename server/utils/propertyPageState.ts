import type { Request } from 'express';
import property from '../controllers/property.js';
import propertySitemap from '../controllers/propertySitemap.js';
import propertySitemapState from '../controllers/propertySitemapState.js';
import propertySitemapCounty from '../controllers/propertySitemapCounty.js';
import propertySitemapCity from '../controllers/propertySitemapCity.js';
import { matchPropertySpaRoute } from '../../helpers/routes/propertySpaRoutes.js';

type PageConfig = {
	beforeGet?: (req: Request, payload: Request['query']) => Request['query'];
	get: (payload: Request['query']) => Promise<Record<string, unknown>>;
};

type ClassifiedSitemap = {
	action: 'sitemap';
	config: PageConfig;
	heading: string;
};

type ClassifiedSearch = {
	action: 'search';
	config: PageConfig;
	heading: string;
	spa: NonNullable<ReturnType<typeof matchPropertySpaRoute>>;
};

type Classified = ClassifiedSitemap | ClassifiedSearch | { action: 'redirect' };

function normalizePath(path: string | undefined) {
	if (!path) return '';
	if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
	return path;
}

function linkRows(component: { data?: { href?: string; text?: string }[] } | undefined) {
	const data = component?.data;
	if (!Array.isArray(data)) return [];
	return data.map((link) => ({
		href: link?.href || '',
		text: link?.text || '',
	}));
}

export function classifyPropertySitemapPath(path: string): ClassifiedSitemap | { action: 'redirect' } | null {
	const pagePath = normalizePath(path);
	if (pagePath === '/property' || pagePath === '/property/sitemap') {
		return { action: 'sitemap', config: propertySitemap as PageConfig, heading: '' };
	}
	if (/^\/property\/sitemap\/[a-z]{2}$/i.test(pagePath)) {
		return { action: 'sitemap', config: propertySitemapState as PageConfig, heading: 'Counties' };
	}
	if (/^\/property\/sitemap\/[a-z]{2}\/[^/]+_county$/i.test(pagePath)) {
		return { action: 'sitemap', config: propertySitemapCounty as PageConfig, heading: 'Cities' };
	}
	if (/^\/property\/sitemap\/[a-z]{2}\/[^/]+$/i.test(pagePath)) {
		return { action: 'sitemap', config: propertySitemapCity as PageConfig, heading: 'Zipcodes' };
	}
	return null;
}

export function classifyPropertySearchPath(path: string): ClassifiedSearch | null {
	const pagePath = normalizePath(path);
	if (pagePath === '/property/search') {
		return {
			action: 'search',
			config: property as PageConfig,
			heading: '',
			spa: { id: 'search', params: {} },
		};
	}
	const spa = matchPropertySpaRoute(pagePath);
	if (spa && (spa.id === 'geo' || spa.id === 'map' || spa.id === 'detail')) {
		return { action: 'search', config: property as PageConfig, heading: '', spa };
	}
	return null;
}

export function classifyPropertyPath(path: string): Classified | null {
	return classifyPropertySitemapPath(path) ?? classifyPropertySearchPath(path);
}

function filterFields(component: { data?: { fields?: Record<string, unknown>[] } } | undefined) {
	const fields = component?.data?.fields;
	if (!Array.isArray(fields)) return [];
	return fields.map((field) => {
		if (field.type === 'range') {
			return {
				id: field.id,
				type: 'range',
				label: field.label,
				format: field.format === 'count' ? 'number' : field.format,
				stops: field.stops,
			};
		}
		const options = Array.isArray(field.options) ? field.options as Record<string, unknown>[] : [];
		return {
			id: field.id,
			type: field.type,
			label: field.label,
			cols: field.cols,
			options: options.map((option) => ({
				value: field.id === 'tags' ? option.name : option.value,
				label: option.label,
				checked: option.checked,
				disabled: option.disabled,
			})),
		};
	});
}

function toPageState(classified: ClassifiedSitemap | ClassifiedSearch, data: Record<string, unknown> | undefined) {
	const groups: { title: string; links: { href: string; text: string }[] }[] = [];
	const zipcodes = data?.zipcodesComponent as { data?: { href?: string; text?: string }[] } | undefined;
	const neighborhoods = data?.neighborhoodsComponent as { data?: { href?: string; text?: string }[] } | undefined;
	const links = data?.linksComponent as { data?: { href?: string; text?: string }[] } | undefined;
	if (zipcodes) {
		groups.push({ title: 'Zipcodes', links: linkRows(zipcodes) });
	}
	if (neighborhoods) {
		groups.push({ title: 'Neighborhoods', links: linkRows(neighborhoods) });
	}
	if (links) {
		groups.push({ title: classified.heading, links: linkRows(links) });
	}

	const headerComponent = data?.headerComponent as { data?: unknown } | undefined;
	const footerComponent = data?.footerComponent as { data?: unknown } | undefined;
	const articleComponent = data?.articleComponent as { data?: unknown[] } | undefined;
	const filterComponent = data?.filterComponent as { data?: { fields?: Record<string, unknown>[] } } | undefined;

	return {
		title: (data?.title as string) || 'Property',
		marker: 'vue-property',
		kind: classified.action === 'search' ? 'search' : 'sitemap',
		header: headerComponent?.data ?? null,
		footer: footerComponent?.data ?? null,
		breadcrumb: data?.breadcrumb ?? null,
		groups: classified.action === 'sitemap' ? groups : [],
		articles: classified.action === 'search' ? (articleComponent?.data ?? []) : [],
		filters: classified.action === 'search' ? filterFields(filterComponent) : [],
		detail: classified.action === 'search' && classified.spa?.id === 'detail'
			? (data?.detail ?? null)
			: null,
	};
}

async function loadClassified(req: Request, classified: ClassifiedSitemap | ClassifiedSearch) {
	if (classified.action === 'search') {
		if (classified.spa.id === 'geo') {
			req.query.geoPath = classified.spa.params.tail;
		} else if (classified.spa.id === 'map') {
			const { state, geoSlug, coords } = classified.spa.params;
			req.query.geoPath = `${state}/${geoSlug}/${coords}`;
		} else if (classified.spa.id === 'detail') {
			const { state, zip, prId } = classified.spa.params;
			req.query.geoPath = `${state}/${zip}`;
			req.query.prId = prId;
		}
	}

	let payload = req.query;
	if (classified.config.beforeGet) {
		payload = classified.config.beforeGet(req, payload);
	}
	const data = await classified.config.get(payload);
	return { action: 'page' as const, state: toPageState(classified, data) };
}

export async function loadPropertySitemapPageState(req: Request) {
	const classified = classifyPropertySitemapPath(req.path);
	if (!classified) return null;
	if (classified.action === 'redirect') return classified;
	return loadClassified(req, classified);
}

export async function loadPropertySearchPageState(req: Request) {
	const classified = classifyPropertySearchPath(req.path);
	if (!classified) return null;
	return loadClassified(req, classified);
}

export async function loadPropertyPageState(req: Request) {
	const classified = classifyPropertyPath(req.path);
	if (!classified) return null;
	if (classified.action === 'redirect') return classified;
	return loadClassified(req, classified);
}
