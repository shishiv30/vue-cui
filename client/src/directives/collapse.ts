import type { Directive } from 'vue';
import { emit } from '../../js/core/event.js';

type CollapseState = {
	toggle: () => void;
};

const stateMap = new WeakMap<HTMLElement, CollapseState>();

function emitCollapse(eventName: string, el: HTMLElement) {
	emit(`${eventName}.collapse`, [el]);
}

function show(el: HTMLElement, panel: Element | null) {
	emitCollapse('show', el);
	el.classList.add('shown');
	panel?.classList.add('shown');
	emitCollapse('shown', el);
}

function hide(el: HTMLElement, panel: Element | null) {
	emitCollapse('hide', el);
	el.classList.remove('shown');
	panel?.classList.remove('shown');
	emitCollapse('hidden', el);
}

const collapse: Directive<HTMLElement, string> = {
	mounted(el, binding) {
		const selector = binding.value;
		const panel = selector ? document.querySelector(selector) : null;
		const toggle = () => {
			if (el.classList.contains('shown')) {
				hide(el, panel);
			} else {
				show(el, panel);
			}
		};
		if (binding.arg === 'shown') {
			show(el, panel);
		} else {
			hide(el, panel);
		}
		el.addEventListener('click', toggle);
		stateMap.set(el, { toggle });
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (state) {
			el.removeEventListener('click', state.toggle);
			stateMap.delete(el);
		}
	},
};

export default collapse;
