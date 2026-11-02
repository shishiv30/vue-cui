import { articleMock, type ArticleUiModel } from './articleModel';

export type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

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
			article: { ...articleMock, id: 'a', title: '1200 Main St, Austin, TX 78701', img: 'https://picsum.photos/800/600?random=11' },
		},
		{
			id: 'b',
			position: { lat: 30.2849, lng: -97.7341 },
			title: '88 Oak Ave, Austin, TX 78705',
			desc: '2 bd · 1 ba · 1,100 sqft',
			icon: 'icon-home',
			color: 'var(--color-safe, #2e9e5b)',
			article: {
				...articleMock,
				id: 'b',
				title: '88 Oak Ave, Austin, TX 78705',
				img: 'https://picsum.photos/800/600?random=12',
				attrs: [
					{ key: 'Est', value: '$389,000', desc: 'Estimate Price' },
					{ key: 'Bd', value: '2', desc: 'Bedrooms' },
					{ key: 'Ba', value: '1', desc: 'Bathrooms' },
				],
			},
		},
		{
			id: 'c',
			position: { lat: 30.2405, lng: -97.7695 },
			title: '9 Pine Ct, Austin, TX 78704',
			label: '$720k',
			color: 'var(--color-danger, #e0245e)',
			article: {
				...articleMock,
				id: 'c',
				title: '9 Pine Ct, Austin, TX 78704',
				img: 'https://picsum.photos/800/600?random=13',
				attrs: [
					{ key: 'Est', value: '$720,000', desc: 'Estimate Price' },
					{ key: 'Bd', value: '4', desc: 'Bedrooms' },
					{ key: 'Ba', value: '3', desc: 'Bathrooms' },
				],
				tags: [{ className: 'major active', text: 'Pending' }],
			},
		},
	],
};
