<template>
	<div
		v-if="model.images.length"
		ref="rootEl"
		class="player"
		:class="[{ playing, reverse: !direction }, model.style || 'slide', model.className]"
		:style="durationStyle"
	>
		<img
			:src="firstSrc"
			alt="Player"
			:class="{ next: !currentIsLast }"
			@animationiteration="onFirstIteration"
		/>
		<img
			:src="lastSrc"
			alt="Player"
			:class="{ next: currentIsLast }"
			@animationiteration="onLastIteration"
		/>
		<div v-if="model.showControl !== false" class="buttons">
			<button
				type="button"
				aria-label="prev"
				class="player-prev"
				@click="goPrev(true)"
			></button>
			<button
				type="button"
				aria-label="pause/play"
				class="player-toggle"
				@click="toggle"
			></button>
			<button
				type="button"
				aria-label="next"
				class="player-next"
				@click="goNext(true)"
			></button>
		</div>
		<div v-if="model.showProcess !== false" class="player-processing">
			<button
				v-for="(_, i) in model.images"
				:key="i"
				type="button"
				:data-index="i"
				:class="{ active: i === index }"
				:aria-label="`Go to ${i + 1}`"
				:aria-current="i === index ? 'true' : undefined"
				@click="goTo(i)"
			></button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PlayerUiModel } from './playerModel';
import { emit } from '../../js/core/event.js';
import { emitPhase } from './emitPhase';

const props = defineProps<{
	/** Configuration for the player. An empty `images` list renders nothing. */
	model: PlayerUiModel;
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
const index = ref(clampIndex(props.model.initialIndex ?? 0));
const playing = ref(false);
const direction = ref(props.model.direction !== false);
let nextIsLast = true;

const firstSrc = ref(srcAt(index.value));
const lastSrc = ref(srcAt(peekIndex(index.value, direction.value)));
const currentIsLast = ref(false);

const durationStyle = computed(() => {
	const n = props.model.animationDuration;
	if (n == null) {
		return undefined;
	}
	const value = n >= 100 ? `${n / 1000}s` : `${n}s`;
	return { '--player-animation-duration': value };
});

function clampIndex(i: number) {
	const last = props.model.images.length - 1;
	if (i < 0) {
		return 0;
	}
	if (i > last) {
		return last;
	}
	return i;
}

function srcAt(i: number) {
	return props.model.images[i];
}

function peekIndex(from: number, nextDirection: boolean) {
	const last = props.model.images.length - 1;
	if (nextDirection) {
		return from === last ? 0 : from + 1;
	}
	return from === 0 ? last : from - 1;
}

function updateImage(force?: boolean) {
	if (force) {
		firstSrc.value = srcAt(index.value);
		lastSrc.value = srcAt(peekIndex(index.value, direction.value));
		currentIsLast.value = false;
	} else if (nextIsLast) {
		lastSrc.value = srcAt(peekIndex(index.value, direction.value));
		currentIsLast.value = true;
	} else {
		firstSrc.value = srcAt(peekIndex(index.value, direction.value));
		currentIsLast.value = false;
	}
}

function update(force?: boolean) {
	if (force) {
		const el = rootEl.value;
		if (el) {
			el.classList.add('reset');
		}
		updateImage(true);
		if (el) {
			void el.offsetWidth;
			el.classList.remove('reset');
		}
		play();
	} else {
		updateImage(false);
	}
}

function goTo(i: number) {
	const next = clampIndex(i);
	emit('change.player', [rootEl.value, next]);
	emitVue('change', next);
	index.value = next;
	update(true);
	emit('changed.player', [rootEl.value, index.value]);
	emitVue('changed', index.value);
}

function goNext(force?: boolean) {
	const next = peekIndex(index.value, true);
	emit('change.player', [rootEl.value, next]);
	emitVue('change', next);
	index.value = next;
	direction.value = true;
	update(force);
	emit('changed.player', [rootEl.value, index.value]);
	emitVue('changed', index.value);
}

function goPrev(force?: boolean) {
	const next = peekIndex(index.value, false);
	emit('change.player', [rootEl.value, next]);
	emitVue('change', next);
	index.value = next;
	direction.value = false;
	update(force);
	emit('changed.player', [rootEl.value, index.value]);
	emitVue('changed', index.value);
}

function play() {
	if (playing.value) {
		return;
	}
	playing.value = true;
	emit('player.play', [rootEl.value]);
}

function pause() {
	if (!playing.value) {
		return;
	}
	playing.value = false;
	emit('player.pause', [rootEl.value]);
}

function toggle() {
	if (playing.value) {
		pause();
	} else {
		play();
	}
}

function onFirstIteration() {
	nextIsLast = true;
	if (direction.value) {
		goNext();
	} else {
		goPrev();
	}
}

function onLastIteration() {
	nextIsLast = false;
	if (direction.value) {
		goNext();
	} else {
		goPrev();
	}
}

watch(
	() => props.model.initialIndex,
	(nextIndex) => {
		if (typeof nextIndex === 'number') {
			goTo(nextIndex);
		}
	},
);

watch(
	() => props.model.autoPlay,
	(autoPlay) => {
		if (autoPlay) {
			play();
		} else if (autoPlay === false) {
			pause();
		}
	},
);

watch(
	() => props.model.direction,
	(nextDirection) => {
		if (typeof nextDirection === 'boolean') {
			direction.value = nextDirection;
			updateImage(true);
		}
	},
);

defineExpose({
	/** Jump to an index, reset frames, and start playing. */
	goTo,
	/** Advance one image. Optional force resets both frames and plays. */
	goNext,
	/** Return one image. Optional force resets both frames and plays. */
	goPrev,
	/** Add class playing. No-op if already playing. Emits player.play. */
	play,
	/** Remove class playing. No-op if already paused. Emits player.pause. */
	pause,
	/** Toggle between play and pause. */
	toggle,
});

onMounted(() => {
	emitPhase('init', 'player', rootEl.value);
	emitPhase('initialed', 'player', rootEl.value);
	emitPhase('load', 'player', rootEl.value);
	emitPhase('loaded', 'player', rootEl.value);
	emitPhase('render', 'player', rootEl.value);
	updateImage(true);
	if (props.model.autoPlay) {
		play();
	}
	emitPhase('rendered', 'player', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'player', rootEl.value);
	emitPhase('destroyed', 'player', rootEl.value);
});
</script>
