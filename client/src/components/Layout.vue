<template>
	<main
		ref="rootEl"
		class="layout"
		:class="{
			'layout-horizontal': mode === 'horizontal',
			'layout-grid': mode === 'grid',
			'layout-ring': mode === 'ring',
		}"
	>
		<div
			v-if="mode === 'ring'"
			class="layout-ring-frame"
			:style="ringStageStyle"
		>
		<div
			ref="stageEl"
			class="layout-ring-stage"
		>
			<article
				v-for="(item, index) in data"
				:key="index"
				class="article"
				:class="[item.className, articleClass, articleClass === 'article-card' && !item.img ? 'no-image' : undefined]"
				:style="cardStyle(index)"
			>
				<i v-if="item.icon" :class="item.icon"></i>
				<figure v-if="item.img">
					<img v-lazyload="item.img" alt="" />
				</figure>
				<header v-if="item.title" class="f3">{{ item.title }}</header>
				<sub v-if="item.sub">{{ item.sub }}</sub>
				<sup v-if="item.sup">{{ item.sup }}</sup>
				<div v-for="(paragraph, bodyIndex) in item.body" :key="bodyIndex">{{ paragraph }}</div>
				<div v-if="item.tags?.length" class="tags">
					<span v-for="tag in item.tags" :key="tag" class="attr">{{ tag }}</span>
				</div>
				<dl v-if="item.dict?.length" class="dict">
					<template v-for="fact in item.dict" :key="fact.key">
						<dt>{{ fact.key }}</dt>
						<dd>{{ fact.value }}</dd>
					</template>
				</dl>
				<footer v-if="item.footer">{{ item.footer }}</footer>
			</article>
		</div>
		</div>
		<template v-else>
		<article
			v-for="(item, index) in data"
			:key="index"
			class="article"
			:class="[item.className, articleClass, articleClass === 'article-card' && !item.img ? 'no-image' : undefined]"
			:style="cardStyle(index)"
		>
			<i v-if="item.icon" :class="item.icon"></i>
			<figure v-if="item.img">
				<img v-lazyload="item.img" alt="" />
			</figure>
			<header v-if="item.title" class="f3">{{ item.title }}</header>
			<sub v-if="item.sub">{{ item.sub }}</sub>
			<sup v-if="item.sup">{{ item.sup }}</sup>
			<div v-for="(paragraph, bodyIndex) in item.body" :key="bodyIndex">{{ paragraph }}</div>
			<div v-if="item.tags?.length" class="tags">
				<span v-for="tag in item.tags" :key="tag" class="attr">{{ tag }}</span>
			</div>
			<dl v-if="item.dict?.length" class="dict">
				<template v-for="fact in item.dict" :key="fact.key">
					<dt>{{ fact.key }}</dt>
					<dd>{{ fact.value }}</dd>
				</template>
			</dl>
			<footer v-if="item.footer">{{ item.footer }}</footer>
		</article>
		</template>
	</main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { LayoutArticle, LayoutMode } from './layoutModel';
import { emitPhase } from './emitPhase';

const props = defineProps<{
	data: LayoutArticle[];
	model: LayoutMode;
	/** default is the layout article. card adds article-card. thumbnail adds article-thumbnail. */
	articleMode?: 'default' | 'card' | 'thumbnail';
	/** Overrides --image-ratio on every article. Example: 16/9. */
	imageRatio?: string;
}>();

const articleClass = computed(() => {
	if (props.articleMode === 'card') {
		return 'article-card';
	}
	if (props.articleMode === 'thumbnail') {
		return 'article-thumbnail';
	}
	return undefined;
});

const ratioStyle = computed(() => {
	if (!props.imageRatio || mode.value === 'grid') {
		return undefined;
	}
	const value = props.imageRatio.includes('/')
		? props.imageRatio.replace('/', ' / ')
		: props.imageRatio;
	return { '--image-ratio': value };
});

