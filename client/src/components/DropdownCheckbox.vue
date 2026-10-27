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
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import type { FormEnumOption } from './formEnumOption';

const props = defineProps<{
	/** Choice list. Each entry is one checkbox. */
	data: FormEnumOption[];
	/** Shown on the button when nothing is selected. */
	label?: string;
}>();

const modelValue = defineModel<string[]>({ default: () => [] });
const name = useId();
const rootEl = ref<HTMLElement | null>(null);
const open = ref(false);

const buttonText = computed(() => {
	const selected = props.data
		.filter((option) => modelValue.value.includes(option.value))
		.map((option) => option.text);
	return selected.length ? selected.join(', ') : props.label || '';
});

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
