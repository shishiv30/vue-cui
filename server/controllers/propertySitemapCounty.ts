// @ts-nocheck
import { getCitiesForSitemap, getGeoByPath, getBreadcrumbByGeo } from '../../helpers/geo.js';
import { getGeoData } from '../../data/index.js';
import { sitemapUiData } from '../page/sitemapUi.js';

const SITEMAP_BASE = '/property/sitemap';

export default {
	name: 'property-sitemap-county',
	assetName: 'property',
	beforeGet: function (req, payload) {
		// Extract state and county from path (e.g., /property/sitemap/ca/los-angeles_county)
		const pathMatch = req.path.match(/^\/property\/sitemap\/([a-z]{2})\/([^\/]+)_county$/i);
		if (pathMatch) {
			const stateCode = pathMatch[1].toUpperCase();
			const countyCode = pathMatch[2].replace(/-/g, ' ');
			return { stateCode, countyCode };
		}
		return null;
	},
	seo: function (req, model) {
		const page = model?.data?.data || model?.data || {};
		const countyName = page.countyName || 'County';
		const stateName = page.stateName || 'State';
		return {
			title: `${countyName}, ${stateName} Cities Sitemap`,
			desc: `Browse all cities in ${countyName}, ${stateName}.`,
			keywords: `sitemap, cities, ${countyName}, ${stateName}`,
		};
	},
	get: async function (payload) {
		if (!payload?.stateCode || !payload?.countyCode) {
			throw new Error('State code and county code are required');
		}

		const geoData = getGeoData();
		if (!geoData || !geoData.county || !geoData.city) {
			throw new Error('Geo data not available');
		}

		const stateCode = payload.stateCode;
		const countyCode = payload.countyCode.replace(/-/g, ' '); // Convert hyphens back to spaces

		// Find the county to get its full name
		// Match by countyCode (short name) or by converting county name
		const county = geoData.county.find(
			(c) =>
				c.state === stateCode &&
				(c.countyCode?.toLowerCase().trim() === countyCode.toLowerCase().trim() ||
					c.county?.replace(/\s+County$/i, '').toLowerCase().trim() === countyCode.toLowerCase().trim()),
		);
		const countyName = county?.county || `${countyCode} County`;

		// Get state name
		const geo = getGeoByPath(`${stateCode.toLowerCase()}`);
		const stateName = geo?.state || stateCode;

		const cityLinks = getCitiesForSitemap(countyName, stateCode, SITEMAP_BASE, geoData.city);

		// Build breadcrumb: Home > Sitemap > State > County
		const countyGeo = { state: stateCode, county: countyName, type: 'county' };
		const breadcrumb = getBreadcrumbByGeo(countyGeo, SITEMAP_BASE);
		if (breadcrumb && breadcrumb.links) {
			// Replace first link to point to /property/sitemap
			breadcrumb.links[0] = { text: 'Home', href: '/property' };
			breadcrumb.links.splice(1, 0, { text: 'Sitemap', href: '/property/sitemap' });
			// Last item is current (no href)
			const lastLink = breadcrumb.links[breadcrumb.links.length - 1];
			if (lastLink) {
				lastLink.href = '';
			}
		}

		return sitemapUiData({
			title: `${countyName} Cities`,
			description: `Browse all cities in ${countyName}, ${stateName}.`,
			breadcrumb,
			links: cityLinks,
			extra: { countyName, stateName, stateCode },
		});
	},
};
