import {
	createRouter,
	createWebHistory,
	createMemoryHistory,
	type RouterHistory,
} from 'vue-router';
import Property from './pages/Property.vue';
import Document from './pages/Document.vue';

export function createPropertyRouter(history: RouterHistory = createWebHistory()) {
	return createRouter({
		history,
		routes: [
			{
				path: '/',
				name: 'home',
				component: Document,
			},
			{
				path: '/property',
				redirect: '/property/sitemap',
			},
			{
				path: '/property/sitemap/:state?/:place?',
				name: 'property-sitemap',
				component: Property,
			},
			{
				path: '/property/:pathMatch(.*)*',
				name: 'property-search',
				component: Property,
			},
			{
				path: '/document',
				name: 'document',
				component: Document,
			},
		],
	});
}

export { createMemoryHistory };
