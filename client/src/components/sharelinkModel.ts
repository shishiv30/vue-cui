/** Options from `client/js/plugins/_sharelink.js` (`data-url`, `data-text`, `data-subject`, `data-platforms`). */

/** All supported platforms, most popular first. */
export const SHARELINK_PLATFORM_IDS = [
	'facebook',
	'whatsapp',
	'x',
	'linkedin',
	'reddit',
	'pinterest',
	'telegram',
	'threads',
	'bluesky',
	'email',
	'sms',
	'flipboard',
	'line',
	'viber',
	'tumblr',
	'vk',
	'weibo',
	'ok',
	'xing',
	'hackernews',
] as const;

export type SharelinkPlatformId = (typeof SHARELINK_PLATFORM_IDS)[number];

/** Shown when `platforms` is empty: the top 10. */
export const SHARELINK_DEFAULT_PLATFORMS: SharelinkPlatformId[] = SHARELINK_PLATFORM_IDS.slice(
	0,
	10,
);

export interface SharelinkUiModel {
	/** Page to share. Empty: the current `location.href`, read on click. */
	url?: string;
	/** Share text (X, Threads, Bluesky, Telegram, WhatsApp, SMS, Pinterest, Reddit title…). */
	text?: string;
	/** Email subject, and the native share title. */
	subject?: string;
	/** Platforms to show, in this order. Empty: `SHARELINK_DEFAULT_PLATFORMS`. `twitter` is read as `x`. */
	platforms?: (SharelinkPlatformId | 'twitter')[];
	/** Extra classes on the root. The root class `sharelink` stays on the component. */
	className?: string;
}

export const sharelinkMock: SharelinkUiModel = {
	url: '',
	text: 'Check out this page',
	subject: 'CUI share link',
	platforms: [],
	className: '',
};
