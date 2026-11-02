<template>
	<div ref="rootEl" class="gmap" :class="model.className">
		<div ref="canvasEl" class="gmap-canvas"></div>
		<div ref="popEl" class="gmap-pop" :class="{ glide }" :data-placement="placement">
			<Transition name="gmap-pop">
				<div v-if="popMarker" ref="cardEl" class="gmap-pop-card" role="dialog" :aria-label="popMarker.title || 'Details'">
					<div class="gmap-pop-body">
						<slot name="popover" :marker="popMarker">
							<Article v-if="popMarker.article" :model="popMarker.article" />
							<div v-else class="gmap-info">
								<strong v-if="popMarker.title">{{ popMarker.title }}</strong>
								<p v-if="popMarker.desc">{{ popMarker.desc }}</p>
							</div>
						</slot>
					</div>
					<button type="button" class="gmap-pop-close" aria-label="Close" @click="closePopover">&times;</button>
					<span class="gmap-pop-arrow"></span>
				</div>
			</Transition>
		</div>
		<p v-if="error" class="gmap-error" role="alert">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useSlots, watch } from 'vue';
import Article from './Article.vue';
import type { MapBounds, MapLatLng, MapMarker, MapUiModel } from './mapModel';
import { emitPhase } from './emitPhase';
import { loadGoogleMaps } from './googleMapsLoader';

const props = defineProps<{
	model: MapUiModel;
	/** Google Maps JavaScript API key. Defaults to GOOGLE_MAPS_API_KEY from .env.local in the app build. */
	apiKey?: string;
}>();

const emit = defineEmits<{
	/** A pin was clicked. */
	'marker-click': [marker: MapMarker];
	/** The empty map was clicked. */
	'map-click': [position: MapLatLng];
	/** Pan or zoom finished. */
	'bounds-change': [bounds: MapBounds, zoom: number];
	/** A pin was picked, or the popover was closed (close button, Escape or a click on the map). `null` means nothing is selected. */
	'select': [id: string | null];
}>();

const defaultApiKey = typeof __GOOGLE_MAPS_API_KEY__ === 'string' ? __GOOGLE_MAPS_API_KEY__ : '';
const slots = useSlots();
const rootEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLElement | null>(null);
const popEl = ref<HTMLElement | null>(null);
const cardEl = ref<HTMLElement | null>(null);
const error = ref('');
const placement = ref<'top' | 'bottom'>('top');
/** True while the popover slides from one pin to another. */
const glide = ref(false);

const map = shallowRef<google.maps.Map | null>(null);
let markerLib: google.maps.MarkerLibrary | null = null;
let overlay: google.maps.OverlayView | null = null;
let resizeObserver: ResizeObserver | null = null;
const pins = new Map<string, { marker: google.maps.marker.AdvancedMarkerElement; data: MapMarker; el: HTMLElement }>();

const POP_GAP = 12;
const POP_MARGIN = 8;
const PIN_OUT_MS = 200;
const FIT_DEBOUNCE_MS = 120;
let glideTimer = 0;
let fitTimer = 0;
let fitKey = '';

const popMarker = computed(() => {
	const m = props.model.markers.find((item) => item.id === props.model.selectedId);
	return m && (slots.popover || m.article || m.title || m.desc) ? m : undefined;
});

