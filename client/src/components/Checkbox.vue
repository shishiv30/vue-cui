<template>
	<div>
		<label v-if="label">{{ label }}</label>
		<div class="checkbox">
			<label v-for="(option, index) in data" :key="option.value" :for="optionId(index)">
				<input
					:id="optionId(index)"
					type="checkbox"
					:name="name"
					:value="option.value"
					:checked="modelValue.includes(option.value)"
					@change="onChange(option.value, $event)"
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
	/** Choice list. Each entry is one checkbox. */
	data: FormEnumOption[];
	/** Optional group heading. */
	label?: string;
}>();

const modelValue = defineModel<string[]>({ default: () => [] });
const name = useId();

function optionId(index: number) {
	return `${name}-${index}`;
}

function onChange(value: string, event: Event) {
	const checked = (event.target as HTMLInputElement).checked;
	if (checked) {
		if (!modelValue.value.includes(value)) {
			modelValue.value = [...modelValue.value, value];
		}
		return;
	}
	modelValue.value = modelValue.value.filter((item) => item !== value);
}
</script>
