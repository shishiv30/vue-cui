<template>
	<section class="detail-body-timeline section large">
		<div class="grid grid-xs-1 panel">
			<h2 v-if="model.heading" class="f4">{{ model.heading }}</h2>
			<div v-if="model.intro">{{ model.intro }}</div>
			<ul class="section-timeline">
				<li
					v-for="(entry, index) in model.entries"
					:key="index"
					:class="entry.type"
				>
					<template v-if="entry.type === 'title'">
						<b>{{ entry.label }}</b>
						<div></div>
					</template>
					<template v-else>
						<span>{{ entry.date }}</span>
						<span>{{ entry.text }}</span>
						<div></div>
					</template>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { DetailTimeline } from './detailModel';

defineProps<{ model: DetailTimeline }>();
</script>
