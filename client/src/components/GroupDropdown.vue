<template>
	<div
		ref="rootEl"
		class="group-dropdown"
		:class="phase"
		@focusout="onFocusOut"
	>
		<ul
			ref="barEl"
			class="group-dropdown-button small"
			:class="{ changed: barChanged }"
		>
			<li v-for="field in data" :key="field.id">
				<button
					type="button"
					:data-target="field.id"
					:class="{ selected: isSelected(field), opened: openedId === field.id }"
					@click.stop="onButton(field.id)"
				>
					{{ buttonText(field) }}
				</button>
				<button
					type="button"
					class="group-dropdown-reset"
					aria-label="Reset"
					:hidden="!isSelected(field)"
					@click.stop="resetField(field)"
				></button>
			</li>
		</ul>
		<div
			ref="listEl"
			class="group-dropdown-list"
			:style="listStyle"
			@mousedown="onListMouseDown"
			@animationend="onFlyOut"
		>
			<div
				v-for="field in data"
				:key="field.id"
				:data-id="field.id"
				:hidden="shownId !== field.id"
			>
				<RangeSlider
					v-if="field.type === 'range'"
					:data="stopOptions(field)"
					:format="field.format"
					:model-value="sliderPair(field)"
					@update:model-value="onRange(field, $event)"
				/>
				<div
					v-else
					:class="choiceClass(field)"
				>
					<label
						v-for="(option, index) in field.options"
						:key="`${field.id}-${index}`"
						:for="optionId(field.id, index)"
					>
						<input
							:id="optionId(field.id, index)"
							:type="field.type === 'single' ? 'radio' : 'checkbox'"
							:name="field.id"
							:value="option.value"
							:checked="isChecked(field, option.value)"
							:disabled="optionDisabled(field, option)"
							@change="onChoice(field, option.value, $event)"
						/>
						<span>{{ option.label }}</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { emit } from '../../js/core/event.js';
import { emitPhase } from './emitPhase';
import type { FormEnumOption } from './formEnumOption';
import RangeSlider from './RangeSlider.vue';
import { formatStop } from './sliderScale';
import type {
	GroupDropdownChoiceField,
	GroupDropdownField,
	GroupDropdownRangeField,
	GroupDropdownValue,
} from './groupdropdownModel';

const NAME = 'groupdropdown';
const HIDE_MS = 220;
const OFF_MARKET_STATUS = new Set(['sold', 'rental']);
const OFF_MARKET_TAGS = new Set(['construction', 'openhouse']);

const props = defineProps<{
	/** Panels. The listing filter is the example. */
	data: GroupDropdownField[];
}>();

const modelValue = defineModel<GroupDropdownValue>({ default: () => ({}) });

const emitVue = defineEmits({
	/**
	 * Fires while a control changes. The argument is the value object.
	 */
	input: (value: GroupDropdownValue) => Boolean(value),
	/**
	 * Fires when a panel is reset or the list closes. The argument is the value object.
	 */
	change: (value: GroupDropdownValue) => Boolean(value),
	/**
	 * Fires when a panel opens. The argument is the field id.
	 */
	open: (id: string) => typeof id === 'string',
	/**
	 * Fires after the list finishes closing.
	 */
	close: () => true,
});

const uid = useId();
const rootEl = ref<HTMLElement | null>(null);
const barEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const phase = ref<'close' | 'open' | 'closing'>('close');
const shownId = ref('');
const labels = ref<Record<string, string>>({});
const listStyle = ref<Record<string, string>>({});
let hideTimer = 0;

const openedId = computed(() => (phase.value === 'open' ? shownId.value : ''));

const barChanged = computed(() => props.data.some((field) => isSelected(field)));

function optionId(fieldId: string, index: number) {
	return `${uid}-${fieldId}-${index}`;
}

function isRange(field: GroupDropdownField): field is GroupDropdownRangeField {
	return field.type === 'range';
}

function stopOptions(field: GroupDropdownRangeField): FormEnumOption[] {
	return field.stops.split(',').filter(Boolean).map((value) => ({ value, text: value }));
}

function readField(field: GroupDropdownField, source: GroupDropdownValue = modelValue.value) {
	const current = source[field.id];
	if (current !== undefined) {
		return current;
	}
	if (isRange(field)) {
		return ['', ''];
	}
	if (field.type === 'single') {
		const checked = field.options.find((option) => option.checked);
		return checked ? checked.value : '';
	}
	return field.options.filter((option) => option.checked).map((option) => option.value);
}

function rangeEnds(field: GroupDropdownRangeField, source?: GroupDropdownValue): [string, string] {
	const value = readField(field, source);
	if (Array.isArray(value)) {
		return [value[0] ?? '', value[1] ?? ''];
	}
	return ['', ''];
}

