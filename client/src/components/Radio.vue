<template>
	<div>
		<label v-if="label">{{ label }}</label>
		<div class="radio">
			<label v-for="(option, index) in data" :key="option.value" :for="optionId(index)">
				<input
					:id="optionId(index)"
					type="radio"
					:name="name"
					:value="option.value"
					:checked="modelValue === option.value"
					@change="modelValue = option.value"
				/>
				<span>{{ option.text }}</span>
			</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import type { FormEnumOption } from './formEnumOption';

defineProps<{
	/** Choice list. Each entry is one radio. */
	data: FormEnumOption[];
	/** Optional group heading. */
	label?: string;
}>();

const modelValue = defineModel<string>({ default: '' });
const name = useId();

function optionId(index: number) {
	return `${name}-${index}`;
}
</script>
