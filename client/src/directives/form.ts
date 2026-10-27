import type { Directive } from 'vue';
import { isFieldValid } from './validation';

type FormValue = string | boolean | string[];
type FormPayload = Record<string, FormValue>;

type FormState = {
	onSubmit: (event: Event) => void;
	submit: ((payload: FormPayload) => void) | null;
};

const stateMap = new WeakMap<HTMLFormElement, FormState>();

function collect(form: HTMLFormElement): FormPayload {
	const payload: FormPayload = {};
	form.querySelectorAll('input').forEach((item) => {
		if (item.type === 'radio' || item.type === 'checkbox') {
			return;
		}
		if (item.name) {
			payload[item.name] = item.value;
		}
	});
	form.querySelectorAll('textarea').forEach((item) => {
		if (item.name) {
			payload[item.name] = item.value;
		}
	});
	form.querySelectorAll('select').forEach((item) => {
		if (item.name) {
			payload[item.name] = item.value;
		}
	});
	form.querySelectorAll('.checkbox').forEach((group) => {
		const boxes = group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		if (!boxes.length) {
			return;
		}
		const name = boxes[0].name;
		if (!name) {
			return;
		}
		if (boxes.length === 1) {
			const box = boxes[0];
			if (box.checked) {
				payload[name] = box.value ? box.value : true;
			} else {
				payload[name] = box.value ? '' : false;
			}
			return;
		}
		payload[name] = [];
		boxes.forEach((box) => {
			if (box.checked) {
				(payload[name] as string[]).push(box.value);
			}
		});
	});
	form.querySelectorAll('.radio').forEach((group) => {
		const radios = group.querySelectorAll<HTMLInputElement>('input[type="radio"]');
		if (!radios.length) {
			return;
		}
		const name = radios[0].name;
		if (!name) {
			return;
		}
		payload[name] = '';
		radios.forEach((radio) => {
			if (radio.checked) {
				payload[name] = radio.value ? radio.value : true;
			}
		});
	});
	return payload;
}

function fields(form: HTMLFormElement) {
	return form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
		'[data-validation]',
	);
}

const formDirective: Directive<HTMLFormElement, (payload: FormPayload) => void> = {
	mounted(el, binding) {
		const state: FormState = {
			onSubmit: (event: Event) => {
				event.preventDefault();
				let focusTarget: HTMLElement | null = null;
				let passed = true;
				fields(el).forEach((field) => {
					if (!isFieldValid(field)) {
						passed = false;
						if (!focusTarget) {
							focusTarget = field;
						}
					}
				});
				if (focusTarget) {
					focusTarget.focus();
				}
				if (!passed || typeof state.submit !== 'function') {
					return;
				}
				state.submit(collect(el));
			},
			submit: typeof binding.value === 'function' ? binding.value : null,
		};
		el.addEventListener('submit', state.onSubmit);
		stateMap.set(el, state);
	},
	updated(el, binding) {
		const state = stateMap.get(el);
		if (state) {
			state.submit = typeof binding.value === 'function' ? binding.value : null;
		}
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (state) {
			el.removeEventListener('submit', state.onSubmit);
			stateMap.delete(el);
		}
	},
};

export default formDirective;
