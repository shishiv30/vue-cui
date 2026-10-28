<template>
	<div ref="pageEl" :class="pageClass">
		<Header :model="header" />
		<nav
			class="listing-nav"
			aria-label="Listing"
		>
			<div v-if="breadcrumbLinks.length" class="breadcrumb">
				<ul>
					<li v-for="(link, index) in breadcrumbLinks" :key="index">
						<span v-if="!link.href">{{ link.text }}</span>
						<a v-else :href="link.href">{{ link.text }}</a>
					</li>
				</ul>
			</div>
			<div v-if="filters.length" class="filter">
				<GroupDropdown
					v-model="filterValue"
					:data="filters"
					@change="onFilterChange"
					@input="onFilterChange"
				/>
			</div>
		</nav>
		<Detail
			v-if="detail || detailPlaceholder || leaving"
			:model="detail"
			:placeholder="detailPlaceholder"
			:reveal="detailReveal"
		/>
		<Result :articles="articles" />
		<footer v-if="footer" class="footer">
			<section class="section small major inline bg active">
				<div class="fixed fixed-max-xs grid grid-xs-1">
					<div class="footer-section">
						<div class="text-bold f4">{{ footer.contact.title }}</div>
						<p>Email: {{ footer.contact.email }}</p>
						<p>Phone: {{ footer.contact.phone }}</p>
						<p>Address: {{ footer.contact.address }}</p>
					</div>
					<div class="footer-section">
						<div class="text-bold f4">{{ footer.social.title }}</div>
						<div class="footer-social-link">
							<a
								v-for="(link, index) in footer.social.links"
								:key="index"
								:href="link.href"
								:aria-label="link.ariaLabel"
							>
								<i :class="`icon-${link.icon}`"></i>
							</a>
						</div>
					</div>
					<nav>
						<ul class="flex">
							<li v-for="(item, index) in footer.menu" :key="index">
								<a :href="item.href">{{ item.text }}</a>
							</li>
						</ul>
					</nav>
					<div class="footer-section default bg">
						<div class="text-bold f4">Newsletter</div>
						<p>Stay updated with our latest news and updates.</p>
						<form class="input minor left">
							<input type="email" placeholder="Enter your email" required />
							<button type="submit" class="btn primary" aria-label="Subscribe">
								<i class="icon-envelope"></i>
							</button>
						</form>
					</div>
					<div class="footer-bottom">
						<p>&copy; {{ footer.year }} {{ footer.appName }}. All rights reserved.</p>
					</div>
				</div>
			</section>
			<section class="section small inline bg">
				<div class="f6">
					This website is for informational purposes only and does not constitute legal, financial, or investment
					advice. The information provided is not intended to be a substitute for professional advice. Always
					consult with a qualified professional before making any financial decisions. &copy;
					{{ footer.year }}
					{{ footer.appName }}. All rights reserved.
				</div>
			</section>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Detail from '../components/Detail.vue';
import GroupDropdown from '../components/GroupDropdown.vue';
import Header from '../components/Header.vue';
import Result from '../components/Result.vue';
import type { PropertyDetailModel } from '../components/detailModel';
import type { ArticleUiModel } from '../components/articleModel';
import type { GroupDropdownField, GroupDropdownValue } from '../components/groupdropdownModel';
import { getQueryStringByFilter } from '../../../helpers/filter.js';
import { matchPropertySpaRoute } from '../../../helpers/routes/propertySpaRoutes.js';
import { headerMock } from '../components/headerModel';
import type { PropertyState } from '../store';

const store = useStore<PropertyState>();
const route = useRoute();
const router = useRouter();
const detail = computed(() => store.state.detail);
const detailPlaceholder = ref(false);
const detailReveal = ref(false);
const header = headerMock;
const footer = computed(() => store.state.footer);
const articles = computed(() => store.state.articles);
const filters = computed(() => store.state.filters);
const breadcrumbLinks = computed(() => store.state.breadcrumb?.links ?? []);

type PropertyView = 'grid' | 'detail' | 'map';

