export interface FormEnumOption {
	/** Submitted value. */
	value: string;
	/** Visible label. */
	text: string;
}

/** Gender radios from `client/pages/document/index.html`. */
export const radioMock: FormEnumOption[] = [
	{ value: 'Male', text: 'Male' },
	{ value: 'Female', text: 'Female' },
];

/** Favor checkboxes from `client/pages/document/index.html`. */
export const checkboxMock: FormEnumOption[] = [
	{ value: 'Dance', text: 'Dance' },
	{ value: 'Sing', text: 'Sing' },
	{ value: 'Paint', text: 'Paint' },
];

/** Frequency options from the document selectbox. */
export const selectMock: FormEnumOption[] = [
	{ value: 'Weekly', text: 'Weekly' },
	{ value: 'Daily', text: 'Daily' },
	{ value: 'Monthly', text: 'Monthly' },
];

/** Price stops used by listing filters. */
export const rangeSliderMock: FormEnumOption[] = [
	{ value: 'no_min', text: 'no min' },
	{ value: '0', text: '0' },
	{ value: '100000', text: '100k' },
	{ value: '250000', text: '250k' },
	{ value: '500000', text: '500k' },
	{ value: '750000', text: '750k' },
	{ value: '1000000', text: '1m' },
	{ value: '1500000', text: '1.5m' },
	{ value: '2000000', text: '2m' },
	{ value: '3000000', text: '3m' },
	{ value: '4000000', text: '4m' },
	{ value: '5000000', text: '5m' },
	{ value: '7500000', text: '7.5m' },
	{ value: '10000000', text: '10m' },
	{ value: 'no_max', text: 'no max' },
];
