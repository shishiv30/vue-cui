import type { Directive } from 'vue';

type TabState = {
	toggle: (target: HTMLElement | number) => void;
	onClick: (e: Event) => void;
	buttons: HTMLElement[];
};

const stateMap = new WeakMap<HTMLElement, TabState>();

function panelsFor(targetId: string) {
	return document.querySelectorAll(`[data-id="${targetId}"]`);
}

function initialIndex(value: unknown) {
	return typeof value === 'number' && Number.isInteger(value) ? value : 0;
}

const tab: Directive<HTMLElement, number> = {
	mounted(el, binding) {
		const toggle = (target: HTMLElement | number) => {
			let button = target as HTMLElement;
			if (Number.isInteger(target)) {
				button = el.querySelectorAll('[data-target]')[target as number] as HTMLElement;
			}
			if (!button?.classList || button.classList.contains('active')) {
				return;
			}
			el.querySelectorAll('[data-target].active').forEach((item) => {
				const active = item as HTMLElement;
				active.classList.remove('active');
				panelsFor(active.dataset.target || '').forEach((panel) => {
					panel.classList.add('hide');
				});
			});
			button.classList.add('active');
			panelsFor(button.dataset.target || '').forEach((panel) => {
				panel.classList.remove('hide');
			});
		};
		const onClick = (e: Event) => {
			const button = (e.currentTarget as HTMLElement) || null;
			if (button) {
				toggle(button);
			}
		};
		const index = initialIndex(binding.value);
		const buttons = Array.from(el.querySelectorAll('[data-target]')) as HTMLElement[];
		buttons.forEach((item, i) => {
			panelsFor(item.dataset.target || '').forEach((panel) => {
				if (i !== index) {
					panel.classList.add('hide');
				} else {
					item.classList.add('active');
				}
			});
			item.addEventListener('click', onClick);
		});
		stateMap.set(el, { toggle, onClick, buttons });
	},
	updated(el, binding) {
		if (binding.value === binding.oldValue) {
			return;
		}
		const state = stateMap.get(el);
		if (state) {
			state.toggle(initialIndex(binding.value));
		}
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (!state) {
			return;
		}
		state.buttons.forEach((item) => {
			item.removeEventListener('click', state.onClick);
		});
		stateMap.delete(el);
	},
};

export default tab;