function pinElement(data: MapMarker): HTMLElement {
	const wrap = document.createElement('div');
	wrap.className = `map-marker${data.anchor === 'bottom' ? ' anchor-bottom' : ''}`;
	const custom = typeof data.html === 'function' ? data.html(data) : data.html;
	if (custom) {
		wrap.classList.add('custom');
		wrap.append(custom);
		return wrap;
	}
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

/** Same look, so the element can stay and only the position or title moves. */
function sameLook(a: MapMarker, b: MapMarker) {
	return (
		a.icon === b.icon &&
		a.label === b.label &&
		a.imgSrc === b.imgSrc &&
		a.color === b.color &&
		a.className === b.className &&
		a.html === b.html &&
		a.anchor === b.anchor
	);
}

/** Plays the exit animation, then takes the pin off the map. */
function retire(entry: { marker: google.maps.marker.AdvancedMarkerElement; el: HTMLElement }) {
	entry.el.classList.add('leaving');
	window.setTimeout(() => {
		entry.marker.map = null;
	}, PIN_OUT_MS);
}

function syncMarkers() {
	if (!map.value || !markerLib) {
		return;
	}
	const next = new Map(props.model.markers.map((m) => [m.id, m]));
	for (const [id, entry] of pins) {
		if (!next.has(id)) {
			pins.delete(id);
			retire(entry);
		}
	}
	// New pins drop in one after another; the delay is capped so a big batch stays quick.
	let order = 0;
	for (const [id, data] of next) {
		const existing = pins.get(id);
		if (existing && existing.data === data) {
			continue;
		}
		if (existing && sameLook(existing.data, data)) {
			existing.data = data;
			existing.marker.position = data.position;
			existing.marker.title = data.title ?? '';
			existing.marker.zIndex = data.zIndex ?? null;
			continue;
		}
		if (existing) {
			existing.marker.map = null;
		}
		const el = pinElement(data);
		el.style.setProperty('--i', String(Math.min(order++, 12)));
		if (existing) {
			el.classList.add('static');
		}
		const marker = new markerLib.AdvancedMarkerElement({
			map: map.value,
			position: data.position,
			title: data.title,
			content: el,
			zIndex: data.zIndex,
		});
		marker.addListener('gmp-click', () => {
			const current = pins.get(id)?.data ?? data;
			emit('marker-click', current);
			emit('select', current.id);
		});
		pins.set(id, { marker, data, el });
	}
	syncSelected();
	const key = [...pins.keys()].sort().join('|');
	if (props.model.fitMarkers && key !== fitKey) {
		scheduleFit(fitKey ? FIT_DEBOUNCE_MS : 0);
	}
	fitKey = key;
}

function syncSelected() {
	const id = props.model.selectedId;
	for (const [key, entry] of pins) {
		entry.el.classList.toggle('on', key === id);
		entry.marker.zIndex = key === id ? 1000 : (entry.data.zIndex ?? null);
	}
}

/**
 * Put the popover next to the selected pin: above it, or below when there is no room above,
 * kept inside the map, with the arrow pointing at the pin. Runs on every map redraw.
 */
function placePopover() {
	const outer = popEl.value;
	const card = cardEl.value;
	const canvas = canvasEl.value;
	const entry = popMarker.value ? pins.get(popMarker.value.id) : undefined;
	const point = entry && overlay?.getProjection()?.fromLatLngToContainerPixel(new google.maps.LatLng(entry.data.position));
	if (!outer || !card || !canvas || !entry || !point) {
		return null;
	}
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const pinHeight = entry.el.offsetHeight;
	const pinTop = point.y - (entry.data.anchor === 'bottom' ? pinHeight : pinHeight / 2);
	const pinBottom = pinTop + pinHeight;
	const w = card.offsetWidth;
	const h = card.offsetHeight;
	const roomAbove = pinTop - POP_GAP - POP_MARGIN;
	const roomBelow = height - pinBottom - POP_GAP - POP_MARGIN;
	const above = roomAbove >= h || (roomBelow < h && roomAbove >= roomBelow);
	const y = above ? pinTop - POP_GAP - h : pinBottom + POP_GAP;
	const x = Math.min(Math.max(point.x - w / 2, POP_MARGIN), Math.max(width - w - POP_MARGIN, POP_MARGIN));
	const arrow = Math.min(Math.max(point.x - x, 16), Math.max(w - 16, 16));
	outer.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
	outer.style.setProperty('--arrow-x', `${Math.round(arrow)}px`);
	placement.value = above ? 'top' : 'bottom';
	return { point, y, h, width, height };
}

/** Pan the map when the popover would be cut off, or the pin itself is off screen. */
function ensureVisible() {
	const placed = placePopover();
	const m = map.value;
	if (!placed || !m) {
		return;
	}
	const { point, y, h, width, height } = placed;
	if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) {
		const id = popMarker.value?.id;
		const target = id ? pins.get(id)?.data.position : undefined;
		if (target) {
			m.panTo(target);
		}
		return;
	}
	if (y < POP_MARGIN) {
		m.panBy(0, y - POP_MARGIN);
	} else if (y + h > height - POP_MARGIN) {
		m.panBy(0, y + h - (height - POP_MARGIN));
	}
}

