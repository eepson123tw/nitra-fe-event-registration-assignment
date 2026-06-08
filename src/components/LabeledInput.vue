<script setup>
// Labeled text input with two-way binding via defineModel (Vue 3.4+).
const model = defineModel({ type: String, default: '' })

defineProps({
  label: { type: String, required: true },
  /** Muted suffix after the label, e.g. "(Optional)". */
  labelSuffix: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-md font-medium text-neutral">
      {{ label }}
      <span v-if="labelSuffix" class="font-regular text-neutral-quiet">{{ labelSuffix }}</span>
    </label>
    <q-input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      outlined
      dense
      hide-bottom-space
    />
  </div>
</template>