const ringRadius = computed(() => {
	const count = props.data.length;
	if (count < 2) {
		return 300;
	}
	const cardWidth = 300;
	const theta = Math.tan(Math.PI / count);
	if (theta <= 0.01) {
		return cardWidth;
	}
	return Math.round((cardWidth / 2) / theta);
});

const ringStep = computed(() => (
	props.data.length > 0 ? 360 / props.data.length : 0
));

const ringStageStyle = computed(() => ({
	'--ring-radius': `${ringRadius.value}px`,
}));

function cardStyle(index: number) {
	const style: Record<string, string> = {};
	if (ratioStyle.value) {
		Object.assign(style, ratioStyle.value);
	}
	if (mode.value === 'ring') {
		style['--ring-angle'] = `${index * ringStep.value}deg`;
	}
	return Object.keys(style).length ? style : undefined;
}

const rootEl = ref<HTMLElement | null>(null);
const stageEl = ref<HTMLElement | null>(null);
const mode = ref<LayoutMode>(normalizeMode(props.model));

let gridObserver: ResizeObserver | null = null;
let lastCols = 0;
let lastRects: DOMRect[] = [];
let colToken = 0;

function normalizeMode(value: string): LayoutMode {
	if (value === 'horizontal' || value === 'grid' || value === 'ring') {
		return value;
	}
	return 'default';
}

function articlesIn(main: HTMLElement) {
	if (mode.value === 'ring') {
		const selector = ':scope > .layout-ring-frame > .layout-ring-stage > .article';
	return [...main.querySelectorAll(selector)] as HTMLElement[];
	}
	return [...main.querySelectorAll(':scope > .article')] as HTMLElement[];
}

function gridColumnCount(main: HTMLElement) {
	const style = getComputedStyle(main);
	const gap = parseFloat(style.columnGap) || 0;
	const min = parseFloat(style.getPropertyValue('--layout-grid-min')) || 260;
	const width = main.clientWidth
		- (parseFloat(style.paddingLeft) || 0)
		- (parseFloat(style.paddingRight) || 0);
	if (min + gap <= 0) {
		return 1;
	}
	return Math.max(1, Math.floor((width + gap) / (min + gap)));
}

function stopGrid() {
	colToken += 1;
	lastCols = 0;
	lastRects = [];
	if (gridObserver) {
		gridObserver.disconnect();
		gridObserver = null;
	}
	rootEl.value?.classList.remove('is-col-animating');
}

function flyColumns(main: HTMLElement, articles: HTMLElement[], from: DOMRect[]) {
	const token = colToken + 1;
	colToken = token;
	const moves: HTMLElement[] = [];
	articles.forEach((article, index) => {
		const prev = from[index];
		if (!prev) {
			return;
		}
		const next = article.getBoundingClientRect();
		const dx = prev.left - next.left;
		const dy = prev.top - next.top;
		lastRects[index] = next;
		if (dx === 0 && dy === 0) {
			return;
		}
		article.style.transition = 'none';
		article.style.transform = `translate(${dx}px, ${dy}px)`;
		moves.push(article);
	});
	if (!moves.length) {
		return;
	}
	main.classList.add('is-col-animating');
	main.offsetWidth;
	requestAnimationFrame(() => {
		if (token !== colToken) {
			return;
		}
		moves.forEach((article) => {
			article.style.transition = '';
			article.style.transform = '';
		});
		let remaining = moves.length;
		let settled = false;
		const finish = () => {
			if (settled || token !== colToken) {
				return;
			}
			settled = true;
			moves.forEach((article) => {
				article.removeEventListener('transitionend', onEnd);
			});
			main.classList.remove('is-col-animating');
		};
		const onEnd = (event: TransitionEvent) => {
			if (event.propertyName !== 'transform') {
				return;
			}
			remaining -= 1;
			if (remaining <= 0) {
				finish();
			}
		};
		moves.forEach((article) => {
			article.addEventListener('transitionend', onEnd);
		});
		setTimeout(finish, 580);
	});
}

function columnCount(main: HTMLElement) {
	if (main.classList.contains('layout-grid')) {
		return gridColumnCount(main);
	}
	const count = parseInt(getComputedStyle(main).columnCount, 10);
	return Number.isFinite(count) && count > 0 ? count : 1;
}