const viewFlipMs = 500;

function viewFromPath(path: string): PropertyView {
	const match = matchPropertySpaRoute(path);
	if (match?.id === 'detail' || match?.id === 'map') {
		return match.id;
	}
	return 'grid';
}

const pageEl = ref<HTMLElement | null>(null);
const view = ref<PropertyView>(viewFromPath(route.path));
const animating = ref(false);
const leaving = ref(false);
const lock = ref(false);
const collapse = ref(false);
const menu = ref(false);

const pageClass = computed(() => ({
	'page-property': true,
	[`view-${view.value}`]: true,
	'view-animating': animating.value,
	'detail-leaving': leaving.value,
	lock: lock.value,
	collapse: collapse.value,
	menu: menu.value,
}));

type ItemRect = {
	item: HTMLElement;
	top: number;
	left: number;
	width: number;
	height: number;
};

let flipToken = 0;
let flyToken = 0;
let pendingFlip: { target: PropertyView; from: ItemRect[]; token: number } | null = null;

function resultItems() {
	const root = pageEl.value;
	if (!root) {
		return [];
	}
	return Array.from(root.querySelectorAll<HTMLElement>('section.result li.item'));
}

function measureItems(items: HTMLElement[]) {
	return items
		.map((item) => {
			const rect = item.getBoundingClientRect();
			return {
				item,
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			};
		})
		.filter((entry) => entry.width > 0 && entry.height > 0);
}

function clearItemTransforms(items: HTMLElement[]) {
	items.forEach((item) => {
		item.style.transition = '';
		item.style.transform = '';
	});
}

function endFlip(token: number, items: HTMLElement[]) {
	if (token !== flipToken) {
		return;
	}
	flipToken += 1;
	clearItemTransforms(items);
	animating.value = false;
}

function beginFlip(target: PropertyView) {
	flipToken += 1;
	const token = flipToken;
	const from = view.value === 'grid' || view.value === 'detail' ? measureItems(resultItems()) : [];
	clearItemTransforms(from.map((entry) => entry.item));
	if (!from.length) {
		pendingFlip = null;
		animating.value = false;
		return;
	}
	animating.value = true;
	pendingFlip = { target, from, token };
}

function playFlip(target: PropertyView) {
	const pending = pendingFlip;
	pendingFlip = null;
	if (!pending || pending.target !== target || pending.token !== flipToken) {
		return;
	}
	const { from, token } = pending;
	const moves: HTMLElement[] = [];
	from.forEach((prev) => {
		const next = prev.item.getBoundingClientRect();
		const dx = prev.left - next.left;
		const dy = prev.top - next.top;
		if (dx === 0 && dy === 0) {
			return;
		}
		prev.item.style.transition = 'none';
		prev.item.style.transform = `translate(${dx}px, ${dy}px)`;
		moves.push(prev.item);
	});
	if (!moves.length) {
		endFlip(token, from.map((entry) => entry.item));
		return;
	}
	requestAnimationFrame(() => {
		if (token !== flipToken) {
			return;
		}
		moves.forEach((item) => {
			item.style.transition = '';
			item.style.transform = '';
		});
		let remaining = moves.length;
		let settled = false;
		const finish = () => {
			if (settled) {
				return;
			}
			settled = true;
			moves.forEach((item) => {
				item.removeEventListener('transitionend', onEnd);
			});
			endFlip(token, from.map((entry) => entry.item));
		};
		const onEnd = (event: TransitionEvent) => {
			if (event.propertyName !== 'transform') {
				return;
			}
			remaining -= 1;
			if (remaining <= 0) {
				finish();
			}
		};
		moves.forEach((item) => {
			item.addEventListener('transitionend', onEnd);
		});
		setTimeout(finish, viewFlipMs + 80);
	});
}

function detailBody() {
	return pageEl.value?.querySelector<HTMLElement>('.detail-body') ?? null;
}

function pinDetailBody(transform: string) {
	const body = detailBody();
	if (!body) {
		return;
	}
	body.style.transition = 'none';
	body.style.transform = transform;
}

