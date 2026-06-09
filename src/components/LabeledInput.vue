<script setup>
// Labeled text input with two-way binding via defineModel (Vue 3.4+).
import { useId } from 'vue'

const model = defineModel({ type: String, default: '' })

// Stable id so the error message can be linked to the input for assistive tech.
const errorId = useId()

defineProps({
  label: { type: String, required: true },
  /** Muted suffix after the label, e.g. "(Optional)". Hidden when `required`. */
  labelSuffix: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  /** Marks the field required: shows a red asterisk instead of the suffix. */
  required: { type: Boolean, default: false },
  /** Error message; when truthy the label, border and message turn danger. */
  error: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-sm font-medium" :class="error ? 'text-danger' : 'text-neutral'">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
      <span v-else-if="labelSuffix" class="font-regular text-neutral-quiet">{{ labelSuffix }}</span>
    </label>
    <q-input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :error="!!error"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      outlined
      dense
      hide-bottom-space
      no-error-icon
    />
    <span v-if="error" :id="errorId" class="text-sm text-danger">{{ error }}</span>
  </div>
</template>
