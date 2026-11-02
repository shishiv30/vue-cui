import { getHref, getSrc } from './url.js';

/**
 * Build EJS locals matching BaseController.toPage (getHref / getSrc + model fields).
 * @param {object} model — page data (API envelope.data or SSR model.data)
 * @returns {object}
 */
export function createEjsRenderContext(model: any) {
	const m = model || {};
	const appHost = m.appHost ?? m.meta?.appHost ?? '';
	const cdnHost = m.cdnHost ?? m.meta?.cdnHost ?? '';
	return {
		...m,
		appHost,
		cdnHost,
		getHref: (item: any) => getHref(item, appHost),
		getSrc: (img: any) => getSrc(img, cdnHost),
	};
}
