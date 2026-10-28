<template>
	<h1 class="f3 text-bold text-center">{{ title }}</h1>
	<section class="section grid grid-xs-1 fixed">
		<template v-for="(group, groupIndex) in groups" :key="groupIndex">
			<h2 v-if="group.title" class="f4 text-bold">{{ group.title }}</h2>
			<ul
				v-if="group.links.length"
				class="grid grid-xs-1 grid-sm-2 grid-md-3 grid-lg-4 grid-xl-5"
			>
				<li v-for="(link, linkIndex) in group.links" :key="linkIndex">
					<a class="link" :href="link.href">{{ link.text }}</a>
				</li>
			</ul>
		</template>
	</section>
</template>

<script setup lang="ts">
import type { LinkGroup } from '../store';

defineProps<{
	title: string;
	groups: LinkGroup[];
}>();
</script>
