<script setup>
// A selectable workshop/meal add-on (toggle to add/remove). Workshops may be
// disabled when sold out or when they overlap a selected session.
import { computed } from 'vue'
import { useFormat } from '../../../composables/useFormat.js'

const { currency, dayLabel, timeRange } = useFormat()

const props = defineProps({
  /** @type {{ id, name, price, description, date?, endDate? }} */
  addon: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** Status line, e.g. "8 spots remaining" / "Sold Out". */
  status: { type: String, default: '' },
  statusTone: { type: String, default: 'quiet' }, // 'quiet' | 'danger'
})
const emit = defineEmits(['toggle'])

const timeLabel = computed(() =>
  props.addon.date
    ? `${dayLabel(props.addon.date)}, ${timeRange(props.addon.date, props.addon.endDate)}`
    : '',
)

function toggle() {
  if (!props.disabled) emit('toggle', props.addon.id)
}
</script>

<template>
  <div
    role="checkbox"
    :aria-checked="selected"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    :aria-label="addon.name"
    class="flex flex-col gap-2 p-4 rounded-[6px] border-2 border-solid outline-none transition-colors duration-150 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)] focus-visible:shadow-[0_0_0_2px_var(--border-brand-emphasis)]"
    :class="disabled
      ? 'cursor-not-allowed border-neutral-muted bg-surface-l0'
      : selected
        ? 'cursor-pointer border-brand-emphasis bg-brand-subtle-rest'
        : 'cursor-pointer border-neutral-muted bg-surface-l0 hover:border-brand-muted'"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <div class="row items-center justify-between full-width text-subtitle1">
      <span class="text-neutral">{{ addon.name }}</span>
      <span class="text-brand-emphasis">{{ currency(addon.price, { cents: false }) }}</span>
    </div>
    <p class="m-0 text-sm text-neutral-muted">{{ addon.description }}</p>
    <p v-if="timeLabel" class="m-0 text-[11px] leading-[14px] text-neutral-quiet">{{ timeLabel }}</p>
    <p
      v-if="status"
      class="m-0 text-[11px] leading-[14px]"
      :class="statusTone === 'danger' ? 'text-danger-emphasis' : 'text-neutral-quiet'"
    >
      {{ status }}
    </p>
  </div>
</template>
