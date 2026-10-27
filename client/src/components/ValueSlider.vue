<template>
	<div
		v-if="stops.length >= 2"
		ref="rootEl"
		class="value-slider"
	>
		<div
			ref="trackEl"
			class="value-slider-track"
			@pointerdown="onTrackDown"
		>
			<div
				class="value-slider-fill"
				:style="{ width: nodeLeft }"
			></div>
			<button
				type="button"
				class="value-slider-node"
				:style="{ left: nodeLeft }"
				aria-label="value"
				@pointerdown="onNodeDown"
			></button>
		</div>
		<div class="value-slider-label">
			<span>{{ endLabel(0) }}</span>
			<output>{{ outputText }}</output>
			<span>{{ endLabel(stops.length - 1) }}</span>
		</div>
		<input type="hidden" :value="hiddenValue" />
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { emit } from '../../js/core/event.js';
import { emitPhase } from './emitPhase';
import type { FormEnumOption } from './formEnumOption';
import { formatStop, scaleStops, type SliderFormat } from './sliderScale';

const NAME = 'valueslider';

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

const modelValue = defineModel<number | string>({
	default: '',
});

const emitVue = defineEmits({
	/**
	 * Fires while the thumb moves. The argument is the selected stop value.
	 */
	change: (value: string) => typeof value === 'string',
	/**
	 * Fires when the pointer is released. The argument is the selected stop value.
	 */
	changed: (value: string) => typeof value === 'string',
});

const rootEl = ref<HTMLElement | null>(null);
const trackEl = ref<HTMLElement | null>(null);
const index = ref(0);
let dragging = false;

const stops = computed(() => {
	if (props.data && props.data.length >= 2) {
		return props.data;
	}
	return scaleStops(props.min ?? 0, props.max ?? 100, props.step ?? 1);
});

const formatName = computed(() => props.format ?? 'number');
const last = computed(() => Math.max(stops.value.length - 1, 1));

function currentValue() {
	return stops.value[index.value]?.value ?? '';
}

function endLabel(stopIndex: number) {
	return formatStop(stops.value[stopIndex]?.value ?? '', formatName.value);
}

function indexOfValue(value: number | string) {
	if (value === undefined || value === null || value === '') {
		return 0;
	}
	const exact = stops.value.findIndex((option) => option.value === String(value));
	return exact >= 0 ? exact : 0;
}

const nodeLeft = computed(() => `${(index.value / last.value) * 100}%`);
const outputText = computed(() => formatStop(currentValue(), formatName.value));
const hiddenValue = computed(() => {
	const stop = currentValue();
	return stop === 'no_min' || stop === 'no_max' ? '' : stop;
});

function applyFromModel() {
	index.value = indexOfValue(modelValue.value);
}

function place() {
	const next = currentValue();
	modelValue.value = next;
	const root = rootEl.value;
	root?.dispatchEvent(new Event('input', { bubbles: true }));
	emitVue('change', next);
	emit('change.valueslider', [root, next]);
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

function move(nextIndex: number) {
	index.value = nextIndex;
	place();
}

function onPointerMove(event: PointerEvent) {
	if (!dragging) {
		return;
	}
	move(indexFromEvent(event));
}

function onPointerUp() {
	if (!dragging) {
		return;
	}
	dragging = false;
	window.removeEventListener('pointermove', onPointerMove);
	window.removeEventListener('pointerup', onPointerUp);
	const next = currentValue();
	rootEl.value?.dispatchEvent(new Event('change', { bubbles: true }));
	emitVue('changed', next);
	emit('changed.valueslider', [rootEl.value, next]);
}

function startDrag(event: PointerEvent) {
	dragging = true;
	event.preventDefault();
	move(indexFromEvent(event));
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerup', onPointerUp);
}

function onNodeDown(event: PointerEvent) {
	startDrag(event);
}

function onTrackDown(event: PointerEvent) {
	const target = event.target as HTMLElement;
	if (target.classList.contains('value-slider-node')) {
		return;
	}
	startDrag(event);
}

/** Current stop value. */
function get() {
	return currentValue();
}

applyFromModel();

watch(
	() => [modelValue.value, stops.value] as const,
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
