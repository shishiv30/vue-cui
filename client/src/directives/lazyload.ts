import type { Directive } from 'vue';

const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

let observer: IntersectionObserver | null = null;

function setImageRatio(img: HTMLImageElement) {
	if (!img.hasAttribute('ratio') || !img.naturalWidth || !img.naturalHeight) {
		return;
	}
	if (img.style.getPropertyValue('--image-ratio')) {
		return;
	}
	img.style.setProperty('--image-ratio', String(img.naturalWidth / img.naturalHeight));
}

function setLoadedHeight(img: HTMLImageElement) {
	if (img.hasAttribute('ratio') || img.closest('.layout-grid')) {
		return;
	}
	if (!img.naturalWidth || !img.naturalHeight || !img.offsetWidth) {
		return;
	}
	const height = img.offsetWidth * (img.naturalHeight / img.naturalWidth);
	img.style.height = '200px';
	requestAnimationFrame(() => {
		img.style.height = `${height}px`;
	});
}

function clean(img: HTMLImageElement) {
	img.setAttribute('data-src-loaded', '');
	img.removeAttribute('data-src');
	img.removeEventListener('load', onLoad);
	img.removeEventListener('error', onError);
}

function onLoad(event: Event) {
	const img = event.target as HTMLImageElement | null;
	if (!img) {
		return;
	}
	setImageRatio(img);
	setLoadedHeight(img);
	clean(img);
}

function onError(event: Event) {
	const img = event.target as HTMLImageElement | null;
	if (!img) {
		return;
	}
	img.classList.add('img-load-error');
	img.src = PLACEHOLDER;
	clean(img);
}

function loadImg(img: HTMLImageElement) {
	const imgSrc = img.getAttribute('data-src');
	if (!imgSrc) {
		return;
	}
	img.addEventListener('load', onLoad);
	img.addEventListener('error', onError);
	img.src = imgSrc;
}

function ensureObserver() {
	if (observer || typeof IntersectionObserver === 'undefined') {
		return observer;
	}
	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}
			const img = entry.target as HTMLImageElement;
			loadImg(img);
			observer?.unobserve(img);
		});
	});
	return observer;
}

function bind(img: HTMLImageElement, url: string) {
	if (img.hasAttribute('fetchpriority')) {
		return;
	}
	if (url && url !== PLACEHOLDER) {
		img.setAttribute('data-src', url);
		img.setAttribute('src', PLACEHOLDER);
	} else if (!img.getAttribute('src') && img.hasAttribute('data-src')) {
		img.setAttribute('src', PLACEHOLDER);
	}
	const io = ensureObserver();
	if (!io) {
		loadImg(img);
		return;
	}
	io.observe(img);
}

const lazyload: Directive<HTMLImageElement, string> = {
	mounted(el, binding) {
		bind(el, binding.value || '');
	},
	updated(el, binding) {
		const next = binding.value || '';
		if (!next || next === el.getAttribute('data-src') || next === el.getAttribute('src')) {
			return;
		}
		el.removeAttribute('data-src-loaded');
		el.style.height = '';
		bind(el, next);
	},
	unmounted(el) {
		observer?.unobserve(el);
		el.removeEventListener('load', onLoad);
		el.removeEventListener('error', onError);
	},
};

export default lazyload;
