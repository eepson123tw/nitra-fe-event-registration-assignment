<script setup>
// A single selectable session (multi-select). Full sessions are disabled.
import { computed } from 'vue'
import { useFormat } from '../../../composables/useFormat.js'

const { timeRange: formatTimeRange } = useFormat()

const props = defineProps({
  /** @type {{ id, title, speaker, speakerTitle, track, date, endDate, capacity, registered }} */
  session: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  /** True when this selected session overlaps another selected one (after a submit attempt). */
  conflict: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])

const full = computed(() => props.session.registered >= props.session.capacity)
const remaining = computed(() => Math.max(0, props.session.capacity - props.session.registered))
const fillPct = computed(() =>
  Math.min(100, Math.round((props.session.registered / props.session.capacity) * 100)),
)
const timeRange = computed(() => formatTimeRange(props.session.date, props.session.endDate))

// Capacity colour tier by how full the session is (full -> getting full -> ... -> plenty).
const tier = computed(() => {
  if (full.value) return 'full'
  const r = props.session.registered / props.session.capacity
  if (r >= 0.75) return 'high'
  if (r >= 0.5) return 'medium'
  return 'low'
})
const barClass = {
  full: 'bg-danger-emphasis-rest',
  high: 'bg-orange-600',
  medium: 'bg-yellow-800',
  low: 'bg-brand-emphasis-rest',
}
const spotsClass = {
  full: 'text-danger-emphasis font-semibold',
  high: 'text-orange-700 font-medium',
  medium: 'text-yellow-800 font-medium',
  low: 'text-brand-emphasis font-medium',
}

// Track -> badge palette (maps onto the design system's colour scale).
const trackBadge = {
  main: 'bg-gray-50 text-gray-700',
  frontend: 'bg-orange-50 text-orange-600',
  backend: 'bg-blue-50 text-blue-600',
  devops: 'bg-yellow-200 text-yellow-900',
}

function toggle() {
  if (!full.value) emit('toggle', props.session.id)
}
</script>

<template>
  <div
    role="checkbox"
    :aria-checked="selected"
    :aria-disabled="full"
    :tabindex="full ? -1 : 0"
    :aria-label="session.title"
    class="flex flex-col gap-2 p-4 rounded-[6px] border-2 border-solid outline-none transition-colors duration-150 shadow-card focus-ring"
    :class="full
      ? 'cursor-not-allowed border-neutral-muted bg-surface-l2'
      : conflict
        ? 'cursor-pointer border-danger-emphasis bg-danger-muted-rest'
        : selected
          ? 'cursor-pointer border-brand-emphasis bg-brand-subtle-rest'
          : 'cursor-pointer border-neutral-muted bg-surface-l0 hover:border-brand-muted'"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <!-- Top: track badge + checkbox -->
    <div class="row items-center justify-between full-width">
      <span
        class="rounded-full px-[5px] py-[3px] text-[11px] leading-[14px] font-medium uppercase"
        :class="full ? 'bg-gray-50 text-gray-700' : (trackBadge[session.track] || trackBadge.main)"
      >
        {{ session.trackLabel || session.track }}
      </span>
      <span
        v-if="!full"
        class="flex flex-center h-4 w-4 rounded-[2px]"
        :class="selected ? 'bg-brand-emphasis-rest' : 'bg-surface-l0 border border-neutral-emphasis'"
        aria-hidden="true"
      >
        <q-icon v-if="selected" name="check" size="12px" class="text-inverse" />
      </span>
    </div>

    <p class="m-0 text-subtitle1" :class="full ? 'text-neutral-disabled' : 'text-neutral'">
      {{ session.title }}
    </p>
    <p class="m-0 text-sm" :class="full ? 'text-neutral-disabled' : 'text-neutral-muted'">
      {{ session.speaker }}, {{ session.speakerTitle }}
    </p>
    <p
      class="m-0 text-[11px] leading-[14px]"
      :class="full ? 'text-neutral-disabled' : 'text-neutral-quiet'"
    >
      {{ timeRange }}
    </p>

    <!-- Capacity bar (fill width is a runtime %, so it stays a bound style) -->
    <div class="full-width h-1.5 rounded-[3px] bg-surface-l2">
      <div class="h-1.5 rounded-[3px]" :class="barClass[tier]" :style="{ width: fillPct + '%' }" />
    </div>
    <p class="m-0 text-[11px] leading-[14px]" :class="spotsClass[tier]">
      {{ full ? $t('sessions.soldOut') : $t('sessions.spotsLeft', { count: remaining }, remaining) }}
    </p>

    <!-- Conflict cue: only after a submit attempt, on each overlapping card.
         a11y limitation (see PLAN §6): this per-card cue is visual + readable
         text but is NOT wired to the card's accessible name or a live region —
         the step-level conflict notice (role="alert" in StepSessionSelection)
         is what announces the conflict to assistive tech. -->
    <p
      v-if="conflict"
      class="row items-center no-wrap gap-1 m-0 text-[11px] leading-[14px] font-medium text-danger"
    >
      <q-icon name="error" size="14px" />
      {{ $t('sessions.conflict') }}
    </p>
  </div>
</template>
