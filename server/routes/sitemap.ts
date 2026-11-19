import type { Router } from 'express';

/** The old EJS sitemap moved to the Vue page at /property/sitemap. Same path shape below the prefix. */
export default function registerSitemap(router: Router) {
	router.get(/^\/sitemap(\/.*)?$/i, (req, res) => {
		const rest = req.path.replace(/^\/sitemap/i, '').replace(/\/+$/, '');
		const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
		res.redirect(301, `/property/sitemap${rest}${query}`);
	});
}
