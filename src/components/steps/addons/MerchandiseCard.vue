<script setup>
// A merchandise add-on: optional size selector + a 0..maxQuantity stepper.
// Selected (quantity > 0) shows the brand styling and an "Added" note.
import { computed } from 'vue'
import { formatCurrency } from '../../../utils/currency.js'
import QuantityPicker from '../../QuantityPicker.vue'

const props = defineProps({
  /** @type {{ id, name, price, description, sizes?, maxQuantity }} */
  addon: { type: Object, required: true },
  quantity: { type: Number, default: 0 },
  size: { type: String, default: '' },
})
const emit = defineEmits(['update'])

const selected = computed(() => props.quantity > 0)

function onQuantity(quantity) {
  emit('update', { quantity, size: props.size })
}
function onSize(e) {
  emit('update', { quantity: props.quantity, size: e.target.value })
}
</script>

<template>
  <div
    role="group"
    :aria-label="addon.name"
    class="flex flex-col gap-2 p-[16px] rounded-[6px] border-2 border-solid shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]"
    :class="selected
      ? 'border-brand-emphasis bg-brand-subtle-rest'
      : 'border-neutral-muted bg-surface-l0'"
  >
    <div class="row items-center justify-between full-width text-subtitle1 text-neutral">
      <span>{{ addon.name }}</span>
      <span>{{ formatCurrency(addon.price, { cents: false }) }}</span>
    </div>
    <p class="m-0 text-sm text-neutral-muted">{{ addon.description }}</p>

    <div class="row items-center no-wrap gap-4">
      <!-- Size selector (only for items that offer sizes) -->
      <div v-if="addon.sizes" class="row items-center no-wrap gap-2">
        <span class="text-sm font-medium text-neutral-muted">{{ $t('addons.size') }}</span>
        <div class="relative">
          <select
            :value="size"
            :aria-label="$t('addons.size')"
            class="appearance-none cursor-pointer rounded-[6px] border border-solid border-neutral-muted bg-surface-l0 py-[6px] pl-[12px] pr-[24px] text-sm font-medium text-neutral"
            @change="onSize"
          >
            <option value="">{{ $t('addons.selectSize') }}</option>
            <option v-for="s in addon.sizes" :key="s" :value="s">{{ s }}</option>
          </select>
          <span
            class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-quiet"
            aria-hidden="true"
          >▾</span>
        </div>
      </div>

      <QuantityPicker
        :model-value="quantity"
        :max="addon.maxQuantity"
        @update:model-value="onQuantity"
      />
    </div>

    <p v-if="selected" class="m-0 text-[11px] font-semibold text-success">
      ✓ {{ $t('addons.added') }}
    </p>
  </div>
</template>
