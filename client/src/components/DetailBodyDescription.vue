<template>
	<section class="detail-body-description property-detail-description f6 text-gray">
		{{ model.text }}
	</section>
</template>

<script setup lang="ts">
import type { DetailParagraph } from './detailModel';

defineProps<{ model: DetailParagraph }>();
</script>
