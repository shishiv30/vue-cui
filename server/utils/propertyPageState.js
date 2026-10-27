import property from '../controllers/property.js';
import propertySitemap from '../controllers/propertySitemap.js';
import propertySitemapState from '../controllers/propertySitemapState.js';
import propertySitemapCounty from '../controllers/propertySitemapCounty.js';
import propertySitemapCity from '../controllers/propertySitemapCity.js';
import { matchPropertySpaRoute } from '../../helpers/routes/propertySpaRoutes.js';

function normalizePath(path) {
	if (!path) return '';
	if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
	return path;
}

function linkRows(component) {
	const data = component?.data;
	if (!Array.isArray(data)) return [];
	return data.map((link) => ({
		href: link?.href || '',
		text: link?.text || '',
	}));
}

/**
 * @param {string} path
 * @returns {{ action: 'redirect' } | { action: 'sitemap' | 'search', config: object, heading: string, spa?: object } | null}
 */
export function classifyPropertyPath(path) {
	const pagePath = normalizePath(path);
	if (pagePath === '/property') {
		return { action: 'redirect' };
	}
	if (pagePath.startsWith('/property/detail/')) {
		return null;
	}
	if (pagePath === '/property/sitemap') {
		return { action: 'sitemap', config: propertySitemap, heading: '' };
	}
	if (/^\/property\/sitemap\/[a-z]{2}$/i.test(pagePath)) {
		return { action: 'sitemap', config: propertySitemapState, heading: 'Counties' };
	}
	if (/^\/property\/sitemap\/[a-z]{2}\/[^/]+_county$/i.test(pagePath)) {
		return { action: 'sitemap', config: propertySitemapCounty, heading: 'Cities' };
	}
	if (/^\/property\/sitemap\/[a-z]{2}\/[^/]+$/i.test(pagePath)) {
		return { action: 'sitemap', config: propertySitemapCity, heading: 'Zipcodes' };
	}

	const spa = matchPropertySpaRoute(pagePath);
	if (spa && (spa.id === 'geo' || spa.id === 'map')) {
		return { action: 'search', config: property, heading: '', spa };
	}
	return null;
}

function filterFields(component) {
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
		return {
			id: field.id,
			type: field.type,
			label: field.label,
			cols: field.cols,
			options: (field.options || []).map((option) => ({
				value: field.id === 'tags' ? option.name : option.value,
				label: option.label,
				checked: option.checked,
				disabled: option.disabled,
			})),
		};
	});
}

function toPageState(classified, data) {
	const groups = [];
	if (data?.zipcodesComponent) {
		groups.push({ title: 'Zipcodes', links: linkRows(data.zipcodesComponent) });
	}
	if (data?.neighborhoodsComponent) {
		groups.push({ title: 'Neighborhoods', links: linkRows(data.neighborhoodsComponent) });
	}
	if (data?.linksComponent) {
		groups.push({ title: classified.heading, links: linkRows(data.linksComponent) });
	}

	return {
		title: data?.title || 'Property',
		marker: 'vue-property',
		kind: classified.action === 'search' ? 'search' : 'sitemap',
		header: data?.headerComponent?.data ?? null,
		footer: data?.footerComponent?.data ?? null,
		breadcrumb: data?.breadcrumb ?? null,
		groups: classified.action === 'sitemap' ? groups : [],
		articles: classified.action === 'search' ? (data?.articleComponent?.data ?? []) : [],
		filters: classified.action === 'search' ? filterFields(data?.filterComponent) : [],
	};
}

/**
 * @param {import('express').Request} req
 * @returns {Promise<{ action: 'redirect' } | { action: 'page', state: object } | null>}
 */
export async function loadPropertyPageState(req) {
	const classified = classifyPropertyPath(req.path);
	if (!classified) return null;
	if (classified.action === 'redirect') return classified;

	if (classified.action === 'search' && classified.spa) {
		if (classified.spa.id === 'geo') {
			req.query.geoPath = classified.spa.params.tail;
		} else if (classified.spa.id === 'map') {
			const { state, geoSlug, coords } = classified.spa.params;
			req.query.geoPath = `${state}/${geoSlug}/${coords}`;
		}
	}

	let payload = req.query;
	if (classified.config.beforeGet) {
		payload = classified.config.beforeGet(req, payload);
	}
	const data = await classified.config.get(payload);
	return { action: 'page', state: toPageState(classified, data) };
}
