<template>
	<header
		ref="rootEl"
		class="header"
		:class="[{ sticky: model.sticky === 'true', 'header-close': closed }, model.className]"
		data-role="header"
	>
		<div class="header-overlay" @click="hideMenu"></div>
		<div class="header-bar">
			<a href="javascript:;" class="menu-img" data-role="theme" aria-label="CUI Logo"></a>
			<div v-if="model.search" class="input right">
				<input
					:id="model.search.inputId"
					:placeholder="model.search.placeholder"
					type="text"
					name="text"
					:autocomplete="model.search.autocomplete"
					:autocorrect="model.search.autocorrect"
					:spellcheck="model.search.spellcheck"
					data-role="autocomplete"
					:data-method="model.search.method"
					:data-url="model.search.url"
					:data-keys="model.search.keys"
					:data-type="model.search.type"
				/>
				<a href="javascript:;" aria-label="Do Search" class="btn">
					<i class="icon-search"></i>
				</a>
			</div>
		</div>
		<nav class="header-menu">
			<ul class="header-menu-list">
				<li
					v-for="(item, index) in model.menu"
					:key="item.href + item.text"
					:class="{ list: item.children && item.children.length }"
					:ref="(el) => setItemRef(el, index)"
				>
					<a :href="item.href">{{ item.text }}</a>
					<ul v-if="item.children && item.children.length">
						<li v-for="child in item.children" :key="child.href + child.text">
							<a :href="child.href">{{ child.text }}</a>
						</li>
					</ul>
					<button
						v-if="item.children && item.children.length"
						type="button"
						class="header-expand"
						:aria-label="`Expand ${item.text}`"
						@click="toggleSub(index)"
					>
						<i class="icon-caret-left"></i>
					</button>
				</li>
			</ul>
			<a
				href="javascript:;"
				aria-label="Open Menu"
				class="menu-icon header-switch-link"
				@click.prevent="toggleMenu"
			>
				<i class="icon-bars f3"></i>
			</a>
		</nav>
	</header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { HeaderUiModel } from './headerModel';
import { emitPhase } from './emitPhase';

defineProps<{ model: HeaderUiModel }>();

const rootEl = ref<HTMLElement | null>(null);
const closed = ref(false);
const openIndex = ref<number | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
let savedScrollY: number | null = null;
let lastScrollY = 0;

function setItemRef(el: unknown, index: number) {
	if (el instanceof HTMLElement) {
		itemRefs.value[index] = el;
	}
}

function lockPhoneScroll() {
	if (window.innerWidth >= 640 || savedScrollY !== null) {
		return;
	}
	savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
	document.body.style.top = `-${savedScrollY}px`;
}

function unlockPhoneScroll() {
	if (savedScrollY === null) {
		return;
	}
	const y = savedScrollY;
	savedScrollY = null;
	document.body.style.top = '';
	window.scrollTo(0, y);
}

function hideMenu() {
	document.body.classList.remove('body-expand-header');
	unlockPhoneScroll();
	openIndex.value = null;
	itemRefs.value.forEach((el) => {
		el.classList.remove('hover');
		el.style.height = '';
	});
}

function showMenu() {
	lockPhoneScroll();
	document.body.classList.add('body-expand-header');
}

function toggleMenu() {
	if (document.body.classList.contains('body-expand-header')) {
		hideMenu();
	} else {
		showMenu();
	}
}

function toggleSub(index: number) {
	const current = itemRefs.value[index];
	if (!current) {
		return;
	}
	if (openIndex.value === index) {
		current.classList.remove('hover');
		current.style.height = '';
		openIndex.value = null;
		return;
	}
	if (openIndex.value !== null) {
		const previous = itemRefs.value[openIndex.value];
		if (previous) {
			previous.classList.remove('hover');
			previous.style.height = '';
		}
	}
	current.classList.add('hover');
	current.style.height = `${current.scrollHeight}px`;
	openIndex.value = index;
}

function onScroll() {
	const y = window.scrollY || document.documentElement.scrollTop || 0;
	if (y > lastScrollY) {
		closed.value = true;
	} else if (y < lastScrollY) {
		closed.value = false;
	}
	lastScrollY = y;
}

onMounted(() => {
	emitPhase('init', 'header', rootEl.value);
	emitPhase('initialed', 'header', rootEl.value);
	emitPhase('load', 'header', rootEl.value);
	emitPhase('loaded', 'header', rootEl.value);
	emitPhase('render', 'header', rootEl.value);
	lastScrollY = window.scrollY || document.documentElement.scrollTop || 0;
	window.addEventListener('scroll', onScroll, { passive: true });
	emitPhase('rendered', 'header', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'header', rootEl.value);
	window.removeEventListener('scroll', onScroll);
	document.body.classList.remove('body-expand-header');
	document.body.style.top = '';
	emitPhase('destroyed', 'header', rootEl.value);
});
</script>
