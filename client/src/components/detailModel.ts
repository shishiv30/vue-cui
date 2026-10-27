import type { SliderUiModel } from './sliderModel';

export interface DetailTagItem {
	text?: string;
	value?: string;
	icon?: string;
	className?: string;
}

export interface DetailTags {
	items: DetailTagItem[];
}

export interface DetailParagraph {
	text: string;
}

export interface DetailRecordItem {
	key?: string;
	value?: string | number;
	desc?: string;
	className?: string;
}

export interface DetailRecord {
	heading?: string;
	items: DetailRecordItem[];
}

export interface DetailOpenHouseItem {
	startDate?: string;
	startTime?: string;
	endDate?: string;
	endTime?: string;
}

export interface DetailOpenHouses {
	heading?: string;
	items: DetailOpenHouseItem[];
}

export interface DetailTimelineEntry {
	type: 'title' | 'desc';
	label?: string;
	date?: string;
	text?: string;
}

export interface DetailTimeline {
	heading?: string;
	intro?: string;
	entries: DetailTimelineEntry[];
}

/** Shape returned by mapPropertyDetailToArticle for the detail panel. */
export interface PropertyDetailModel {
	title?: string;
	tags?: DetailTags | null;
	album?: SliderUiModel | null;
	paragraph?: DetailParagraph | null;
	record?: DetailRecord | null;
	openHouses?: DetailOpenHouses | null;
	timeline?: DetailTimeline | null;
}