function startGrid(main: HTMLElement) {
	stopGrid();
	const articles = articlesIn(main);
	lastCols = columnCount(main);
	lastRects = articles.map((article) => article.getBoundingClientRect());
	gridObserver = new ResizeObserver(() => {
		if (
			main.classList.contains('layout-horizontal')
			|| main.classList.contains('layout-ring')
		) {
			return;
		}
		const cols = columnCount(main);
		const cards = articlesIn(main);
		if (cols === lastCols || cards.length !== lastRects.length) {
			lastCols = cols;
			lastRects = cards.map((article) => article.getBoundingClientRect());
			return;
		}
		const from = lastRects;
		lastCols = cols;
		flyColumns(main, cards, from);
	});
	gridObserver.observe(main);
}

let unbindRing: (() => void) | null = null;

function clearRing() {
	unbindRing?.();
	unbindRing = null;
}

function bindRingDrag(stage: HTMLElement, radius: number, articles: HTMLElement[], step: number) {
	let spin = 0;
	let pointerId: number | null = null;
	let lastX = 0;
	let startX = 0;
	let startY = 0;
	let dragging = false;
	let frame = 0;
	const radians = 180 / Math.PI;

	function wrap(deg: number) {
		return ((deg % 360) + 360) % 360;
	}

	function updateFacing() {
		if (!Number.isFinite(spin)) {
			spin = 0;
		}
		articles.forEach((article, index) => {
			const position = wrap(index * step + spin);
			const delta = Math.min(position, 360 - position);
			const front = delta < 90;
			article.style.visibility = front ? 'visible' : 'hidden';
			article.style.pointerEvents = front ? 'auto' : 'none';
		});
	}

	function paint() {
		frame = 0;
		stage.style.setProperty('--ring-spin', `${spin}deg`);
		updateFacing();
	}

	function onPointerDown(event: PointerEvent) {
		pointerId = event.pointerId;
		lastX = event.clientX;
		startX = event.clientX;
		startY = event.clientY;
		dragging = false;
	}

	function onPointerMove(event: PointerEvent) {
		if (event.pointerId !== pointerId) {
			return;
		}
		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		if (!dragging) {
			if (Math.hypot(dx, dy) < 8) {
				return;
			}
			if (Math.abs(dy) > Math.abs(dx)) {
				pointerId = null;
				return;
			}
			dragging = true;
			lastX = event.clientX;
			stage.setPointerCapture(event.pointerId);
			stage.classList.add('is-grabbing');
		}
		spin -= ((event.clientX - lastX) / radius) * radians;
		lastX = event.clientX;
		if (!frame) {
			frame = requestAnimationFrame(paint);
		}
	}

	function resetPointer(reason: string, event: Event | null) {
		const pointerEvent = event as PointerEvent | null;
		if (
			pointerEvent
			&& pointerEvent.pointerId !== undefined
			&& pointerId !== null
			&& pointerEvent.pointerId !== pointerId
		) {
			return;
		}
		const id = pointerId;
		pointerId = null;
		dragging = false;
		stage.classList.remove('is-grabbing');
		if (reason !== 'lostpointercapture' && id !== null && stage.hasPointerCapture(id)) {
			stage.releasePointerCapture(id);
		}
		if (!Number.isFinite(spin)) {
			spin = 0;
			paint();
		}
	}

	function onPointerUp(event: PointerEvent) {
		resetPointer(event.type, event);
	}

	function onBlur() {
		resetPointer('blur', null);
	}

	function onWheel(event: WheelEvent) {
		if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
			return;
		}
		event.preventDefault();
		spin -= (event.deltaX / radius) * radians;
		if (!frame) {
			frame = requestAnimationFrame(paint);
		}
	}

	updateFacing();
	stage.addEventListener('pointerdown', onPointerDown);
	stage.addEventListener('pointermove', onPointerMove);
	stage.addEventListener('pointerup', onPointerUp);
	stage.addEventListener('pointercancel', onPointerUp);
	stage.addEventListener('lostpointercapture', onPointerUp);
	window.addEventListener('blur', onBlur);
	stage.addEventListener('wheel', onWheel, { passive: false });

	return () => {
		if (frame) {
			cancelAnimationFrame(frame);
		}
		stage.removeEventListener('pointerdown', onPointerDown);
		stage.removeEventListener('pointermove', onPointerMove);
		stage.removeEventListener('pointerup', onPointerUp);
		stage.removeEventListener('pointercancel', onPointerUp);
		stage.removeEventListener('lostpointercapture', onPointerUp);
		window.removeEventListener('blur', onBlur);
		stage.removeEventListener('wheel', onWheel);
		stage.classList.remove('is-grabbing');
		stage.style.removeProperty('--ring-spin');
		articles.forEach((article) => {
			article.style.pointerEvents = '';
			article.style.visibility = '';
		});
	};
}

