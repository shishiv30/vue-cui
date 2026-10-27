<template>
	<div class="detail-body-tags filter property-detail-tags">
		<span class="f7">Tags</span>
		<span
			v-for="(tag, index) in model.items"
			:key="index"
			class="tag"
			:class="tag.className"
		>
			<i v-if="tag.icon" :class="`icon-${tag.icon}`"></i>{{ tag.text ?? tag.value }}
		</span>
	</div>
</template>

<script setup lang="ts">
import type { DetailTags } from './detailModel';

defineProps<{ model: DetailTags }>();
</script>
