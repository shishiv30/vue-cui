// @ts-nocheck
import config from '../config.js';
import { headerMock } from '../../client/src/components/headerModel.js';

const APP_HOST = config.appHost || '';

function toHref(path) {
	return path.startsWith('javascript') || path === '#' || path === ''
		? path || 'javascript:;'
		: `${APP_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
}

function buildMenuFromLinks(links) {
	const sorted = [...links].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	const topLevel = sorted.filter((row) => row.parentId == null || row.parentId === '');

	function toItem(row) {
		const href = toHref(row.path);
		const children = sorted
			.filter((r) => r.parentId === row.id)
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
			.map((r) => ({ text: r.text, href: toHref(r.path) }));
		return children.length ? { text: row.text, href, children } : { text: row.text, href };
	}

	return topLevel.map(toItem);
}

/**
 * Header model for the Vue `Header` component.
 * @param {Array|null} [linkTableOverride] - Optional link rows. If null/undefined, uses `headerMock.menu`.
 */
export function headerData(linkTableOverride) {
	if (linkTableOverride == null) {
		return {
			...headerMock,
			search: headerMock.search ? { ...headerMock.search, url: `${APP_HOST}/api/geo` } : undefined,
		};
	}
	return {
		...headerMock,
		search: headerMock.search ? { ...headerMock.search, url: `${APP_HOST}/api/geo` } : undefined,
		menu: Array.isArray(linkTableOverride)
			? buildMenuFromLinks(linkTableOverride)
			: headerMock.menu,
	};
}
