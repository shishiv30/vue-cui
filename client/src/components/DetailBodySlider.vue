<template>
	<div class="detail-body-slider">
		<Slider :model="slider" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Slider from './Slider.vue';
import type { SliderUiModel } from './sliderModel';

const props = defineProps<{ model: SliderUiModel }>();

const slider = computed<SliderUiModel>(() => ({
	...props.model,
	className: 'property-slider',
}));
</script>
