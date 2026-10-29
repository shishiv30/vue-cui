<template>
	<div
		ref="rootEl"
		class="welcome"
		:class="[{ 'welcome-loaded': loaded }, model.className]"
		:style="{ '--welcome-ratio': ratioValue }"
		data-role="welcome"
	>
		<picture class="welcome-picture">
			<source v-if="src.lg" media="(min-width: 1600px)" :srcset="src.lg" />
			<source v-if="src.md" media="(min-width: 960px)" :srcset="src.md" />
			<source v-if="src.sm" media="(min-width: 640px)" :srcset="src.sm" />
			<img
				ref="imgEl"
				class="welcome-img"
				:data-src-loaded="loaded ? '' : undefined"
				:src="fallbackSrc"
				:alt="model.alt ?? model.data.title ?? ''"
				@load="onLoad"
				@error="onError"
			/>
		</picture>
		<div
			v-for="slot in slots"
			:key="slot.key"
			class="welcome-panel"
			:class="[
				`welcome-${slot.position}`,
				slot.leaving ? 'welcome-out' : loaded ? `welcome-${slot.animation}` : '',
			]"
			:style="{ '--welcome-delay': `${slot.delay}ms` }"
		>
			<i v-if="slot.panel.icon" class="welcome-icon" :class="[slot.panel.icon, slot.panel.iconStyle]" aria-hidden="true"></i>
			<div class="welcome-text">
				<span v-if="slot.panel.sup" class="welcome-sup">{{ slot.panel.sup }}</span>
				<div class="welcome-main">
					<strong class="welcome-title">{{ slot.panel.title }}</strong>
					<span v-if="slot.panel.label" class="attr welcome-label" :class="slot.panel.labelStyle">{{ slot.panel.label }}</span>
				</div>
				<span v-if="slot.panel.sub" class="welcome-sub">{{ slot.panel.sub }}</span>
			</div>
		</div>
		<div v-if="model.data.title || model.data.subTitle" class="welcome-caption">
			<address v-if="model.data.title" class="welcome-caption-title">{{ model.data.title }}</address>
			<span v-if="model.data.subTitle" class="welcome-caption-sub">{{ model.data.subTitle }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
	welcomeAnimations,
	welcomePositions,
	type WelcomeAnimation,
	type WelcomePanel,
	type WelcomePanelPosition,
	type WelcomeUiModel,
} from './welcomeModel';
import { emitPhase } from './emitPhase';

const props = defineProps<{
	/** Image sources, panels and caption. Ratio defaults to 16/9. */
	model: WelcomeUiModel;
}>();

const rootEl = ref<HTMLElement | null>(null);
const imgEl = ref<HTMLImageElement | null>(null);
const loaded = ref(false);
interface PanelSlot {
	/** Unique per entrance, so a replaced panel is a new element and its animation plays. */
	key: number;
	/** Index in `data.list`. */
	index: number;
	panel: WelcomePanel;
	position: WelcomePanelPosition;
	animation: WelcomeAnimation;
	delay: number;
	leaving: boolean;
}

/** Time the leaving animation needs before the next panel takes the corner. Matches `.welcome-out`. */
const LEAVE_MS = 500;

const slots = ref<PanelSlot[]>([]);
let slotKey = 0;
let nextIndex = 0;
/** Slot indexes, oldest first. */
let queue: number[] = [];
let rotateTimer = 0;
let leaveTimer = 0;

const src = computed(() => props.model.src);
const fallbackSrc = computed(() => src.value.xs ?? src.value.sm ?? src.value.md ?? src.value.lg);
const ratioValue = computed(() => {
	const [w, h] = (props.model.ratio ?? '16/9').split('/').map(Number);
	return w > 0 && h > 0 ? `${w} / ${h}` : '16 / 9';
});
const corners = computed(() => {
	const list = (props.model.positions ?? welcomePositions).filter((p) => welcomePositions.includes(p));
	return list.length ? [...new Set(list)] : welcomePositions;
});

function pickAnimation(): WelcomeAnimation {
	const mode = props.model.animation ?? 'random';
	return mode === 'random' ? welcomeAnimations[Math.floor(Math.random() * welcomeAnimations.length)] : mode;
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function stopRotation() {
	window.clearInterval(rotateTimer);
	window.clearTimeout(leaveTimer);
	rotateTimer = 0;
	leaveTimer = 0;
}

/** Chosen after load, on the client only, so server and client markup match. */
function buildSlots() {
	stopRotation();
	const list = props.model.data.list;
	const places = shuffle(corners.value);
	const count = Math.min(list.length, places.length);
	const fits = list.length <= places.length;
	slots.value = list.slice(0, count).map((panel, index) => ({
		key: slotKey++,
		index,
		panel,
		position: (fits && panel.position) || places[index],
		animation: pickAnimation(),
		delay: index * 150 + 100,
		leaving: false,
	}));
	queue = slots.value.map((_, i) => i);
	nextIndex = count % Math.max(list.length, 1);
	if (!fits) {
		const seconds = props.model.interval ?? 4;
		rotateTimer = window.setInterval(rotate, Math.max(seconds, 1) * 1000);
	}
}

/** The oldest panel leaves, then the next one in the list enters the same corner. */
function rotate() {
	const target = queue.shift();
	if (target === undefined || slots.value[target].leaving) {
		return;
	}
	slots.value[target].leaving = true;
	queue.push(target);
	leaveTimer = window.setTimeout(() => {
		const list = props.model.data.list;
		const index = nextIndex;
		nextIndex = (nextIndex + 1) % list.length;
		slots.value[target] = {
			key: slotKey++,
			index,
			panel: list[index],
			position: slots.value[target].position,
			animation: pickAnimation(),
			delay: 0,
			leaving: false,
		};
	}, LEAVE_MS);
}

function onLoad() {
	if (loaded.value) {
		return;
	}
	buildSlots();
	loaded.value = true;
	emitPhase('loaded', 'welcome', rootEl.value);
}

function onError() {
	emitPhase('error', 'welcome', rootEl.value);
}

watch(
	() => [props.model.src, props.model.animation, props.model.data.list, props.model.positions, props.model.interval],
	() => {
		stopRotation();
		slots.value = [];
		loaded.value = false;
		// A cached image does not fire `load` again for the same element.
		requestAnimationFrame(() => {
			if (imgEl.value?.complete && imgEl.value.naturalWidth) {
				onLoad();
			}
		});
	},
);

onMounted(() => {
	emitPhase('init', 'welcome', rootEl.value);
	emitPhase('render', 'welcome', rootEl.value);
	// The image may have finished loading before hydration attached @load.
	if (imgEl.value?.complete && imgEl.value.naturalWidth) {
		onLoad();
	}
	emitPhase('rendered', 'welcome', rootEl.value);
});

onBeforeUnmount(() => {
	stopRotation();
	emitPhase('destroy', 'welcome', rootEl.value);
	emitPhase('destroyed', 'welcome', rootEl.value);
});
</script>
