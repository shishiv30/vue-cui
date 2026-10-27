<template>
	<div class="detail-body-open-houses">
		<h2 v-if="model.heading" class="f4">{{ model.heading }}</h2>
		<ul class="property-detail-open-houses">
			<li v-for="(row, index) in model.items" :key="index">
				<time v-if="row.startDate">{{ row.startDate }}</time>
				<span v-if="row.startTime">{{ row.startTime }}</span>
				<span v-if="row.endDate">{{ row.endDate }}</span>
				<span v-if="row.endTime">{{ row.endTime }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { DetailOpenHouses } from './detailModel';

defineProps<{ model: DetailOpenHouses }>();
</script>
