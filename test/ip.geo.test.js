import assert from 'node:assert/strict';
import test from 'node:test';
import { getNearestCityByLatLng, getGeoCityByIp, normalizeClientIp } from '../helpers/ip.js';

const cities = [
	{ city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431, path: 'tx/austin' },
	{ city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.797, path: 'tx/dallas' },
	{ city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, path: 'ca/san-francisco' },
];

test('normalizeClientIp strips ipv4-mapped prefix', () => {
	assert.equal(normalizeClientIp('::ffff:8.8.8.8'), '8.8.8.8');
});

test('getNearestCityByLatLng picks the closer city when within range', () => {
	const geo = getNearestCityByLatLng(30.3, -97.7, cities);
	assert.equal(geo.city, 'Austin');
	assert.equal(geo.state, 'TX');
	assert.equal(geo.type, 'city');
});

test('getNearestCityByLatLng returns null when nothing is nearby', () => {
	assert.equal(getNearestCityByLatLng(0, 0, cities), null);
});

test('getGeoCityByIp falls back to latlng when lookup has no city', () => {
	const geo = getGeoCityByIp('8.8.8.8', cities);
	assert.ok(geo);
	assert.equal(typeof geo.lat, 'number');
	assert.equal(typeof geo.lng, 'number');
});
