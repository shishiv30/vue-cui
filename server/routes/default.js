import BaseController from '../controllers/index.js';
import { pageConfig } from '../../client/pages.config.js';

export default function registerDefault(router) {
	// `/` is the Vue document page in server/index.ts.

	// Static pages serve dist HTML: layout.
	pageConfig.pages.forEach((page) => {
		if (page.name && page.static) {
			router.get(`/${page.name}`, (req, res) => {
				BaseController.dist(res, `${page.name}.html`);
			});
		}
	});
}
