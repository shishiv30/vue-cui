<template>
	<div ref="rootEl" class="sharelink" :class="[model.className, { copied: !!notice, qr: !!qrSvg }]">
		<div
			v-for="group in groups"
			:key="group.name"
			class="sharelink-bar"
			:class="`sharelink-${group.name}`"
			role="group"
			:aria-label="group.name === 'ai' ? 'Ask AI about this page' : 'Share'"
		>
			<a
				v-for="item in group.items"
				:key="item.id"
				class="sharelink-item"
				:class="[`sharelink-${item.id}`, { 'text-only': !item.icon }]"
				href="#"
				role="button"
				:aria-label="ariaLabel(item)"
				@click.prevent="open(item.id)"
			>
				<i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
				<span class="sharelink-label">{{ item.label }}</span>
			</a>
		</div>
		<p class="sharelink-notice" role="status">{{ notice }}</p>
		<figure class="sharelink-qr">
			<span v-html="qrSvg"></span>
			<figcaption>Scan with WeChat to share</figcaption>
			<button type="button" class="sharelink-qr-close" aria-label="Close" @click="qrSvg = ''">
				<i class="icon-close" aria-hidden="true"></i>
			</button>
		</figure>
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

/** Encoded url `u`, text `t`, "text url" `ut`, subject `s` and "prompt url" `p`. */
type Encoded = { u: string; t: string; ut: string; s: string; p: string };

type ShareItem = {
	label: string;
	/** Font icon class. Empty: the icon font has none, so the item shows its label only (`text-only`). */
	icon: string;
	/**
	 * `share`: opens a share page. `copy`: the app has no web share link, so copy the URL.
	 * `qr`: show a QR code of the URL to scan in the app. `ai`: opens an assistant with a prompt.
	 */
	kind: 'share' | 'copy' | 'qr' | 'ai';
	href?: (e: Encoded) => string;
	/** App or mail scheme: open in place, not in a popup. */
	inPlace?: boolean;
};

type Item = ShareItem & { id: SharelinkPlatformId | 'native' };

const PLATFORMS: Record<SharelinkPlatformId, ShareItem> = {
	facebook: {
		label: 'Facebook',
		icon: 'icon-facebook',
		kind: 'share',
		href: (e) => `https://www.facebook.com/sharer/sharer.php?u=${e.u}`,
	},
	whatsapp: {
		label: 'WhatsApp',
		icon: 'icon-whatsapp',
		kind: 'share',
		href: (e) => `https://wa.me/?text=${e.ut}`,
	},
	instagram: { label: 'Instagram', icon: 'icon-instagram', kind: 'copy' },
	tiktok: { label: 'TikTok', icon: '', kind: 'copy' },
	wechat: { label: 'WeChat', icon: 'icon-wechat', kind: 'qr' },
	messenger: { label: 'Messenger', icon: '', kind: 'copy' },
	telegram: {
		label: 'Telegram',
		icon: 'icon-telegram',
		kind: 'share',
		href: (e) => `https://t.me/share/url?url=${e.u}&text=${e.t}`,
	},
	snapchat: { label: 'Snapchat', icon: 'icon-snapchat-ghost', kind: 'copy' },
	x: {
		label: 'X',
		icon: '',
		kind: 'share',
		href: (e) => `https://x.com/intent/post?url=${e.u}&text=${e.t}`,
	},
	pinterest: {
		label: 'Pinterest',
		icon: 'icon-pinterest-p',
		kind: 'share',
		href: (e) => `https://www.pinterest.com/pin/create/button/?url=${e.u}&description=${e.t}`,
	},
	reddit: {
		label: 'Reddit',
		icon: 'icon-reddit-alien',
		kind: 'share',
		href: (e) => `https://www.reddit.com/submit?url=${e.u}&title=${e.t}`,
	},
	linkedin: {
		label: 'LinkedIn',
		icon: 'icon-linkedin',
		kind: 'share',
		href: (e) => `https://www.linkedin.com/sharing/share-offsite/?url=${e.u}`,
	},
	threads: {
		label: 'Threads',
		icon: '',
		kind: 'share',
		href: (e) => `https://www.threads.com/intent/post?url=${e.u}&text=${e.t}`,
	},
	rednote: { label: 'RedNote', icon: '', kind: 'copy' },
	weibo: {
		label: 'Weibo',
		icon: 'icon-weibo',
		kind: 'share',
		href: (e) => `https://service.weibo.com/share/share.php?url=${e.u}&title=${e.t}`,
	},
	qq: { label: 'QQ', icon: 'icon-qq', kind: 'copy' },
	discord: { label: 'Discord', icon: '', kind: 'copy' },
	line: {
		label: 'LINE',
		icon: '',
		kind: 'share',
		href: (e) => `https://social-plugins.line.me/lineit/share?url=${e.u}`,
	},
	email: {
		label: 'Email',
		icon: 'icon-envelope',
		kind: 'share',
		href: (e) => `mailto:?subject=${e.s}&body=${e.ut}`,
		inPlace: true,
	},
	sms: {
		label: 'SMS',
		icon: 'icon-commenting',
		kind: 'share',
		href: (e) => `sms:?&body=${e.ut}`,
		inPlace: true,
	},
	chatgpt: {
		label: 'ChatGPT',
		icon: '',
		kind: 'ai',
		href: (e) => `https://chatgpt.com/?q=${e.p}`,
	},
	googleai: {
		label: 'Google AI',
		icon: 'icon-google',
		kind: 'ai',
		href: (e) => `https://www.google.com/search?udm=50&q=${e.p}`,
	},
	claude: {
		label: 'Claude',
		icon: '',
		kind: 'ai',
		href: (e) => `https://claude.ai/new?q=${e.p}`,
	},
	perplexity: {
		label: 'Perplexity',
		icon: '',
		kind: 'ai',
		href: (e) => `https://www.perplexity.ai/search?q=${e.p}`,
	},
	copilot: {
		label: 'Copilot',
		icon: 'icon-windows',
		kind: 'ai',
		href: (e) => `https://copilot.microsoft.com/?q=${e.p}`,
	},
};

