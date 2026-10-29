<template>
	<article
		v-if="model"
		ref="rootEl"
		class="article shadow corner article-card"
		:class="model.className"
	>
		<button
			v-if="toggleStatus !== null"
			type="button"
			class="article-toggle"
			:class="{ on: toggleStatus }"
			:aria-pressed="toggleStatus"
			@click="onToggle"
		>
			<i :class="toggleIcon"></i>
		</button>
		<a :href="href">
			<address class="f6 text-gray">{{ model.title }}</address>
		</a>
		<dl v-if="attrs.length" class="dict">
			<template v-for="(attr, index) in attrs" :key="index">
				<dd v-if="attr.value" :class="attr.className">{{ attr.value }}</dd>
				<dt v-if="attr.key" :title="attr.desc">{{ attr.key }}</dt>
			</template>
		</dl>
		<figure>
			<img
				ratio
				:src="imgSrc"
				:alt="model.imgAlt"
				loading="lazy"
				@error="onImgError"
			/>
			<figcaption>{{ model.imgTag }}</figcaption>
		</figure>
		<div v-if="tags.length" class="tags">
			<span
				v-for="(tag, index) in tags"
				:key="index"
				class="attr"
				:class="tag.className"
			>{{ tag.text }}</span>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ArticleUiModel } from './articleModel';
import { emitPhase } from './emitPhase';

const props = withDefaults(
	defineProps<{
		model: ArticleUiModel;
		toggleStatus?: boolean | null;
		toggleStyle?: 'heart' | 'star' | 'bookmark';
	}>(),
	{ toggleStatus: null, toggleStyle: 'heart' }
);

const emit = defineEmits<{ (e: 'toggle', status: boolean): void }>();

const toggleIcon = computed(() => [props.toggleStyle, props.toggleStatus ? 'on' : 'off']);

function onToggle() {
	emit('toggle', !props.toggleStatus);
}

const rootEl = ref<HTMLElement | null>(null);

const failedSrc = ref('');
const imgSrc = computed(() => {
	const src = props.model.img;
	return (src && src !== failedSrc.value ? src : props.model.fallbackImg) || undefined;
});

function onImgError() {
	failedSrc.value = props.model.img ?? '';
}

const attrs = computed(() => props.model.attrs ?? []);
const tags = computed(() => (props.model.tags ?? []).filter((tag) => tag.text));

const href = computed(() => {
	const item = props.model;
	let url = '';
	if (item.href) {
		url = item.href;
	} else if (item.path) {
		url = item.path;
	}
	if (!url || !item.id) {
		return url;
	}
	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}id=${encodeURIComponent(item.id)}`;
});

onMounted(() => {
	emitPhase('init', 'article', rootEl.value);
	emitPhase('initialed', 'article', rootEl.value);
	emitPhase('load', 'article', rootEl.value);
	emitPhase('loaded', 'article', rootEl.value);
	emitPhase('render', 'article', rootEl.value);
	emitPhase('rendered', 'article', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'article', rootEl.value);
	emitPhase('destroyed', 'article', rootEl.value);
});
</script>
