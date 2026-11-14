// @ts-nocheck
import { getStatesForSitemap } from '../../helpers/geo.js';
import { sitemapUiData } from '../page/sitemapUi.js';

const SITEMAP_BASE = '/property/sitemap';

export default {
	name: 'property-sitemap',
	assetName: 'property',
	seo: function (req, model) {
		const title = model?.data?.data?.title || model?.data?.title || 'States Sitemap';
		return {
			title,
			desc: 'Browse all states.',
			keywords: 'sitemap, states',
		};
	},
	get: async function () {
		const stateLinks = getStatesForSitemap(SITEMAP_BASE);
		const breadcrumb = {
			links: [
				{ text: 'Home', href: '/property' },
				{ text: 'Sitemap', href: '' },
			],
		};
		return sitemapUiData({
			title: 'States Sitemap',
			description: 'Browse all states.',
			breadcrumb,
			links: stateLinks,
		});
	},
};
