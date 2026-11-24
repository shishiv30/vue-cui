<template>
	<div ref="rootEl" class="sharelink" :class="model.className">
		<div class="sharelink-bar" role="group" aria-label="Share">
			<a
				v-for="item in items"
				:key="item.id"
				class="sharelink-item"
				href="#"
				role="button"
				:aria-label="item.id === 'native' ? 'Share' : `Share on ${item.label}`"
				@click.prevent="open(item.id)"
			>
				<i :class="item.icon" aria-hidden="true"></i>
				<span class="sharelink-label">{{ item.label }}</span>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { SharelinkPlatformId, SharelinkUiModel } from './sharelinkModel';
import { emitPhase } from './emitPhase';

type ShareItem = {
	id: SharelinkPlatformId | 'native';
	label: string;
	icon: string;
	width?: number;
	height?: number;
};

const PLATFORMS: ShareItem[] = [
	{ id: 'facebook', label: 'Facebook', icon: 'icon-facebook', width: 626, height: 436 },
	{ id: 'twitter', label: 'Twitter', icon: 'icon-twitter', width: 550, height: 420 },
	{ id: 'linkedin', label: 'LinkedIn', icon: 'icon-linkedin', width: 600, height: 600 },
	{ id: 'whatsapp', label: 'WhatsApp', icon: 'icon-whatsapp', width: 600, height: 600 },
	{ id: 'email', label: 'Email', icon: 'icon-envelope' },
];
const NATIVE: ShareItem = { id: 'native', label: 'Share', icon: 'icon-share-alt' };

const props = defineProps<{
	/** Share options. Empty `platforms` shows all of them. */
	model: SharelinkUiModel;
}>();

const rootEl = ref<HTMLElement | null>(null);
/** Set after mount only, so SSR and the first client render match. */
const hasNative = ref(false);

const items = computed(() => {
	const ids = props.model.platforms;
	const list = ids?.length
		? PLATFORMS.filter((p) => ids.includes(p.id as SharelinkPlatformId))
		: PLATFORMS;
	return hasNative.value ? [NATIVE, ...list] : list;
});

function shareUrl(id: SharelinkPlatformId, url: string) {
	const u = encodeURIComponent(url);
	const { text, subject } = props.model;
	switch (id) {
		case 'facebook':
			return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
		case 'twitter':
			return `https://twitter.com/intent/tweet?url=${u}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
		case 'linkedin':
			return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
		case 'whatsapp':
			return `https://wa.me/?text=${u}`;
		case 'email':
			return `mailto:?subject=${encodeURIComponent(subject || '')}&body=${u}`;
	}
}

function open(id: ShareItem['id']) {
	const url = props.model.url || location.href;
	if (id === 'native') {
		navigator
			.share({
				url,
				text: props.model.text || undefined,
				title: props.model.subject || document.title,
			})
			.catch(() => {});
		return;
	}
	const href = shareUrl(id, url);
	if (id === 'email') {
		location.href = href;
		return;
	}
	const item = PLATFORMS.find((p) => p.id === id);
	window.open(
		href,
		`share-${id}`,
		`toolbar=0,status=0,width=${item?.width},height=${item?.height}`,
	);
}

defineExpose({
	/** Open the share window for one platform id, or `native` for the Web Share sheet. */
	open,
});

onMounted(() => {
	emitPhase('init', 'sharelink', rootEl.value);
	emitPhase('initialed', 'sharelink', rootEl.value);
	emitPhase('load', 'sharelink', rootEl.value);
	emitPhase('loaded', 'sharelink', rootEl.value);
	emitPhase('render', 'sharelink', rootEl.value);
	hasNative.value = typeof navigator.share === 'function';
	emitPhase('rendered', 'sharelink', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'sharelink', rootEl.value);
	emitPhase('destroyed', 'sharelink', rootEl.value);
});
</script>
