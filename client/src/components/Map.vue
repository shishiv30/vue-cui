<template>
	<div ref="rootEl" class="map" :class="model.className">
		<div ref="canvasEl" class="map-canvas"></div>
		<div ref="popEl" class="map-pop" :class="{ glide }" :data-placement="placement">
			<Transition name="map-pop">
				<div v-if="popMarker" ref="cardEl" class="map-pop-card" role="dialog" :aria-label="popMarker.title || 'Details'">
					<div class="map-pop-body">
						<slot name="popover" :marker="popMarker">
							<Article v-if="popMarker.article" :model="popMarker.article" />
							<div v-else class="map-info">
								<strong v-if="popMarker.title">{{ popMarker.title }}</strong>
								<p v-if="popMarker.desc">{{ popMarker.desc }}</p>
							</div>
						</slot>
					</div>
					<button type="button" class="map-pop-close" aria-label="Close" @click="closePopover">&times;</button>
					<span class="map-pop-arrow"></span>
				</div>
			</Transition>
		</div>
		<p v-if="error" class="map-error" role="alert">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useSlots, watch } from 'vue';
import Article from './Article.vue';
import type { MapBounds, MapLatLng, MapMarker, MapUiModel } from './mapModel';
import { decodePolylines } from './mapPolyline';
import { defaultMapStyle, isDarkUi, mapStyleOverlay, mapStyleRules } from './mapStyles';
import { emitPhase } from './emitPhase';
import { loadGoogleMaps } from './googleMapsLoader';

const props = defineProps<{
	model: MapUiModel;
	/** Google Maps JavaScript API key. Defaults to GOOGLE_MAPS_API_KEY from .env.local. */
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
	/** Street View overlay could not be opened for the current center. */
	'streetview-error': [];
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
let overlay: google.maps.OverlayView | null = null;
let pinPane: Element | null = null;
let resizeObserver: ResizeObserver | null = null;
const pins = new Map<string, { data: MapMarker; el: HTMLElement }>();
let maskPolygon: google.maps.Polygon | null = null;
let outlineLines: google.maps.Polyline[] = [];
let streetView: google.maps.StreetViewPanorama | null = null;
let streetViewEl: HTMLElement | null = null;
let streetViewGen = 0;
let themeObserver: MutationObserver | null = null;
let themeMedia: MediaQueryList | null = null;
let pinningView = false;

function maskFill() {
	return {
		fillColor: isDarkUi() ? '#08090c' : '#000000',
		fillOpacity: isDarkUi() ? 0.42 : 0.3,
		strokeOpacity: 0,
		clickable: false,
		geodesic: false,
	};
}

function outlineSolid() {
	return {
		strokeColor: isDarkUi() ? '#c5ccd4' : '#ffffff',
		strokeOpacity: 1,
		strokeWeight: 1,
		geodesic: true,
		clickable: false,
	};
}

function ringWinding(ring: MapLatLng[]) {
	let sum = 0;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		sum += (ring[i].lng - ring[j].lng) * (ring[i].lat + ring[j].lat);
	}
	return sum;
}

function oppositeWinding(ring: MapLatLng[], reference: MapLatLng[]) {
	const copy = [...ring];
	if (Math.sign(ringWinding(copy)) === Math.sign(ringWinding(reference))) {
		copy.reverse();
	}
	return copy;
}

/** Current viewport rectangle (padded). First path of the inverse mask. */
function outerMapBounds(): MapLatLng[] | null {
	const bounds = map.value?.getBounds();
	if (!bounds) {
		return null;
	}
	const ne = bounds.getNorthEast();
	const sw = bounds.getSouthWest();
	const padLat = (ne.lat() - sw.lat()) * 0.08;
	const spanLng = ne.lng() - sw.lng();
	const padLng = (spanLng < 0 ? spanLng + 360 : spanLng) * 0.08;
	return [
		{ lat: ne.lat() + padLat, lng: sw.lng() - padLng },
		{ lat: ne.lat() + padLat, lng: ne.lng() + padLng },
		{ lat: sw.lat() - padLat, lng: ne.lng() + padLng },
		{ lat: sw.lat() - padLat, lng: sw.lng() - padLng },
	];
}

function boundaryPath(): MapLatLng[][] {
	return boundaryRings();
}

/**
 * Inverse fill: [outerMapBounds, ...boundaryPath].
 * If `inverseBoundary` is true, fill the polygon itself instead.
 */
