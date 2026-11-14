// @ts-nocheck
import {
	getGeoDisplayText,
	getGeoByPath,
} from '../../helpers/geo.js';
import { getGeoCityByIp } from '../../helpers/ip.js';
import { buildDetailSeo } from '../../helpers/article.js';
import { apiDataToUiData, uiPayloadToPayload } from '../page/mapProperty.js';
import { pageContext } from '../page/pageContext.js';
import {
	getPropertyHistoryById,
	getPropertyListingInfoById,
	searchHouse,
} from '../routes/api.soa.property.js';
import { createHeaderComponent } from '../ejs/comp_header.js';
import { createFooterComponent } from '../ejs/comp_footer.js';
import { getImgCdnUrl } from '../../helpers/url.js';
import { getFilterByQuery } from '../../helpers/filter.js';
import { createFilterComponent } from '../ejs/comp_filter.js';

function getSeo(geo) {
	const label = geo ? getGeoDisplayText(geo).trim() : '';
	const place = label || 'Property';
	const typePart = geo && geo.type ? `${geo.type} ` : '';
	const desc = `Search results at ${place} ${typePart}page`.trim();
	return {
		title: `Search results at ${place}`.trim(),
		description: desc,
		desc,
		keywords: `${place}, real estate, property`,
	};
}

export default {
	name: 'property',
	seo: function (_req, model) {
		const fromGet = model?.data?.seo ?? model?.data?.data?.seo;
		if (fromGet && typeof fromGet === 'object') {
			return {
				title: fromGet.title || 'Property',
				desc: fromGet.desc || fromGet.description || '',
				keywords: fromGet.keywords || '',
			};
		}
		return {
			title: 'Property',
			desc: '',
			keywords: 'property',
		};
	},
	beforeGet: function (req, payload) {
		let geo;
		const prId = req.query.id || req.query.prId;

		const geoPathRaw = String(req.query.geoPath || '')
			.replace(/^\/+|\/+$/g, '');
		if (geoPathRaw && geoPathRaw !== 'search') {
			geo = getGeoByPath(geoPathRaw);
		} else if ((req.query.ip || req.ip) && !prId) {
			const ip = req.query.ip || req.ip;
			geo = getGeoCityByIp(ip);
		}

		return {
			...payload,
			geo,
			prId,
			filter: getFilterByQuery(req.query),
		};
	},
	preload: function (_req, model) {
		const href = model?.data?.metadata?.welcomeImage;
		if (!href) {
			return null;
		}
		return [{ as: 'image', href }];
	},
	get: async function (payload) {
		const { geo, prId, filter } = uiPayloadToPayload(payload);
		const context = pageContext(geo ?? null);
		const welcomeImage = getImgCdnUrl(context.metadata.cdnHost, '/welcome.webp');

		let [nearbyRaw, listingRaw, historiesRaw] = await Promise.all([
			geo ? searchHouse(geo, filter) : Promise.resolve(null),
			prId ? getPropertyListingInfoById(prId) : Promise.resolve(null),
			prId ? getPropertyHistoryById(prId) : Promise.resolve(null),
		]);

		const { detail, articles, articleTotalCount } = apiDataToUiData(
			listingRaw,
			historiesRaw,
			nearbyRaw,
		);

		const filterFields = createFilterComponent(filter).data.fields;
		const header = createHeaderComponent().data;
		const footer = createFooterComponent().data;
		const seoSource = buildDetailSeo(detail) || getSeo(geo);
		const title = seoSource.title || 'Property';
		const description = seoSource.description || seoSource.desc || '';

		return {
			seo: {
				title,
				h1: title,
				description,
			},
			httpHead: welcomeImage
				? [{ rel: 'preload', as: 'image', href: welcomeImage }]
				: [],
			metadata: {
				...context.metadata,
				welcomeImage,
			},
			data: {
				...context.data,
				detail,
				articles,
				articleTotalCount,
				filters: filterFields,
				header,
				footer,
				breadcrumb: null,
			},
		};
	},
};
