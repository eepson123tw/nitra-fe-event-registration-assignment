<script setup>
// Post-submission confirmation. Shown in place of the wizard once validation
// passes: a success mark, the confirmation number, a thank-you note, and a
// recap of the order. "Back to Home" asks the host to reset the wizard.
import { event } from '../../../mocks/event.js'
import { useRegistration } from '../../../composables/useRegistration.js'
import OrderSummary from '../../OrderSummary.vue'

defineProps({
  /** Generated confirmation reference, e.g. "TC2025-48217". */
  code: { type: String, required: true },
})

defineEmits(['restart'])

const { state } = useRegistration()
</script>

<template>
  <section class="flex flex-col items-center gap-6 py-10 text-center">
    <div class="flex flex-center h-16 w-16 rounded-full bg-success-emphasis-rest">
      <q-icon name="check" size="36px" class="text-inverse" />
    </div>

    <div class="flex flex-col gap-2">
      <h2 class="m-0 text-h2 font-bold text-neutral">{{ $t('success.title') }}</h2>
      <p class="m-0 text-md font-semibold text-success-emphasis">
        {{ $t('success.confirmation', { code }) }}
      </p>
    </div>

    <p class="m-0 max-w-[480px] text-md text-neutral-muted">
      {{ $t('success.message', { event: event.name, email: state.attendee.email }) }}
    </p>

    <OrderSummary class="w-full max-w-[420px] text-left" />

    <q-btn
      unelevated
      no-caps
      color="accent"
      :label="$t('success.backHome')"
      padding="10px 16px"
      class="rounded-[10px] text-md font-semibold"
      @click="$emit('restart')"
    />
  </section>
</template>