const NATIVE: Item = { id: 'native', label: 'Share', icon: 'icon-share-alt', kind: 'share' };

const props = defineProps<{
	/** Share options. Empty `platforms` shows the top 5 social platforms and the top 4 AI assistants. */
	model: SharelinkUiModel;
}>();

const rootEl = ref<HTMLElement | null>(null);
/** Set after mount only, so SSR and the first client render match. */
const hasNative = ref(false);
/** Status line after a copy. Its root class `copied` shows it. */
const notice = ref('');
let noticeTimer: ReturnType<typeof setTimeout> | undefined;
/** WeChat QR code as an SVG string. Its root class `qr` shows it. */
const qrSvg = ref('');

const groups = computed(() => {
	const ids = props.model.platforms?.length ? props.model.platforms : SHARELINK_DEFAULT_PLATFORMS;
	const list: Item[] = ids
		.map((id) => (id === 'twitter' ? 'x' : id))
		.filter((id) => id in PLATFORMS)
		.map((id) => ({ id, ...PLATFORMS[id] }));
	const share = list.filter((i) => i.kind !== 'ai');
	const ai = list.filter((i) => i.kind === 'ai');
	return [
		{ name: 'share', items: hasNative.value ? [NATIVE, ...share] : share },
		{ name: 'ai', items: ai },
	].filter((g) => g.items.length);
});

function ariaLabel(item: Item) {
	if (item.id === 'native') {
		return 'Share';
	}
	if (item.kind === 'ai') {
		return `Ask ${item.label} about this page`;
	}
	if (item.kind === 'qr') {
		return `Show QR code for ${item.label}`;
	}
	return item.kind === 'copy' ? `Copy link for ${item.label}` : `Share on ${item.label}`;
}

function showNotice(text: string) {
	notice.value = text;
	clearTimeout(noticeTimer);
	noticeTimer = setTimeout(() => (notice.value = ''), 4000);
}

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
	if (item.kind === 'qr') {
		if (qrSvg.value) {
			qrSvg.value = '';
			return;
		}
		// Loaded on click only, so the page bundle stays small.
		import('qrcode-generator').then(({ default: qrcode }) => {
			const qr = qrcode(0, 'M');
			qr.addData(url);
			qr.make();
			qrSvg.value = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
		});
		return;
	}
	if (item.kind === 'copy') {
		navigator.clipboard
			.writeText(url)
			.then(() => showNotice(`Link copied. Paste it in ${item.label}.`))
			.catch(() => showNotice(`Copy this link for ${item.label}: ${url}`));
		return;
	}
	const href = item.href!({
		u: encodeURIComponent(url),
		t: encodeURIComponent(text),
		ut: encodeURIComponent(text ? `${text} ${url}` : url),
		s: encodeURIComponent(subject),
		p: encodeURIComponent(`${props.model.prompt || 'Summarize this page:'} ${url}`),
	});
	if (item.inPlace) {
		location.href = href;
		return;
	}
	if (item.kind === 'ai') {
		window.open(href, '_blank', 'noopener');
		return;
	}
	window.open(href, `share-${id}`, 'toolbar=0,status=0,width=600,height=600');
}

defineExpose({
	/** Run one platform id: open its share page or AI assistant, copy the link, or `native` for the Web Share sheet. */
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
	clearTimeout(noticeTimer);
	emitPhase('destroy', 'sharelink', rootEl.value);
	emitPhase('destroyed', 'sharelink', rootEl.value);
});
</script>
