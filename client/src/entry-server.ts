import { renderToString } from 'vue/server-renderer';
import { createMemoryHistory } from 'vue-router';
import { canonicalPropertyUrl } from '../../helpers/routes/propertySpaRoutes.js';
import { createApp } from './app';
import type { PropertyState } from './store';

export async function render(url: string, pageState?: PropertyState) {
	const { app, router, store } = createApp(createMemoryHistory());
	if (pageState) {
		store.hydrate(pageState);
	}
	await router.push(canonicalPropertyUrl(url));
	await router.isReady();
	const html = await renderToString(app);
	return { html, state: store.$state };
}
