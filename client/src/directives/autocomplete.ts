import type { Directive, DirectiveBinding } from 'vue';
import { emit } from '../../js/core/event.js';
import { logError } from '../../js/core/log.js';

/**
 * v-autocomplete: suggestion list for any text input.
 *
 * <input v-model="text" v-autocomplete="cities" />
 * <input v-model="text" v-autocomplete="{ source: '/api/geo', label: 'city' }"
 *   @autocomplete-select="onPick" />
 *
 * One shared list and one overlay live under <body>. CSS draws their states:
 * `.in` (open), `.top` / `.bottom` (placement) and `.selected` on an item.
 * The list sits flush against the input and takes the input's colors, border and radius,
 * so the two read as one box. While open the input gets `autocomplete-top` or
 * `autocomplete-bottom`, which squares the corners where the list joins it.
 * While the list is open, `html.autocomplete-open` locks page scrolling and the
 * overlay dims the page, leaving a hole over the input. A click on it closes the list.
 */

export type AutocompleteItem = unknown;
export type AutocompleteFetcher = (
	query: string,
	signal: AbortSignal,
) => AutocompleteItem[] | Promise<AutocompleteItem[]>;
/** An array is filtered locally, a string is a GET url, a function returns the matches. */
export type AutocompleteSource = AutocompleteItem[] | string | AutocompleteFetcher;

export type AutocompleteOptions = {
	source: AutocompleteSource;
	/** Item field or function that gives the text shown and written to the input. */
	label?: string | ((item: AutocompleteItem) => string);
	/** Query parameter name for a url source. Default `text`. */
	param?: string;
	/** Extra query parameters for a url source. */
	params?: Record<string, string>;
	/** Characters needed before searching. Default 1. */
	minLength?: number;
	/** Debounce for url and function sources, in ms. Default 300. */
	delay?: number;
	/** Most items shown. Default 10. */
	limit?: number;
	/** Extra class on the shared list while this input owns it, for a caller-specific layout. */
	listClass?: string;
};

export type AutocompleteValue = AutocompleteSource | AutocompleteOptions;

/** Space kept between the list and the viewport edge. */
const GAP = 4;
/** Input styles the list copies, so the two look like one box. */
const SHARED_STYLE = {
	'--autocomplete-list-color': 'color',
	'--autocomplete-list-color-bg': 'backgroundColor',
	'--autocomplete-list-color-border': 'borderBottomColor',
	'--autocomplete-list-border-width': 'borderBottomWidth',
	'--autocomplete-list-radius': 'borderTopLeftRadius',
} as const;
const LIST_ID = 'autocompleteList';

type AutocompleteState = {
	opts: AutocompleteOptions;
	items: AutocompleteItem[];
	index: number;
	timer: ReturnType<typeof setTimeout> | null;
	abort: AbortController | null;
	query: string;
	onInput: () => void;
	onFocus: () => void;
	onBlur: () => void;
	onKeydown: (e: KeyboardEvent) => void;
};

const stateMap = new WeakMap<HTMLInputElement, AutocompleteState>();

let list: HTMLElement | null = null;
let overlay: HTMLElement | null = null;
let owner: HTMLInputElement | null = null;
let ownerClass = '';

function parseOpts(binding: DirectiveBinding<AutocompleteValue>): AutocompleteOptions {
	const value = binding.value;
	if (value && typeof value === 'object' && !Array.isArray(value) && 'source' in value) {
		return value;
	}
	return { source: (value as AutocompleteSource) ?? [] };
}

function getLabel(item: AutocompleteItem, opts: AutocompleteOptions) {
	if (typeof opts.label === 'function') {
		return opts.label(item);
	}
	if (item && typeof item === 'object') {
		const obj = item as Record<string, unknown>;
		const key = opts.label || ['label', 'text', 'name'].find((k) => k in obj) || '';
		return String(obj[key] ?? '');
	}
	return String(item ?? '');
}

function ensureList() {
	if (list) {
		return list;
	}
	const el = document.createElement('div');
	el.id = LIST_ID;
	el.className = 'autocomplete-list bottom';
	el.setAttribute('role', 'listbox');
	// Keep focus on the input so a click selects instead of blurring first.
	el.addEventListener('mousedown', (e) => e.preventDefault());
	el.addEventListener('click', (e) => {
		const item = (e.target as HTMLElement).closest<HTMLElement>('.autocomplete-item');
		if (item && owner) {
			select(owner, Number(item.dataset.index));
		}
	});
	el.addEventListener('mousemove', (e) => {
		const item = (e.target as HTMLElement).closest<HTMLElement>('.autocomplete-item');
		if (item && owner) {
			highlight(owner, Number(item.dataset.index), false);
		}
	});
	overlay = document.createElement('div');
	overlay.className = 'autocomplete-overlay';
	overlay.addEventListener('click', () => {
		if (owner) {
			hide(owner);
		}
	});
	document.body.append(overlay, el);
	list = el;
	return el;
}

