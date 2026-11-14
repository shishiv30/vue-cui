import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
	createPropertySpaRegExp,
	matchPropertySpaRoute,
	matchPropertySpaServerRoute,
	PROPERTY_SPA_ROUTE_ORDER,
} from '../helpers/routes/propertySpaRoutes.js';

describe('matchPropertySpaRoute', () => {
	test('listing id is not a path segment', () => {
		const m = matchPropertySpaRoute('/property/tx/78664/');
		assert.equal(m?.id, 'geo');
		assert.equal(m?.params.tail, '/tx/78664/');
	});

	test('map paths', () => {
		const m = matchPropertySpaRoute('/property/tx/austin/@30.2672,-97.7431');
		assert.equal(m?.id, 'map');
		assert.equal(m?.params.state, 'tx');
		assert.equal(m?.params.geoSlug, 'austin');
		assert.equal(m?.params.coords, '@30.2672,-97.7431');
	});

	test('geo grid paths', () => {
		const m = matchPropertySpaRoute('/property/tx/austin');
		assert.equal(m?.id, 'geo');
		assert.equal(m?.params.tail, '/tx/austin');
	});

	test('geo county slug', () => {
		const m = matchPropertySpaRoute('/property/tx/williamson_county');
		assert.equal(m?.id, 'geo');
		assert.equal(m?.params.tail, '/tx/williamson_county');
	});

	test('map URL matches geo on server (no separate map handler)', () => {
		const path = '/property/tx/austin/@30.2672,-97.7431';
		assert.equal(matchPropertySpaRoute(path)?.id, 'map');
		assert.equal(matchPropertySpaServerRoute(path), 'geo');
		assert.ok(createPropertySpaRegExp('geo').test(path));
	});

	test('grid path does not match detail', () => {
		assert.equal(matchPropertySpaRoute('/property/tx/austin')?.id, 'geo');
		assert.notEqual(matchPropertySpaRoute('/property/tx/austin')?.id, 'detail');
	});

	test('sitemap path matches geo regex (excluded by registration order on server)', () => {
		const m = matchPropertySpaRoute('/property/sitemap');
		assert.equal(m?.id, 'geo');
	});
});

describe('createPropertySpaRegExp parity', () => {
	test('route order is map, geo', () => {
		assert.deepEqual(PROPERTY_SPA_ROUTE_ORDER, ['map', 'geo']);
	});

	test('first matching rule in order for ambiguous checks', () => {
		const vectors = [
			['/property/tx/austin/@30.2672,-97.7431', 'map'],
			['/property/tx/austin', 'geo'],
		];
		for (const [path, expected] of vectors) {
			assert.equal(matchPropertySpaRoute(path)?.id, expected, path);
		}
	});
});

describe('server geo catch-all charset', () => {
	test('map coordinates match geo regex', () => {
		const geo = createPropertySpaRegExp('geo');
		assert.ok(geo.test('/property/tx/austin/@30.5,-97.5'));
	});

	test('legacy catch-all would not match map coords', () => {
		const legacy = /^\/property([\/\w\-]+)\/?$/;
		assert.ok(!legacy.test('/property/tx/austin/@30.5,-97.5'));
	});
});
