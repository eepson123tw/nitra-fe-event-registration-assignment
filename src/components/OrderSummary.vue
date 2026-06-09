<script setup>
// Live order summary: ticket + selected add-ons, VIP workshop discount, total.
import { computed } from 'vue'
import { useRegistration } from '../composables/useRegistration.js'
import { buildOrderSummary } from '../utils/pricing.js'
import { formatCurrency } from '../utils/currency.js'

const { state } = useRegistration()
const summary = computed(() => buildOrderSummary(state))
const isEmpty = computed(() => !summary.value.ticket && summary.value.lines.length === 0)
</script>

<template>
  <aside class="flex flex-col gap-4 rounded-[6px] border border-solid border-neutral-muted bg-surface-l1 p-6">
    <h2 class="m-0 text-subtitle1 text-neutral">{{ $t('addons.summary.title') }}</h2>

    <div
      v-if="summary.ticket"
      class="row items-start justify-between full-width text-sm text-neutral-muted"
    >
      <span>{{ $t('addons.summary.ticket', { name: summary.ticket.name }) }}</span>
      <span>{{ formatCurrency(summary.ticket.amount) }}</span>
    </div>

    <div
      v-for="line in summary.lines"
      :key="line.id"
      class="row items-start justify-between full-width text-sm"
      :class="line.kind === 'merchandise' ? 'font-medium text-brand-emphasis' : 'text-neutral-muted'"
    >
      <span>{{ line.kind === 'merchandise' ? `${line.name} × ${line.quantity}` : line.name }}</span>
      <span>{{ formatCurrency(line.amount) }}</span>
    </div>

    <div
      v-if="summary.discount > 0"
      class="row items-start justify-between full-width text-[11px] leading-[14px] text-brand-emphasis"
    >
      <span>{{ $t('addons.summary.workshopDiscount') }}</span>
      <span>-{{ formatCurrency(summary.discount) }}</span>
    </div>

    <p v-if="isEmpty" class="m-0 text-sm text-neutral-quiet">{{ $t('addons.summary.empty') }}</p>

    <div class="h-px full-width bg-[var(--divider-muted)]" />

    <div class="row items-start justify-between full-width text-sm font-medium text-neutral">
      <span>{{ $t('addons.summary.total') }}</span>
      <span>{{ formatCurrency(summary.total) }}</span>
    </div>
  </aside>
</template>
