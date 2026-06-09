<script setup>
// "Qty:" [−] n [+] max — a bounded 0..max stepper.
const model = defineModel({ type: Number, default: 0 })
const props = defineProps({
  max: { type: Number, default: 99 },
})

function dec() {
  if (model.value > 0) model.value -= 1
}
function inc() {
  if (model.value < props.max) model.value += 1
}
</script>

<template>
  <div class="row items-center no-wrap gap-2">
    <span class="text-sm font-medium text-neutral-muted">{{ $t('addons.qty') }}</span>
    <button
      type="button"
      class="flex flex-center h-7 w-7 cursor-pointer rounded-[6px] border border-solid border-neutral-muted bg-surface-l0 outline-none focus-ring disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="model <= 0"
      :aria-label="$t('addons.qtyDecrease')"
      @click="dec"
    >
      <q-icon name="remove" size="16px" class="text-neutral" />
    </button>
    <span class="w-6 text-center text-md font-semibold text-neutral" aria-live="polite">{{ model }}</span>
    <button
      type="button"
      class="flex flex-center h-7 w-7 cursor-pointer rounded-[6px] border border-solid border-neutral-muted bg-surface-l0 outline-none focus-ring disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="model >= max"
      :aria-label="$t('addons.qtyIncrease')"
      @click="inc"
    >
      <q-icon name="add" size="16px" class="text-neutral" />
    </button>
    <span class="text-[10px] text-neutral-quiet">{{ $t('addons.max', { count: max }) }}</span>
  </div>
</template>
