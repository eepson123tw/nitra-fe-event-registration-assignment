<script setup>
// Pill-style WAI-ARIA tablist (day tabs, category tabs): roving tabindex +
// arrow-key navigation between pills. v-model holds the active tab's key; the
// caller owns the panel content and its role="tabpanel".
import { useRovingFocus } from '../composables/useRovingFocus.js'

const props = defineProps({
  /** @type {{ key: string, label: string }[]} */
  tabs: { type: Array, required: true },
  /** Accessible name for the tablist. */
  ariaLabel: { type: String, required: true },
})

/** Key of the active tab. */
const active = defineModel({ type: String, required: true })

const { setItemRef, onKeydown } = useRovingFocus(
  () => props.tabs.length,
  () => props.tabs.findIndex((tab) => tab.key === active.value),
  (next) => {
    active.value = props.tabs[next].key
  },
)
</script>

<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    class="row items-center gap-1 self-start rounded-[10px] bg-surface-l2 p-1"
    @keydown="onKeydown"
  >
    <button
      v-for="(tab, i) in tabs"
      :key="tab.key"
      :ref="(el) => setItemRef(el, i)"
      type="button"
      role="tab"
      :aria-selected="tab.key === active"
      :tabindex="tab.key === active ? 0 : -1"
      class="pill rounded-2 px-5 py-2"
      :class="tab.key === active ? 'pill-active' : 'pill-inactive'"
      @click="active = tab.key"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
