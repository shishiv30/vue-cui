/** Google encoded polyline (precision 5) to lat/lng rings. */
export function decodePolyline(encoded: string): { lat: number; lng: number }[] {
	const ring: { lat: number; lng: number }[] = [];
	let index = 0;
	let lat = 0;
	let lng = 0;
	while (index < encoded.length) {
		let result = 0;
		let shift = 0;
		let byte = 0;
		do {
			byte = encoded.charCodeAt(index++) - 63;
			result |= (byte & 31) << shift;
			shift += 5;
		} while (byte >= 32);
		lat += result & 1 ? ~(result >> 1) : result >> 1;
		result = 0;
		shift = 0;
		do {
			byte = encoded.charCodeAt(index++) - 63;
			result |= (byte & 31) << shift;
			shift += 5;
		} while (byte >= 32);
		lng += result & 1 ? ~(result >> 1) : result >> 1;
		ring.push({ lat: lat / 1e5, lng: lng / 1e5 });
	}
	return ring;
}

export function decodePolylines(encoded: string[]): { lat: number; lng: number }[][] {
	return encoded.map(decodePolyline).filter((ring) => ring.length >= 3);
}
