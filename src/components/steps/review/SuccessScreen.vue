<script setup>
// Post-submission confirmation — the Figma "Success State" frame (green check,
// green title, confirmation number, short note) plus an order recap so the user
// has a record of what they registered for. "Back to Home" resets the wizard.
import { event } from '../../../mocks/event.js'
import { useRegistration } from '../../../composables/useRegistration.js'
import successIcon from '../../../assets/successIcon.svg'
import OrderSummary from '../../OrderSummary.vue'

defineProps({
  /** Generated confirmation reference, e.g. "TC2025-48217". */
  code: { type: String, required: true },
})

defineEmits(['restart'])

const { state } = useRegistration()
</script>

<template>
  <section class="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
    <img :src="successIcon" alt="" class="h-20 w-20" />

    <h2 class="m-0 text-h2 text-success">{{ $t('success.title') }}</h2>

    <p class="m-0 text-lg font-regular text-neutral">
      {{ $t('success.confirmation', { code }) }}
    </p>

    <p class="m-0 max-w-[420px] text-sm font-regular text-neutral-muted">
      {{ $t('success.message', { event: event.name, email: state.attendee.email }) }}
    </p>

    <!-- Order recap — reuses the design's summary card, left-aligned -->
    <OrderSummary class="w-full max-w-[420px] text-left" />

    <q-btn
      unelevated
      no-caps
      color="accent"
      :label="$t('success.backHome')"
      padding="10px 16px"
      class="rounded-[10px] text-md font-semibold transition-all duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0"
      @click="$emit('restart')"
    />
  </section>
</template>
