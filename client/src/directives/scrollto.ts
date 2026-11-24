import type { Directive } from 'vue';

export type ScrollToOptions = {
	/** Selector of the element to scroll to. */
	target: string;
	/** Pixels to keep above the target. */
	offsetTop?: number;
	/** Selector of the scroll container. Omit for the page. */
	container?: string;
};

export type ScrollToValue = string | ScrollToOptions;

type ScrollToState = {
	value: ScrollToValue;
	onClick: (e: Event) => void;
};

const stateMap = new WeakMap<HTMLElement, ScrollToState>();

function toOptions(value: ScrollToValue, el: HTMLElement): ScrollToOptions {
	if (!value) {
		return { target: el.getAttribute('href') ?? '' };
	}
	return typeof value === 'string' ? { target: value } : value;
}

function scrollTo(opts: ScrollToOptions) {
	const target = opts.target ? document.querySelector(opts.target) : null;
	if (!target) {
		return;
	}
	const offset = opts.offsetTop ?? 0;
	const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		? 'auto'
		: 'smooth';
	const container = opts.container ? document.querySelector(opts.container) : null;
	if (container) {
		const top =
			container.scrollTop +
			target.getBoundingClientRect().top -
			container.getBoundingClientRect().top -
			offset;
		container.scrollTo({ top, behavior });
		return;
	}
	const top = window.scrollY + target.getBoundingClientRect().top - offset;
	window.scrollTo({ top, behavior });
}

/** `v-scrollto="'#id'"` or `v-scrollto="{ target, offsetTop, container }"`. A click scrolls there. */
const scrollto: Directive<HTMLElement, ScrollToValue> = {
	mounted(el, binding) {
		const state: ScrollToState = {
			value: binding.value,
			onClick: (e: Event) => {
				e.preventDefault();
				scrollTo(toOptions(state.value, el));
			},
		};
		el.addEventListener('click', state.onClick);
		stateMap.set(el, state);
	},
	updated(el, binding) {
		const state = stateMap.get(el);
		if (state) {
			state.value = binding.value;
		}
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (state) {
			el.removeEventListener('click', state.onClick);
			stateMap.delete(el);
		}
	},
};

export default scrollto;
