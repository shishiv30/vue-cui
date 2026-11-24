<template>
	<div ref="rootEl" class="map" :class="model.className">
		<div ref="canvasEl" class="map-canvas"></div>
		<div ref="popEl" class="map-pop" :class="{ glide }" :data-placement="placement">
			<Transition name="map-pop">
				<div
					v-if="popMarker"
					ref="cardEl"
					class="map-pop-card"
					role="dialog"
					:aria-label="popMarker.title || 'Details'"
				>
					<div class="map-pop-body">
						<slot name="popover" :marker="popMarker">
							<Article v-if="popMarker.article" :model="popMarker.article" />
							<div v-else class="map-info">
								<strong v-if="popMarker.title">{{ popMarker.title }}</strong>
								<p v-if="popMarker.desc">{{ popMarker.desc }}</p>
							</div>
						</slot>
					</div>
					<button type="button" class="map-pop-close" aria-label="Close" @click="closePopover">
						&times;
					</button>
					<span class="map-pop-arrow"></span>
				</div>
			</Transition>
		</div>
		<div
			class="map-sheet"
			:class="{ active: !!activeIds }"
			role="dialog"
			:aria-label="sheetTitle"
			:aria-hidden="!activeIds"
			:inert="!activeIds"
		>
			<div class="map-sheet-head">
				<strong>{{ sheetTitle }}</strong>
				<button type="button" class="map-sheet-close" aria-label="Close" @click="closeSheet">
					&times;
				</button>
			</div>
			<div class="map-sheet-body">
				<List :model="sheetList" @click="onRowClick" />
			</div>
		</div>
		<p v-if="error" class="map-error" role="alert">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	shallowRef,
	useSlots,
	watch,
} from 'vue';
import Article from './Article.vue';
import List from './List.vue';
import type { ListTheme, ListUiModel } from './listModel';
import type { MapBounds, MapLatLng, MapMarker, MapUiModel } from './mapModel';
import { buildMergeTree, groupsAt, type MapGroup, type MapMergeTree } from './mapMerge';
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
	/** A pin was clicked, or a row in the group list. */
	'marker-click': [marker: MapMarker];
	/** A group pin was clicked and its list opened. */
	'group-click': [markers: MapMarker[]];
	/** The empty map was clicked. */
	'map-click': [position: MapLatLng];
	/** Pan or zoom finished. */
	'bounds-change': [bounds: MapBounds, zoom: number];
	/** A pin was picked, or the popover was closed (close button, Escape or a click on the map). `null` means nothing is selected. */
	select: [id: string | null];
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
/** What is on the map now: single pins and group pins, by item id. */
const shown = new Map<string, { item: MapGroup; el: HTMLElement }>();
/** Marker id to the item that holds it on the map now. */
let owners = new Map<string, MapGroup>();
let tree: MapMergeTree | null = null;
let lastZoom = -1;
const visibleIds = shallowRef(new Set<string>());
/** Members of the group whose list is open; `null` when the list is closed. */
const activeIds = shallowRef<string[] | null>(null);
/** Last opened members, kept so the list does not empty while it slides away. */
const sheetIds = shallowRef<string[]>([]);

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
	const decoded = props.model.boundaryEncoded ? decodePolylines(props.model.boundaryEncoded) : [];
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
const PIN_MERGE_MS = 320;
const GROUP_COUNT_MAX = 99;
const FIT_DEBOUNCE_MS = 120;
let glideTimer = 0;
let fitTimer = 0;
let fitKey = '';

const popMarker = computed(() => {
	const m = props.model.markers.find((item) => item.id === props.model.selectedId);
	return m && visibleIds.value.has(m.id) && (slots.popover || m.article || m.title || m.desc)
		? m
		: undefined;
});

const sheetMarkers = computed(() => {
	const ids = new Set(sheetIds.value);
	return props.model.markers.filter((m) => ids.has(m.id));
});

const sheetTitle = computed(() => `${sheetMarkers.value.length} items`);

const sheetList = computed<ListUiModel>(() => ({
	size: 'tiny',
	items: sheetMarkers.value.map((m) => ({
		title: m.title ?? m.article?.title ?? '',
		desc: m.desc ?? '',
		sup: m.label,
		image: m.imgSrc ?? m.article?.img,
		icon: m.icon,
		theme: (pinThemeClass(m.theme) || undefined) as ListTheme | undefined,
	})),
}));

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
		pin.classList.add('has-icon');
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

