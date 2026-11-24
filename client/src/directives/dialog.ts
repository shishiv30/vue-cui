import type { Directive } from 'vue';

type DialogState = {
	onClick: (e: Event) => void;
};

const stateMap = new WeakMap<HTMLElement, DialogState>();
const boundDialogs = new WeakSet<HTMLDialogElement>();

function resolve(selector: string): HTMLDialogElement | null {
	const el = selector ? document.querySelector(selector) : null;
	return el instanceof HTMLDialogElement ? el : null;
}

/** `[data-dialog="close"]` and a backdrop click close the dialog. Esc is native. */
function bindClose(dialog: HTMLDialogElement) {
	if (boundDialogs.has(dialog)) {
		return;
	}
	boundDialogs.add(dialog);
	dialog.addEventListener('click', (e) => {
		const target = e.target as Element;
		if (target === dialog || target.closest('[data-dialog="close"]')) {
			dialog.close();
		}
	});
}

/** `v-dialog="'#dialogId'"` on a trigger. A click calls `showModal()` on that `<dialog>`. */
const dialog: Directive<HTMLElement, string> = {
	mounted(el, binding) {
		const onClick = (e: Event) => {
			e.preventDefault();
			const target = resolve(binding.value);
			if (!target || target.open) {
				return;
			}
			bindClose(target);
			target.showModal();
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
	},
};

export default dialog;