function releaseDetailBody() {
	const body = detailBody();
	if (!body) {
		return;
	}
	body.style.transition = '';
	body.style.transform = '';
}

function beginFly(target: 'detail' | 'grid') {
	flyToken += 1;
	const from = view.value;
	if ((from !== 'grid' && from !== 'detail') || !detailBody()) {
		leaving.value = false;
		return;
	}
	if (target === 'grid' && from === 'detail') {
		leaving.value = true;
		pinDetailBody('translateX(0)');
		return;
	}
	if (target === 'detail' && from === 'grid') {
		leaving.value = false;
		pinDetailBody('translateX(100%)');
	}
}

function playFly(target: 'detail' | 'grid') {
	const token = flyToken;
	const body = detailBody();
	if (!body || !body.style.transform) {
		return;
	}
	requestAnimationFrame(() => {
		if (token !== flyToken) {
			return;
		}
		releaseDetailBody();
		if (target !== 'grid') {
			return;
		}
		let settled = false;
		const finish = () => {
			if (settled || token !== flyToken) {
				return;
			}
			settled = true;
			body.removeEventListener('transitionend', onEnd);
			leaving.value = false;
		};
		const onEnd = (event: TransitionEvent) => {
			if (event.propertyName !== 'transform') {
				return;
			}
			finish();
		};
		body.addEventListener('transitionend', onEnd);
		setTimeout(finish, viewFlipMs + 80);
	});
}

async function applyView(next: PropertyView) {
	const prev = view.value;
	if (prev === next) {
		return;
	}
	const pair = (prev === 'grid' && next === 'detail') || (prev === 'detail' && next === 'grid');
	if (pair && (next === 'grid' || next === 'detail')) {
		beginFlip(next);
		beginFly(next);
		view.value = next;
		await nextTick();
		playFlip(next);
		playFly(next);
		return;
	}
	leaving.value = false;
	animating.value = false;
	view.value = next;
}

let detailRequest = 0;

