<template>
	<div
		v-if="stops.length >= 2"
		ref="rootEl"
		class="range-slider"
		@reset="onReset"
	>
		<div
			ref="trackEl"
			class="range-slider-track"
			@pointerdown="onTrackDown"
		>
			<div
				class="range-slider-fill"
				:style="{ left: fillLeft, width: fillWidth }"
			></div>
			<button
				type="button"
				class="range-slider-node"
				data-edge="min"
				:style="{ left: minLeft }"
				aria-label="min"
				@pointerdown="onNodeDown('min', $event)"
			></button>
			<button
				type="button"
				class="range-slider-node"
				data-edge="max"
				:style="{ left: maxLeft }"
				aria-label="max"
				@pointerdown="onNodeDown('max', $event)"
			></button>
		</div>
		<div class="range-slider-label">
			<span>{{ endLabel(0) }}</span>
			<output>{{ outputText }}</output>
			<span>{{ endLabel(stops.length - 1) }}</span>
		</div>
		<input type="hidden" data-edge="min" :value="hiddenMin" />
		<input type="hidden" data-edge="max" :value="hiddenMax" />
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { emit } from '../../js/core/event.js';
import { emitPhase } from './emitPhase';
import type { FormEnumOption } from './formEnumOption';
import { formatStop, scaleStops, type SliderFormat } from './sliderScale';

type RangePair = { min: string; max: string };

const NAME = 'rangeslider';

const props = defineProps<{
	/** Stops along the track. `no_min` / `no_max` are allowed values. */
	data?: FormEnumOption[];
	/** First generated stop when `data` is omitted. */
	min?: number | string;
	/** Last generated stop when `data` is omitted. */
	max?: number | string;
	/** Distance between generated stops. */
	step?: number | string;
	/** `number` is the default. `price` uses k/m. `sqft` uses sqft or acres. */
	format?: SliderFormat;
}>();

const modelValue = defineModel<[string, string]>({
	default: () => ['', ''],
});

const emitVue = defineEmits({
	/**
	 * Fires while the thumbs move. The argument is `{ min, max }`.
	 */
	change: (pair: RangePair) => Boolean(pair),
	/**
	 * Fires when the pointer is released. The argument is `{ min, max }`.
	 */
	changed: (pair: RangePair) => Boolean(pair),
});

const rootEl = ref<HTMLElement | null>(null);
const trackEl = ref<HTMLElement | null>(null);
const minIndex = ref(0);
const maxIndex = ref(0);
let dragEdge = '';

const stops = computed(() => {
	if (props.data && props.data.length >= 2) {
		return props.data;
	}
	return scaleStops(props.min ?? 0, props.max ?? 100, props.step ?? 1);
});

const formatName = computed(() => props.format ?? 'number');

const last = computed(() => Math.max(stops.value.length - 1, 1));

function indexOfValue(value: string, fallback: number) {
	if (value === undefined || value === null || value === '') {
		return fallback;
	}
	const exact = stops.value.findIndex((option) => option.value === value);
	return exact >= 0 ? exact : fallback;
}

function pair(): RangePair {
	return {
		min: stops.value[minIndex.value]?.value ?? '',
		max: stops.value[maxIndex.value]?.value ?? '',
	};
}

function endLabel(index: number) {
	const stop = stops.value[index]?.value ?? '';
	return formatStop(stop, formatName.value);
}

function minLeftPct() {
	return (minIndex.value / last.value) * 100;
}

function maxLeftPct() {
	return (maxIndex.value / last.value) * 100;
}

const minLeft = computed(() => `${minLeftPct()}%`);
const maxLeft = computed(() => `${maxLeftPct()}%`);
const fillLeft = computed(() => `${minLeftPct()}%`);
const fillWidth = computed(() => `${maxLeftPct() - minLeftPct()}%`);

