<script setup>
// Step 2 — Session Selection: sessions grouped by day, multi-select.
// Time-conflict detection is deferred to Step 4 (no inline blocking here);
// only capacity-full sessions are disabled.
import { computed, ref } from 'vue'
import { sessions } from '../../../mocks/sessions.js'
import { useRegistration } from '../../../composables/useRegistration.js'
import { dayKey, formatDayLabel } from '../../../utils/datetime.js'
import SessionCard from './SessionCard.vue'

const { state } = useRegistration()

// Group sessions by day, preserving source order.
const days = computed(() => {
  const map = new Map()
  for (const s of sessions) {
    const key = dayKey(s.date)
    if (!map.has(key)) map.set(key, { key, label: formatDayLabel(s.date), sessions: [] })
    map.get(key).sessions.push(s)
  }
  return [...map.values()]
})

const activeDayKey = ref(days.value[0]?.key)
const activeDay = computed(
  () => days.value.find((d) => d.key === activeDayKey.value) ?? days.value[0],
)

// O(1) membership lookup instead of Array.includes per card.
const selectedSet = computed(() => new Set(state.selectedSessionIds))
const selectedCount = computed(() => state.selectedSessionIds.length)

function toggle(id) {
  const i = state.selectedSessionIds.indexOf(id)
  if (i === -1) state.selectedSessionIds.push(id)
  else state.selectedSessionIds.splice(i, 1)
}

// Day tabs behave as a tablist: roving tabindex + arrow-key navigation.
const tabRefs = ref([])
function setTabRef(el, i) {
  tabRefs.value[i] = el
}
function onTabKeydown(e) {
  const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
  const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
  if (!forward && !backward) return
  e.preventDefault()
  const cur = days.value.findIndex((d) => d.key === activeDayKey.value)
  const next = (cur + (forward ? 1 : -1) + days.value.length) % days.value.length
  activeDayKey.value = days.value[next].key
  tabRefs.value[next]?.focus()
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="q-my-none text-h3 font-bold text-neutral">{{ $t('sessions.sectionTitle') }}</h2>

    <!-- Day tabs -->
    <div
      role="tablist"
      :aria-label="$t('sessions.sectionTitle')"
      class="row items-center gap-1 self-start rounded-[10px] bg-surface-l2 p-1"
      @keydown="onTabKeydown"
    >
      <button
        v-for="(day, i) in days"
        :key="day.key"
        :ref="(el) => setTabRef(el, i)"
        type="button"
        role="tab"
        :aria-selected="day.key === activeDayKey"
        :tabindex="day.key === activeDayKey ? 0 : -1"
        class="cursor-pointer rounded-2 border-none px-5 py-2 text-[13px]"
        :class="day.key === activeDayKey
          ? 'bg-brand-emphasis-rest text-inverse font-semibold'
          : 'bg-transparent text-neutral-muted font-medium'"
        @click="activeDayKey = day.key"
      >
        {{ day.label }}
      </button>
    </div>

    <p class="m-0 text-sm text-neutral-muted">
      {{ $t('sessions.selectedCount', { count: selectedCount }, selectedCount) }}
    </p>

    <div role="tabpanel" class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SessionCard
        v-for="s in activeDay.sessions"
        :key="s.id"
        :session="s"
        :selected="selectedSet.has(s.id)"
        @toggle="toggle"
      />
    </div>
  </section>
</template>