function wait(ms: number) {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

async function loadDetail(prId: string, animate: boolean) {
	const requestId = ++detailRequest;
	const fromGrid = view.value !== 'detail';
	const switching = animate && !fromGrid && store.state.detail != null;
	const skeletonAt = Date.now();
	if (switching) {
		detailReveal.value = false;
		detailPlaceholder.value = true;
	}
	const response = await fetch(`/api/property/detail/${encodeURIComponent(prId)}`);
	if (requestId !== detailRequest || !response.ok) {
		return;
	}
	const body = await response.json() as { data?: { detail?: PropertyDetailModel | null } };
	if (requestId !== detailRequest) {
		return;
	}
	const nextDetail = body.data?.detail ?? null;
	if (switching) {
		await wait(Math.max(0, 1500 - (Date.now() - skeletonAt)));
		if (requestId !== detailRequest) {
			return;
		}
		detailPlaceholder.value = false;
		detailReveal.value = true;
		store.state.detail = nextDetail;
		return;
	}
	detailPlaceholder.value = false;
	store.state.detail = nextDetail;
	if (animate && fromGrid) {
		detailReveal.value = false;
		await nextTick();
		detailReveal.value = true;
		await applyView('detail');
		return;
	}
	detailReveal.value = false;
}

watch(() => route.path, (path) => {
	const next = viewFromPath(path);
	if (next !== 'detail') {
		detailPlaceholder.value = false;
		detailReveal.value = false;
		void applyView(next).then(() => {
			window.setTimeout(() => {
				if (view.value !== 'detail') {
					store.state.detail = null;
				}
			}, viewFlipMs);
		});
		return;
	}
	const prId = matchPropertySpaRoute(path)?.params.prId;
	if (prId) {
		void loadDetail(prId, true);
	}
});

onMounted(() => {
	if (view.value !== 'detail' || store.state.detail) {
		return;
	}
	const prId = matchPropertySpaRoute(route.path)?.params.prId;
	if (prId) {
		void loadDetail(prId, false);
	}
});

function modelFromFields(fields: GroupDropdownField[]): GroupDropdownValue {
	const value: GroupDropdownValue = {};
	fields.forEach((field) => {
		if (field.type === 'range') {
			value[field.id] = ['', ''];
			return;
		}
		if (field.type === 'single') {
			value[field.id] = field.options.find((option) => option.checked)?.value ?? '';
			return;
		}
		value[field.id] = field.options.filter((option) => option.checked).map((option) => option.value);
	});
	return value;
}

const filterValue = ref<GroupDropdownValue>(modelFromFields(store.state.filters));

watch(filters, (fields) => {
	filterValue.value = modelFromFields(fields);
});

function numberOrEmpty(value: string | undefined) {
	if (value == null || value === '') {
		return undefined;
	}
	const number = Number(value);
	return Number.isFinite(number) ? number : undefined;
}

function pair(value: GroupDropdownValue[string]) {
	return Array.isArray(value) ? value : ['', ''];
}

function filterFromDropdown(value: GroupDropdownValue) {
	const filter: Record<string, unknown> = {};
	const ranges: { id: string; min: string; max: string }[] = [
		{ id: 'price', min: 'minPrice', max: 'maxPrice' },
		{ id: 'bed', min: 'minBed', max: 'maxBed' },
		{ id: 'bath', min: 'minBath', max: 'maxBath' },
	];
	ranges.forEach((field) => {
		const [minText, maxText] = pair(value[field.id]);
		const min = numberOrEmpty(minText);
		const max = numberOrEmpty(maxText);
		if (min !== undefined) {
			filter[field.min] = min;
		}
		if (max !== undefined) {
			filter[field.max] = max;
		}
	});
	const types = value.propertyType;
	if (Array.isArray(types) && types.length) {
		filter.propertyTypes = types.map((item) => item.toUpperCase());
	}
	const status = value.propertyStatus;
	if (status === 'sold') {
		filter.searchPropertyStatus = 'INACTIVE';
	} else if (status === 'rental') {
		filter.searchPropertyStatus = 'FOR_RENT';
	}
	const tags = Array.isArray(value.tags) ? value.tags : [];
	if (tags.includes('photo')) {
		filter.hasPhoto = true;
	}
	if (status !== 'sold' && status !== 'rental') {
		if (tags.includes('construction')) {
			filter.isNewConstruction = true;
		}
		if (tags.includes('openhouse')) {
			filter.isOpenHousesOnly = true;
		}
	}
	return filter;
}

let filterTimer = 0;

function onFilterChange() {
	window.clearTimeout(filterTimer);
	filterTimer = window.setTimeout(() => {
		const current = new URLSearchParams(window.location.search);
		const next = new URLSearchParams(getQueryStringByFilter(filterFromDropdown(filterValue.value)));
		['size', 'sort', 'order'].forEach((key) => {
			const kept = current.get(key);
			if (kept) {
				next.set(key, kept);
			}
		});
		const query: Record<string, string | string[]> = {};
		new Set(next.keys()).forEach((key) => {
			const all = next.getAll(key);
			query[key] = all.length > 1 ? all : all[0];
		});
		router.replace({ path: route.path, query });
	}, 200);
}

watch(() => route.fullPath, async (fullPath, previous) => {
	if (fullPath === previous || previous === undefined) {
		return;
	}
	const pagePath = route.path.replace(/\/+$/, '') || '/';
	const isIpSearch = pagePath === '/property/search';
	if (!isIpSearch && matchPropertySpaRoute(route.path)?.id !== 'geo') {
		return;
	}
	const geo = isIpSearch ? '' : route.path.replace(/^\/property\//, '');
	const search = route.fullPath.includes('?') ? route.fullPath.slice(route.fullPath.indexOf('?')) : '';
	const response = await fetch(`/api/property/search${geo ? `/${geo}` : ''}${search}`);
	if (!response.ok) {
		return;
	}
	const body = await response.json() as { articles?: ArticleUiModel[] };
	store.state.articles = body.articles ?? [];
});
</script>
