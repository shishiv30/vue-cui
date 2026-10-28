import geoip from 'geoip-lite';
import { getGeoCityByCityState, geoType } from '../helpers/geo.js';
import { getGeoData } from '../data/index.js';

/** Skip cities farther than this (degrees, ~50 miles at mid-latitudes). */
const MAX_CITY_DISTANCE_DEG = 0.75;

export function normalizeClientIp(ip) {
	if (!ip) {
		return '';
	}
	return String(ip).replace(/^::ffff:/i, '').split(',')[0].trim();
}

/**
 * Closest city in the geo cache (uscities lat/lng). Fuse is name-only, so this
 * walks the city list. Returns null when nothing is within MAX_CITY_DISTANCE_DEG.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {Array<{ lat?: string|number, lng?: string|number, city?: string, state?: string, path?: string }>|null} [cities]
 */
export function getNearestCityByLatLng(lat, lng, cities) {
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return null;
	}
	const list = Array.isArray(cities) ? cities : getGeoData()?.city;
	if (!list || !list.length) {
		return null;
	}

	const cosLat = Math.cos((lat * Math.PI) / 180);
	let best = null;
	let bestD2 = Infinity;

	for (let i = 0; i < list.length; i++) {
		const city = list[i];
		const cityLat = Number(city.lat);
		const cityLng = Number(city.lng);
		if (!Number.isFinite(cityLat) || !Number.isFinite(cityLng) || !city.city || !city.state) {
			continue;
		}
		const dLat = lat - cityLat;
		const dLng = (lng - cityLng) * cosLat;
		const d2 = dLat * dLat + dLng * dLng;
		if (d2 < bestD2) {
			bestD2 = d2;
			best = city;
		}
	}

	if (!best || Math.sqrt(bestD2) > MAX_CITY_DISTANCE_DEG) {
		return null;
	}

	return {
		type: geoType.city,
		city: best.city,
		state: best.state,
		path: best.path,
		lat: Number(best.lat),
		lng: Number(best.lng),
	};
}

export function getGeoCityByIp(ip, cities) {
	const ipInfo = geoip.lookup(normalizeClientIp(ip));
	if (!ipInfo) {
		return null;
	}
	if (ipInfo.city && ipInfo.region) {
		const geo = getGeoCityByCityState(ipInfo.city, ipInfo.region);
		if (geo) {
			return geo;
		}
	}
	const lat = Number(ipInfo.ll?.[0]);
	const lng = Number(ipInfo.ll?.[1]);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return null;
	}
	const nearest = getNearestCityByLatLng(lat, lng, cities);
	if (nearest) {
		return nearest;
	}
	return {
		type: geoType.city,
		lat,
		lng,
	};
}
