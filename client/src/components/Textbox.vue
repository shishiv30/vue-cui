<template>
	<div
		ref="rootEl"
		class="textbox"
		:class="{ focus: focused || modelValue.length > 0 }"
	>
		<div v-if="type === 'textarea'" class="textarea">
			<label v-if="label" :for="fieldId">{{ label }}</label>
			<textarea
				:id="fieldId"
				:value="modelValue"
				@input="onInput"
				@focus="focused = true"
				@blur="onBlur"
			/>
		</div>
		<div v-else class="input">
			<label v-if="label" :for="fieldId">{{ label }}</label>
			<input
				:id="fieldId"
				:value="modelValue"
				@input="onInput"
				@focus="focused = true"
				@blur="onBlur"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, useId } from 'vue';

withDefaults(defineProps<{
	/** `input` renders a single line. `textarea` renders a multiline field. */
	type?: 'input' | 'textarea';
	/** Floating label. Shown inside the field until it is focused or filled. */
	label?: string;
}>(), {
	type: 'input',
});

const modelValue = defineModel<string>({ default: '' });
const fieldId = useId();
const focused = ref(false);
const rootEl = ref<HTMLElement | null>(null);

onMounted(() => {
	rootEl.value?.setAttribute('textbox-loaded', '');
});

function onInput(event: Event) {
	const field = event.target;
	if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
		modelValue.value = field.value;
	}
}

function onBlur() {
	focused.value = false;
}
</script>