function boundaryPolygon(): MapLatLng[][] | null {
	const path = boundaryPath();
	if (!path.length) {
		return null;
	}
	if (props.model.inverseBoundary) {
		return path;
	}
	const outer = outerMapBounds();
	if (!outer) {
		return null;
	}
	return [outer].concat(path.map((ring) => oppositeWinding(ring, outer)));
}

function closedRing(ring: MapLatLng[]) {
	if (!ring.length) {
		return ring;
	}
	const first = ring[0];
	const last = ring[ring.length - 1];
	if (first.lat === last.lat && first.lng === last.lng) {
		return ring;
	}
	return [...ring, first];
}

function boundaryRings(): MapLatLng[][] {
	const decoded = props.model.boundaryEncoded
		? decodePolylines(props.model.boundaryEncoded)
		: [];
	return [...decoded, ...(props.model.boundary ?? [])].filter((ring) => ring.length >= 3);
}

function clearBoundary() {
	maskPolygon?.setMap(null);
	maskPolygon = null;
	for (const line of outlineLines) {
		line.setMap(null);
	}
	outlineLines = [];
}

function syncMaskLayer() {
	const m = map.value;
	const paths = boundaryPolygon();
	if (!m || !paths) {
		maskPolygon?.setMap(null);
		maskPolygon = null;
		return;
	}
	if (!maskPolygon) {
		maskPolygon = new google.maps.Polygon({
			...maskFill(),
			paths,
			map: m,
		});
		return;
	}
	maskPolygon.setOptions(maskFill());
	maskPolygon.setPaths(paths);
	maskPolygon.setMap(m);
}

function syncBoundary() {
	const m = map.value;
	const rings = boundaryRings();
	if (!m || !rings.length) {
		clearBoundary();
		return;
	}
	for (const line of outlineLines) {
		line.setMap(null);
	}
	outlineLines = rings.map(
		(ring) =>
			new google.maps.Polyline({
				...outlineSolid(),
				path: closedRing(ring),
				map: m,
			}),
	);
	syncMaskLayer();
}

function recycleStreetView() {
	streetViewGen += 1;
	if (streetView) {
		google.maps.event.clearInstanceListeners(streetView);
		streetView.setVisible(false);
	}
	streetView = null;
	streetViewEl?.remove();
	streetViewEl = null;
}

async function syncStreetView() {
	const m = map.value;
	const root = rootEl.value;
	const name = props.model.mapStyle ?? defaultMapStyle;
	if (!m || !root || mapStyleOverlay(name) !== 'streetview') {
		recycleStreetView();
		return;
	}
	const gen = (streetViewGen += 1);
	const pos = m.getCenter();
	if (!pos) {
		recycleStreetView();
		return;
	}
	if (!streetViewEl) {
		streetViewEl = document.createElement('div');
		streetViewEl.className = 'map-streetview';
		root.append(streetViewEl);
	}
	try {
		const lib = (await google.maps.importLibrary('streetView')) as google.maps.StreetViewLibrary;
		if (gen !== streetViewGen || !streetViewEl) {
			return;
		}
		const result = await new lib.StreetViewService().getPanorama({ location: pos, radius: 80 });
		if (gen !== streetViewGen || !streetViewEl) {
			return;
		}
		const location = result.data.location?.latLng ?? pos;
		if (streetView) {
			streetView.setPosition(location);
			streetView.setVisible(true);
			return;
		}
		streetView = new lib.StreetViewPanorama(streetViewEl, {
			position: location,
			visible: true,
			enableCloseButton: false,
			addressControl: false,
			fullscreenControl: false,
			motionTracking: false,
			linksControl: true,
			panControl: true,
			zoomControl: true,
		});
	} catch {
		if (gen !== streetViewGen) {
			return;
		}
		recycleStreetView();
		emit('streetview-error');
	}
}

const POP_GAP = 12;
const POP_MARGIN = 8;
const PIN_EDGE = 16;
const PIN_OUT_MS = 200;
const FIT_DEBOUNCE_MS = 120;
let glideTimer = 0;
let fitTimer = 0;
let fitKey = '';

const popMarker = computed(() => {
	const m = props.model.markers.find((item) => item.id === props.model.selectedId);
	return m && (slots.popover || m.article || m.title || m.desc) ? m : undefined;
});

function pinThemeClass(theme?: string) {
	if (!theme || theme === 'default') {
		return '';
	}
	return theme === 'primary' ? 'major' : theme;
}

