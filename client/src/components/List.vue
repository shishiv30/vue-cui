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
				<span class="list-icon" :class="[item.theme, { 'list-icon-image': item.image }]">
					<img v-if="item.image" :src="item.image" :alt="item.imageAlt ?? ''" />
					<i v-else-if="item.icon" :class="item.icon" role="img" :aria-label="iconLabel(item.icon)"></i>
				</span>
				<span class="list-body">
					<span v-if="item.sub" class="list-sub">{{ item.sub }}</span>
					<span class="list-title">{{ item.title }}</span>
					<span class="list-desc">{{ item.desc }}</span>
					<span v-if="item.sup" class="list-sup">{{ item.sup }}</span>
				</span>
				<i class="list-arrow icon-angle-right" role="img" aria-label="Open"></i>
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

/** Readable name of the glyph itself, e.g. `icon-folder-o` becomes "folder". */
function iconLabel(icon = '') {
	const name = icon.split(/\s+/).find((cls) => cls.startsWith('icon-')) ?? '';
	return name.replace(/^icon-/, '').replace(/-o$/, '').replace(/-/g, ' ');
}

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
