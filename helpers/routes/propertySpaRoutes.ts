/**
 * Shared property SPA URL patterns for server routes and client Router.
 * Sitemap, detail, map, and geo HTML are Vue SSR. These patterns classify those URLs.
 */

export const PROPERTY_SEG = {
	STATE: '[a-z]{2}',
	ZIP_OR_SLUG: '[0-9a-z-]+',
	GUID: '[0-9a-z-]+',
	GEO_SLUG: '[^/]+',
	MAP_COORD: '@[^/]+,[^/]+',
	/** Tail after /property for geo catch-all (slugs, map coords, underscores). */
	GEO_TAIL: '[/0-9a-zA-Z_@.,\\-]+',
};

const { STATE, GEO_SLUG, MAP_COORD, GEO_TAIL } = PROPERTY_SEG;

/** Search is `/property/<geoPath>/`. A listing is `/property/<geoPath>/detail_<propertyId>`. */
export const PROPERTY_SPA_ROUTES = {
	map: {
		source: `^/property/(${STATE})/(${GEO_SLUG})/(${MAP_COORD})/?$`,
		paramNames: ['state', 'geoSlug', 'coords'],
	},
	geo: {
		source: `^/property(${GEO_TAIL})/?$`,
		paramNames: ['tail'],
	},
};

/** Match order: map, then geo. Listing id is the `id` query, not a path segment. */
export const PROPERTY_SPA_ROUTE_ORDER = ['map', 'geo'];

const DEFAULT_FLAGS = 'i';

/**
 * @see docs/routes-reference.md (map: property-spa-routes)
 * @param {'detail' | 'map' | 'geo'} id
 * @param {string} [flags]
 * @returns {RegExp}
 */
export function createPropertySpaRegExp(id: any, flags = DEFAULT_FLAGS) {
	const route = (PROPERTY_SPA_ROUTES as Record<string, any>)[id];
	if (!route) {
		throw new Error(`Unknown property SPA route id: ${id}`);
	}
	return new RegExp(route.source, flags);
}

/**
 * @param {string} pathname
 * @param {string} [flags]
 * @returns {{ id: string, params: Record<string, string> } | null}
 */
export function matchPropertySpaRoute(pathname: any, flags = DEFAULT_FLAGS) {
	if (!pathname) {
		return null;
	}
	for (const id of PROPERTY_SPA_ROUTE_ORDER) {
		const route = (PROPERTY_SPA_ROUTES as Record<string, any>)[id];
		const reg = new RegExp(route.source, flags);
		const match = pathname.match(reg);
		if (!match) {
			continue;
		}
		/** @type {Record<string, string>} */
		const params: Record<string, string> = {};
		route.paramNames.forEach((name: any, index: any) => {
			params[name] = match[index + 1];
		});
		return { id, params };
	}
	return null;
}

/**
 * Which server-side regex would match first (detail and geo only; map uses geo on server).
 * @param {string} pathname
 * @param {string} [flags]
 * @returns {'detail' | 'geo' | null}
 */
export function matchPropertySpaServerRoute(pathname: any, flags = DEFAULT_FLAGS) {
	if (createPropertySpaRegExp('geo', flags).test(pathname)) {
		return 'geo';
	}
	return null;
}

export function listingIdFromPath(pathname: string) {
	const match = String(pathname || '').match(/\/detail_([^/]+)\/?$/i);
	return match ? decodeURIComponent(match[1]) : '';
}

/** Old detail URLs become `/property/<geoPath>/detail_<propertyId>`. */
export function canonicalPropertyUrl(url: string) {
	const [path, search = ''] = String(url || '').split('?');
	const params = new URLSearchParams(search);
	const queryId = params.get('id');
	const legacy = path.match(/^\/property\/detail\/([a-z]{2})\/([^/]+)\/([^/]+)\/?$/i);
	if (legacy) {
		const id = encodeURIComponent(legacy[3]);
		return `/property/${legacy[1].toLowerCase()}/${legacy[2]}/detail_${id}`;
	}
	const short = path.match(/^\/property\/detail\/([^/]+)\/?$/i);
	if (short && !path.includes('/detail_')) {
		return `/property/detail_${encodeURIComponent(short[1])}`;
	}
	if (queryId && !listingIdFromPath(path)) {
		params.delete('id');
		const rest = params.toString();
		const base = path.replace(/\/+$/, '');
		return `${base}/detail_${encodeURIComponent(queryId)}${rest ? `?${rest}` : ''}`;
	}
	return search ? `${path}?${search}` : path;
}

/** `/property/<geoPath>/detail_<propertyId>` */
export function propertyListingHref(geoPath: string, propertyId: string) {
	const trimmed = String(geoPath || '').replace(/^\/+|\/+$/g, '');
	const path = trimmed ? `/property/${trimmed}` : '/property';
	if (!propertyId) {
		return `${path}/`;
	}
	return `${path}/detail_${encodeURIComponent(propertyId)}`;
}
