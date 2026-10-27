<template>
	<article
		v-if="model"
		ref="rootEl"
		class="article shadow corner article-card"
		:class="model.className"
	>
		<a :href="href" @click="onAddressClick">
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
				:src="model.img || '/images/n_a.svg'"
				:alt="model.imgAlt"
				loading="lazy"
				data-role="imgerror"
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
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { routerKey } from 'vue-router';
import type { ArticleUiModel } from './articleModel';
import { emitPhase } from './emitPhase';

const props = defineProps<{ model: ArticleUiModel }>();

const rootEl = ref<HTMLElement | null>(null);

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

const router = inject(routerKey, null);

function onAddressClick(event: MouseEvent) {
	const url = href.value;
	if (
		!router
		|| !url
		|| !url.startsWith('/')
		|| url.startsWith('//')
		|| event.metaKey
		|| event.ctrlKey
		|| event.shiftKey
		|| event.altKey
		|| event.button !== 0
	) {
		return;
	}
	event.preventDefault();
	const queryIndex = url.indexOf('?');
	const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
	const search = queryIndex === -1 ? '' : url.slice(queryIndex + 1);
	const query: Record<string, string> = {};
	new URLSearchParams(search).forEach((value, key) => {
		query[key] = value;
	});
	void router.push({ path, query });
}

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
