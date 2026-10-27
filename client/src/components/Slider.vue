<template>
	<div v-if="model.images.length" ref="rootEl" class="slider" :class="model.className">
		<div
			ref="listEl"
			class="slider-list"
			@pointerdown="onDown"
			@pointermove="onMove"
			@pointerup="onUp"
			@pointercancel="onUp"
			@dragstart.prevent
		>
			<img
				v-if="model.images.length > 1"
				class="prev"
				draggable="false"
				:src="model.images[prevIndex]"
				:alt="label(prevIndex)"
			/>
			<img
				class="current"
				draggable="false"
				:src="model.images[index]"
				:alt="label(index)"
				loading="lazy"
			/>
			<img
				v-if="model.images.length > 1"
				class="next"
				draggable="false"
				:src="model.images[nextIndex]"
				:alt="label(nextIndex)"
			/>
		</div>
		<div v-if="currentMeta" class="slider-info">
			<div class="slider-info-content">
				<span class="slider-info-label">
					{{ currentMeta.index }} / {{ model.imagesMeta?.length }}
				</span>
				<b class="slider-info-title">{{ currentMeta.title }}</b>
				<p class="slider-info-description">{{ currentMeta.description }}</p>
			</div>
		</div>
		<div v-if="model.images.length > 1 && model.showProcess !== false" class="slider-processing">
			<button
				v-for="(_, dot) in model.images"
				:key="dot"
				type="button"
				:class="{ active: dot === index }"
				:data-index="dot"
				:aria-label="`Go to ${dot + 1}`"
				@click="go(dot)"
			></button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { SliderUiModel } from './sliderModel';
import { emit } from '../../js/core/event.js';
import { emitPhase } from './emitPhase';

const props = defineProps<{
	/** Configuration for the slider. An empty `images` list renders nothing. */
	model: SliderUiModel;
}>();

const emitVue = defineEmits({
	/**
	 * Fires before the frame updates. The argument is the index being shown.
	 */
	change: (index: number) => typeof index === 'number',
	/**
	 * Fires after the frame updates. The argument is the current index.
	 */
	changed: (index: number) => typeof index === 'number',
});

const rootEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const index = ref(props.model.initialIndex ?? 0);
const length = computed(() => props.model.images.length);
const prevIndex = computed(() => (index.value + length.value - 1) % length.value);
const nextIndex = computed(() => (index.value + 1) % length.value);
const currentMeta = computed(() => props.model.imagesMeta?.[index.value]);

let dragging = false;
let startX = 0;
let delta = 0;
let snapTimer = 0;

function label(i: number) {
	const alt = props.model.alt || '';
	if (!alt || length.value <= 1) {
		return alt;
	}
	return `${alt} (${i + 1} of ${length.value})`;
}

function place() {
	const el = listEl.value;
	if (!el || length.value <= 1) {
		return;
	}
	el.style.transition = 'none';
	el.style.transform = `translateX(${-el.clientWidth}px)`;
}

function go(i: number) {
	if (i === index.value || i < 0 || i >= length.value) {
		return index.value;
	}
	emit('change.slider', [rootEl.value, i]);
	emitVue('change', i);
	index.value = i;
	place();
	emit('changed.slider', [rootEl.value, index.value]);
	emitVue('changed', index.value);
	return index.value;
}

watch(
	() => props.model.initialIndex,
	(nextIndex) => {
		if (typeof nextIndex === 'number') {
			go(nextIndex);
		}
	},
);

function next() {
	return go(nextIndex.value);
}

function prev() {
	return go(prevIndex.value);
}

defineExpose({
	/** Advance to the next image. Emits change.slider, then changed.slider, and returns the index. */
	next,
	/** Return to the previous image. Emits change.slider, then changed.slider, and returns the index. */
	prev,
});

function onKey(event: KeyboardEvent) {
	const tag = document.activeElement?.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || length.value <= 1) {
		return;
	}
	if (event.key === 'ArrowLeft') {
		event.preventDefault();
		prev();
	} else if (event.key === 'ArrowRight') {
		event.preventDefault();
		next();
	}
}

function onDown(event: PointerEvent) {
	if (length.value <= 1) {
		return;
	}
	event.preventDefault();
	dragging = true;
	startX = event.clientX;
	delta = 0;
	(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	place();
}

function onMove(event: PointerEvent) {
	const el = listEl.value;
	if (!dragging || !el) {
		return;
	}
	event.preventDefault();
	delta = event.clientX - startX;
	el.style.transition = 'none';
	el.style.transform = `translateX(${-el.clientWidth + delta}px)`;
}

function onUp(event: PointerEvent) {
	const el = listEl.value;
	if (!dragging || !el) {
		return;
	}
	event.preventDefault();
	dragging = false;
	const width = el.clientWidth;
	const duration = props.model.duration ?? 0.2;
	const throttle = props.model.throttle ?? 50;
	el.style.transition = `transform ${duration}s`;
	if (delta > throttle) {
		el.style.transform = 'translateX(0px)';
		const target = prevIndex.value;
		window.clearTimeout(snapTimer);
		snapTimer = window.setTimeout(() => go(target), duration * 1100);
	} else if (delta < -throttle) {
		el.style.transform = `translateX(${-width * 2}px)`;
		const target = nextIndex.value;
		window.clearTimeout(snapTimer);
		snapTimer = window.setTimeout(() => go(target), duration * 1100);
	} else {
		el.style.transform = `translateX(${-width}px)`;
	}
	delta = 0;
}

onMounted(() => {
	emitPhase('init', 'slider', rootEl.value);
	emitPhase('initialed', 'slider', rootEl.value);
	emitPhase('load', 'slider', rootEl.value);
	emitPhase('loaded', 'slider', rootEl.value);
	emitPhase('render', 'slider', rootEl.value);
	place();
	document.addEventListener('keydown', onKey);
	emitPhase('rendered', 'slider', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'slider', rootEl.value);
	document.removeEventListener('keydown', onKey);
	window.clearTimeout(snapTimer);
	emitPhase('destroyed', 'slider', rootEl.value);
});
</script>
