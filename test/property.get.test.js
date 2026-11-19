/**
 * Contract test for property config get() return shape (no SOA when prId absent).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import propertyConfig from '../server/controllers/property.js';
import propertySitemap from '../server/controllers/propertySitemap.js';
import { mapPropertyDetailToArticle } from '../helpers/article.js';

try {
	process.loadEnvFile('.env.local');
} catch {}
const PHOTO_HOST = process.env.TEST_PHOTO_HOST || 'https://photos.example.com';

const DETAIL_COMP_KEYS = [
	'metadata',
	'title',
	'tags',
	'album',
	'paragraph',
	'record',
	'openHouses',
	'timeline',
];

const soaPureListing = {
	address: {
		addressInfo: '101 Mel St',
		city: 'Winters',
		county: 'Runnels County',
		state: 'TX',
		zipCode: '79567',
	},
	bathroomsTotal: 1,
	bedrooms: 3,
	currentOpenHouses: [],
	id: '37ac59e7-2172-4e13-9676-46de3875152e',
	listPrice: 135000,
	listingStatus: { displayName: 'Active', name: 'ACTIVE' },
	listingUrl: 'winters-tx/101-mel-st-winters-tx-79567/pid_dh5p9ng4nh/',
	photos: [{ url: `${PHOTO_HOST}/p/402/21259416_0_ZjJZN2.webp` }],
	sqftTotal: 1246,
	yearBuilt: 1958,
};

describe('property.get', () => {
	test('returns page model keys without prId (detail null)', async () => {
		const model = await propertyConfig.get({ geo: undefined, prId: undefined });

		assert.equal(model.data.detail, null);
		assert.ok(model.seo && typeof model.seo.title === 'string');
		assert.equal(model.seo.h1, model.seo.title);
		assert.ok(Array.isArray(model.data.articles));
		assert.ok(model.data.header);
		assert.ok(model.data.footer);
		assert.ok(model.metadata.welcomeImage);
		assert.equal(typeof model.data.articleTotalCount, 'number');
	});

	test('sitemap get returns uiData', async () => {
		const model = await propertySitemap.get();
		assert.equal(typeof model.seo.title, 'string');
		assert.ok(model.metadata.appHost);
		assert.ok(Array.isArray(model.data.links));
		assert.ok(model.data.header);
		assert.ok(model.data.footer);
	});

	test('mapPropertyDetailToArticle keys align with Detail.vue sections', () => {
		const detail = mapPropertyDetailToArticle(soaPureListing, { histories: [] });
		assert.ok(detail);

		for (const key of DETAIL_COMP_KEYS) {
			assert.ok(key in detail, `detail missing key: ${key}`);
		}
	});
});
