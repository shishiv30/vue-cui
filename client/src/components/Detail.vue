<template>
	<section class="detail" id="detail">
		<div class="detail-body grid grid-xs-1" :class="{ placeholder }">
			<template v-if="placeholder">
				<h1 class="property-title"></h1>
				<div class="filter property-detail-tags"></div>
				<div class="slider property-slider"></div>
				<div class="property-detail-description"></div>
				<div class="property-detail-block"></div>
				<div class="property-detail-block"></div>
				<div class="property-detail-block"></div>
			</template>
			<template v-else>
				<h1 v-if="model?.title && shown >= 0" class="h4 m-t-3" :class="revealClass">
					{{ model.title }}
				</h1>
				<DetailBodyTags
					v-if="model?.tags && shown >= 1"
					:model="model.tags"
					:class="revealClass"
				/>
				<DetailBodySlider
					v-if="model?.album && shown >= 2"
					:model="model.album"
					:class="revealClass"
				/>
				<DetailBodyDescription
					v-if="model?.paragraph && shown >= 3"
					:model="model.paragraph"
					:class="revealClass"
				/>
				<DetailBodyFacts
					v-if="model?.record && shown >= 4"
					:model="model.record"
					:class="revealClass"
				/>
				<DetailBodyOpenHouses
					v-if="model?.openHouses && shown >= 5"
					:model="model.openHouses"
					:class="revealClass"
				/>
				<DetailBodyTimeline
					v-if="model?.timeline && shown >= 6"
					:model="model.timeline"
					:class="revealClass"
				/>
			</template>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DetailBodyDescription from './DetailBodyDescription.vue';
import DetailBodyFacts from './DetailBodyFacts.vue';
import DetailBodyOpenHouses from './DetailBodyOpenHouses.vue';
import DetailBodySlider from './DetailBodySlider.vue';
import DetailBodyTags from './DetailBodyTags.vue';
import DetailBodyTimeline from './DetailBodyTimeline.vue';
import type { PropertyDetailModel } from './detailModel';

const props = defineProps<{
	model: PropertyDetailModel | null;
	placeholder?: boolean;
	reveal?: boolean;
}>();

const shown = ref(6);
const revealClass = computed(() => (props.reveal ? 'detail-reveal' : undefined));
let revealTimer = 0;

watch(() => props.reveal, (reveal, previous) => {
	clearTimeout(revealTimer);
	if (!reveal || previous === undefined) {
		shown.value = 6;
		return;
	}
	shown.value = -1;
	stepReveal(0);
});

function stepReveal(step: number) {
	if (!props.reveal) {
		return;
	}
	shown.value = step;
	if (step >= 6) {
		return;
	}
	revealTimer = setTimeout(() => stepReveal(step + 1), 250);
}
</script>
