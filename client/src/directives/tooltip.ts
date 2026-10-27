import type { Directive, DirectiveBinding } from 'vue';
import { emit } from '../../js/core/event.js';

const ANIMATION_MS = 200;
const TEMPLATE = '<div class="tooltip-arrow"></div><div class="tooltip-inner"></div>';
const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const;
const TRIGGERS = ['hover', 'click', 'focus'] as const;

type Placement = (typeof PLACEMENTS)[number];
type Trigger = (typeof TRIGGERS)[number];

type TooltipOpts = {
	content: string;
	html: boolean;
	once: boolean;
	placement: Placement;
	trigger: Trigger;
};

type TooltipState = {
	opts: TooltipOpts;
	onEnter: () => void;
	onLeave: () => void;
	onFocusIn: () => void;
	onFocusOut: () => void;
	onClick: (e: Event) => void;
	outsideClick: ((e: Event) => void) | null;
};

const stateMap = new WeakMap<HTMLElement, TooltipState>();

let sharedTip: HTMLElement | null = null;
let owner: HTMLElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let generation = 0;
let outsideClick: ((e: Event) => void) | null = null;

function clearOutsideClick() {
	if (outsideClick) {
		document.removeEventListener('click', outsideClick);
		outsideClick = null;
	}
}

function cancelTimers() {
	if (hideTimer) {
		clearTimeout(hideTimer);
		hideTimer = null;
	}
	if (showTimer) {
		clearTimeout(showTimer);
		showTimer = null;
	}
}

function emitTooltip(eventName: string, el: HTMLElement) {
	emit(`${eventName}.tooltip`, [el]);
}

function getOffset(el: HTMLElement) {
	const elRect = el.getBoundingClientRect();
	return {
		top: elRect.top + window.pageYOffset,
		left: elRect.left + window.pageXOffset,
	};
}

function setStyles(el: HTMLElement, styles: Record<string, string>) {
	for (const prop in styles) {
		if (styles[prop] === '') {
			el.style.removeProperty(prop);
		} else {
			el.style.setProperty(prop, styles[prop]);
		}
	}
}

function parseOpts(binding: DirectiveBinding<string>): TooltipOpts {
	const mods = binding.modifiers || {};
	let placement: Placement = 'top';
	for (const p of PLACEMENTS) {
		if (mods[p]) {
			placement = p;
			break;
		}
	}
	let trigger: Trigger = 'hover';
	for (const t of TRIGGERS) {
		if (mods[t]) {
			trigger = t;
			break;
		}
	}
	return {
		content: binding.value ?? '',
		html: !!mods.html,
		once: !!mods.once,
		placement,
		trigger,
	};
}

function ensureTip() {
	if (sharedTip) {
		return sharedTip;
	}
	const el = document.createElement('div');
	el.className = 'tooltip defalut';
	el.innerHTML = TEMPLATE;
	el.addEventListener('click', (e) => {
		e.stopPropagation();
	});
	document.body.appendChild(el);
	sharedTip = el;
	return el;
}

function clearPlacement(el: HTMLElement) {
	el.classList.remove(
		'top',
		'bottom',
		'left',
		'right',
		'top-left',
		'top-right',
		'bottom-left',
		'bottom-right',
	);
}

function placementBounds(triggerEl: HTMLElement) {
	let node = triggerEl.parentElement;
	let bounds = { left: 0, right: window.innerWidth };
	while (node && node !== document.body && node !== document.documentElement) {
		const rect = node.getBoundingClientRect();
		if (rect.width > 0 && rect.width + 1 < window.innerWidth) {
			bounds = { left: rect.left, right: rect.right };
			node = node.parentElement;
		} else {
			break;
		}
	}
	return bounds;
}

function positionTip(triggerEl: HTMLElement, tip: HTMLElement, placement: Placement) {
	clearPlacement(tip);
	tip.classList.add('defalut');
	tip.classList.add(placement);
	tip.style.display = 'block';
	tip.style.opacity = '';
	tip.style.visibility = 'hidden';
	tip.classList.remove('in');
	void tip.offsetHeight;

	const cWidth = tip.offsetWidth;
	const cHeight = tip.offsetHeight;
	const tWidth = triggerEl.offsetWidth;
	const tHeight = triggerEl.offsetHeight;
	const offset = getOffset(triggerEl);
	const triggerRect = triggerEl.getBoundingClientRect();
	const triggerLeft = triggerRect.left;
	const bounds = placementBounds(triggerEl);

	if (placement === 'top' || placement === 'bottom') {
		tip.classList.remove(`${placement}-left`, `${placement}-right`);
		const centeredLeft = triggerLeft + (tWidth - cWidth) / 2;
		let css: Record<string, string> = {};
		if (centeredLeft < bounds.left) {
			css = {
				left: `${offset.left}px`,
				right: 'auto',
			};
			tip.classList.add(`${placement}-left`);
		} else if (centeredLeft + cWidth > bounds.right) {
			css = {
				left: `${offset.left + tWidth - cWidth}px`,
				right: 'auto',
			};
			tip.classList.add(`${placement}-right`);
		} else {
			css = {
				left: `${offset.left + (tWidth - cWidth) / 2}px`,
				right: 'auto',
			};
		}
		if (placement === 'top') {
			css.top = `${offset.top}px`;
			css.bottom = 'auto';
			css.transform = 'translateY(-100%)';
		} else {
			css.top = `${offset.top + tHeight}px`;
			css.bottom = 'auto';
			css.transform = 'none';
		}
		setStyles(tip, css);
	} else {
		const verticalCenter = (tHeight - cHeight) / 2;
		const css =
			placement === 'left'
				? {
						top: `${offset.top + verticalCenter}px`,
						left: `${offset.left - cWidth}px`,
						right: '',
						bottom: '',
						transform: '',
					}
				: {
						top: `${offset.top + verticalCenter}px`,
						left: `${offset.left + tWidth}px`,
						right: '',
						bottom: '',
						transform: '',
					};
		setStyles(tip, css);
	}
	tip.style.visibility = '';
}

