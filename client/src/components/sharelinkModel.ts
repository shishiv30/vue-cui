/** Options from `client/js/plugins/_sharelink.js` (`data-url`, `data-text`, `data-subject`, `data-platforms`). */

/** Top 20 social platforms, most popular first. */
export const SHARELINK_PLATFORM_IDS = [
	'facebook',
	'whatsapp',
	'instagram',
	'tiktok',
	'wechat',
	'messenger',
	'telegram',
	'snapchat',
	'x',
	'pinterest',
	'reddit',
	'linkedin',
	'threads',
	'rednote',
	'weibo',
	'qq',
	'discord',
	'line',
	'email',
	'sms',
] as const;

/** AI assistants that open with a prompt about the page, most popular first. */
export const SHARELINK_AI_IDS = ['chatgpt', 'googleai', 'claude', 'perplexity', 'copilot'] as const;

export type SharelinkPlatformId =
	(typeof SHARELINK_PLATFORM_IDS)[number] | (typeof SHARELINK_AI_IDS)[number];

/** Shown when `platforms` is empty: the top 5 social platforms and the top 4 AI assistants. */
export const SHARELINK_DEFAULT_PLATFORMS: SharelinkPlatformId[] = [
	...SHARELINK_PLATFORM_IDS.slice(0, 5),
	...SHARELINK_AI_IDS.slice(0, 4),
];

export interface SharelinkUiModel {
	/** Page to share. Empty: the current `location.href`, read on click. */
	url?: string;
	/** Share text (X, Threads, Telegram, WhatsApp, SMS, Pinterest, Reddit title…). */
	text?: string;
	/** Email subject, and the native share title. */
	subject?: string;
	/** Prompt for the AI assistants; the page URL is added after it. Empty: "Summarize this page:". */
	prompt?: string;
	/** Platforms to show, in this order. Empty: `SHARELINK_DEFAULT_PLATFORMS`. `twitter` is read as `x`. */
	platforms?: (SharelinkPlatformId | 'twitter')[];
	/** Extra classes on the root. The root class `sharelink` stays on the component. */
	className?: string;
}

export const sharelinkMock: SharelinkUiModel = {
	url: '',
	text: 'Check out this page',
	subject: 'CUI share link',
	prompt: '',
	platforms: [],
	className: '',
};
