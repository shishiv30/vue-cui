// @ts-nocheck
import config from '../config.js';
import { headerMock } from '../../client/src/components/headerModel.js';

const APP_HOST = config.appHost || '';

const COMPONENT_NAME = 'header';
const COMPONENT_TEMPLATE = 'comp_header';

function toHref(path) {
	return path.startsWith('javascript') || path === '#' || path === ''
		? (path || 'javascript:;')
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
		return children.length
			? { text: row.text, href, children }
			: { text: row.text, href };
	}

	return topLevel.map(toItem);
}

function getHeaderData(linkTableOverride) {
	if (linkTableOverride == null) {
		return {
			...headerMock,
			search: headerMock.search
				? { ...headerMock.search, url: `${APP_HOST}/api/geo` }
				: undefined,
		};
	}
	return {
		...headerMock,
		search: headerMock.search
			? { ...headerMock.search, url: `${APP_HOST}/api/geo` }
			: undefined,
		menu: Array.isArray(linkTableOverride)
			? buildMenuFromLinks(linkTableOverride)
			: headerMock.menu,
	};
}

/**
 * Create the header UI component config.
 * @param {Array|null} [linkTableOverride] - Optional link rows. If null/undefined, uses data/links.js.
 * @returns {{ name: string, template: string, data: object }}
 */
export function createHeaderComponent(linkTableOverride) {
	return {
		name: COMPONENT_NAME,
		template: COMPONENT_TEMPLATE,
		data: getHeaderData(linkTableOverride),
	};
}

