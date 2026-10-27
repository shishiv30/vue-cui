/** Markup from `client/pages/document/index.html`, options from `client/js/plugins/_player.js`. */
export interface PlayerUiModel {
	/** Image URLs. The mock list matches `data-images` in `client/pages/document/index.html`. */
	images: string[];
	/** Index of the first visible image (plugin `imgIndex`). */
	initialIndex?: number;
	/** Dot buttons. Defaults to shown. */
	showProcess?: boolean;
	/** Prev / toggle / next buttons. Defaults to shown. */
	showControl?: boolean;
	/** If true, start playback after mount. */
	autoPlay?: boolean;
	/**
	 * Sets `--player-animation-duration`. Plugin `defaultOpt` is 4000 meaning 4s.
	 * CSS default is 10s. Values >= 100 are milliseconds (`${n / 1000}s`); otherwise seconds.
	 */
	animationDuration?: number;
	/** Motion. `slide` is the default. `fly` moves in to cover. `zoom` fades and scales in to cover. */
	style?: 'slide' | 'fly' | 'zoom';
	/** Playback direction. `true` plays forward. `false` reverses the slide. `goNext` sets true, `goPrev` sets false. */
	direction?: boolean;
	/** Extra classes on the root. The root class `player` stays on the component. */
	className?: string;
}

export const playerMock: PlayerUiModel = {
	images: [
		'/images/01.jpg',
		'/images/02.jpg',
		'/images/03.jpg',
		'/images/04.jpg',
		'/images/05.jpg',
		'/images/06.jpg',
		'/images/07.jpg',
	],
	initialIndex: 0,
	showProcess: true,
	showControl: true,
	autoPlay: false,
	animationDuration: 4000,
	style: 'slide',
	direction: true,
	className: '',
};
