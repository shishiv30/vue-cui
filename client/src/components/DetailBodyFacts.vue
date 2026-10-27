<template>
	<div class="detail-body-facts">
		<h2 v-if="model.heading" class="f4">{{ model.heading }}</h2>
		<ul class="list-dict">
			<li v-for="(attr, index) in model.items" :key="index">
				<abbr v-if="attr.key" class="key" :title="attr.desc">{{ attr.key }}</abbr>
				<span v-if="attr.value" class="value" :class="attr.className">{{ attr.value }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { DetailRecord } from './detailModel';

defineProps<{ model: DetailRecord }>();
</script>
