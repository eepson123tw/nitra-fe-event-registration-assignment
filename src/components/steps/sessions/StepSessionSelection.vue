<script setup>
// Step 2 — Session Selection: sessions grouped by day, multi-select.
// Time-conflict detection is deferred to Step 4 (no inline blocking here);
// only capacity-full sessions are disabled.
import { computed, ref } from 'vue'
import { useRegistration } from '../../../composables/useRegistration.js'
import { useCatalog } from '../../../composables/useCatalog.js'
import { useFormat } from '../../../composables/useFormat.js'
import { dayKey, findOverlappingIds } from '../../../utils/datetime.js'
import TabPills from '../../TabPills.vue'
import SessionCard from './SessionCard.vue'

const { state } = useRegistration()
const { sessions } = useCatalog()
const { dayLabel } = useFormat()

// Sessions that overlap another selected one — surfaced only after a submit
// attempt (validation stays deferred), and recomputed live as the user edits
// so the cues clear the moment a conflict is resolved. Shares the overlap
// helper with the Step-4 validator.
const conflictIds = computed(() => {
  if (!state.validationAttempted) return new Set()
  const selected = sessions.value.filter((s) => state.selectedSessionIds.includes(s.id))
  return findOverlappingIds(selected)
})

// Group sessions by day, preserving source order.
const days = computed(() => {
  const map = new Map()
  for (const s of sessions.value) {
    const key = dayKey(s.date)
    if (!map.has(key)) map.set(key, { key, label: dayLabel(s.date), sessions: [] })
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

</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="q-my-none text-h3 font-bold text-neutral">{{ $t('sessions.sectionTitle') }}</h2>

    <!-- Day tabs -->
    <TabPills v-model="activeDayKey" :tabs="days" :aria-label="$t('sessions.sectionTitle')" />

    <p class="m-0 text-sm text-neutral-muted">
      {{ $t('sessions.selectedCount', { count: selectedCount }, selectedCount) }}
    </p>

    <!-- Conflict notice: points the user at the highlighted cards to fix -->
    <div
      v-if="conflictIds.size"
      role="alert"
      class="flex items-center gap-2 rounded-[6px] border border-solid border-danger-muted bg-danger-muted-rest p-4 text-danger"
    >
      <q-icon name="error" size="18px" />
      <p class="m-0 text-sm font-medium">{{ $t('sessions.conflictNotice') }}</p>
    </div>

    <div role="tabpanel" class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SessionCard
        v-for="s in activeDay.sessions"
        :key="s.id"
        :session="s"
        :selected="selectedSet.has(s.id)"
        :conflict="conflictIds.has(s.id)"
        @toggle="toggle"
      />
    </div>
  </section>
</template>
