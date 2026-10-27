<template>
	<div class="selectbox">
		<label v-if="label" :for="selectId">{{ label }}</label>
		<select :id="selectId" :value="modelValue" @change="onChange">
			<option value="" disabled>select a option</option>
			<option v-for="option in data" :key="option.value" :value="option.value">
				{{ option.text }}
			</option>
		</select>
		<i class="icon-angle-down"></i>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import type { FormEnumOption } from './formEnumOption';

defineProps<{
	/** Choice list. Each entry is one option. */
	data: FormEnumOption[];
	/** Optional field heading. */
	label?: string;
}>();

const modelValue = defineModel<string>({ default: '' });
const selectId = useId();

function onChange(event: Event) {
	modelValue.value = (event.target as HTMLSelectElement).value;
}
</script>
