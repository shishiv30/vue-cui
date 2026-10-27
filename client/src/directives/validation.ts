import type { Directive } from 'vue';
import { formatTrim } from '../../js/core/format.js';
import { isEmail, isPhoneNumber, isPrice, isZipcode } from '../../js/core/validate.js';

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type ValidationState = {
	rules: string[];
	onChange: () => void;
};

const stateMap = new WeakMap<Field, ValidationState>();

function readValue(el: Field) {
	if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
		const value = el.getAttribute('value');
		return el.checked ? (value || 'on') : '';
	}
	return el.value;
}

function wrapper(el: Field) {
	if (el instanceof HTMLInputElement) {
		if (el.type === 'checkbox') {
			return el.closest('.checkbox');
		}
		if (el.type === 'radio') {
			return el.closest('.radio');
		}
		return el.closest('.input');
	}
	if (el.tagName === 'TEXTAREA') {
		return el.closest('.textarea') || el.closest('.input');
	}
	if (el.tagName === 'SELECT') {
		return el.closest('.selectbox') || el.closest('.input');
	}
	return el.parentElement;
}

function showError(el: Field, message: string) {
	const parent = wrapper(el);
	if (!parent) {
		return;
	}
	parent.classList.remove('has-success');
	if (message) {
		parent.dataset.tooltip = message;
	}
	parent.classList.add('has-error');
}

function showPass(el: Field, isRequired: boolean, value: string) {
	const parent = wrapper(el);
	if (!parent) {
		return;
	}
	parent.classList.remove('has-error');
	if (parent.dataset.tooltip) {
		delete parent.dataset.tooltip;
	}
	if (isRequired || value) {
		parent.classList.add('has-success');
	} else {
		parent.classList.remove('has-success');
	}
}

function priceOk(value: string) {
	const amount = Number(value);
	return Number.isInteger(amount) && isPrice(amount);
}

export function isFieldValid(el: Field) {
	const state = stateMap.get(el);
	const rules = state?.rules ?? [];
	const value = formatTrim(readValue(el)) || '';
	const isRequired = rules.includes('required');
	for (const rule of rules) {
		if (rule === 'required' && value === '') {
			showError(el, '* requried');
			return false;
		}
		if (rule === 'email' && value && !isEmail(value)) {
			showError(el, 'Invalid Email.');
			return false;
		}
		if (rule === 'phone' && value && !isPhoneNumber(value)) {
			showError(el, 'Invalid Phone Number');
			return false;
		}
		if (rule === 'zipcode' && value && !isZipcode(value)) {
			showError(el, 'Invalid Zipcode');
			return false;
		}
		if (rule === 'price' && value && !priceOk(value)) {
			showError(el, 'Invalid Price');
			return false;
		}
	}
	showPass(el, isRequired, value);
	return true;
}

function parseRules(value: unknown) {
	if (typeof value !== 'string' || !value) {
		return [];
	}
	return value.split('|').map((rule) => rule.trim()).filter(Boolean);
}

const validation: Directive<Field, string> = {
	mounted(el, binding) {
		const onChange = () => {
			isFieldValid(el);
		};
		stateMap.set(el, { rules: parseRules(binding.value), onChange });
		el.dataset.validation = '';
		el.addEventListener('change', onChange);
	},
	updated(el, binding) {
		const state = stateMap.get(el);
		if (state) {
			state.rules = parseRules(binding.value);
		}
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (state) {
			el.removeEventListener('change', state.onChange);
			stateMap.delete(el);
		}
		delete el.dataset.validation;
	},
};

export default validation;
