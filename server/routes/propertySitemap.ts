import type { Router } from 'express';
import BaseController from '../controllers/index.js';

function handlePropertyRoute(controller: InstanceType<typeof BaseController>, res: import('express').Response) {
	return (async () => {
		try {
			const model = await controller.get();
			if (model && model.code === 500) {
				console.error('Property sitemap get failed:', 'error' in model ? model.error : model);
				res.status(500).send('Unable to load this page. Please try again later.');
				return;
			}
			await controller.toPage(model);
		} catch (err) {
			console.error('Property sitemap route error:', err);
			res.status(500).send('Unable to load this page. Please try again later.');
		}
	})();
}

export default function registerPropertySitemap(router: Router) {
	router.get(/^\/property\/?$/, async (req, res) => {
		await handlePropertyRoute(new BaseController(req, res, 'property-sitemap'), res);
	});

	router.get(/^\/property\/sitemap\/?$/, async (req, res) => {
		await handlePropertyRoute(new BaseController(req, res, 'property-sitemap'), res);
	});

	router.get(/^\/property\/sitemap\/([a-z]{2})\/?$/, async (req, res) => {
		await handlePropertyRoute(new BaseController(req, res, 'property-sitemap-state'), res);
	});

	router.get(/^\/property\/sitemap\/([a-z]{2})\/([^/]+)_county\/?$/, async (req, res) => {
		await handlePropertyRoute(new BaseController(req, res, 'property-sitemap-county'), res);
	});

	router.get(/^\/property\/sitemap\/([a-z]{2})\/([^/]+)\/?$/, async (req, res) => {
		await handlePropertyRoute(new BaseController(req, res, 'property-sitemap-city'), res);
	});
}
