<template>
	<div>
		<Header :model="header" />
		<nav v-if="breadcrumbLinks.length" class="breadcrumb" aria-label="breadcrumb">
			<ul>
				<li v-for="(link, index) in breadcrumbLinks" :key="index">
					<span v-if="!link.href">{{ link.text }}</span>
					<a v-else :href="link.href">{{ link.text }}</a>
				</li>
			</ul>
		</nav>
		<Sitemap :title="title" :groups="groups" />
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
					This website is for informational purposes only and does not constitute legal, financial,
					or investment advice. The information provided is not intended to be a substitute for
					professional advice. Always consult with a qualified professional before making any
					financial decisions. &copy;
					{{ footer.year }}
					{{ footer.appName }}. All rights reserved.
				</div>
			</section>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyStore } from '../store';
import Header from '../components/Header.vue';
import Sitemap from '../components/Sitemap.vue';
import { headerMock } from '../components/headerModel';

const store = usePropertyStore();
const route = useRoute();
const title = computed(() => store.title);
const header = headerMock;
const footer = computed(() => store.footer);
const groups = computed(() => store.groups);
const breadcrumbLinks = computed(() => store.breadcrumb?.links ?? []);
async function loadSitemap(path: string) {
	const pagePath = path.replace(/\/+$/, '') || '/';
	const apiPath = pagePath === '/property' ? '/property/sitemap' : pagePath;
	const ui = await store.loadPage(`/api${apiPath}`);
	if (!ui || route.path !== path) {
		return;
	}
	document.title = ui.seo?.title ?? document.title;
}

watch(
	() => route.path,
	(path, previous) => {
		if (path !== previous) {
			void loadSitemap(path);
		}
	},
);

// Coming from search: the store holds results, not states.
onMounted(() => {
	if (!store.groups.length) {
		void loadSitemap(route.path);
	}
});
</script>
