function clearRing(main) {
	const frame = main.querySelector(':scope > .layout-ring-frame');
	const stage = frame
		? frame.querySelector(':scope > .layout-ring-stage')
		: main.querySelector(':scope > .layout-ring-stage');
	if (stage) {
		while (stage.firstChild) {
			const child = stage.firstChild;
			if (child instanceof HTMLElement) {
				child.style.removeProperty('visibility');
				child.style.removeProperty('pointer-events');
				child.style.removeProperty('--ring-angle');
			}
			main.insertBefore(child, frame || stage);
		}
		(frame || stage).remove();
	}
	main.classList.remove('layout-ring');
	main.style.removeProperty('--ring-perspective');
	main.style.removeProperty('--ring-radius');
}

function gridColumnCount(main) {
	const style = getComputedStyle(main);
	const gap = parseFloat(style.columnGap) || 0;
	const min = parseFloat(style.getPropertyValue('--layout-grid-min')) || 260;
	const width = main.clientWidth
		- (parseFloat(style.paddingLeft) || 0)
		- (parseFloat(style.paddingRight) || 0);
	if (min + gap <= 0) {
		return 1;
	}
	return Math.max(1, Math.floor((width + gap) / (min + gap)));
}

function bindGrid(main) {
	if (main._layoutGrid) {
		main._layoutGrid.disconnect();
	}
	const firstCount = main.classList.contains('layout-grid')
		? gridColumnCount(main)
		: (parseInt(getComputedStyle(main).columnCount, 10) || 1);
	let lastCols = firstCount;
	let lastRects = [...main.querySelectorAll(':scope > .article')].map((article) => {
		return article.getBoundingClientRect();
	});
	let token = 0;
	const observer = new ResizeObserver(() => {
		if (main.classList.contains('layout-horizontal')) {
			return;
		}
		const cols = main.classList.contains('layout-grid')
			? gridColumnCount(main)
			: (parseInt(getComputedStyle(main).columnCount, 10) || 1);
		const articles = [...main.querySelectorAll(':scope > .article')];
		if (cols === lastCols || articles.length !== lastRects.length) {
			lastCols = cols;
			lastRects = articles.map((article) => article.getBoundingClientRect());
			return;
		}
		const from = lastRects;
		lastCols = cols;
		token += 1;
		const current = token;
		const moves = [];
		articles.forEach((article, index) => {
			const prev = from[index];
			const next = article.getBoundingClientRect();
			lastRects[index] = next;
			const dx = prev.left - next.left;
			const dy = prev.top - next.top;
			if (dx === 0 && dy === 0) {
				return;
			}
			article.style.transition = 'none';
			article.style.transform = `translate(${dx}px, ${dy}px)`;
			moves.push(article);
		});
		if (!moves.length) {
			return;
		}
		main.classList.add('is-col-animating');
		main.offsetWidth;
		requestAnimationFrame(() => {
			if (current !== token) {
				return;
			}
			moves.forEach((article) => {
				article.style.transition = '';
				article.style.transform = '';
			});
			let remaining = moves.length;
			let settled = false;
			const finish = () => {
				if (settled || current !== token) {
					return;
				}
				settled = true;
				moves.forEach((article) => {
					article.removeEventListener('transitionend', onEnd);
				});
				main.classList.remove('is-col-animating');
			};
			const onEnd = (event) => {
				if (event.propertyName !== 'transform') {
					return;
				}
				remaining -= 1;
				if (remaining <= 0) {
					finish();
				}
			};
			moves.forEach((article) => {
				article.addEventListener('transitionend', onEnd);
			});
			setTimeout(finish, 580);
		});
	});
	observer.observe(main);
	main._layoutGrid = observer;
}

function clearGrid(main) {
	if (main._layoutGrid) {
		main._layoutGrid.disconnect();
		main._layoutGrid = null;
	}
	main.classList.remove('layout-grid', 'is-col-animating');
}

function mountRing(main) {
	clearRing(main);
	const articles = [...main.querySelectorAll(':scope > .article')];
	if (articles.length < 2) {
		return;
	}
	const frame = document.createElement('div');
	frame.className = 'layout-ring-frame';
	const stage = document.createElement('div');
	stage.className = 'layout-ring-stage';
	articles.forEach((article) => stage.appendChild(article));
	frame.appendChild(stage);
	main.prepend(frame);
	const count = articles.length;
	const step = 360 / count;
	const cardWidth = 300;
	const theta = Math.tan(Math.PI / count);
	const radius = theta > 0.01
		? Math.round((cardWidth / 2) / theta)
		: cardWidth;
	frame.style.setProperty('--ring-radius', radius + 'px');
	articles.forEach((article, index) => {
		article.style.setProperty('--ring-angle', index * step + 'deg');
	});
	main.classList.add('layout-ring');
	bindRingDrag(stage, radius, articles, step);
}