function closePopover() {
	emit('select', null);
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape' && props.model.selectedId) {
		emit('select', null);
	}
}

function scheduleFit(delay = FIT_DEBOUNCE_MS) {
	window.clearTimeout(fitTimer);
	fitTimer = window.setTimeout(() => fitBounds(), delay);
}

/** Zoom and pan so every marker is visible. */
function fitBounds(padding = props.model.fitPadding ?? 48) {
	const m = map.value;
	if (!m || !pins.size) {
		return;
	}
	const bounds = new google.maps.LatLngBounds();
	for (const { data } of pins.values()) {
		bounds.extend(data.position);
	}
	// One pin, or several on the same spot: fitBounds would zoom all the way in.
	if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
		m.panTo(bounds.getCenter());
		m.setZoom(props.model.zoom ?? 14);
		return;
	}
	m.fitBounds(bounds, padding);
	const cap = props.model.fitMaxZoom ?? 16;
	google.maps.event.addListenerOnce(m, 'idle', () => {
		if ((m.getZoom() ?? 0) > cap) {
			m.setZoom(cap);
		}
	});
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
		await loadGoogleMaps(props.apiKey || defaultApiKey);
		const [{ Map }, markers] = await Promise.all([
			google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
			google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
		]);
		if (!canvasEl.value) {
			return;
		}
		markerLib = markers;
		map.value = new Map(canvasEl.value, mapOptions());
		// The overlay only exists to get the lat/lng to pixel projection and a redraw on every move.
		overlay = new google.maps.OverlayView();
		overlay.onAdd = () => {};
		overlay.onRemove = () => {};
		overlay.draw = placePopover;
		overlay.setMap(map.value);
		resizeObserver = new ResizeObserver(placePopover);
		document.addEventListener('keydown', onKeydown);
		map.value.addListener('click', (e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				emit('map-click', e.latLng.toJSON());
			}
			if (props.model.selectedId) {
				emit('select', null);
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

// A copy, so pushing to or splicing the same array also counts as a change.
watch(() => [...props.model.markers], syncMarkers);
watch(() => props.model.selectedId, syncSelected);
watch(popMarker, async (current, previous) => {
	// Moving between two pins slides the popover; opening from nothing just fades in.
	glide.value = !!current && !!previous && current.id !== previous.id;
	window.clearTimeout(glideTimer);
	if (glide.value) {
		glideTimer = window.setTimeout(() => (glide.value = false), 400);
	}
	await nextTick();
	resizeObserver?.disconnect();
	if (cardEl.value) {
		resizeObserver?.observe(cardEl.value);
		ensureVisible();
	}
});
watch(
	() => props.model.fitMarkers,
	(on) => on && scheduleFit(0)
);
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
	window.clearTimeout(fitTimer);
	window.clearTimeout(glideTimer);
	document.removeEventListener('keydown', onKeydown);
	resizeObserver?.disconnect();
	overlay?.setMap(null);
	overlay = null;
	if (map.value) {
		google.maps.event.clearInstanceListeners(map.value);
	}
	map.value = null;
	emitPhase('destroyed', 'gmap', rootEl.value);
});

defineExpose({ fitBounds, panTo });
</script>