/** A round pin with the list icon and the member count. */
function groupElement(group: MapGroup): HTMLElement {
	const wrap = document.createElement('div');
	wrap.className = 'map-marker group';
	const count = group.memberIds.length;
	wrap.title = `${count} items`;
	const pin = document.createElement('span');
	pin.className = 'pin';
	const i = document.createElement('i');
	i.className = 'icon-th-list';
	const badge = document.createElement('span');
	badge.className = 'map-group-count';
	badge.textContent = count > GROUP_COUNT_MAX ? `${GROUP_COUNT_MAX}+` : String(count);
	pin.append(i, badge);
	wrap.append(pin);
	wrap.addEventListener('click', (e) => {
		e.stopPropagation();
		groupClick(group);
	});
	return wrap;
}

/**
 * Plays the exit animation (`leaving` or `merging`), then takes the pin off the map.
 * A pin shown again before that loses the class and stays.
 */
function retire(el: HTMLElement, cls: 'leaving' | 'merging' = 'leaving', ms = PIN_OUT_MS) {
	el.classList.add(cls);
	window.setTimeout(() => {
		if (el.classList.contains(cls)) {
			el.remove();
		}
	}, ms);
}

function pinClick(id: string, data: MapMarker) {
	const current = pins.get(id)?.data ?? data;
	closeSheet();
	emit('marker-click', current);
	emit('select', current.id);
}

function groupClick(group: MapGroup) {
	openSheet(group.memberIds);
	if (props.model.selectedId) {
		emit('select', null);
	}
	emit('group-click', sheetMarkers.value);
}

function onRowClick(_item: unknown, index: number) {
	const m = sheetMarkers.value[index];
	if (m) {
		emit('marker-click', m);
		emit('select', m.id);
	}
}

function openSheet(ids: string[]) {
	activeIds.value = ids;
	sheetIds.value = ids;
	syncSelected();
}

function closeSheet() {
	if (activeIds.value) {
		activeIds.value = null;
		syncSelected();
	}
}

/** The item on the map that holds the open list's members. */
function activeGroup() {
	const ids = activeIds.value;
	return ids ? owners.get(ids.find((id) => owners.has(id)) ?? '') : undefined;
}

/** Keep the open list on its group: follow it into a bigger group, close it when it splits. */
function syncActive() {
	const ids = activeIds.value;
	if (!ids) {
		return;
	}
	const group = activeGroup();
	const members = new Set(group?.memberIds);
	const live = ids.filter((id) => pins.has(id));
	if (!group || members.size < 2 || !live.length || !live.every((id) => members.has(id))) {
		closeSheet();
	} else if (group.memberIds.length !== ids.length) {
		openSheet(group.memberIds);
	}
}

function mergeTree() {
	const m = props.model;
	const radius = m.autoMerge === false ? 0 : (m.mergeRadius ?? 48);
	return buildMergeTree(m.markers, radius, m.mergeMaxZoom ?? 16);
}

function divPoint(position: MapLatLng) {
	return overlay?.getProjection()?.fromLatLngToDivPixel(new google.maps.LatLng(position)) ?? null;
}

function placeAt(el: HTMLElement, position: MapLatLng) {
	const point = divPoint(position);
	if (point) {
		el.style.left = `${point.x}px`;
		el.style.top = `${point.y}px`;
	}
}

/** Pixel offset from the pin to `target`, for the fly-in and fly-out keyframes. */
function setOffset(el: HTMLElement, name: 'from' | 'to', target: MapLatLng, self: MapLatLng) {
	const a = divPoint(target);
	const b = divPoint(self);
	if (a && b) {
		el.style.setProperty(`--${name}-x`, `${Math.round(a.x - b.x)}px`);
		el.style.setProperty(`--${name}-y`, `${Math.round(a.y - b.y)}px`);
	}
}

/**
 * Draw the items for the current zoom. On a zoom change, pins fly into their new group
 * (zoom out) or out of their old group (zoom in); CSS runs the motion.
 */