function sliderPair(field: GroupDropdownRangeField, source?: GroupDropdownValue): [string, string] {
	const stops = stopOptions(field);
	const first = stops[0]?.value ?? '';
	const last = stops[stops.length - 1]?.value ?? '';
	const [min, max] = rangeEnds(field, source);
	return [min || first, max || last];
}

function statusValue(source: GroupDropdownValue = modelValue.value) {
	const field = props.data.find((item) => item.id === 'propertyStatus');
	if (!field || isRange(field)) {
		return '';
	}
	const current = readField(field, source);
	return typeof current === 'string' ? current : '';
}

function optionDisabled(
	field: GroupDropdownField,
	option: { value: string; disabled?: boolean },
) {
	if (option.disabled) {
		return true;
	}
	return field.id === 'tags'
		&& OFF_MARKET_TAGS.has(option.value)
		&& OFF_MARKET_STATUS.has(statusValue());
}

function withoutOffMarketTags(source: GroupDropdownValue) {
	if (!OFF_MARKET_STATUS.has(statusValue(source))) {
		return source;
	}
	const tags = source.tags;
	if (!Array.isArray(tags)) {
		return source;
	}
	const next = tags.filter((value) => !OFF_MARKET_TAGS.has(value));
	if (next.length === tags.length) {
		return source;
	}
	return { ...source, tags: next };
}

function isChecked(field: GroupDropdownChoiceField, value: string) {
	const current = readField(field);
	if (field.type === 'single') {
		return current === value;
	}
	return Array.isArray(current) && current.includes(value);
}

function isSelected(field: GroupDropdownField, source?: GroupDropdownValue) {
	if (isRange(field)) {
		const [min, max] = rangeEnds(field, source);
		return min !== '' || max !== '';
	}
	const current = readField(field, source);
	if (field.type === 'single') {
		return String(current).trim() !== '';
	}
	return Array.isArray(current) && current.some((value) => String(value).trim() !== '');
}

function choiceClass(field: GroupDropdownChoiceField) {
	const kind = field.type === 'single' ? 'radio' : 'checkbox';
	return field.cols === 1 ? `${kind} cols-1` : kind;
}

function rangeLabel(field: GroupDropdownRangeField, source?: GroupDropdownValue) {
	const [min, max] = sliderPair(field, source);
	if (!isSelected(field, source)) {
		return '';
	}
	return `${formatStop(min, field.format)} – ${formatStop(max, field.format)}`;
}

function choiceLabel(field: GroupDropdownChoiceField, source?: GroupDropdownValue) {
	const current = readField(field, source);
	if (field.type === 'single') {
		const match = field.options.find((option) => option.value === current && option.value !== '');
		return match ? match.label : '';
	}
	const selected = Array.isArray(current) ? current : [];
	return field.options
		.filter((option) => selected.includes(option.value))
		.map((option) => option.label)
		.join(', ');
}

function buttonText(field: GroupDropdownField) {
	return labels.value[field.id] || field.label;
}

function syncLabel(field: GroupDropdownField, source?: GroupDropdownValue) {
	const shown = isRange(field) ? rangeLabel(field, source) : choiceLabel(field, source);
	labels.value[field.id] = shown
		? (isRange(field) ? `${field.label}: ${shown}` : shown)
		: field.label;
}

function syncLabels(source?: GroupDropdownValue) {
	props.data.forEach((field) => syncLabel(field, source));
}

function write(next: GroupDropdownValue) {
	const value = withoutOffMarketTags(next);
	modelValue.value = value;
	syncLabels(value);
}

function patch(id: string, value: string | string[]) {
	write({ ...modelValue.value, [id]: value });
}

function emitInput() {
	emitVue('input', modelValue.value);
	emit(`input.${NAME}`, [rootEl.value, modelValue.value]);
}

function emitChange() {
	emitVue('change', modelValue.value);
	emit(`change.${NAME}`, [rootEl.value, modelValue.value]);
}

function onRange(field: GroupDropdownRangeField, pair: [string, string]) {
	const stops = stopOptions(field);
	const first = stops[0]?.value ?? '';
	const last = stops[stops.length - 1]?.value ?? '';
	const min = pair[0] === first || pair[0] === 'no_min' ? '' : pair[0];
	const max = pair[1] === last || pair[1] === 'no_max' ? '' : pair[1];
	patch(field.id, [min, max]);
	emitInput();
}

function onChoice(field: GroupDropdownChoiceField, value: string, event: Event) {
	const checked = (event.target as HTMLInputElement).checked;
	if (field.type === 'single') {
		patch(field.id, checked ? value : '');
	} else {
		const current = readField(field);
		const list = Array.isArray(current) ? current : [];
		patch(
			field.id,
			checked ? [...list, value] : list.filter((item) => item !== value),
		);
	}
	emitInput();
}

function resetField(field: GroupDropdownField) {
	patch(field.id, isRange(field) || field.type !== 'single' ? (isRange(field) ? ['', ''] : []) : '');
	const panel = listEl.value?.querySelector(`[data-id="${field.id}"]`);
	panel?.querySelector('[data-role="rangeslider"], .range-slider')
		?.dispatchEvent(new CustomEvent('reset'));
	emitChange();
}

