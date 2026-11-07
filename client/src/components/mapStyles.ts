export type MapStyleOverlay = 'streetview';

/** One named JSON map look. Add a row here to expose a new style. */
export interface MapStyleSetting {
	text: string;
	value: string;
	/** True on the style used when `model.mapStyle` is omitted. */
	defaultValue?: boolean;
	/** Extra layer on top of the map. Switching away destroys and recycles it. */
	overlay?: MapStyleOverlay;
	rules: google.maps.MapTypeStyle[];
}

export const activeMapStyle: google.maps.MapTypeStyle[] = [
	{
		elementType: 'geometry',
		stylers: [{ color: '#ecf1f6' }],
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#ecf1f6' }],
	},
	{
		featureType: 'administrative',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8b929c' }],
	},
	{
		featureType: 'administrative',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#f5f5f5' }, { weight: 2 }],
	},
	{
		featureType: 'administrative.neighborhood',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#d6d6d6' }, { weight: 1 }],
	},
	{
		featureType: 'administrative.land_parcel',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#ffffff' }, { weight: 2 }],
	},
	{
		featureType: 'landscape.man_made',
		elementType: 'geometry.fill',
		stylers: [{ color: '#ecf1f6' }],
	},
	{
		featureType: 'landscape.man_made',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#BABFC8' }, { weight: 2 }],
	},
	{
		featureType: 'landscape.natural',
		elementType: 'geometry',
		stylers: [{ color: '#bcdad1' }],
	},
	{
		featureType: 'landscape.natural.landcover',
		elementType: 'geometry',
		stylers: [{ color: '#ccebd7' }],
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [{ color: '#d7f0e0' }],
	},
	{
		featureType: 'poi.business',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.government',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'geometry',
		stylers: [{ color: '#f4e1e1' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'labels.icon',
		stylers: [{ color: '#f9b9b9' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [{ color: '#d7f0e0' }],
	},
	{
		featureType: 'poi.park',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.attraction',
		elementType: 'labels.icon',
		stylers: [{ color: '#a4abbe' }],
	},
	{
		featureType: 'poi.attraction',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.place_of_worship',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.school',
		elementType: 'geometry',
		stylers: [{ color: '#dae1ec' }],
	},
	{
		featureType: 'poi.school',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.sports_complex',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [{ color: '#fafafa' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8b929c' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#f5f5f5' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.fill',
		stylers: [{ color: '#fff7e4' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#f9da8d' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels.icon',
		stylers: [{ color: '#a4abbe' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: '#c3dff9' }],
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8b929c' }],
	},
];

/** Cool 高级灰 night palette. Hue ~216, low chroma; parks and water stay slightly tinted. */
export const activeMapStyleDark: google.maps.MapTypeStyle[] = [
	{
		elementType: 'geometry',
		stylers: [{ color: '#1c2026' }],
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#1c2026' }],
	},
	{
		featureType: 'administrative',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8b929c' }],
	},
	{
		featureType: 'administrative',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#1c2026' }, { weight: 2 }],
	},
	{
		featureType: 'administrative.neighborhood',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#3a414b' }, { weight: 1 }],
	},
	{
		featureType: 'administrative.land_parcel',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#2a3038' }, { weight: 2 }],
	},
	{
		featureType: 'landscape.man_made',
		elementType: 'geometry.fill',
		stylers: [{ color: '#222830' }],
	},
	{
		featureType: 'landscape.man_made',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#3d4550' }, { weight: 2 }],
	},
	{
		featureType: 'landscape.natural',
		elementType: 'geometry',
		stylers: [{ color: '#1e2623' }],
	},
	{
		featureType: 'landscape.natural.landcover',
		elementType: 'geometry',
		stylers: [{ color: '#1f2825' }],
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [{ color: '#232a28' }],
	},
	{
		featureType: 'poi.business',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.government',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'geometry',
		stylers: [{ color: '#2a2426' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'labels.icon',
		stylers: [{ color: '#6e5a5c' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [{ color: '#232a28' }],
	},
	{
		featureType: 'poi.park',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.attraction',
		elementType: 'labels.icon',
		stylers: [{ color: '#6d7480' }],
	},
	{
		featureType: 'poi.attraction',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.place_of_worship',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.school',
		elementType: 'geometry',
		stylers: [{ color: '#242830' }],
	},
	{
		featureType: 'poi.school',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.sports_complex',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [{ color: '#2e343d' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8b929c' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#1c2026' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.fill',
		stylers: [{ color: '#3a3e38' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#4a4e47' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels.icon',
		stylers: [{ color: '#6d7480' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels.text',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: '#171e28' }],
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#6d7480' }],
	},
];

export const inactiveMapStyleDark: google.maps.MapTypeStyle[] = [
	{
		elementType: 'geometry.fill',
		stylers: [{ color: '#1a1d22' }],
	},
	{
		elementType: 'geometry.stroke',
		stylers: [{ color: '#2a2e35' }],
	},
	{
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'landscape.natural',
		elementType: 'geometry',
		stylers: [{ color: '#1c201e' }],
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [{ color: '#2a2e35' }],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: '#14181f' }],
	},
	{
		featureType: 'transit',
		stylers: [{ visibility: 'off' }],
	},
];

export const inactiveMapStyle: google.maps.MapTypeStyle[] = [
	{
		elementType: 'geometry.fill',
		stylers: [{ saturation: -100 }, { lightness: 50 }],
	},
	{
		elementType: 'geometry.stroke',
		stylers: [{ saturation: -100 }, { lightness: 50 }],
	},
	{
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		stylers: [{ lightness: 100 }],
	},
	{
		featureType: 'transit',
		stylers: [{ visibility: 'off' }],
	},
];

export const mapStyleList: MapStyleSetting[] = [
	{
		text: 'Active',
		value: 'active',
		defaultValue: true,
		rules: activeMapStyle,
	},
	{
		text: 'Inactive',
		value: 'inactive',
		rules: inactiveMapStyle,
	},
	{
		text: 'Street View',
		value: 'streetview',
		overlay: 'streetview',
		rules: activeMapStyle,
	},
];

export type MapStyleName = (typeof mapStyleList)[number]['value'];

export const defaultMapStyle: MapStyleName =
	mapStyleList.find((item) => item.defaultValue)?.value ?? mapStyleList[0].value;

/** Same rule as CSS: `theme-dark`, else `prefers-color-scheme: dark` unless `theme-light`. */
export function isDarkUi(): boolean {
	const html = document.documentElement;
	const body = document.body;
	if (html.classList.contains('theme-light') || body.classList.contains('theme-light')) {
		return false;
	}
	if (html.classList.contains('theme-dark') || body.classList.contains('theme-dark')) {
		return true;
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const hidePoiStyle: google.maps.MapTypeStyle[] = [
	{
		featureType: 'poi',
		stylers: [{ visibility: 'off' }],
	},
];

export function mapStyleRules(
	name: MapStyleName = defaultMapStyle,
	dark = isDarkUi(),
	hidePoi = true,
): google.maps.MapTypeStyle[] {
	const rules = dark
		? name === 'inactive'
			? inactiveMapStyleDark
			: activeMapStyleDark
		: (mapStyleList.find((item) => item.value === name)?.rules ?? mapStyleList[0].rules);
	return hidePoi ? [...rules, ...hidePoiStyle] : rules;
}

export function mapStyleOverlay(name: MapStyleName): MapStyleOverlay | undefined {
	return mapStyleList.find((item) => item.value === name)?.overlay;
}
