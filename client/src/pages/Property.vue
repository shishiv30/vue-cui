<template>
	<div :class="pageClass">
		<Header v-if="header" :model="header" />
		<nav
			v-if="kind === 'search'"
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
		<nav
			v-else-if="breadcrumbLinks.length"
			class="breadcrumb"
			aria-label="breadcrumb"
		>
			<ul>
				<li v-for="(link, index) in breadcrumbLinks" :key="index">
					<span v-if="!link.href">{{ link.text }}</span>
					<a v-else :href="link.href">{{ link.text }}</a>
				</li>
			</ul>
		</nav>
		<section
			v-if="kind === 'sitemap'"
			class="section grid grid-xs-1 fixed"
		>
			<h1 class="f3 text-bold text-center">{{ title }}</h1>
			<template v-for="(group, groupIndex) in groups" :key="groupIndex">
				<h2 v-if="group.title" class="f4 text-bold">{{ group.title }}</h2>
				<ul
					v-if="group.links.length"
					class="grid grid-xs-1 grid-sm-2 grid-md-3 grid-lg-4 grid-xl-5"
				>
					<li v-for="(link, linkIndex) in group.links" :key="linkIndex">
						<a class="link" :href="link.href">{{ link.text }}</a>
					</li>
				</ul>
			</template>
		</section>
		<section v-if="kind === 'search'" class="detail" id="detail"></section>
		<section v-if="kind === 'search'" class="result">
			<ul>
				<li
					v-for="(article, index) in articles"
					:key="article.id || index"
					class="item"
				>
					<Article :model="article" />
				</li>
			</ul>
		</section>
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
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Article from '../components/Article.vue';
import GroupDropdown from '../components/GroupDropdown.vue';
import Header from '../components/Header.vue';
import type { ArticleUiModel } from '../components/articleModel';
import type { GroupDropdownField, GroupDropdownValue } from '../components/groupdropdownModel';
import { getQueryStringByFilter } from '../../../helpers/filter.js';
import type { PropertyState } from '../store';

const store = useStore<PropertyState>();
const route = useRoute();
const router = useRouter();
const title = computed(() => store.state.title);
const kind = computed(() => store.state.kind);
const header = computed(() => store.state.header);
const footer = computed(() => store.state.footer);
const groups = computed(() => store.state.groups);
const articles = computed(() => store.state.articles);
const filters = computed(() => store.state.filters);
const breadcrumbLinks = computed(() => store.state.breadcrumb?.links ?? []);

const view = ref<'grid' | 'detail' | 'map'>('grid');
const lock = ref(false);
const collapse = ref(false);
const menu = ref(false);

const pageClass = computed(() => {
	if (kind.value !== 'search') {
		return undefined;
	}
	return {
		'page-property': true,
		[`view-${view.value}`]: true,
		lock: lock.value,
		collapse: collapse.value,
		menu: menu.value,
	};
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
	if (kind.value !== 'search' || fullPath === previous || previous === undefined) {
		return;
	}
	const geo = route.path.replace(/^\/property\//, '');
	const search = route.fullPath.includes('?') ? route.fullPath.slice(route.fullPath.indexOf('?')) : '';
	const response = await fetch(`/api/property/search/${geo}${search}`);
	if (!response.ok) {
		return;
	}
	const body = await response.json() as { articles?: ArticleUiModel[] };
	store.state.articles = body.articles ?? [];
});
</script>