function buttonEl(id: string) {
	return barEl.value?.querySelector(`[data-target="${id}"]`) as HTMLElement | null;
}

function targetLeft(button: HTMLElement) {
	const bar = barEl.value;
	const list = listEl.value;
	const root = rootEl.value;
	if (!bar || !list || !root) {
		return 0;
	}
	const item = (button.closest('li') as HTMLElement) || button;
	const aligned = item.offsetLeft - bar.scrollLeft;
	const parent = (list.offsetParent as HTMLElement) || root;
	const parentLeft = parent.getBoundingClientRect().left;
	const viewportRight = document.documentElement.clientWidth;
	const overflow = parentLeft + aligned + list.offsetWidth - viewportRight;
	if (overflow > 0) {
		return Math.max(aligned - overflow, -parentLeft);
	}
	return aligned;
}

async function placeList(id: string) {
	const button = buttonEl(id);
	const list = listEl.value;
	if (!list || !button) {
		return;
	}
	await nextTick();
	listStyle.value = { transition: 'none', width: '', left: '0px' };
	await nextTick();
	const left = targetLeft(button);
	listStyle.value = { transition: 'none', left: `${left}px` };
	void list.offsetWidth;
	listStyle.value = { left: `${left}px` };
}

async function switchList(id: string) {
	const list = listEl.value;
	const button = buttonEl(id);
	if (!list || !button) {
		return;
	}
	const prevWidth = list.offsetWidth;
	const prevLeft = list.offsetLeft;
	shownId.value = id;
	await nextTick();
	listStyle.value = { transition: 'none', width: 'auto', left: `${prevLeft}px` };
	await nextTick();
	const nextWidth = list.offsetWidth;
	const nextLeft = targetLeft(button);
	listStyle.value = {
		transition: 'none',
		width: `${prevWidth}px`,
		left: `${prevLeft}px`,
	};
	void list.offsetWidth;
	listStyle.value = { width: `${nextWidth}px`, left: `${nextLeft}px` };
}

function cancelHide() {
	window.clearTimeout(hideTimer);
	phase.value = 'open';
}

function finishClose() {
	window.clearTimeout(hideTimer);
	if (phase.value !== 'closing') {
		return;
	}
	phase.value = 'close';
	shownId.value = '';
	listStyle.value = {};
	emitVue('close');
	emit(`close.${NAME}`, [rootEl.value]);
}

function onFlyOut(event: AnimationEvent) {
	if (event.target !== listEl.value || event.animationName !== 'group-dropdown-fly-out') {
		return;
	}
	finishClose();
}

/** Close the list. */
function close() {
	if (phase.value !== 'open') {
		phase.value = 'close';
		shownId.value = '';
		return;
	}
	emitChange();
	phase.value = 'closing';
	hideTimer = window.setTimeout(finishClose, HIDE_MS);
}

/** Open the panel for `id`. Calling it again on the open panel closes the list. */
function open(id: string) {
	const list = listEl.value;
	if (!list || !props.data.some((field) => field.id === id)) {
		return;
	}
	if (openedId.value === id) {
		close();
		return;
	}
	const switching = phase.value === 'open';
	if (phase.value === 'closing') {
		cancelHide();
	}
	phase.value = 'open';
	emitVue('open', id);
	emit(`open.${NAME}`, [rootEl.value, id]);
	if (switching) {
		void switchList(id);
		return;
	}
	shownId.value = id;
	void placeList(id);
}

function onButton(id: string) {
	open(id);
}

function onFocusOut(event: FocusEvent) {
	const root = rootEl.value;
	if (!root || (event.relatedTarget && root.contains(event.relatedTarget as Node))) {
		return;
	}
	window.setTimeout(() => {
		if (!root.contains(document.activeElement)) {
			close();
		}
	}, 0);
}

function onListMouseDown(event: MouseEvent) {
	const target = event.target as HTMLElement | null;
	const focusable = target?.closest('input, textarea, select');
	const shown = !!(focusable && getComputedStyle(focusable).display !== 'none');
	if (!shown) {
		event.preventDefault();
	}
}

onMounted(() => {
	emitPhase('init', NAME, rootEl.value);
	emitPhase('initialed', NAME, rootEl.value);
	emitPhase('load', NAME, rootEl.value);
	emitPhase('loaded', NAME, rootEl.value);
	emitPhase('render', NAME, rootEl.value);
	syncLabels();
	emitPhase('rendered', NAME, rootEl.value);
});

onBeforeUnmount(() => {
	emitPhase('destroy', NAME, rootEl.value);
	window.clearTimeout(hideTimer);
	emitPhase('destroyed', NAME, rootEl.value);
});

defineExpose({
	open,
	close,
});
</script>
