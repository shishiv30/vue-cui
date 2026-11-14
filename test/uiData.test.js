import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { apiDataToUiData, uiPayloadToPayload } from '../server/page/mapProperty.ts';
import { propertySearchUi } from '../server/routes/api.ts';
import { loadPropertySitemapPageState } from '../server/utils/propertyPageState.ts';

const listing = {
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
	photos: [{ url: 'https://photos.example.com/p/402/21259416_0_ZjJZN2.webp' }],
	sqftTotal: 1246,
	yearBuilt: 1958,
};

describe('property uiData mappers', () => {
	test('uiPayloadToPayload keeps geo, prId, and filter', () => {
		const filter = { minBed: 2 };
		const mapped = uiPayloadToPayload({ geo: { type: 'city' }, prId: 'abc', filter });
		assert.equal(mapped.prId, 'abc');
		assert.equal(mapped.filter, filter);
		assert.equal(mapped.geo.type, 'city');
	});

	test('apiDataToUiData maps a listing and nearby rows without the network', () => {
		const ui = apiDataToUiData(listing, { histories: [] }, {
			listings: [listing],
			totalCount: 1,
		});
		assert.ok(ui.detail);
		assert.ok(ui.detail.metadata);
		assert.equal(ui.articles.length, 1);
		assert.equal(ui.articleTotalCount, 1);
	});

	test('property search handler returns 400 when geo is missing', async () => {
		const result = await propertySearchUi({ query: {}, ip: '' });
		assert.equal(result.status, 400);
		assert.equal(result.body.error, 'Invalid geo path');
	});

	test('sitemap page state uiData has seo and link rows', async () => {
		const result = await loadPropertySitemapPageState({
			path: '/property/sitemap',
			query: {},
		});
		assert.equal(result.action, 'page');
		assert.equal(typeof result.state.uiData.seo.title, 'string');
		assert.ok(Array.isArray(result.state.uiData.data.groups));
		assert.ok(result.state.uiData.data.groups.length > 0);
	});
});
