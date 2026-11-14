<template>
	<GroupDropdown
		ref="dropdown"
		v-model="model"
		:data="data"
		@change="onChange"
		@input="onInput"
	/>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { off, on } from '../../js/core/event.js';
import GroupDropdown from './GroupDropdown.vue';
import type { GroupDropdownField, GroupDropdownValue } from './groupdropdownModel';

defineProps<{
	data: GroupDropdownField[];
}>();

const model = defineModel<GroupDropdownValue>({ default: () => ({}) });

const emit = defineEmits<{
	change: [value: GroupDropdownValue];
	input: [value: GroupDropdownValue];
}>();

const dropdown = ref<{ resetAll: () => void } | null>(null);

function onChange(value: GroupDropdownValue) {
	emit('change', value);
}

function onInput(value: GroupDropdownValue) {
	emit('input', value);
}

function onReset() {
	dropdown.value?.resetAll();
}

onMounted(() => {
	on('reset.filter', onReset);
});

onBeforeUnmount(() => {
	off('reset.filter');
});
</script>
