import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { computed, ref } from 'vue';
import Map from './Map.vue';
import { defaultMapStyle, mapStyleList } from './mapStyles';
import {
	mapMock,
	type MapMarker,
	type MapStyleName,
	type MapType,
	type MapUiModel,
} from './mapModel';

type MapStoryArgs = {
	apiKey?: string;
	markers: MapMarker[];
	zoom: number;
	mapType: MapType;
	mapStyle: MapStyleName;
	fitMarkers: boolean;
	autoMerge: boolean;
	mergeRadius: number;
	mergeMaxZoom: number;
	hidePoi: boolean;
	inverseBoundary: boolean;
	className: string;
	markerClick?: (marker: MapMarker) => void;
	groupClick?: (markers: MapMarker[]) => void;
	mapClick?: (position: { lat: number; lng: number }) => void;
	streetviewError?: () => void;
};

const envApiKey = typeof __GOOGLE_MAPS_API_KEY__ === 'string' ? __GOOGLE_MAPS_API_KEY__ : '';

const meta = {
	id: 'components-map',
	title: 'Components/Map',
	component: Map,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Map with custom pins (icon, price label, image or your own HTML element). Boundary mask paths are `[outerMapBounds, ...boundaryPath]` unless `inverseBoundary` is set. Clicking a pin emits `marker-click`. With `autoMerge` (default on), pins closer than `mergeRadius` px merge into a group pin up to `mergeMaxZoom`, with a fly-in and fly-out animation on zoom. Clicking a group pin emits `group-click` and opens a bottom list of its pins; the list follows the group on zoom out and closes when the group splits or leaves the map. The current driver is Google Maps and needs a Maps JavaScript API key from `.env.local` when `apiKey` is not passed.',
			},
		},
	},
	argTypes: {
		apiKey: {
			control: 'text',
			description: 'Maps JavaScript API key. Falls back to GOOGLE_MAPS_API_KEY from .env.local.',
			table: { category: 'props' },
		},
		markers: {
			control: 'object',
			description:
				'Pins. Each has id, position, an optional look and an optional `article` for the popover.',
			table: { category: 'props', type: { summary: 'MapMarker[]' } },
		},
		zoom: { control: { type: 'range', min: 1, max: 20 }, table: { category: 'props' } },
		mapType: {
			control: 'inline-radio',
			options: ['roadmap', 'satellite', 'hybrid', 'terrain'],
			table: { category: 'props' },
		},
		mapStyle: {
			control: 'inline-radio',
			options: mapStyleList.map((item) => item.value),
			description:
				'Look from `mapStyleList`. `streetview` is an overlay; switching away destroys and recycles it.',
			table: { category: 'props' },
		},
		fitMarkers: {
			control: 'boolean',
			description:
				'Zoom to show every pin after pins are added or removed. Several changes in a row fit once.',
			table: { category: 'props' },
		},
		autoMerge: {
			control: 'boolean',
			description:
				'Merge pins too close to tap into a group pin. Tap a group to list its pins. Default true.',
			table: { category: 'props' },
		},
		mergeRadius: {
			control: { type: 'range', min: 0, max: 120, step: 4 },
			description: 'Pins closer than this many screen px merge. `0` turns merging off. Default 48.',
			table: { category: 'props' },
		},
		mergeMaxZoom: {
			control: { type: 'range', min: 0, max: 20 },
			description: 'Above this zoom pins never merge. Default 16.',
			table: { category: 'props' },
		},
		hidePoi: {
			control: 'boolean',
			description: 'Hide Google points of interest. Default true.',
			table: { category: 'props' },
		},
		inverseBoundary: {
			control: 'boolean',
			description:
				'False (default): fill [outerMapBounds, ...boundaryPath]. True: fill the polygon only.',
			table: { category: 'props' },
		},
		className: { control: 'text', table: { category: 'props' } },
		markerClick: {
			description: 'A pin was clicked.',
			table: { category: 'events', type: { summary: 'marker: MapMarker' } },
		},
		groupClick: {
			description: 'A group pin was clicked and its list opened.',
			table: { category: 'events', type: { summary: 'markers: MapMarker[]' } },
		},
		mapClick: {
			description: 'The empty map was clicked.',
			table: { category: 'events', type: { summary: 'position: { lat, lng }' } },
		},
		streetviewError: {
			description: 'Street View overlay had no coverage at the map center.',
			table: { category: 'events' },
		},
	},
	args: {
		apiKey: envApiKey,
		markers: mapMock.markers,
		zoom: 13,
		mapType: 'roadmap',
		mapStyle: defaultMapStyle,
		fitMarkers: false,
		autoMerge: true,
		mergeRadius: 48,
		mergeMaxZoom: 16,
		hidePoi: true,
		inverseBoundary: false,
		className: '',
		markerClick: fn(),
		groupClick: fn(),
		mapClick: fn(),
		streetviewError: fn(),
	},
} satisfies Meta<MapStoryArgs>;

export default meta;
type Story = StoryObj<MapStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		components: { Map },
		setup() {
			const selectedId = ref<string | undefined>(undefined);
			const model = computed<MapUiModel>(() => ({
				markers: args.markers,
				center: mapMock.center,
				zoom: args.zoom,
				mapType: args.mapType,
				mapStyle: args.mapStyle,
				fitMarkers: args.fitMarkers,
				autoMerge: args.autoMerge,
				mergeRadius: args.mergeRadius,
				mergeMaxZoom: args.mergeMaxZoom,
				hidePoi: args.hidePoi,
				boundaryEncoded: mapMock.boundaryEncoded,
				inverseBoundary: args.inverseBoundary,
				className: args.className,
				selectedId: selectedId.value,
			}));
			const onMarker = (m: MapMarker) => args.markerClick?.(m);
			const onSelect = (id: string | null) => {
				selectedId.value = id ?? undefined;
			};
			return { args, model, onMarker, onSelect };
		},
		template: `
			<Map v-if="args.apiKey" :key="args.apiKey" :model="model" :api-key="args.apiKey" style="--map-height: 80vh" @marker-click="onMarker" @group-click="args.groupClick" @select="onSelect" @map-click="args.mapClick" @streetview-error="args.streetviewError" />
			<p v-else>Set GOOGLE_MAPS_API_KEY in <code>.env.local</code> or enter a key in the <code>apiKey</code> control.</p>`,
	}),
};

/** Extra pins in a tight cluster downtown, so zooming out merges them into groups. */
const crowdMarkers: MapMarker[] = Array.from({ length: 14 }, (_, i) => ({
	id: `crowd-${i}`,
	position: {
		lat: 30.2672 + Math.sin(i * 1.7) * 0.004,
		lng: -97.7431 + Math.cos(i * 1.3) * 0.005,
	},
	title: `${100 + i * 7} Congress Ave, Austin, TX 78701`,
	desc: `${(i % 4) + 1} bd · ${(i % 3) + 1} ba`,
	label: i % 3 === 0 ? `$${300 + i * 25}k` : undefined,
	icon: i % 3 === 1 ? 'icon-home' : undefined,
	theme: (['primary', 'safe', 'danger', 'minor'] as const)[i % 4],
}));

export const AutoMerge: Story = {
	...Default,
	args: {
		markers: [...mapMock.markers, ...crowdMarkers],
		zoom: 12,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Zoom out to merge close pins into group pins; zoom in to split them. Tap a group pin to open its list. The list follows the group on zoom out and closes when the group splits or leaves the map.',
			},
		},
	},
};
