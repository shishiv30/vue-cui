<template>
	<section class="result">
		<ul>
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
import Article from './Article.vue';
import type { ArticleUiModel } from './articleModel';

defineProps<{ articles: ArticleUiModel[] }>();
</script>
