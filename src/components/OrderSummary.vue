<script setup>
// Live order summary (Step 3 sidebar): card chrome + the shared summary lines.
import { computed } from 'vue'
import { useRegistration } from '../composables/useRegistration.js'
import { useCatalog } from '../composables/useCatalog.js'
import { buildOrderSummary } from '../utils/pricing.js'
import OrderSummaryLines from './OrderSummaryLines.vue'

const { state } = useRegistration()
const { ticketTypes, addons } = useCatalog()
const summary = computed(() =>
  buildOrderSummary(state, { ticketTypes: ticketTypes.value, addons: addons.value }),
)
</script>

<template>
  <aside class="flex flex-col gap-4 rounded-[6px] border border-solid border-neutral-muted bg-surface-l1 p-6">
    <h2 class="m-0 text-subtitle1 text-neutral">{{ $t('addons.summary.title') }}</h2>
    <OrderSummaryLines :summary="summary" :total-label="$t('addons.summary.total')" with-empty />
  </aside>
</template>
