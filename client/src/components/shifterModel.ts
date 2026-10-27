/** Markup from `client/pages/document/index.html`, options from `client/js/plugins/_shifter.js`. */
export interface ShifterUiModel {
	/** Scroller children. The mock list matches the document demo. An empty list renders nothing. */
	items: string[];
	/**
	 * How far next/prev move. `data-step` on the plugin.
	 * Greater than 0: that many cards. Otherwise the visible scroller width.
	 */
	step?: number;
	/** Extra classes on the root. The root class `shifter` stays on the component. */
	className?: string;
}

export const shifterMock: ShifterUiModel = {
	items: [
		'Item 1',
		'Item 2',
		'Item 3',
		'Item 4',
		'Item 5',
		'Item 6',
		'Item 7',
		'Item 8',
		'Item 9',
		'Item 10',
	],
	step: 1,
	className: '',
};
