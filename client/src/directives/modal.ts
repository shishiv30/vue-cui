import type { Directive } from 'vue';

const HIDE_MS = 500;

type ModalState = {
	onClick: (e: Event) => void;
};

type OpenModal = {
	root: HTMLElement;
	trigger: HTMLElement;
	onKey: (e: KeyboardEvent) => void;
};

const stateMap = new WeakMap<HTMLElement, ModalState>();

/** One modal is open at a time. */
let current: OpenModal | null = null;
let uid = 0;

function hide() {
	if (!current) {
		return;
	}
	const { root, trigger, onKey } = current;
	current = null;
	document.removeEventListener('keydown', onKey);
	root.classList.remove('modal-active');
	setTimeout(() => {
		root.remove();
		if (!current) {
			document.documentElement.classList.remove('modal-model');
		}
	}, HIDE_MS);
	trigger.focus();
}

function show(trigger: HTMLElement, selector: string, theme: string) {
	const source = selector ? document.querySelector(selector) : null;
	if (!source) {
		return;
	}
	hide();
	const root = document.createElement('div');
	root.id = `modal-${++uid}`;
	root.className = `modal modal-${theme}`;
	root.tabIndex = -1;
	root.setAttribute('role', 'dialog');
	root.setAttribute('aria-modal', 'true');
	root.innerHTML =
		'<div class="modal-overlay"></div><div class="modal-panel"><div class="modal-body">' +
		'<button class="modal-title-close" data-modal="close" type="button" aria-label="Close">' +
		'<i class="icon-close" aria-hidden="true"></i></button>' +
		source.innerHTML +
		'</div></div>';
	root.addEventListener('click', (e) => {
		const target = e.target as Element;
		if (target.closest('[data-modal="close"]') || target.classList.contains('modal-overlay')) {
			hide();
		}
	});
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			hide();
		}
	};
	document.addEventListener('keydown', onKey);
	document.body.appendChild(root);
	document.documentElement.classList.add('modal-model');
	current = { root, trigger, onKey };
	// The class starts the CSS fade (`@starting-style` in _modal.scss).
	root.classList.add('modal-active');
	root.focus();
}

/**
 * `v-modal:[theme]="'#templateId'"`. A click copies the template's HTML into a new
 * `div.modal` under `body`. Themes: `default`, `fullscreen`, `dropdown`.
 */
const modal: Directive<HTMLElement, string> = {
	mounted(el, binding) {
		const onClick = (e: Event) => {
			e.preventDefault();
			show(el, binding.value, binding.arg || 'default');
		};
		el.addEventListener('click', onClick);
		stateMap.set(el, { onClick });
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (state) {
			el.removeEventListener('click', state.onClick);
			stateMap.delete(el);
		}
		if (current?.trigger === el) {
			hide();
		}
	},
};

export default modal;
