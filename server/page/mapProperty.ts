import {
	mapPropertyDetailToArticle,
	mapSOADataListToArticles,
} from '../../helpers/article.js';

type NearbyRaw = {
	listings?: unknown[];
	articleTotalCount?: number;
	totalCount?: number;
} | null;

export function uiPayloadToPayload(payload: {
	geo?: unknown;
	prId?: unknown;
	filter?: unknown;
} | null | undefined) {
	const source = payload || {};
	return {
		geo: source.geo,
		prId: source.prId,
		filter: source.filter,
	};
}

export function apiDataToUiData(
	listingRaw: unknown,
	historiesRaw: unknown,
	nearbyRaw: NearbyRaw,
) {
	const detail = mapPropertyDetailToArticle(listingRaw, historiesRaw);
	let articles: unknown[] = [];
	let articleTotalCount = 0;
	if (nearbyRaw && nearbyRaw.listings && nearbyRaw.listings.length > 0) {
		articles = mapSOADataListToArticles(nearbyRaw.listings);
		articleTotalCount = nearbyRaw.articleTotalCount ?? nearbyRaw.totalCount ?? 0;
	}
	return { detail, articles, articleTotalCount };
}
