// @ts-nocheck
import config from '../config.js';

const APP_HOST = config.appHost || '';

/**
 * Links for the Vue `Sitemap` grid. Relative hrefs get the app host.
 * @param {{ href: string, text: string }[]} links - Array of link items
 */
export function linksData(links) {
	const linksArray = Array.isArray(links) ? links : [];
	const processedLinks = linksArray.map((link) => {
		if (!link || !link.href) {
			return link;
		}
		const href = link.href;
		// If href is already absolute (http/https), javascript:, or #, keep it as is
		if (href.startsWith('http') || href.startsWith('javascript') || href === '#' || href === '') {
			return link;
		}
		// Prepend app host to relative paths
		link.href = `${APP_HOST}${href}`;
		return link;
	});

	return processedLinks;
}
