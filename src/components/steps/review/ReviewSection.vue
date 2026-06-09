<script setup>
// Card chrome for one Step 4 review section: a titled surface-L1 card with an
// "Edit → Step N" link in the header. The border turns danger-coloured once the
// referenced step has validation errors (after a submit attempt). Rows are
// provided via the default slot.
defineProps({
  title: { type: String, required: true },
  /** 1-based step the Edit link jumps to. */
  step: { type: Number, required: true },
  /** Highlight the card as containing errors. */
  hasError: { type: Boolean, default: false },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-[6px] border-solid bg-surface-l1 p-5"
    :class="hasError ? 'border-2 border-danger-emphasis' : 'border border-neutral-muted'"
  >
    <header class="flex items-center justify-between gap-4">
      <h3 class="m-0 text-subtitle1" :class="hasError ? 'text-danger' : 'text-neutral'">{{ title }}</h3>
      <button
        type="button"
        class="shrink-0 cursor-pointer border-none bg-transparent p-0 text-[12px] font-semibold leading-[16px] text-teal-500 underline"
        @click="emit('navigate', step)"
      >
        {{ $t('review.edit', { step }) }}
      </button>
    </header>
    <slot />
  </section>
</template>
