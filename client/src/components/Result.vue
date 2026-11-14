<template>
	<section class="result">
		<p v-if="!articles.length" class="result-empty">
			No homes match this search.
			<a v-if="showReset" href="" @click.prevent="resetFilters">Reset filters</a>
		</p>
		<ul v-else>
			<li
				v-for="(article, index) in articles"
				:key="article.id || index"
				class="item"
			>
				<Article :model="{ fallbackImg: '/images/n_a.svg', ...article }" />
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { emit } from '../../js/core/event.js';
import Article from './Article.vue';
import type { ArticleUiModel } from './articleModel';

defineProps<{
	articles: ArticleUiModel[];
	showReset?: boolean;
}>();

function resetFilters() {
	emit('reset.filter');
}
</script>
