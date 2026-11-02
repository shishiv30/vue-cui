import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { computed, ref } from 'vue';
import GoogleMap from './GoogleMap.vue';
import { articleMock } from './articleModel';
import { mapMock, type MapMarker, type MapType, type MapUiModel } from './mapModel';

type GoogleMapStoryArgs = {
	apiKey?: string;
	markers: MapMarker[];
	zoom: number;
	mapType: MapType;
	fitMarkers: boolean;
	className: string;
	markerClick?: (marker: MapMarker) => void;
	mapClick?: (position: { lat: number; lng: number }) => void;
};

const keyNote = '<p v-else>Enter a Maps JavaScript API key in the <code>apiKey</code> control to render the map.</p>';

const meta = {
	title: 'Components/GoogleMap',
	component: GoogleMap,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Google Map with custom pins (icon, price label, image or your own HTML element). Clicking a pin emits `marker-click`; set `selectedId` and a popover opens next to the pin with its `article` card, kept inside the map and flipped below the pin when there is no room above. Pins drop in, the popover fades in and slides between pins, and the map fits all pins after they are added. Needs a Maps JavaScript API key. Enter it in the `apiKey` control; the app build reads `GOOGLE_MAPS_API_KEY` from `.env.local` when `apiKey` is not passed.',
			},
		},
	},
	argTypes: {
		apiKey: { control: 'text', description: 'Maps JavaScript API key. Required in Storybook; the app build falls back to GOOGLE_MAPS_API_KEY from .env.local.', table: { category: 'props' } },
		markers: { control: 'object', description: 'Pins. Each has id, position, an optional look and an optional `article` for the popover.', table: { category: 'props', type: { summary: 'MapMarker[]' } } },
		zoom: { control: { type: 'range', min: 1, max: 20 }, table: { category: 'props' } },
		mapType: { control: 'inline-radio', options: ['roadmap', 'satellite', 'hybrid', 'terrain'], table: { category: 'props' } },
		fitMarkers: { control: 'boolean', description: 'Zoom to show every pin after pins are added or removed. Several changes in a row fit once.', table: { category: 'props' } },
		className: { control: 'text', table: { category: 'props' } },
		markerClick: { description: 'A pin was clicked.', table: { category: 'events', type: { summary: 'marker: MapMarker' } } },
		mapClick: { description: 'The empty map was clicked.', table: { category: 'events', type: { summary: 'position: { lat, lng }' } } },
	},
	args: {
		apiKey: '',
		markers: mapMock.markers,
		zoom: 12,
		mapType: 'roadmap',
		fitMarkers: true,
		className: '',
		markerClick: fn(),
		mapClick: fn(),
	},
} satisfies Meta<GoogleMapStoryArgs>;

export default meta;
type Story = StoryObj<GoogleMapStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		components: { GoogleMap },
		setup() {
			const selectedId = ref<string | undefined>(undefined);
			const model = computed<MapUiModel>(() => ({
				markers: args.markers,
				center: mapMock.center,
				zoom: args.zoom,
				mapType: args.mapType,
				fitMarkers: args.fitMarkers,
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
			<GoogleMap v-if="args.apiKey" :key="args.apiKey" :model="model" :api-key="args.apiKey" @marker-click="onMarker" @select="onSelect" @map-click="args.mapClick" />
			<p v-else>Enter a Maps JavaScript API key in the <code>apiKey</code> control to render the map.</p>`,
	}),
};