function pinElement(data: MapMarker): HTMLElement {
	const wrap = document.createElement('div');
	const theme = pinThemeClass(data.theme);
	wrap.className = `map-marker${theme ? ` ${theme}` : ''}${data.anchor === 'bottom' ? ' anchor-bottom' : ''}`;
	const custom = typeof data.html === 'function' ? data.html(data) : data.html;
	if (custom) {
		wrap.classList.add('custom');
		wrap.append(custom);
		return wrap;
	}
	const pin = document.createElement('span');
	pin.className = `pin ${data.className ?? ''}`.trim();
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
	} else {
		pin.classList.add('dot');
		wrap.classList.add('dot');
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
		a.theme === b.theme &&
		a.className === b.className &&
		a.html === b.html &&
		a.anchor === b.anchor
	);
}

/** Plays the exit animation, then takes the pin off the map. */
function retire(entry: { el: HTMLElement }) {
	entry.el.classList.add('leaving');
	window.setTimeout(() => {
		entry.el.remove();
	}, PIN_OUT_MS);
}

function pinClick(id: string, data: MapMarker) {
	const current = pins.get(id)?.data ?? data;
	emit('marker-click', current);
	emit('select', current.id);
}

function syncMarkers() {
	if (!map.value || !pinPane) {
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
			existing.el.title = data.title ?? '';
			existing.el.style.zIndex = data.zIndex != null ? String(data.zIndex) : '';
			continue;
		}
		if (existing) {
			existing.el.remove();
		}
		const el = pinElement(data);
		el.style.setProperty('--i', String(Math.min(order++, 12)));
		el.title = data.title ?? '';
		if (data.zIndex != null) {
			el.style.zIndex = String(data.zIndex);
		}
		if (existing) {
			el.classList.add('static');
		}
		el.addEventListener('click', (e) => {
			e.stopPropagation();
			pinClick(id, data);
		});
		pinPane.append(el);
		pins.set(id, { data, el });
	}
	syncSelected();
	positionPins();
	const key = [...pins.keys()].sort().join('|');
	if (props.model.fitMarkers && key !== fitKey) {
		scheduleFit(fitKey ? FIT_DEBOUNCE_MS : 0);
	}
	fitKey = key;
}

function positionPins() {
	const proj = overlay?.getProjection();
	if (!proj) {
		return;
	}
	for (const { data, el } of pins.values()) {
		const point = proj.fromLatLngToDivPixel(new google.maps.LatLng(data.position));
		if (!point) {
			continue;
		}
		el.style.left = `${point.x}px`;
		el.style.top = `${point.y}px`;
	}
}

