<template>
	<div ref="rootEl" class="group-dropdown" :class="open ? 'open' : 'close'">
		<ul class="group-dropdown-button small">
			<li>
				<button type="button" @click="open = !open">{{ buttonText }}</button>
			</li>
		</ul>
		<div class="group-dropdown-list">
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
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import type { FormEnumOption } from './formEnumOption';

const props = defineProps<{
	/** Choice list. Each entry is one radio. */
	data: FormEnumOption[];
	/** Shown on the button when nothing is selected. */
	label?: string;
}>();

const modelValue = defineModel<string>({ default: '' });
const name = useId();
const rootEl = ref<HTMLElement | null>(null);
const open = ref(false);

const buttonText = computed(() => {
	const selected = props.data.find((option) => option.value === modelValue.value);
	return selected?.text || props.label || '';
});

function optionId(index: number) {
	return `${name}-${index}`;
}

function onDocumentPointer(event: PointerEvent) {
	const root = rootEl.value;
	if (!root || root.contains(event.target as Node)) {
		return;
	}
	open.value = false;
}

onMounted(() => {
	document.addEventListener('pointerdown', onDocumentPointer);
});

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', onDocumentPointer);
});
</script>
