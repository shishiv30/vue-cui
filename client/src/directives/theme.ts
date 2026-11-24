import type { Directive } from 'vue';

const THEME_KEY = 'theme';
const CLASSES = ['theme-dark', 'theme-light'];

type ThemeMode = 'dark' | 'light' | 'auto';

const stateMap = new WeakMap<HTMLElement, (e: Event) => void>();

function readMode(): ThemeMode {
	const saved = localStorage.getItem(THEME_KEY);
	return saved === 'dark' || saved === 'light' ? saved : 'auto';
}

/** Same classes and storage key as the inline script in `client/src/index.html`. */
function applyMode(mode: 'dark' | 'light') {
	const cls = `theme-${mode}`;
	for (const node of [document.documentElement, document.body]) {
		node.classList.remove(...CLASSES);
		node.classList.add(cls);
	}
	localStorage.setItem(THEME_KEY, mode);
}

function toggleMode() {
	const mode = readMode();
	if (mode === 'auto') {
		const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyMode(systemDark ? 'light' : 'dark');
		return;
	}
	applyMode(mode === 'dark' ? 'light' : 'dark');
}

/** `v-theme` on a trigger. A click switches between `theme-light` and `theme-dark`. */
const theme: Directive<HTMLElement> = {
	mounted(el) {
		const onClick = (e: Event) => {
			e.preventDefault();
			toggleMode();
		};
		el.addEventListener('click', onClick);
		stateMap.set(el, onClick);
	},
	unmounted(el) {
		const onClick = stateMap.get(el);
		if (onClick) {
			el.removeEventListener('click', onClick);
			stateMap.delete(el);
		}
	},
};

export default theme;