function startRing() {
	clearRing();
	const stage = stageEl.value;
	const articles = stage
		? [...stage.querySelectorAll(':scope > .article')] as HTMLElement[]
		: [];
	if (!stage || articles.length < 2) {
		return;
	}
	unbindRing = bindRingDrag(stage, ringRadius.value, articles, ringStep.value);
}

function playMove(main: HTMLElement, apply: () => void) {
	const articles = articlesIn(main);
	const from = articles.map((article) => article.getBoundingClientRect());
	articles.forEach((article) => {
		article.style.transition = 'none';
		article.style.transform = '';
	});
	apply();
	nextTick(() => {
		if (mode.value === 'ring') {
			startRing();
		} else if (mode.value !== 'horizontal') {
			startGrid(main);
		}
		const destinations = articles.map((article) => {
			const value = getComputedStyle(article).transform;
			return value === 'none' ? '' : value;
		});
		articles.forEach((article, index) => {
			const next = article.getBoundingClientRect();
			const prev = from[index];
			const dx = (prev.left + prev.width / 2) - (next.left + next.width / 2);
			const dy = (prev.top + prev.height / 2) - (next.top + next.height / 2);
			article.style.transition = 'none';
			article.style.transform = `translate(${dx}px, ${dy}px) ${destinations[index]}`;
		});
		main.offsetWidth;
		requestAnimationFrame(() => {
			articles.forEach((article) => {
				article.style.transition = 'transform .6s ease';
				article.style.transform = '';
				const done = (event: TransitionEvent) => {
					if (event.propertyName !== 'transform') {
						return;
					}
					article.style.transition = '';
					article.removeEventListener('transitionend', done);
				};
				article.addEventListener('transitionend', done);
			});
		});
	});
}

/** Switch among default columns, the horizontal strip, the grid, and the ring. */
function setModel(nextMode: string) {
	const next = normalizeMode(nextMode);
	const main = rootEl.value;
	if (!main || next === mode.value) {
		return;
	}
	if (next === 'horizontal') {
		window.scrollTo(0, 0);
	}
	playMove(main, () => {
		stopGrid();
		clearRing();
		mode.value = next;
	});
}

watch(
	() => props.model,
	(next) => {
		setModel(next);
	},
);

watch(
	() => props.data.length,
	() => {
		if (mode.value !== 'ring') {
			return;
		}
		nextTick(() => startRing());
	},
);

onMounted(() => {
	emitPhase('init', 'layout', rootEl.value);
	emitPhase('initialed', 'layout', rootEl.value);
	emitPhase('load', 'layout', rootEl.value);
	emitPhase('loaded', 'layout', rootEl.value);
	emitPhase('render', 'layout', rootEl.value);
	if (rootEl.value && mode.value === 'ring') {
		startRing();
	} else if (rootEl.value && mode.value !== 'horizontal') {
		startGrid(rootEl.value);
	}
	emitPhase('rendered', 'layout', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'layout', rootEl.value);
	stopGrid();
	clearRing();
	emitPhase('destroyed', 'layout', rootEl.value);
});

defineExpose({ setModel });
</script>
