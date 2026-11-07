import { articleMock, type ArticleUiModel } from './articleModel';
import { austinEncodedPolylines } from './mapAustinEncoded';
import { defaultMapStyle, type MapStyleName } from './mapStyles';

export type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
export type { MapStyleName };
/** Palette class on a pin. `primary` is the same as `major`. */
export type MapPinTheme = 'default' | 'gray' | 'primary' | 'major' | 'minor' | 'danger' | 'safe' | 'tip';

export interface MapLatLng {
	lat: number;
	lng: number;
}

/** One pin. Pick a look with `icon`, `label`, `imgSrc` or `html`; with none of them you get a plain dot. */
export interface MapMarker {
	id: string;
	position: MapLatLng;
	/** Tooltip on hover, and the heading of the popover when there is no `article`. */
	title?: string;
	/** Body of the popover as plain text, used when there is no `article`. */
	desc?: string;
	/** Detail card shown in the popover when this pin is selected. Wins over `title` and `desc`. */
	article?: ArticleUiModel;
	/** Font icon class inside the pin, e.g. `icon-home`. */
	icon?: string;
	/** Short text inside the pin, e.g. a price like `$450k`. */
	label?: string;
	/** Image inside the pin. */
	imgSrc?: string;
	/** Fully custom pin element, or a function that builds one for this marker. Wins over `icon`, `label` and `imgSrc`. The component never writes it with `innerHTML`; pass trusted markup only. */
	html?: HTMLElement | ((marker: MapMarker) => HTMLElement);
	/** Which point of the pin sits on the position. `center` suits round pins, `bottom` suits pins with a tail. Default `center`. */
	anchor?: 'center' | 'bottom';
	/** Palette: `primary`/`major`, `minor`, `danger`, `safe` (also `default`, `gray`, `tip`). */
	theme?: MapPinTheme;
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
	/** Named JSON look from `mapStyleList`. Default is the item with `defaultValue`. */
	mapStyle?: MapStyleName;
	/** Hide Google POI icons and labels. Default true. */
	hidePoi?: boolean;
	/** Zoom and pan to show every marker whenever pins are added or removed. Several changes in a row fit once. */
	fitMarkers?: boolean;
	/** Space in px kept free around the pins when fitting. Default 48. */
	fitPadding?: number;
	/** Highest zoom a fit may reach, so pins close together are not shown at street level. Default 16. */
	fitMaxZoom?: number;
	/** Id of the highlighted marker. Its popover opens when it has an article, title or desc. */
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
	/** Google Cloud map id. When set, JSON `mapStyle` is ignored (cloud styling wins). */
	mapId?: string;
	/** Polygon rings. Mask is viewport minus these rings; inside stays unshaded. */
	boundary?: MapLatLng[][];
	/** Google encoded polylines, decoded into extra `boundary` rings. */
	boundaryEncoded?: string[];
	/** When false (default), fill viewport minus the polygon. When true, fill the polygon only. */
	inverseBoundary?: boolean;
	/** Extra classes on the root. */
	className?: string;
}

function mockPinCard(id: string, title: string, n: number): ArticleUiModel {
	return {
		...articleMock,
		id,
		title,
		img: `https://picsum.photos/800/600?random=${n}`,
		imgAlt: title,
	};
}

