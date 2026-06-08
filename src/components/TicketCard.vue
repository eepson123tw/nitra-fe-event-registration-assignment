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
    class="flex flex-col text-left cursor-pointer q-pa-lg transition rounded-[10px]"
    :class="selected
      ? 'border-2 border-brand-emphasis bg-surface-l0'
      : 'border-2 border-neutral-muted bg-surface-l1 hover:border-brand-muted'"
    :aria-pressed="selected"
    @click="emit('select', ticket.id)"
  >
    <div class="row items-start justify-between full-width">
      <span class="text-lg font-bold text-neutral">{{ ticket.name }}</span>
      <span class="text-lg font-bold text-neutral">{{ formatCurrency(ticket.price, { cents: false }) }}</span>
    </div>

    <p class="q-mt-xs q-mb-md text-md text-neutral-muted">{{ ticket.description }}</p>

    <ul class="flex flex-col gap-2">
      <li v-for="perk in ticket.perks" :key="perk" class="row items-center no-wrap">
        <q-icon name="check_circle" size="18px" class="text-success-emphasis" />
        <span class="q-ml-sm text-md text-neutral">{{ perk }}</span>
      </li>
    </ul>

    <span
      v-if="selected"
      class="row items-center self-start q-mt-md q-px-sm q-py-xs rounded-full bg-brand-bold-rest text-inverse text-sm font-semibold"
    >
      <q-icon name="check" size="14px" class="q-mr-xs" />
      {{ $t('ticket.selected') }}
    </span>
  </button>
</template>