function fillTip(tip: HTMLElement, opts: TooltipOpts) {
	const inner = tip.querySelector('.tooltip-inner');
	if (!inner) {
		return;
	}
	if (opts.html) {
		inner.innerHTML = opts.content;
	} else {
		inner.textContent = opts.content;
	}
}

function removeSharedTip() {
	clearOutsideClick();
	if (sharedTip) {
		sharedTip.remove();
		sharedTip = null;
	}
	owner = null;
}

function detach(el: HTMLElement) {
	const state = stateMap.get(el);
	if (!state) {
		return;
	}
	if (state.opts.trigger === 'click') {
		el.removeEventListener('click', state.onClick);
	} else if (state.opts.trigger === 'focus') {
		el.removeEventListener('focusin', state.onFocusIn);
		el.removeEventListener('focusout', state.onFocusOut);
	} else {
		el.removeEventListener('mouseenter', state.onEnter);
		el.removeEventListener('mouseleave', state.onLeave);
	}
	if (state.outsideClick && state.outsideClick === outsideClick) {
		clearOutsideClick();
	}
	stateMap.delete(el);
}

function showTip(el: HTMLElement, opts: TooltipOpts) {
	if (!stateMap.has(el)) {
		return;
	}
	cancelTimers();
	clearOutsideClick();
	const gen = ++generation;
	const tip = ensureTip();
	owner = el;
	fillTip(tip, opts);
	emitTooltip('show', el);
	positionTip(el, tip, opts.placement);
	showTimer = setTimeout(() => {
		if (gen !== generation || owner !== el) {
			return;
		}
		tip.classList.add('in');
		emitTooltip('shown', el);
		showTimer = null;
	}, 10);
}

function hideOpenTip() {
	if (!owner) {
		return;
	}
	const state = stateMap.get(owner);
	if (!state) {
		return;
	}
	hideTip(owner, state.opts);
}

if (typeof window !== 'undefined') {
	window.addEventListener('resize', hideOpenTip);
}

function hideTip(el: HTMLElement, opts: TooltipOpts) {
	const tip = sharedTip;
	if (!tip || owner !== el) {
		return;
	}
	cancelTimers();
	const gen = ++generation;
	emitTooltip('hide', el);
	tip.classList.remove('in');
	hideTimer = setTimeout(() => {
		if (gen !== generation || owner !== el) {
			return;
		}
		if (opts.once) {
			removeSharedTip();
			detach(el);
		}
		emitTooltip('hidden', el);
		hideTimer = null;
	}, ANIMATION_MS + 1);
}

const tooltip: Directive<HTMLElement, string> = {
	mounted(el, binding) {
		const opts = parseOpts(binding);
		const state: TooltipState = {
			opts,
			onEnter: () => showTip(el, state.opts),
			onLeave: () => hideTip(el, state.opts),
			onFocusIn: () => showTip(el, state.opts),
			onFocusOut: () => hideTip(el, state.opts),
			onClick: (e: Event) => {
				e.preventDefault();
				e.stopPropagation();
				showTip(el, state.opts);
				const hideOnOutsideClick = (ev: Event) => {
					const target = ev.target as Node | null;
					if (outsideClick !== hideOnOutsideClick) {
						return;
					}
					if (!sharedTip || owner !== el || (!sharedTip.contains(target) && target !== el)) {
						hideTip(el, state.opts);
						clearOutsideClick();
					}
				};
				outsideClick = hideOnOutsideClick;
				state.outsideClick = hideOnOutsideClick;
				setTimeout(() => {
					if (outsideClick === hideOnOutsideClick) {
						document.addEventListener('click', hideOnOutsideClick);
					}
				}, 0);
			},
			outsideClick: null,
		};
		if (opts.trigger === 'click') {
			el.addEventListener('click', state.onClick);
		} else if (opts.trigger === 'focus') {
			el.addEventListener('focusin', state.onFocusIn);
			el.addEventListener('focusout', state.onFocusOut);
		} else {
			el.addEventListener('mouseenter', state.onEnter);
			el.addEventListener('mouseleave', state.onLeave);
		}
		stateMap.set(el, state);
	},
	updated(el, binding) {
		const state = stateMap.get(el);
		if (state) {
			state.opts = parseOpts(binding);
		}
	},
	unmounted(el) {
		const state = stateMap.get(el);
		if (state && owner === el) {
			hideTip(el, state.opts);
		}
		detach(el);
	},
};

export default tooltip;
