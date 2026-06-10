<script setup>
// Shared itemized lines for an order summary — ticket, add-on lines (merch in
// brand), VIP workshop discount, divider, total. Used by both the Step-3 live
// OrderSummary and the Step-4 review pricing so the row markup lives once. The
// surrounding card chrome (tag, heading, spacing) stays with each caller.
import { computed } from 'vue'
import { useFormat } from '../composables/useFormat.js'

const props = defineProps({
  /** Result of buildOrderSummary(state, catalog). */
  summary: { type: Object, required: true },
  /** Label for the total row ("Total" vs "Grand Total"). */
  totalLabel: { type: String, required: true },
  /** Show the "no items yet" line when nothing is selected. */
  withEmpty: { type: Boolean, default: false },
})

const { currency } = useFormat()
const isEmpty = computed(() => !props.summary.ticket && props.summary.lines.length === 0)
</script>

<template>
  <div
    v-if="summary.ticket"
    class="row items-start justify-between full-width text-sm font-regular text-neutral-muted"
  >
    <span>{{ $t('summary.ticket', { name: summary.ticket.name }) }}</span>
    <span>{{ currency(summary.ticket.amount) }}</span>
  </div>

  <div
    v-for="line in summary.lines"
    :key="line.id"
    class="row items-start justify-between full-width text-sm font-regular"
    :class="line.kind === 'merchandise' ? 'text-brand-emphasis' : 'text-neutral-muted'"
  >
    <span>{{ line.kind === 'merchandise' ? `${line.name} × ${line.quantity}` : line.name }}</span>
    <span>{{ currency(line.amount) }}</span>
  </div>

  <div
    v-if="summary.discount > 0"
    class="row items-start justify-between full-width text-[11px] leading-[14px] text-brand-emphasis"
  >
    <span>{{ $t('summary.workshopDiscount') }}</span>
    <span>-{{ currency(summary.discount) }}</span>
  </div>

  <p v-if="withEmpty && isEmpty" class="m-0 text-sm text-neutral-quiet">{{ $t('summary.empty') }}</p>

  <!-- Separator before the total -->
  <div class="h-px w-full bg-[var(--divider-muted)]" />

  <div class="row items-start justify-between full-width text-sm font-medium text-neutral">
    <span>{{ totalLabel }}</span>
    <span>{{ currency(summary.total) }}</span>
  </div>
</template>
