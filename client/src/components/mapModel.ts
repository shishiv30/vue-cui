export type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

export interface MapLatLng {
	lat: number;
	lng: number;
}

/** One pin. Pick a look with `icon`, `label`, `imgSrc` or `html`; with none of them you get a plain dot. */
export interface MapMarker {
	id: string;
	position: MapLatLng;
	/** Tooltip on hover, and the heading of the info window. */
	title?: string;
	/** Body of the info window, as plain text. Empty means no info window. */
	desc?: string;
	/** Font icon class inside the pin, e.g. `icon-home`. */
	icon?: string;
	/** Short text inside the pin, e.g. a price like `$450k`. */
	label?: string;
	/** Image inside the pin. */
	imgSrc?: string;
	/** Fully custom pin element. Wins over `icon`, `label` and `imgSrc`. The component never writes it with `innerHTML`; pass trusted markup only. */
	html?: HTMLElement | (() => HTMLElement);
	/** CSS color of the pin background. Empty keeps the theme color. */
	color?: string;
	/** Extra classes on the pin. */
	className?: string;
	/** Stacking order. Selected pins are always on top. */
	zIndex?: number;
}

export interface MapBounds {
	north: number;
	south: number;
	east: number;
	west: number;
}

export interface MapUiModel {
	markers: MapMarker[];
	/** Start center. Ignored when `fitMarkers` is on and there are markers. */
	center?: MapLatLng;
	zoom?: number;
	mapType?: MapType;
	/** Zoom and pan to show every marker whenever the marker list changes. */
	fitMarkers?: boolean;
	/** Id of the highlighted marker. Its info window opens when it has a title or desc. */
	selectedId?: string;
	/** Show Google's own controls. */
	controls?: {
		zoom?: boolean;
		mapType?: boolean;
		fullscreen?: boolean;
		streetView?: boolean;
	};
	/** `cooperative` needs two fingers or ctrl to move the map; `greedy` always moves it. */
	gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
	/** Map style id from Google Cloud. Advanced markers need one; the default is Google's demo id. */
	mapId?: string;
	/** Extra classes on the root. */
	className?: string;
}

export const mapMock: MapUiModel = {
	center: { lat: 30.2672, lng: -97.7431 },
	zoom: 12,
	fitMarkers: true,
	markers: [
		{
			id: 'a',
			position: { lat: 30.2672, lng: -97.7431 },
			title: '1200 Main St, Austin, TX 78701',
			desc: '3 bd · 2 ba · 1,850 sqft',
			label: '$450k',
		},
		{
			id: 'b',
			position: { lat: 30.2849, lng: -97.7341 },
			title: '88 Oak Ave, Austin, TX 78705',
			desc: '2 bd · 1 ba · 1,100 sqft',
			icon: 'icon-home',
			color: 'var(--color-safe, #2e9e5b)',
		},
		{
			id: 'c',
			position: { lat: 30.2405, lng: -97.7695 },
			title: '9 Pine Ct, Austin, TX 78704',
			label: '$720k',
			color: 'var(--color-danger, #e0245e)',
		},
	],
};
