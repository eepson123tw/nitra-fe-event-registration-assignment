<script setup>
// Step 1 — Attendee Info. Implemented in a later phase.
import { useRegistration } from '../../composables/useRegistration.js'

const { state } = useRegistration()
</script>

<template>
  <div class="text-neutral-muted">
    {{ $t('steps.attendee.label') }} — {{ $t('common.comingSoon') }}
    <!-- Wiring check: proves the shared store is injectable here. -->
    <span class="sr-only">{{ state.ticketTypeId }}</span>
  </div>
</template>