function renderItem(label: string, query: string, i: number) {
	const node = document.createElement('div');
	node.className = 'autocomplete-item';
	node.id = `${LIST_ID}-${i}`;
	node.dataset.index = String(i);
	node.setAttribute('role', 'option');
	const at = query ? label.toLowerCase().indexOf(query.toLowerCase()) : -1;
	if (at < 0) {
		node.textContent = label;
		return node;
	}
	const match = document.createElement('b');
	match.className = 'autocomplete-match';
	match.textContent = label.slice(at, at + query.length);
	node.append(label.slice(0, at), match, label.slice(at + query.length));
	return node;
}

function position() {
	if (!list || !owner) {
		return;
	}
	const rect = owner.getBoundingClientRect();
	// The overlay leaves this box uncovered, so the input stays visible and clickable.
	overlay?.style.setProperty('--autocomplete-hole-top', `${rect.top}px`);
	overlay?.style.setProperty('--autocomplete-hole-right', `${rect.right}px`);
	overlay?.style.setProperty('--autocomplete-hole-bottom', `${rect.bottom}px`);
	overlay?.style.setProperty('--autocomplete-hole-left', `${rect.left}px`);
	const below = window.innerHeight - rect.bottom - GAP * 2;
	const above = rect.top - GAP * 2;
	const placeBelow = below >= Math.min(list.scrollHeight, 240) || below >= above;
	list.classList.toggle('bottom', placeBelow);
	list.classList.toggle('top', !placeBelow);
	owner.classList.toggle('autocomplete-bottom', placeBelow);
	owner.classList.toggle('autocomplete-top', !placeBelow);
	// CSS reads these, so a listClass can replace the layout.
	list.style.setProperty('--autocomplete-space', `${Math.max(placeBelow ? below : above, 0)}px`);
	list.style.setProperty('--autocomplete-left', `${rect.left}px`);
	list.style.setProperty('--autocomplete-width', `${rect.width}px`);
	list.style.setProperty('--autocomplete-top', placeBelow ? `${rect.bottom}px` : 'auto');
	list.style.setProperty(
		'--autocomplete-bottom',
		placeBelow ? 'auto' : `${window.innerHeight - rect.top}px`,
	);
}

function isOpen(el: HTMLInputElement) {
	return owner === el && !!list && list.classList.contains('in');
}

function show(el: HTMLInputElement, state: AutocompleteState, items: AutocompleteItem[]) {
	if (!items.length || document.activeElement !== el) {
		hide(el);
		return;
	}
	const tip = ensureList();
	const wasOpen = isOpen(el);
	owner = el;
	const nextClass = state.opts.listClass || '';
	if (nextClass !== ownerClass) {
		// Swapped only on show, so the closing fade keeps the previous layout.
		if (ownerClass) {
			tip.classList.remove(...ownerClass.split(' '));
		}
		if (nextClass) {
			tip.classList.add(...nextClass.split(' '));
		}
		ownerClass = nextClass;
	}
	state.items = items;
	state.index = -1;
	tip.replaceChildren(
		...items.map((item, i) => renderItem(getLabel(item, state.opts), state.query, i)),
	);
	tip.scrollTop = 0;
	el.setAttribute('aria-expanded', 'true');
	el.removeAttribute('aria-activedescendant');
	if (!wasOpen) {
		// Lock scrolling first: hiding the scrollbar can move the input.
		document.documentElement.classList.add('autocomplete-open');
		// Read before the placement class squares the input's corners.
		const inputStyle = getComputedStyle(el);
		for (const [name, prop] of Object.entries(SHARED_STYLE)) {
			tip.style.setProperty(name, inputStyle[prop]);
		}
	}
	position();
	if (!wasOpen) {
		window.addEventListener('resize', position);
		overlay?.classList.add('in');
		tip.classList.add('in');
		emit('show.autocomplete', [el]);
	}
}

function hide(el: HTMLInputElement) {
	const state = stateMap.get(el);
	if (state) {
		state.index = -1;
		state.abort?.abort();
		state.abort = null;
		if (state.timer) {
			clearTimeout(state.timer);
			state.timer = null;
		}
	}
	el.setAttribute('aria-expanded', 'false');
	el.removeAttribute('aria-activedescendant');
	el.classList.remove('autocomplete-top', 'autocomplete-bottom');
	if (owner !== el || !list) {
		return;
	}
	window.removeEventListener('resize', position);
	if (list.classList.contains('in')) {
		document.documentElement.classList.remove('autocomplete-open');
		overlay?.classList.remove('in');
		list.classList.remove('in');
		emit('hide.autocomplete', [el]);
	}
}