function renderItems(byZoom: boolean) {
	if (!pinPane || !tree) {
		return;
	}
	const zoom = Math.floor(map.value?.getZoom() ?? 0);
	const zoomIn = byZoom && lastZoom >= 0 && zoom > lastZoom;
	const zoomOut = byZoom && lastZoom >= 0 && zoom < lastZoom;
	lastZoom = zoom;
	const next = groupsAt(tree, zoom);
	const nextIds = new Set(next.map((item) => item.id));
	const nextOwners = new Map<string, MapGroup>();
	for (const item of next) {
		for (const id of item.memberIds) {
			nextOwners.set(id, item);
		}
	}
	for (const [id, entry] of shown) {
		const single = entry.item.memberIds.length === 1;
		if (nextIds.has(id) && (!single || pins.get(id)?.el === entry.el)) {
			continue;
		}
		shown.delete(id);
		const target = zoomOut ? nextOwners.get(entry.item.memberIds[0]) : undefined;
		if (target && target.id !== id) {
			placeAt(entry.el, entry.item.position);
			setOffset(entry.el, 'to', target.position, entry.item.position);
			retire(entry.el, 'merging', PIN_MERGE_MS);
		} else {
			retire(entry.el);
		}
	}
	for (const item of next) {
		const current = shown.get(item.id);
		if (current) {
			current.item = item;
			continue;
		}
		const group = item.memberIds.length > 1;
		const el = group ? groupElement(item) : pins.get(item.id)?.el;
		if (!el) {
			continue;
		}
		el.classList.remove('leaving', 'merging', 'splitting', 'merged');
		const from = zoomIn ? owners.get(item.memberIds[0]) : undefined;
		if (from && from.id !== item.id) {
			setOffset(el, 'from', from.position, item.position);
			el.classList.add('splitting');
		} else if (zoomOut && group) {
			el.classList.add('merged');
		}
		pinPane.append(el);
		shown.set(item.id, { item, el });
	}
	owners = nextOwners;
	visibleIds.value = new Set(shown.keys());
	syncActive();
	syncSelected();
	positionPins();
}

function syncMarkers() {
	if (!map.value || !pinPane) {
		return;
	}
	const next = new Map(props.model.markers.map((m) => [m.id, m]));
	for (const id of pins.keys()) {
		if (!next.has(id)) {
			pins.delete(id);
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
		pins.set(id, { data, el });
	}
	tree = mergeTree();
	renderItems(false);
	const key = [...pins.keys()].sort().join('|');
	if (props.model.fitMarkers && key !== fitKey) {
		scheduleFit(fitKey ? FIT_DEBOUNCE_MS : 0);
	}
	fitKey = key;
}

function positionPins() {
	for (const { item, el } of shown.values()) {
		placeAt(el, item.position);
	}
}

/** `on`: holds the selected pin. `active`: the group whose list is open. */
function syncSelected() {
	const id = props.model.selectedId;
	const active = activeGroup()?.id;
	for (const [key, { item, el }] of shown) {
		const on = !!id && item.memberIds.includes(id);
		const zIndex = item.memberIds.length === 1 ? pins.get(key)?.data.zIndex : undefined;
		el.classList.toggle('on', on);
		el.classList.toggle('active', key === active);
		el.style.zIndex = on ? '2147483646' : zIndex != null ? String(zIndex) : '';
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
	const point =
		entry &&
		overlay
			?.getProjection()
			?.fromLatLngToContainerPixel(new google.maps.LatLng(entry.data.position));
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
	const x = Math.min(
		Math.max(point.x - w / 2, POP_MARGIN),
		Math.max(width - w - POP_MARGIN, POP_MARGIN),
	);
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
	const entry = id && shown.has(id) ? pins.get(id) : undefined;
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
	if (e.key !== 'Escape') {
		return;
	}
	closeSheet();
	if (props.model.selectedId) {
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
		options.styles = mapStyleRules(m.mapStyle ?? defaultMapStyle, isDarkUi(), m.hidePoi !== false);
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
			if (Math.floor(map.value?.getZoom() ?? 0) !== lastZoom) {
				renderItems(true);
			}
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
			closeSheet();
			if (props.model.selectedId) {
				emit('select', null);
			}
		});
		map.value.addListener('idle', () => {
			const bounds = map.value?.getBounds();
			const group = activeGroup();
			if (group && bounds && !bounds.contains(group.position)) {
				closeSheet();
			}
			const b = bounds?.toJSON();
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
	() => [props.model.autoMerge, props.model.mergeRadius, props.model.mergeMaxZoom],
	() => {
		if (pinPane) {
			tree = mergeTree();
			renderItems(false);
		}
	},
);
watch(
	() => props.model.fitMarkers,
	(on) => on && scheduleFit(0),
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
	},
);

onBeforeUnmount(() => {
	emitPhase('destroy', 'map', rootEl.value);
	for (const { el } of shown.values()) {
		el.remove();
	}
	shown.clear();
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