function bindRingDrag(stage, radius, articles, step) {
	let spin = 0;
	let pointerId = null;
	let lastX = 0;
	let startX = 0;
	let startY = 0;
	let dragging = false;
	let frame = 0;
	const radians = 180 / Math.PI;

	function wrap(deg) {
		return ((deg % 360) + 360) % 360;
	}

	function updateFacing() {
		if (!Number.isFinite(spin)) {
			spin = 0;
		}
		articles.forEach((article, index) => {
			const position = wrap(index * step + spin);
			const delta = Math.min(position, 360 - position);
			const front = delta < 90;
			article.style.visibility = front ? 'visible' : 'hidden';
			article.style.pointerEvents = front ? 'auto' : 'none';
		});
	}

	function paint() {
		frame = 0;
		stage.style.setProperty('--ring-spin', spin + 'deg');
		updateFacing();
	}

	updateFacing();

	stage.addEventListener('pointerdown', (event) => {
		pointerId = event.pointerId;
		lastX = event.clientX;
		startX = event.clientX;
		startY = event.clientY;
		dragging = false;
	});
	stage.addEventListener('pointermove', (event) => {
		if (event.pointerId !== pointerId) {
			return;
		}
		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		if (!dragging) {
			if (Math.hypot(dx, dy) < 8) {
				return;
			}
			if (Math.abs(dy) > Math.abs(dx)) {
				pointerId = null;
				return;
			}
			dragging = true;
			lastX = event.clientX;
			stage.setPointerCapture(event.pointerId);
			stage.classList.add('is-grabbing');
		}
		spin -= ((event.clientX - lastX) / radius) * radians;
		lastX = event.clientX;
		if (!frame) {
			frame = requestAnimationFrame(paint);
		}
	});
	function resetPointer(reason, event) {
		if (event && event.pointerId !== undefined && pointerId !== null && event.pointerId !== pointerId) {
			return;
		}
		const id = pointerId;
		pointerId = null;
		dragging = false;
		stage.classList.remove('is-grabbing');
		if (reason !== 'lostpointercapture' && id !== null && stage.hasPointerCapture(id)) {
			stage.releasePointerCapture(id);
		}
		if (!Number.isFinite(spin)) {
			spin = 0;
			paint();
		}
	}
	stage.addEventListener('pointerup', (event) => resetPointer(event.type, event));
	stage.addEventListener('pointercancel', (event) => resetPointer(event.type, event));
	stage.addEventListener('lostpointercapture', (event) => resetPointer(event.type, event));
	window.addEventListener('blur', () => resetPointer('blur', null));
	stage.addEventListener('wheel', (event) => {
		if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
			return;
		}
		event.preventDefault();
		spin -= (event.deltaX / radius) * radians;
		if (!frame) {
			frame = requestAnimationFrame(paint);
		}
	}, { passive: false });
}

function playLayoutMove(main, apply) {
	const articles = [...main.querySelectorAll('.article')];
	const from = articles.map((article) => article.getBoundingClientRect());
	articles.forEach((article) => {
		article.style.transition = 'none';
		article.style.transform = '';
	});
	apply();
	const destinations = articles.map((article) => {
		const value = getComputedStyle(article).transform;
		return value === 'none' ? '' : value;
	});
	articles.forEach((article, index) => {
		const next = article.getBoundingClientRect();
		const prev = from[index];
		const dx = (prev.left + prev.width / 2) - (next.left + next.width / 2);
		const dy = (prev.top + prev.height / 2) - (next.top + next.height / 2);
		article.style.transition = 'none';
		article.style.transform = `translate(${dx}px, ${dy}px) ${destinations[index]}`;
	});
	main.offsetWidth;
	requestAnimationFrame(() => {
		articles.forEach((article, index) => {
			article.style.transition = 'transform .6s ease';
			article.style.transform = destinations[index];
			const done = (event) => {
				if (event.propertyName !== 'transform') {
					return;
				}
				article.style.transition = '';
				article.style.transform = '';
				article.removeEventListener('transitionend', done);
			};
			article.addEventListener('transitionend', done);
		});
	});
}

export default {
	name: 'layout',
	defaultOpt: {},
	init: function ($el, opt, exportObj) {
		if ($el.classList.contains('layout-grid')) {
			exportObj.model = 'grid';
		} else if (
			$el.classList.contains('layout-horizontal')
			|| $el.classList.contains('layout-ring')
		) {
			exportObj.model = 'horizontal';
		} else {
			exportObj.model = 'default';
		}
		if (exportObj.model === 'horizontal') {
			$el.classList.add('layout-horizontal');
			clearRing($el);
		}
		if (exportObj.model !== 'horizontal') {
			bindGrid($el);
		}
		exportObj.setModel = function (model) {
			const next = model === 'horizontal' || model === 'grid' ? model : 'default';
			if (next === exportObj.model) {
				return;
			}
			if (next === 'horizontal') {
				window.scrollTo(0, 0);
			}
			playLayoutMove($el, () => {
				$el.classList.remove('layout-horizontal');
				clearRing($el);
				clearGrid($el);
				if (next === 'horizontal') {
					$el.classList.add('layout-horizontal');
				}
				if (next === 'grid') {
					$el.classList.add('layout-grid');
				}
				if (next !== 'horizontal') {
					bindGrid($el);
				}
				exportObj.model = next;
			});
		};
	},
	initBefore: null,
};
