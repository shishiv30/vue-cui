import {
	createRouter,
	createWebHistory,
	createMemoryHistory,
	type RouterHistory,
} from 'vue-router';
import Property from './pages/Property.vue';
import PropertySitemap from './pages/PropertySitemap.vue';
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
				name: 'property-sitemap-root',
				component: PropertySitemap,
			},
			{
				path: '/property/sitemap/:state?/:place?',
				name: 'property-sitemap',
				component: PropertySitemap,
			},
			{
				path: '/property/detail/:state/:place/:propertyId',
				redirect: (to) =>
					`/property/${String(to.params.state).toLowerCase()}/${to.params.place}/detail_${encodeURIComponent(String(to.params.propertyId))}`,
			},
			{
				path: '/property/detail/:propertyId',
				redirect: (to) =>
					`/property/detail_${encodeURIComponent(String(to.params.propertyId))}`,
			},
			{
				path: '/property/search/:geoPath(.*)*',
				name: 'property-search-page',
				component: Property,
			},
			{
				path: '/property/:geoPath(.*)*',
				name: 'property-geo',
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