export const mapMock: MapUiModel = {
	center: { lat: 30.2672, lng: -97.7431 },
	zoom: 13,
	fitMarkers: false,
	boundaryEncoded: [...austinEncodedPolylines],
	markers: [
		{
			id: 'a',
			position: { lat: 30.2672, lng: -97.7431 },
			title: '1200 Main St, Austin, TX 78701',
			desc: '3 bd · 2 ba · 1,850 sqft',
			label: '$450k',
			theme: 'primary',
			article: mockPinCard('a', '1200 Main St, Austin, TX 78701', 11),
		},
		{
			id: 'b',
			position: { lat: 30.2849, lng: -97.7341 },
			title: '88 Oak Ave, Austin, TX 78705',
			desc: '2 bd · 1 ba · 1,100 sqft',
			icon: 'icon-home',
			theme: 'safe',
			article: mockPinCard('b', '88 Oak Ave, Austin, TX 78705', 12),
		},
		{
			id: 'c',
			position: { lat: 30.2405, lng: -97.7695 },
			title: '9 Pine Ct, Austin, TX 78704',
			label: '$720k',
			theme: 'danger',
			article: mockPinCard('c', '9 Pine Ct, Austin, TX 78704', 13),
		},
		{
			id: 'd',
			position: { lat: 30.2986, lng: -97.7541 },
			title: 'Domain Dr, Austin, TX 78758',
			label: '$510k',
			theme: 'minor',
			article: mockPinCard('d', 'Domain Dr, Austin, TX 78758', 14),
		},
		{
			id: 'e',
			position: { lat: 30.3072, lng: -97.72 },
			title: '41 Manor Rd, Austin, TX 78722',
			icon: 'icon-star',
			theme: 'tip',
			article: mockPinCard('e', '41 Manor Rd, Austin, TX 78722', 15),
		},
		{
			id: 'f',
			position: { lat: 30.255, lng: -97.762 },
			title: '200 Barton Springs, Austin, TX 78704',
			label: '$390k',
			theme: 'gray',
			article: mockPinCard('f', '200 Barton Springs, Austin, TX 78704', 16),
		},
		{
			id: 'g',
			position: { lat: 30.32, lng: -97.77 },
			title: '18 Burnet Rd, Austin, TX 78756',
			icon: 'icon-home',
			theme: 'major',
			article: mockPinCard('g', '18 Burnet Rd, Austin, TX 78756', 17),
		},
		{
			id: 'h',
			position: { lat: 30.27, lng: -97.8 },
			title: '77 Enfield Rd, Austin, TX 78703',
			label: '$860k',
			theme: 'safe',
			article: mockPinCard('h', '77 Enfield Rd, Austin, TX 78703', 18),
		},
		{
			id: 'i',
			position: { lat: 30.2684, lng: -97.7448 },
			title: 'Dot · default',
			theme: 'default',
			article: mockPinCard('i', 'Dot · default', 19),
		},
		{
			id: 'i2',
			position: { lat: 30.2696, lng: -97.7412 },
			title: 'Dot · primary',
			theme: 'primary',
			article: mockPinCard('i2', 'Dot · primary', 25),
		},
		{
			id: 'i3',
			position: { lat: 30.2658, lng: -97.7455 },
			title: 'Dot · safe',
			theme: 'safe',
			article: mockPinCard('i3', 'Dot · safe', 26),
		},
		{
			id: 'i4',
			position: { lat: 30.2662, lng: -97.7404 },
			title: 'Dot · danger',
			theme: 'danger',
			article: mockPinCard('i4', 'Dot · danger', 27),
		},
		{
			id: 'i5',
			position: { lat: 30.2708, lng: -97.7462 },
			title: 'Dot · minor',
			theme: 'minor',
			article: mockPinCard('i5', 'Dot · minor', 28),
		},
		{
			id: 'i6',
			position: { lat: 30.2649, lng: -97.7426 },
			title: 'Dot · tip',
			theme: 'tip',
			article: mockPinCard('i6', 'Dot · tip', 29),
		},
		{
			id: 'j',
			position: { lat: 30.22, lng: -97.75 },
			title: '300 S Congress, Austin, TX 78704',
			label: '$275k',
			theme: 'danger',
			article: mockPinCard('j', '300 S Congress, Austin, TX 78704', 20),
		},
		{
			id: 'k',
			position: { lat: 30.29, lng: -97.71 },
			title: '90 Airport Blvd, Austin, TX 78702',
			icon: 'icon-home',
			theme: 'minor',
			article: mockPinCard('k', '90 Airport Blvd, Austin, TX 78702', 21),
		},
		{
			id: 'l',
			position: { lat: 30.265, lng: -97.73 },
			title: '14 Rainey St, Austin, TX 78701',
			imgSrc: 'https://picsum.photos/80/80?random=22',
			theme: 'primary',
			article: mockPinCard('l', '14 Rainey St, Austin, TX 78701', 22),
		},
		{
			id: 'm',
			position: { lat: 30.31, lng: -97.74 },
			title: '2 Koenig Ln, Austin, TX 78756',
			label: '$615k',
			theme: 'tip',
			article: mockPinCard('m', '2 Koenig Ln, Austin, TX 78756', 23),
		},
		{
			id: 'n',
			position: { lat: 30.245, lng: -97.72 },
			title: '60 Riverside, Austin, TX 78741',
			icon: 'icon-star',
			theme: 'gray',
			article: mockPinCard('n', '60 Riverside, Austin, TX 78741', 24),
		},
	],
};
