<template>
	<ul
		v-if="model.items.length"
		ref="rootEl"
		class="list"
		:class="[model.size, model.className]"
	>
		<li v-for="(item, index) in model.items" :key="index">
			<button
				type="button"
				class="list-item"
				:class="item.className"
				@click="onClick(item, index)"
			>
				<span class="list-icon" :class="item.theme">
					<i :class="item.icon"></i>
				</span>
				<span class="list-body">
					<span class="list-title">{{ item.title }}</span>
					<span class="list-desc">{{ item.desc }}</span>
				</span>
				<i class="list-arrow icon-angle-right" aria-hidden="true"></i>
			</button>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { ListItem, ListUiModel } from './listModel';
import { emitPhase } from './emitPhase';

defineProps<{
	model: ListUiModel;
}>();

const emit = defineEmits<{
	/** Fires when a row is clicked. */
	click: [item: ListItem, index: number];
}>();

const rootEl = ref<HTMLElement | null>(null);

function onClick(item: ListItem, index: number) {
	emit('click', item, index);
}

onMounted(() => {
	emitPhase('init', 'list', rootEl.value);
	emitPhase('initialed', 'list', rootEl.value);
	emitPhase('load', 'list', rootEl.value);
	emitPhase('loaded', 'list', rootEl.value);
	emitPhase('render', 'list', rootEl.value);
	emitPhase('rendered', 'list', rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', 'list', rootEl.value);
	emitPhase('destroyed', 'list', rootEl.value);
});
</script>
