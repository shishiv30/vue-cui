/** Options from `client/js/plugins/_sharelink.js` (`data-url`, `data-text`, `data-subject`, `data-platforms`). */
export type SharelinkPlatformId = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';

export interface SharelinkUiModel {
	/** Page to share. Empty: the current `location.href`, read on click. */
	url?: string;
	/** Text for Twitter. */
	text?: string;
	/** Email subject, and the native share title. */
	subject?: string;
	/** Platforms to show, in this order. Empty: all of them. */
	platforms?: SharelinkPlatformId[];
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
