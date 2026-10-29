import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { computed, ref } from 'vue';
import GoogleMap from './GoogleMap.vue';
import { mapMock, type MapMarker, type MapType, type MapUiModel } from './mapModel';

type GoogleMapStoryArgs = {
	apiKey: string;
	markers: MapMarker[];
	zoom: number;
	mapType: MapType;
	fitMarkers: boolean;
	className: string;
	markerClick?: (marker: MapMarker) => void;
	mapClick?: (position: { lat: number; lng: number }) => void;
};

const meta = {
	title: 'Components/GoogleMap',
	component: GoogleMap,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Google Map with custom pins (icon, price label, image or your own element), an info window, fit-to-markers and click events. Needs a Maps JavaScript API key; set it in the `apiKey` control.',
			},
		},
	},
	argTypes: {
		apiKey: { control: 'text', description: 'Maps JavaScript API key.', table: { category: 'props' } },
		markers: { control: 'object', description: 'Pins. Each has id, position and an optional look.', table: { category: 'props', type: { summary: 'MapMarker[]' } } },
		zoom: { control: { type: 'range', min: 1, max: 20 }, table: { category: 'props' } },
		mapType: { control: 'inline-radio', options: ['roadmap', 'satellite', 'hybrid', 'terrain'], table: { category: 'props' } },
		fitMarkers: { control: 'boolean', description: 'Zoom to show every pin when the list changes.', table: { category: 'props' } },
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
		template: `<GoogleMap :model="model" :api-key="args.apiKey" @marker-click="onMarker" @select="onSelect" @map-click="args.mapClick" />`,
	}),
};
