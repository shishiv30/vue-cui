import Fuse from 'fuse.js';
import { geoType } from '../helpers/geo.js';

export function initialFuseState(state: any) {
	if ((globalThis as any)[geoType.state]) {
		return (globalThis as any)[geoType.state];
	}
	(globalThis as any)[geoType.state] = new Fuse(state, {
		keys: [
			{
				name: 'state',
				weight: 0.5,
			},
			{
				name: 'name',
				weight: 0.5,
			},
		],
		threshold: 0.1,
	});
	return (globalThis as any)[geoType.state];
}

export function initialFuseCity(city: any) {
	if ((globalThis as any)[geoType.city]) {
		return (globalThis as any)[geoType.city];
	}
	(globalThis as any)[geoType.city] = new Fuse(city, {
		keys: ['input'],
		threshold: 0.1,
		includeScore: true,
		ignoreLocation: true,
		findAllMatches: true,
	});
	return (globalThis as any)[geoType.city];
}

export function initialFuseCounty(county: any) {
	if ((globalThis as any)[geoType.county]) {
		return (globalThis as any)[geoType.county];
	}
	(globalThis as any)[geoType.county] = new Fuse(county, {
		keys: [
			{
				name: 'input',
				weight: 0.8,
			},
			{
				name: 'county',
				weight: 0.15,
			},
			{
				name: 'state',
				weight: 0.05,
			},
		],
		threshold: 0.3,
		includeScore: true,
		ignoreLocation: true,
		findAllMatches: true,
	});
	return (globalThis as any)[geoType.county];
}

export function initialFuseZipcode(zipcode: any) {
	if ((globalThis as any)[geoType.zipcode]) {
		return (globalThis as any)[geoType.zipcode];
	}
	(globalThis as any)[geoType.zipcode] = new Fuse(zipcode, {
		keys: [
			{
				name: 'input',
				weight: 0.8,
			},
			{
				name: 'zipcode',
				weight: 0.2,
			},
		],
		threshold: 0.3,
		includeScore: true,
		ignoreLocation: true,
		findAllMatches: true,
	});
	return (globalThis as any)[geoType.zipcode];
}

export function initialFuseAddress(address: any) {
	if ((globalThis as any)[geoType.address]) {
		return (globalThis as any)[geoType.address];
	}
	(globalThis as any)[geoType.address] = new Fuse(address, {
		keys: ['address'],
		threshold: 0.1,
	});
	return (globalThis as any)[geoType.address];
}

export function initialFuseNeighborhood(neighborhood: any) {
	if ((globalThis as any)[geoType.neighborhood]) {
		return (globalThis as any)[geoType.neighborhood];
	}
	(globalThis as any)[geoType.neighborhood] = new Fuse(neighborhood, {
		keys: [
			{
				name: 'input',
				weight: 0.6,
			},
			{
				name: 'neighborhood',
				weight: 0.2,
			},
			{
				name: 'city',
				weight: 0.1,
			},
			{
				name: 'state',
				weight: 0.1,
			},
		],
		threshold: 0.3,
		includeScore: true,
		ignoreLocation: true,
		findAllMatches: true,
	});
	return (globalThis as any)[geoType.neighborhood];
}

export function initialFuseGeo({ state, city, county, zipcode, address, neighborhood }: Record<string, any>) {
	if (!(globalThis as any)[geoType.state] && state) {
		initialFuseState(state);
	}
	if (!(globalThis as any)[geoType.city] && city) {
		initialFuseCity(city);
	}
	if (!(globalThis as any)[geoType.zipcode] && zipcode) {
		initialFuseZipcode(zipcode);
	}
	if (!(globalThis as any)[geoType.county] && county) {
		initialFuseCounty(county);
	}
	if (!(globalThis as any)[geoType.neighborhood] && neighborhood) {
		initialFuseNeighborhood(neighborhood);
	}
	// if (!(globalThis as any)[geoType.address] && address) {
	// 	initialFuseAddress(address);
	// }
}

export function searchGeo(query: any, type: any, limit = 10) {
	try {
		// Validate inputs
		if (!query || typeof query !== 'string') {
			console.warn('searchGeo: Invalid query parameter');
			return [];
		}
		if (!type || !Object.values(geoType).includes(type)) {
			console.warn('searchGeo: Invalid type parameter');
			return [];
		}

		let result = [];
		const fuseInstance = (globalThis as any)[type];

		// Check if Fuse instance exists
		if (!fuseInstance) {
			console.warn(`searchGeo: No Fuse instance found for type ${type}`);
			return [];
		}

		// Perform search
		try {
			result = fuseInstance.search(query);
		} catch (searchError) {
			console.error('searchGeo: Search operation failed', searchError);
			return [];
		}

		// Apply limit
		return result.slice(0, limit);
	} catch (error) {
		console.error('searchGeo: Unexpected error', error);
		return [];
	}
}
