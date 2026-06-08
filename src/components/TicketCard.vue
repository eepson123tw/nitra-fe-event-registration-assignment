<script setup>
import { formatCurrency } from '../utils/currency.js'

defineProps({
  /** @type {{ id: string, name: string, price: number, description: string, perks: string[] }} */
  ticket: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="flex flex-col gap-3 text-left cursor-pointer p-[20px] transition rounded-[6px] border-2 border-solid "
    :class="selected
      ? 'border-brand-emphasis bg-brand-subtle-rest'
      : 'border-neutral-muted bg-surface-l1 hover:border-brand-muted'"
    :aria-pressed="selected"
    @click="emit('select', ticket.id)"
  >
    <div class="row items-center justify-between full-width text-subtitle1 text-neutral">
      <span>{{ ticket.name }}</span>
      <span>{{ formatCurrency(ticket.price, { cents: false }) }}</span>
    </div>

    <p class="text-sm text-neutral-muted">{{ ticket.description }}</p>

    <ul class="flex flex-col gap-3 full-width q-pl-none q-my-none">
      <li v-for="perk in ticket.perks" :key="perk" class="row items-center no-wrap">
        <q-icon name="check_circle" size="14px" class="text-neutral" />
        <span class="q-ml-sm text-sm text-neutral-muted">{{ perk }}</span>
      </li>
    </ul>

    <!-- Always rendered to reserve its height, so selecting a card never
         reflows the row; hidden until the card is the selected one. -->
    <span
      class="row items-center self-start px-[8px] py-[3px] rounded-full bg-success-bold-rest text-inverse text-[11px] font-medium"
      :class="{ invisible: !selected }"
      :aria-hidden="!selected"
    >
      <q-icon name="check" size="12px" class="q-mr-xs" />
      {{ $t('ticket.selected') }}
    </span>
  </button>
</template>
