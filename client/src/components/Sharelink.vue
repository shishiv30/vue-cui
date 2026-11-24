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
				@click.prevent="open(item.id as SharelinkPlatformId | 'native')"
			>
				<i :class="item.icon" aria-hidden="true"></i>
				<span class="sharelink-label">{{ item.label }}</span>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
	SHARELINK_DEFAULT_PLATFORMS,
	type SharelinkPlatformId,
	type SharelinkUiModel,
} from './sharelinkModel';
import { emitPhase } from './emitPhase';

type ShareItem = {
	label: string;
	icon: string;
	/** Share link from the encoded url `u`, text `t`, "text url" `ut` and subject `s`. */
	href: (e: Encoded) => string;
	/** App or mail scheme: open in place, not in a popup. */
	inPlace?: boolean;
};

type Encoded = { u: string; t: string; ut: string; s: string };

const PLATFORMS: Record<SharelinkPlatformId, ShareItem> = {
	facebook: {
		label: 'Facebook',
		icon: 'icon-facebook',
		href: (e) => `https://www.facebook.com/sharer/sharer.php?u=${e.u}`,
	},
	whatsapp: {
		label: 'WhatsApp',
		icon: 'icon-whatsapp',
		href: (e) => `https://wa.me/?text=${e.ut}`,
	},
	x: {
		label: 'X',
		icon: 'icon-x',
		href: (e) => `https://x.com/intent/post?url=${e.u}&text=${e.t}`,
	},
	linkedin: {
		label: 'LinkedIn',
		icon: 'icon-linkedin',
		href: (e) => `https://www.linkedin.com/sharing/share-offsite/?url=${e.u}`,
	},
	reddit: {
		label: 'Reddit',
		icon: 'icon-reddit-alien',
		href: (e) => `https://www.reddit.com/submit?url=${e.u}&title=${e.t}`,
	},
	pinterest: {
		label: 'Pinterest',
		icon: 'icon-pinterest-p',
		href: (e) => `https://www.pinterest.com/pin/create/button/?url=${e.u}&description=${e.t}`,
	},
	telegram: {
		label: 'Telegram',
		icon: 'icon-telegram',
		href: (e) => `https://t.me/share/url?url=${e.u}&text=${e.t}`,
	},
	threads: {
		label: 'Threads',
		icon: 'icon-threads',
		href: (e) => `https://www.threads.com/intent/post?url=${e.u}&text=${e.t}`,
	},
	bluesky: {
		label: 'Bluesky',
		icon: 'icon-bluesky',
		href: (e) => `https://bsky.app/intent/compose?text=${e.ut}`,
	},
	email: {
		label: 'Email',
		icon: 'icon-envelope',
		href: (e) => `mailto:?subject=${e.s}&body=${e.ut}`,
		inPlace: true,
	},
	sms: {
		label: 'SMS',
		icon: 'icon-commenting',
		href: (e) => `sms:?&body=${e.ut}`,
		inPlace: true,
	},
	flipboard: {
		label: 'Flipboard',
		icon: 'icon-flipboard',
		href: (e) => `https://share.flipboard.com/bookmarklet/popout?v=2&url=${e.u}&title=${e.t}`,
	},
	line: {
		label: 'LINE',
		icon: 'icon-line',
		href: (e) => `https://social-plugins.line.me/lineit/share?url=${e.u}`,
	},
	viber: {
		label: 'Viber',
		icon: 'icon-viber',
		href: (e) => `viber://forward?text=${e.ut}`,
		inPlace: true,
	},
	tumblr: {
		label: 'Tumblr',
		icon: 'icon-tumblr',
		href: (e) => `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${e.u}&caption=${e.t}`,
	},
	vk: {
		label: 'VK',
		icon: 'icon-vk',
		href: (e) => `https://vk.com/share.php?url=${e.u}&title=${e.t}`,
	},
	weibo: {
		label: 'Weibo',
		icon: 'icon-weibo',
		href: (e) => `https://service.weibo.com/share/share.php?url=${e.u}&title=${e.t}`,
	},
	ok: {
		label: 'OK',
		icon: 'icon-odnoklassniki',
		href: (e) => `https://connect.ok.ru/offer?url=${e.u}&title=${e.t}`,
	},
	xing: {
		label: 'XING',
		icon: 'icon-xing',
		href: (e) => `https://www.xing.com/spi/shares/new?url=${e.u}`,
	},
	hackernews: {
		label: 'Hacker News',
		icon: 'icon-hacker-news',
		href: (e) => `https://news.ycombinator.com/submitlink?u=${e.u}&t=${e.t}`,
	},
};

const props = defineProps<{
	/** Share options. Empty `platforms` shows the top 10. */
	model: SharelinkUiModel;
}>();

const rootEl = ref<HTMLElement | null>(null);
/** Set after mount only, so SSR and the first client render match. */
const hasNative = ref(false);

const items = computed(() => {
	const ids = props.model.platforms?.length ? props.model.platforms : SHARELINK_DEFAULT_PLATFORMS;
	const list = ids
		.map((id) => (id === 'twitter' ? 'x' : id))
		.filter((id) => id in PLATFORMS)
		.map((id) => ({ id, ...PLATFORMS[id] }));
	return hasNative.value
		? [{ id: 'native', label: 'Share', icon: 'icon-share-alt' }, ...list]
		: list;
});

function open(id: SharelinkPlatformId | 'twitter' | 'native') {
	const url = props.model.url || location.href;
	const text = props.model.text || '';
	const subject = props.model.subject || '';
	if (id === 'native') {
		navigator
			.share({ url, text: text || undefined, title: subject || document.title })
			.catch(() => {});
		return;
	}
	const item = PLATFORMS[id === 'twitter' ? 'x' : id];
	if (!item) {
		return;
	}
	const href = item.href({
		u: encodeURIComponent(url),
		t: encodeURIComponent(text),
		ut: encodeURIComponent(text ? `${text} ${url}` : url),
		s: encodeURIComponent(subject),
	});
	if (item.inPlace) {
		location.href = href;
		return;
	}
	window.open(href, `share-${id}`, 'toolbar=0,status=0,width=600,height=600');
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
