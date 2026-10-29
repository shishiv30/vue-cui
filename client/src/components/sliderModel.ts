import { assetUrl } from './assetUrl';

export interface SliderImageMeta {
	index: string | number;
	title: string;
	description: string;
}

/** Markup from `server/ejs/comp_album.ejs`, options from `client/js/plugins/_slider.js`. */
export interface SliderUiModel {
	/** Image URLs. The mock list matches `data-images` in `client/pages/document/index.html`. */
	images: string[];
	/** Index of the first visible image. */
	initialIndex?: number;
	/** Accessible name for the images. */
	alt?: string;
	/** Extra classes on the root. The root class `slider` stays on the component. */
	className?: string;
	/** Dot buttons under the frames. Defaults to shown. */
	showProcess?: boolean;
	/** Snap animation length in seconds. */
	duration?: number;
	/** Drag distance in pixels that changes the frame. */
	throttle?: number;
	/** Optional caption for each image. */
	imagesMeta?: SliderImageMeta[];
}

export const sliderMock: SliderUiModel = {
	images: [
		assetUrl('/images/01.jpg'),
		assetUrl('/images/02.jpg'),
		assetUrl('/images/03.jpg'),
		assetUrl('/images/04.jpg'),
		assetUrl('/images/05.jpg'),
		assetUrl('/images/06.jpg'),
		assetUrl('/images/07.jpg'),
	],
	initialIndex: 0,
	alt: 'Slider',
	className: 'property-slider',
	showProcess: true,
	duration: 0.2,
	throttle: 50,
};
