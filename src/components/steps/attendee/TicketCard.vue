<script setup>
import { ref } from 'vue'
import { useFormat } from '../../../composables/useFormat.js'

const { currency } = useFormat()

defineProps({
  /** @type {{ id: string, name: string, price: number, description: string, perks: string[] }} */
  ticket: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  /** Roving tabindex within the radiogroup: 0 for the active option, -1 otherwise. */
  tabindex: { type: Number, default: -1 },
})

const emit = defineEmits(['select'])

// Exposed so the radiogroup parent can move focus during arrow-key navigation.
const root = ref(null)
defineExpose({ focus: () => root.value?.focus() })
</script>

<template>
  <div
    ref="root"
    role="radio"
    :aria-checked="selected"
    :tabindex="tabindex"
    class="flex flex-col gap-3 cursor-pointer p-5 transition rounded-[6px] border-2 border-solid outline-none focus-visible:shadow-[0_0_0_2px_var(--border-brand-emphasis)]"
    :class="selected
      ? 'border-brand-emphasis bg-brand-subtle-rest'
      : 'border-neutral-muted bg-surface-l1 hover:border-brand-muted'"
    @click="emit('select', ticket.id)"
    @keydown.enter.prevent="emit('select', ticket.id)"
    @keydown.space.prevent="emit('select', ticket.id)"
  >
    <div class="row items-center justify-between full-width text-subtitle1 text-neutral">
      <span>{{ ticket.name }}</span>
      <span>{{ currency(ticket.price, { cents: false }) }}</span>
    </div>

    <p class="text-sm text-neutral-muted m-0">{{ ticket.description }}</p>

    <ul class="flex flex-col gap-3 full-width q-pl-none q-my-none">
      <li v-for="perk in ticket.perks" :key="perk" class="row items-center no-wrap">
        <q-icon name="check_circle" size="14px" class="text-neutral" />
        <span class="q-ml-sm text-sm text-neutral-muted">{{ perk }}</span>
      </li>
    </ul>

    <!-- Always rendered to reserve its height, so selecting a card never
         reflows the row; hidden until the card is the selected one. -->
    <span
      class="row items-center self-start px-2 py-[3px] rounded-full bg-success-bold-rest text-inverse text-[11px] leading-[14px] font-medium"
      :class="{ invisible: !selected }"
      :aria-hidden="!selected"
    >
      <q-icon name="check" size="12px" class="q-mr-xs" />
      {{ $t('ticket.selected') }}
    </span>
  </div>
</template>