function syncSelected() {
	const id = props.model.selectedId;
	for (const [key, entry] of pins) {
		entry.el.classList.toggle('on', key === id);
		entry.el.style.zIndex = key === id
			? '2147483646'
			: (entry.data.zIndex != null ? String(entry.data.zIndex) : '');
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

/** Pan (animated) so the selected pin sits fully inside the map, with a small edge inset. */
function ensureVisible() {
	const m = map.value;
	const canvas = canvasEl.value;
	const id = props.model.selectedId;
	const entry = id ? pins.get(id) : undefined;
	const proj = overlay?.getProjection();
	if (!m || !canvas || !entry || !proj || pinningView) {
		return;
	}
	const point = proj.fromLatLngToContainerPixel(new google.maps.LatLng(entry.data.position));
	if (!point) {
		return;
	}
	const scale = entry.el.classList.contains('dot') ? 1 : 1.22;
	const pinW = Math.max(entry.el.offsetWidth, 8) * scale;
	const pinH = Math.max(entry.el.offsetHeight, 8) * scale;
	const left = point.x - pinW / 2;
	const right = point.x + pinW / 2;
	const top = point.y - (entry.data.anchor === 'bottom' ? pinH : pinH / 2);
	const bottom = top + pinH;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	let dx = 0;
	let dy = 0;
	if (left < PIN_EDGE) {
		dx = left - PIN_EDGE;
	} else if (right > width - PIN_EDGE) {
		dx = right - (width - PIN_EDGE);
	}
	if (top < PIN_EDGE) {
		dy = top - PIN_EDGE;
	} else if (bottom > height - PIN_EDGE) {
		dy = bottom - (height - PIN_EDGE);
	}
	const placed = placePopover();
	if (placed) {
		const { y, h } = placed;
		if (y < POP_MARGIN) {
			dy = Math.min(dy, y - POP_MARGIN);
		} else if (y + h > placed.height - POP_MARGIN) {
			dy = Math.max(dy, y + h - (placed.height - POP_MARGIN));
		}
	}
	if (!dx && !dy) {
		return;
	}
	pinningView = true;
	m.panBy(dx, dy);
	google.maps.event.addListenerOnce(m, 'idle', () => {
		pinningView = false;
	});
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
	const options: google.maps.MapOptions = {
		center: m.center ?? { lat: 39.5, lng: -98.35 },
		zoom: m.zoom ?? 4,
		mapTypeId: m.mapType ?? 'roadmap',
		gestureHandling: m.gestureHandling ?? 'cooperative',
		zoomControl: m.controls?.zoom ?? true,
		mapTypeControl: m.controls?.mapType ?? false,
		fullscreenControl: m.controls?.fullscreen ?? false,
		streetViewControl: m.controls?.streetView ?? false,
	};
	// A mapId turns on cloud vector styling and Google then ignores JSON `styles`.
	if (m.mapId) {
		options.mapId = m.mapId;
	} else {
		options.styles = mapStyleRules(
			m.mapStyle ?? defaultMapStyle,
			isDarkUi(),
			m.hidePoi !== false,
		);
	}
	return options;
}

function applyMapStyles() {
	if (!map.value || props.model.mapId) {
		return;
	}
	map.value.setOptions({
		styles: mapStyleRules(
			props.model.mapStyle ?? defaultMapStyle,
			isDarkUi(),
			props.model.hidePoi !== false,
		),
	});
	maskPolygon?.setOptions(maskFill());
	const line = outlineSolid();
	for (const item of outlineLines) {
		item.setOptions(line);
	}
}

function watchTheme() {
	themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
	themeMedia.addEventListener('change', applyMapStyles);
	themeObserver = new MutationObserver(applyMapStyles);
	themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

onMounted(async () => {
	emitPhase('init', 'map', rootEl.value);
	emitPhase('initialed', 'map', rootEl.value);
	emitPhase('load', 'map', rootEl.value);
	try {
		await loadGoogleMaps(props.apiKey || defaultApiKey);
		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
		if (!canvasEl.value) {
			return;
		}
		map.value = new Map(canvasEl.value, mapOptions());
		watchTheme();
		overlay = new google.maps.OverlayView();
		overlay.onAdd = () => {
			pinPane = overlay?.getPanes()?.overlayMouseTarget ?? null;
			syncMarkers();
		};
		overlay.onRemove = () => {
			pinPane = null;
		};
		overlay.draw = () => {
			positionPins();
			placePopover();
		};
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
		map.value.addListener('bounds_changed', syncMaskLayer);
		syncBoundary();
		syncMarkers();
		void syncStreetView();
		emitPhase('loaded', 'map', rootEl.value);
		emitPhase('render', 'map', rootEl.value);
		emitPhase('rendered', 'map', rootEl.value);
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'Google Maps failed to load.';
	}
});

// A copy, so pushing to or splicing the same array also counts as a change.
watch(() => [...props.model.markers], syncMarkers);
watch(
	() => [
		props.model.inverseBoundary,
		props.model.boundaryEncoded?.join('\n') ?? '',
		...(props.model.boundary ?? []).map((ring) => [...ring]),
	],
	syncBoundary,
);
watch(
	() => props.model.selectedId,
	async () => {
		syncSelected();
		await nextTick();
		ensureVisible();
	},
);
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
	}
	ensureVisible();
});
watch(
	() => props.model.fitMarkers,
	(on) => on && scheduleFit(0)
);
watch(
	() => [props.model.mapStyle ?? defaultMapStyle, props.model.hidePoi !== false],
	() => {
		applyMapStyles();
		void syncStreetView();
	},
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
	emitPhase('destroy', 'map', rootEl.value);
	for (const { el } of pins.values()) {
		el.remove();
	}
	pins.clear();
	window.clearTimeout(fitTimer);
	window.clearTimeout(glideTimer);
	document.removeEventListener('keydown', onKeydown);
	themeMedia?.removeEventListener('change', applyMapStyles);
	themeMedia = null;
	themeObserver?.disconnect();
	themeObserver = null;
	resizeObserver?.disconnect();
	clearBoundary();
	recycleStreetView();
	overlay?.setMap(null);
	overlay = null;
	if (map.value) {
		google.maps.event.clearInstanceListeners(map.value);
	}
	map.value = null;
	emitPhase('destroyed', 'map', rootEl.value);
});

defineExpose({ fitBounds, panTo });
</script>