function highlight(el: HTMLInputElement, index: number, scroll = true) {
	const state = stateMap.get(el);
	if (!state || !list || state.index === index) {
		return;
	}
	state.index = index;
	list.querySelectorAll('.autocomplete-item').forEach((node, i) => {
		node.classList.toggle('selected', i === index);
		node.setAttribute('aria-selected', String(i === index));
		if (i === index && scroll) {
			node.scrollIntoView({ block: 'nearest' });
		}
	});
	if (index >= 0) {
		el.setAttribute('aria-activedescendant', `${LIST_ID}-${index}`);
	}
}

function select(el: HTMLInputElement, index: number) {
	const state = stateMap.get(el);
	const item = state?.items[index];
	if (!state || item === undefined) {
		return;
	}
	el.value = getLabel(item, state.opts);
	hide(el);
	// Let v-model pick up the new text without starting another search.
	state.query = el.value;
	el.dispatchEvent(new Event('input', { bubbles: true }));
	el.dispatchEvent(new CustomEvent('autocomplete-select', { detail: item, bubbles: true }));
	emit('select.autocomplete', [el, item]);
}

function search(el: HTMLInputElement, state: AutocompleteState) {
	const { source, minLength = 1, delay = 300, limit = 10 } = state.opts;
	const query = el.value.trim();
	if (query === state.query) {
		return;
	}
	state.query = query;
	state.abort?.abort();
	state.abort = null;
	if (state.timer) {
		clearTimeout(state.timer);
		state.timer = null;
	}
	if (query.length < minLength) {
		hide(el);
		return;
	}
	if (Array.isArray(source)) {
		const q = query.toLowerCase();
		const matches = source.filter((item) =>
			getLabel(item, state.opts).toLowerCase().includes(q),
		);
		show(el, state, matches.slice(0, limit));
		return;
	}
	state.timer = setTimeout(async () => {
		state.timer = null;
		const abort = new AbortController();
		state.abort = abort;
		try {
			const items = await fetchItems(source, query, abort.signal, state.opts);
			if (!abort.signal.aborted && state.query === query) {
				show(el, state, items.slice(0, limit));
			}
		} catch (error) {
			if (!abort.signal.aborted) {
				logError('[autocomplete] source failed', { query, error });
				hide(el);
			}
		}
	}, delay);
}

async function fetchItems(
	source: string | AutocompleteFetcher,
	query: string,
	signal: AbortSignal,
	opts: AutocompleteOptions,
): Promise<AutocompleteItem[]> {
	if (typeof source === 'function') {
		return (await source(query, signal)) || [];
	}
	const params = new URLSearchParams({ ...opts.params, [opts.param || 'text']: query });
	const res = await fetch(`${source}${source.includes('?') ? '&' : '?'}${params}`, { signal });
	if (!res.ok) {
		throw new Error(`HTTP ${res.status}`);
	}
	const body = await res.json();
	return Array.isArray(body) ? body : body?.data || [];
}

function onKeydown(el: HTMLInputElement, state: AutocompleteState, e: KeyboardEvent) {
	if (!isOpen(el)) {
		if (e.key === 'ArrowDown' && el.value.trim()) {
			e.preventDefault();
			state.query = '';
			search(el, state);
		}
		return;
	}
	const count = state.items.length;
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		highlight(el, (state.index + 1) % count);
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		highlight(el, state.index <= 0 ? count - 1 : state.index - 1);
	} else if (e.key === 'Enter' && state.index >= 0) {
		e.preventDefault();
		select(el, state.index);
	} else if (e.key === 'Escape') {
		e.preventDefault();
		hide(el);
	}
}

const autocomplete: Directive<HTMLInputElement, AutocompleteValue> = {
	mounted(el, binding) {
		const state: AutocompleteState = {
			opts: parseOpts(binding),
			items: [],
			index: -1,
			timer: null,
			abort: null,
			query: el.value.trim(),
			onInput: () => search(el, state),
			onFocus: () => {
				state.query = '';
				search(el, state);
			},
			onBlur: () => hide(el),
			onKeydown: (e) => onKeydown(el, state, e),
		};
		el.setAttribute('role', 'combobox');
		el.setAttribute('aria-autocomplete', 'list');
		el.setAttribute('aria-controls', LIST_ID);
		el.setAttribute('aria-expanded', 'false');
		el.setAttribute('autocomplete', 'off');
		el.addEventListener('input', state.onInput);
		el.addEventListener('focus', state.onFocus);
		el.addEventListener('blur', state.onBlur);
		el.addEventListener('keydown', state.onKeydown);
		stateMap.set(el, state);
	},
	updated(el, binding) {
		const state = stateMap.get(el);
		if (state && binding.value !== binding.oldValue) {
			state.opts = parseOpts(binding);
		}
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (!state) {
			return;
		}
		hide(el);
		if (owner === el) {
			owner = null;
		}
		el.removeEventListener('input', state.onInput);
		el.removeEventListener('focus', state.onFocus);
		el.removeEventListener('blur', state.onBlur);
		el.removeEventListener('keydown', state.onKeydown);
		stateMap.delete(el);
	},
};

export default autocomplete;
