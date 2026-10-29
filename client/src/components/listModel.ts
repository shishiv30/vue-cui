export type ListTheme = 'default' | 'gray' | 'major' | 'minor' | 'danger' | 'safe' | 'tip';

export type ListSize = 'tiny' | 'small' | 'normal' | 'large';

/** One row: icon class, uppercase title, description, and a palette class on the icon. */
export interface ListItem {
	/** Font-awesome class, e.g. `icon-home`. Ignored when `image` is set. */
	icon?: string;
	/** Image src that replaces the icon, filling the icon well. */
	image?: string;
	/** Alt text for `image`. Empty (decorative) by default. */
	imageAlt?: string;
	/** Small line on top of the title. */
	sub?: string;
	/** Highlighted (blue) line below the description, e.g. a call to action. */
	sup?: string;
	/** Small uppercase label above the description. */
	title: string;
	/** Primary line. */
	desc: string;
	/** Palette class for the icon well. Empty keeps body colors. */
	theme?: ListTheme;
	/** Extra classes on the row button. */
	className?: string;
}

export interface ListUiModel {
	items: ListItem[];
	/** Size class from `comp-size('list')`. Empty is the same as `normal`. */
	size?: ListSize | '';
	/** Extra classes on the root `ul`. */
	className?: string;
}

export const listMock: ListUiModel = {
	items: [
		{
			icon: 'icon-home',
			title: 'Home',
			desc: "What's going on with my home?",
			theme: 'major',
		},
		{
			icon: 'icon-usd',
			title: 'Save',
			desc: 'Am I overpaying?',
			theme: 'safe',
		},
		{
			icon: 'icon-exchange',
			title: 'Move',
			desc: 'Should I buy or sell?',
			theme: 'major',
		},
		{
			icon: 'icon-line-chart',
			title: 'Grow',
			desc: 'How do I use my equity?',
			theme: 'minor',
		},
		{
			icon: 'icon-folder-o',
			title: 'Vault',
			desc: "Where's that document?",
			theme: 'gray',
		},
		{
			icon: 'icon-question',
			title: 'Help',
			desc: 'Need a tip on what to do next?',
			theme: 'tip',
		},
	],
	size: 'normal',
	className: '',
};
