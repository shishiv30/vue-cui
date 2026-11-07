import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { computed, ref } from 'vue';
import Map from './Map.vue';
import { defaultMapStyle, mapStyleList } from './mapStyles';
import { mapMock, type MapMarker, type MapStyleName, type MapType, type MapUiModel } from './mapModel';

type MapStoryArgs = {
	apiKey?: string;
	markers: MapMarker[];
	zoom: number;
	mapType: MapType;
	mapStyle: MapStyleName;
	fitMarkers: boolean;
	hidePoi: boolean;
	inverseBoundary: boolean;
	className: string;
	markerClick?: (marker: MapMarker) => void;
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
					'Map with custom pins (icon, price label, image or your own HTML element). Boundary mask paths are `[outerMapBounds, ...boundaryPath]` unless `inverseBoundary` is set. Clicking a pin emits `marker-click`. The current driver is Google Maps and needs a Maps JavaScript API key from `.env.local` when `apiKey` is not passed.',
			},
		},
	},
	argTypes: {
		apiKey: { control: 'text', description: 'Maps JavaScript API key. Falls back to GOOGLE_MAPS_API_KEY from .env.local.', table: { category: 'props' } },
		markers: { control: 'object', description: 'Pins. Each has id, position, an optional look and an optional `article` for the popover.', table: { category: 'props', type: { summary: 'MapMarker[]' } } },
		zoom: { control: { type: 'range', min: 1, max: 20 }, table: { category: 'props' } },
		mapType: { control: 'inline-radio', options: ['roadmap', 'satellite', 'hybrid', 'terrain'], table: { category: 'props' } },
		mapStyle: {
			control: 'inline-radio',
			options: mapStyleList.map((item) => item.value),
			description:
				'Look from `mapStyleList`. `streetview` is an overlay; switching away destroys and recycles it.',
			table: { category: 'props' },
		},
		fitMarkers: { control: 'boolean', description: 'Zoom to show every pin after pins are added or removed. Several changes in a row fit once.', table: { category: 'props' } },
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
		markerClick: { description: 'A pin was clicked.', table: { category: 'events', type: { summary: 'marker: MapMarker' } } },
		mapClick: { description: 'The empty map was clicked.', table: { category: 'events', type: { summary: 'position: { lat, lng }' } } },
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
		hidePoi: true,
		inverseBoundary: false,
		className: '',
		markerClick: fn(),
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
			<Map v-if="args.apiKey" :key="args.apiKey" :model="model" :api-key="args.apiKey" style="--map-height: 80vh" @marker-click="onMarker" @select="onSelect" @map-click="args.mapClick" @streetview-error="args.streetviewError" />
			<p v-else>Set GOOGLE_MAPS_API_KEY in <code>.env.local</code> or enter a key in the <code>apiKey</code> control.</p>`,
	}),
};
