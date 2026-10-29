<template>
	<div ref="rootEl" class="gmap" :class="model.className">
		<div ref="canvasEl" class="gmap-canvas"></div>
		<p v-if="error" class="gmap-error" role="alert">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import type { MapBounds, MapLatLng, MapMarker, MapUiModel } from './mapModel';
import { emitPhase } from './emitPhase';
import { loadGoogleMaps } from './googleMapsLoader';

const props = defineProps<{
	model: MapUiModel;
	/** Google Maps JavaScript API key. */
	apiKey: string;
}>();

const emit = defineEmits<{
	/** A pin was clicked. */
	'marker-click': [marker: MapMarker];
	/** The empty map was clicked. */
	'map-click': [position: MapLatLng];
	/** Pan or zoom finished. */
	'bounds-change': [bounds: MapBounds, zoom: number];
	/** The info window closed, or another pin was picked. `null` means nothing is selected. */
	'select': [id: string | null];
}>();

const rootEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLElement | null>(null);
const error = ref('');

const map = shallowRef<google.maps.Map | null>(null);
let markerLib: google.maps.MarkerLibrary | null = null;
let info: google.maps.InfoWindow | null = null;
const pins = new Map<string, { marker: google.maps.marker.AdvancedMarkerElement; data: MapMarker; el: HTMLElement }>();

function pinElement(data: MapMarker): HTMLElement {
	const custom = typeof data.html === 'function' ? data.html() : data.html;
	if (custom) {
		return custom;
	}
	const wrap = document.createElement('div');
	wrap.className = 'map-marker';
	const pin = document.createElement('span');
	pin.className = `pin ${data.className ?? ''}`.trim();
	if (data.color) {
		pin.style.background = data.color;
	}
	if (data.imgSrc) {
		const img = document.createElement('img');
		img.src = data.imgSrc;
		img.alt = '';
		pin.append(img);
	} else if (data.icon) {
		const i = document.createElement('i');
		i.className = data.icon;
		pin.append(i);
	} else if (data.label) {
		pin.textContent = data.label;
		pin.classList.add('has-label');
	}
	wrap.append(pin);
	return wrap;
}

function syncMarkers() {
	if (!map.value || !markerLib) {
		return;
	}
	const next = new Map(props.model.markers.map((m) => [m.id, m]));
	for (const [id, entry] of pins) {
		if (!next.has(id)) {
			entry.marker.map = null;
			pins.delete(id);
		}
	}
	for (const [id, data] of next) {
		const existing = pins.get(id);
		if (existing && existing.data === data) {
			continue;
		}
		if (existing) {
			existing.marker.map = null;
		}
		const el = pinElement(data);
		const marker = new markerLib.AdvancedMarkerElement({
			map: map.value,
			position: data.position,
			title: data.title,
			content: el,
			zIndex: data.zIndex,
		});
		marker.addListener('gmp-click', () => {
			emit('marker-click', data);
			emit('select', data.id);
		});
		pins.set(id, { marker, data, el });
	}
	syncSelected();
	if (props.model.fitMarkers) {
		fitBounds();
	}
}

function syncSelected() {
	const id = props.model.selectedId;
	for (const [key, entry] of pins) {
		entry.el.classList.toggle('on', key === id);
		entry.marker.zIndex = key === id ? 1000 : (entry.data.zIndex ?? null);
	}
	const entry = id ? pins.get(id) : undefined;
	if (!info || !map.value || !entry || (!entry.data.title && !entry.data.desc)) {
		info?.close();
		return;
	}
	const body = document.createElement('div');
	body.className = 'gmap-info';
	if (entry.data.title) {
		const strong = document.createElement('strong');
		strong.textContent = entry.data.title;
		body.append(strong);
	}
	if (entry.data.desc) {
		const p = document.createElement('p');
		p.textContent = entry.data.desc;
		body.append(p);
	}
	info.setContent(body);
	info.open({ map: map.value, anchor: entry.marker });
}

/** Zoom and pan so every marker is visible. */
function fitBounds(padding = 48) {
	if (!map.value || !pins.size) {
		return;
	}
	const bounds = new google.maps.LatLngBounds();
	for (const { data } of pins.values()) {
		bounds.extend(data.position);
	}
	map.value.fitBounds(bounds, padding);
	// A single pin makes fitBounds zoom all the way in.
	if (pins.size === 1) {
		google.maps.event.addListenerOnce(map.value, 'idle', () => {
			map.value?.setZoom(props.model.zoom ?? 14);
		});
	}
}

function panTo(position: MapLatLng, zoom?: number) {
	map.value?.panTo(position);
	if (zoom !== undefined) {
		map.value?.setZoom(zoom);
	}
}

function mapOptions(): google.maps.MapOptions {
	const m = props.model;
	return {
		center: m.center ?? { lat: 39.5, lng: -98.35 },
		zoom: m.zoom ?? 4,
		mapTypeId: m.mapType ?? 'roadmap',
		mapId: m.mapId ?? 'DEMO_MAP_ID',
		gestureHandling: m.gestureHandling ?? 'cooperative',
		zoomControl: m.controls?.zoom ?? true,
		mapTypeControl: m.controls?.mapType ?? false,
		fullscreenControl: m.controls?.fullscreen ?? false,
		streetViewControl: m.controls?.streetView ?? false,
	};
}

onMounted(async () => {
	emitPhase('init', 'gmap', rootEl.value);
	emitPhase('initialed', 'gmap', rootEl.value);
	emitPhase('load', 'gmap', rootEl.value);
	try {
		await loadGoogleMaps(props.apiKey);
		const [{ Map, InfoWindow }, markers] = await Promise.all([
			google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
			google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
		]);
		if (!canvasEl.value) {
			return;
		}
		markerLib = markers;
		map.value = new Map(canvasEl.value, mapOptions());
		info = new InfoWindow();
		info.addListener('closeclick', () => emit('select', null));
		map.value.addListener('click', (e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				emit('map-click', e.latLng.toJSON());
			}
		});
		map.value.addListener('idle', () => {
			const b = map.value?.getBounds()?.toJSON();
			if (b) {
				emit('bounds-change', b, map.value?.getZoom() ?? 0);
			}
		});
		syncMarkers();
		emitPhase('loaded', 'gmap', rootEl.value);
		emitPhase('render', 'gmap', rootEl.value);
		emitPhase('rendered', 'gmap', rootEl.value);
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Google Maps failed to load.';
	}
});

watch(() => props.model.markers, syncMarkers, { deep: false });
watch(() => props.model.selectedId, syncSelected);
watch(
	() => [props.model.center, props.model.zoom, props.model.mapType],
	() => {
		const m = map.value;
		if (!m) {
			return;
		}
		m.setMapTypeId(props.model.mapType ?? 'roadmap');
		if (!props.model.fitMarkers || !pins.size) {
			if (props.model.center) {
				m.panTo(props.model.center);
			}
			if (props.model.zoom !== undefined) {
				m.setZoom(props.model.zoom);
			}
		}
	}
);

onBeforeUnmount(() => {
	emitPhase('destroy', 'gmap', rootEl.value);
	for (const { marker } of pins.values()) {
		marker.map = null;
	}
	pins.clear();
	info?.close();
	if (map.value) {
		google.maps.event.clearInstanceListeners(map.value);
	}
	map.value = null;
	emitPhase('destroyed', 'gmap', rootEl.value);
});

defineExpose({ fitBounds, panTo });
</script>
