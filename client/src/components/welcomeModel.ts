export type WelcomeAnimation = 'fadein' | 'flyin' | 'jumpin' | 'rotatein' | 'zoomin';

/** `random` picks one of the animations for each panel once the image has loaded. */
export type WelcomeAnimationMode = WelcomeAnimation | 'random';

/** Corners: north-east, north-west, south-east, south-west. */
export type WelcomePanelPosition = 'ne' | 'nw' | 'se' | 'sw';

export const welcomePositions: WelcomePanelPosition[] = ['nw', 'ne', 'sw', 'se'];

export const welcomeAnimations: WelcomeAnimation[] = ['fadein', 'flyin', 'jumpin', 'rotatein', 'zoomin'];

export interface WelcomePanel {
	/** Main line, for example the value. */
	title?: string;
	/** Line under the title. */
	sub?: string;
	/** Small line above the title. */
	sup?: string;
	/** Badge next to the title, for example 3.2%. */
	label?: string;
	/** Extra class on the label, for example safe or danger. */
	labelStyle?: string;
	/** Icon class, for example icon-home. Omitted when empty. */
	icon?: string;
	/** Extra class on the icon. */
	iconStyle?: string;
	/** Fixed corner. Only used when the list fits the available corners. Omitted: a random corner from `positions`. */
	position?: WelcomePanelPosition;
}

export interface WelcomeData {
	list: WelcomePanel[];
	/** Caption headline, usually the address. */
	title?: string;
	/** Caption line under the title, for example city, state and listing by. */
	subTitle?: string;
}

/** One image per breakpoint. `xs` is the fallback `img` src, the others become `<source media>`. */
export interface WelcomeSrc {
	xs?: string;
	/** From 640px. */
	sm?: string;
	/** From 960px. */
	md?: string;
	/** From 1600px. */
	lg?: string;
}

export interface WelcomeUiModel {
	/** Width/height as `w/h`, for example 4/3. Defaults to 16/9. */
	ratio?: string;
	data: WelcomeData;
	src: WelcomeSrc;
	/** Entrance of the panels once the image has loaded. Defaults to random. */
	animation?: WelcomeAnimationMode;
	/**
	 * Corners the panels may use, for example ['ne', 'sw']. Defaults to all four.
	 * With more panels than corners, the panels take turns: the oldest leaves, the next one enters its corner.
	 */
	positions?: WelcomePanelPosition[];
	/** Seconds between two switches when panels take turns. Defaults to 4. */
	interval?: number;
	/** Alt text of the image. Defaults to data.title. */
	alt?: string;
	/** Extra classes on the root. The root class `welcome` stays on the component. */
	className?: string;
}

export const welcomeMock: WelcomeUiModel = {
	ratio: '16/9',
	animation: 'random',
	positions: ['nw', 'ne', 'sw', 'se'],
	interval: 4,
	src: {
		xs: 'https://picsum.photos/seed/welcome/640/360',
		sm: 'https://picsum.photos/seed/welcome/960/540',
		md: 'https://picsum.photos/seed/welcome/1600/900',
		lg: 'https://picsum.photos/seed/welcome/2400/1350',
	},
	data: {
		title: '1847 Waverly Heights Dr',
		subTitle: 'Austin, TX 78703 · Member Jordan Rivera',
		list: [
			{
				sup: 'Estimated value',
				title: '$610,000',
				label: '3.2%',
				labelStyle: 'safe',
			},
			{
				sup: 'Spotted on 5 bills',
				title: 'up to $3,140/yr',
				icon: 'icon-money',
				iconStyle: 'safe',
			},
		],
	},
};