const outputText = computed(() => {
	const minStop = stops.value[minIndex.value]?.value ?? '';
	const maxStop = stops.value[maxIndex.value]?.value ?? '';
	const format = formatName.value;
	return `${formatStop(minStop, format)} – ${formatStop(maxStop, format)}`;
});

const hiddenMin = computed(() => {
	const stop = stops.value[minIndex.value]?.value ?? '';
	return stop === 'no_min' ? '' : stop;
});

const hiddenMax = computed(() => {
	const stop = stops.value[maxIndex.value]?.value ?? '';
	return stop === 'no_max' ? '' : stop;
});

function applyFromModel() {
	const ends = last.value;
	const nextMin = indexOfValue(modelValue.value[0], 0);
	let nextMax = indexOfValue(modelValue.value[1], ends);
	if (nextMin > nextMax) {
		nextMax = nextMin;
	}
	minIndex.value = nextMin;
	maxIndex.value = nextMax;
}

function place() {
	const next = pair();
	modelValue.value = [next.min, next.max];
	const root = rootEl.value;
	root?.dispatchEvent(new Event('input', { bubbles: true }));
	emitVue('change', next);
	emit('change.rangeslider', [root, next]);
}

function indexFromEvent(event: PointerEvent) {
	const track = trackEl.value;
	if (!track) {
		return 0;
	}
	const rect = track.getBoundingClientRect();
	const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 0;
	const clamped = Math.min(1, Math.max(0, ratio));
	return Math.round(clamped * last.value);
}

function move(edge: string, index: number) {
	if (edge === 'min') {
		minIndex.value = Math.min(index, maxIndex.value);
	} else {
		maxIndex.value = Math.max(index, minIndex.value);
	}
	place();
}

function onPointerMove(event: PointerEvent) {
	if (!dragEdge) {
		return;
	}
	move(dragEdge, indexFromEvent(event));
}

function onPointerUp() {
	if (!dragEdge) {
		return;
	}
	dragEdge = '';
	window.removeEventListener('pointermove', onPointerMove);
	window.removeEventListener('pointerup', onPointerUp);
	const next = pair();
	rootEl.value?.dispatchEvent(new Event('change', { bubbles: true }));
	emitVue('changed', next);
	emit('changed.rangeslider', [rootEl.value, next]);
}

function startDrag(edge: string, event: PointerEvent) {
	dragEdge = edge;
	event.preventDefault();
	move(edge, indexFromEvent(event));
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerup', onPointerUp);
}

function onNodeDown(edge: 'min' | 'max', event: PointerEvent) {
	startDrag(edge, event);
}

function onTrackDown(event: PointerEvent) {
	const target = event.target as HTMLElement;
	if (target.dataset.edge === 'min' || target.dataset.edge === 'max') {
		return;
	}
	const index = indexFromEvent(event);
	const edge =
		Math.abs(index - minIndex.value) <= Math.abs(index - maxIndex.value) ? 'min' : 'max';
	startDrag(edge, event);
}

function onReset() {
	minIndex.value = 0;
	maxIndex.value = last.value;
	place();
}

/** Current ends as `{ min, max }` option values. */
function get(): RangePair {
	return pair();
}

applyFromModel();

watch(
	() => [modelValue.value[0], modelValue.value[1], stops.value] as const,
	() => {
		applyFromModel();
	},
);

onMounted(() => {
	emitPhase('init', NAME, rootEl.value);
	emitPhase('initialed', NAME, rootEl.value);
	emitPhase('load', NAME, rootEl.value);
	emitPhase('loaded', NAME, rootEl.value);
	emitPhase('render', NAME, rootEl.value);
	applyFromModel();
	emitPhase('setup', NAME, rootEl.value);
	emitPhase('rendered', NAME, rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', NAME, rootEl.value);
	window.removeEventListener('pointermove', onPointerMove);
	window.removeEventListener('pointerup', onPointerUp);
	emitPhase('cleanup', NAME, rootEl.value);
	emitPhase('destroyed', NAME, rootEl.value);
});

defineExpose({
	get,
});
</script>
