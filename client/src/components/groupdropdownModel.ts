import type { SliderFormat } from './sliderScale';

/** One checkbox or radio inside a panel. */
export interface GroupDropdownOption {
	/** Submitted value. Empty string is the default radio. */
	value: string;
	/** Visible label. */
	label: string;
	/** Starts checked when the field key is missing from `v-model`. */
	checked?: boolean;
	/** Control cannot be toggled. */
	disabled?: boolean;
}

/** Price, bed, or bath slider. `stops` is a comma-separated stop list. */
export interface GroupDropdownRangeField {
	id: string;
	type: 'range';
	label: string;
	format: SliderFormat;
	stops: string;
}

/** Type, status, or tags. `single` is a radio. `multi` and `tags` are checkboxes. */
export interface GroupDropdownChoiceField {
	id: string;
	type: 'single' | 'multi' | 'tags';
	label: string;
	/** `1` uses one column. Anything else uses two. */
	cols?: number;
	options: GroupDropdownOption[];
}

export type GroupDropdownField = GroupDropdownRangeField | GroupDropdownChoiceField;

/**
 * Values keyed by field id.
 * Range is `[min, max]` (`''` is unbounded).
 * `single` is one value. `multi` and `tags` are checked values (`tags` uses option labels' names).
 */
export type GroupDropdownValue = Record<string, string | string[]>;

const BED_STOPS = 'no_min,0,1,2,3,4,5,6,7,8,9,10,no_max';
const PRICE_STOPS = [
	'no_min',
	'0',
	'100000',
	'250000',
	'500000',
	'750000',
	'1000000',
	'1500000',
	'2000000',
	'3000000',
	'4000000',
	'5000000',
	'7500000',
	'10000000',
	'no_max',
].join(',');

const PROPERTY_TYPES = [
	'single_family',
	'condo',
	'townhouse',
	'multi_family',
	'mobile',
	'land',
	'other',
];

function typeLabel(value: string) {
	return value
		.split('_')
		.map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
		.join(' ');
}

/** Listing filter from an empty `createFilterComponent()`. */
export const groupdropdownMock: GroupDropdownField[] = [
	{
		id: 'price',
		type: 'range',
		label: 'Price',
		format: 'price',
		stops: PRICE_STOPS,
	},
	{
		id: 'bed',
		type: 'range',
		label: 'Bed',
		format: 'number',
		stops: BED_STOPS,
	},
	{
		id: 'bath',
		type: 'range',
		label: 'Bath',
		format: 'number',
		stops: BED_STOPS,
	},
	{
		id: 'propertyType',
		type: 'multi',
		label: 'Type',
		cols: 2,
		options: PROPERTY_TYPES.map((value) => ({
			value,
			label: typeLabel(value),
		})),
	},
	{
		id: 'propertyStatus',
		type: 'single',
		label: 'Status',
		cols: 1,
		options: [
			{ value: '', label: 'For sale', checked: true },
			{ value: 'sold', label: 'Sold' },
			{ value: 'rental', label: 'Rental' },
		],
	},
	{
		id: 'tags',
		type: 'tags',
		label: 'Tags',
		cols: 2,
		options: [
			{ value: 'photo', label: 'Photo' },
			{ value: 'construction', label: 'New construction' },
			{ value: 'openhouse', label: 'Open house' },
		],
	},
];

/** Empty listing filter. Range ends are unbounded. */
export const groupdropdownMockValue: GroupDropdownValue = {
	price: ['', ''],
	bed: ['', ''],
	bath: ['', ''],
	propertyType: [],
	propertyStatus: '',
	tags: [],
};
