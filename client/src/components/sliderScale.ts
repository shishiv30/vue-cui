import { formatNumber, formatSqft } from '../../js/core/format.js';
import type { FormEnumOption } from './formEnumOption';

export type SliderFormat = 'number' | 'price' | 'sqft';

export function scaleStops(
	min: number | string,
	max: number | string,
	step: number | string,
): FormEnumOption[] {
	const start = Number(min);
	const end = Number(max);
	const size = Number(step);
	if (
		!Number.isFinite(start)
		|| !Number.isFinite(end)
		|| !Number.isFinite(size)
		|| size <= 0
		|| end < start
	) {
		return [];
	}
	const decimals = (String(step).split('.')[1] || '').length;
	const count = Math.round((end - start) / size);
	const options: FormEnumOption[] = [];
	for (let index = 0; index <= count; index += 1) {
		const raw = start + index * size;
		const value = decimals ? raw.toFixed(decimals) : String(raw);
		options.push({ value, text: value });
	}
	return options;
}

export function formatStop(stop: string, format: SliderFormat) {
	if (stop === 'no_min') {
		return 'no min';
	}
	if (stop === 'no_max') {
		return 'no max';
	}
	const number = Number(stop);
	if (!Number.isFinite(number)) {
		return stop;
	}
	if (format === 'price') {
		if (number >= 1000000) {
			const millions = number / 1000000;
			return Number.isInteger(millions) ? `${millions}m` : `${millions.toFixed(1)}m`;
		}
		if (number >= 1000) {
			const thousands = number / 1000;
			return Number.isInteger(thousands) ? `${thousands}k` : `${thousands.toFixed(1)}k`;
		}
		return String(number);
	}
	if (format === 'sqft') {
		return formatSqft(number);
	}
	return formatNumber(number);
}
