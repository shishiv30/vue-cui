<template>
	<div
		v-if="model.items.length"
		ref="rootEl"
		class="shifter"
		:class="[{ 'hidden-prev': !hasPrev, 'hidden-next': !hasNext }, model.className]"
		data-role="shifter"
	>
		<button
			type="button"
			class="arrow prev circle small"
			aria-label="Previous"
			@click="prev"
		>
			<i class="icon-angle-left" role="img" aria-label="Previous items"></i>
		</button>
		<div
			ref="scrollerEl"
			class="shifter-scroller"
			data-role="scroller"
			tabindex="0"
			@scroll="onScroll"
		>
			<div v-for="item in model.items" :key="item">{{ item }}</div>
		</div>
		<button
			type="button"
			class="arrow next circle small"
			aria-label="Next"
			@click="next"
		>
			<i class="icon-angle-right" role="img" aria-label="Next items"></i>
		</button>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ShifterUiModel } from './shifterModel';
import { emitPhase } from './emitPhase';

const props = defineProps<{
	/** Configuration for the shifter. An empty `items` list renders nothing. */
	model: ShifterUiModel;
}>();

const rootEl = ref<HTMLElement | null>(null);
const scrollerEl = ref<HTMLElement | null>(null);
const hasPrev = ref(false);
const hasNext = ref(false);
let moveStep = 0;
let checkTimer = 0;

function measure() {
	const scroller = scrollerEl.value;
	if (!scroller || scroller.children.length === 0) {
		return;
	}
	const step = props.model.step ?? 0;
	if (step > 0) {
		moveStep = scroller.children[0].clientWidth * step;
	} else {
		moveStep = scroller.clientWidth;
	}
}

function checkArrow() {
	const scroller = scrollerEl.value;
	if (!scroller) {
		return;
	}
	const scrollLeft = scroller.scrollLeft;
	const clientWidth = scroller.clientWidth;
	const scrollWidth = scroller.scrollWidth;
	hasPrev.value = scrollLeft > 2;
	hasNext.value = scrollLeft + clientWidth < scrollWidth - 2;
}

function onScroll() {
	window.clearTimeout(checkTimer);
	checkTimer = window.setTimeout(checkArrow, 100);
}

function next() {
	const scroller = scrollerEl.value;
	if (!scroller) {
		return;
	}
	scroller.scrollTo(scroller.scrollLeft + moveStep, 0);
}

function prev() {
	const scroller = scrollerEl.value;
	if (!scroller) {
		return;
	}
	scroller.scrollTo(scroller.scrollLeft - moveStep, 0);
}

defineExpose({
	/** Scroll the scroller forward by `step` cards, or by the visible width when step is 0. */
	next,
	/** Scroll the scroller backward by `step` cards, or by the visible width when step is 0. */
	prev,
});

watch(
	() => [props.model.step, props.model.items],
	async () => {
		await nextTick();
		measure();
		checkArrow();
	},
);

onMounted(() => {
	emitPhase('init', 'shifter', rootEl.value);
	emitPhase('initialed', 'shifter', rootEl.value);
	emitPhase('load', 'shifter', rootEl.value);
	emitPhase('loaded', 'shifter', rootEl.value);
	emitPhase('render', 'shifter', rootEl.value);
	measure();
	checkArrow();
	emitPhase('rendered', 'shifter', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'shifter', rootEl.value);
	window.clearTimeout(checkTimer);
	emitPhase('destroyed', 'shifter', rootEl.value);
});
</script>
