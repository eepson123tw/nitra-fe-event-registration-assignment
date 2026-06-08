<script setup>
// Step 1 — Attendee Info: ticket type selection + attendee form.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { event } from '../../mocks/event.js'
import { addons } from '../../mocks/addons.js'
import { useRegistration } from '../../composables/useRegistration.js'
import TicketCard from '../TicketCard.vue'
import LabeledInput from '../LabeledInput.vue'

const { t } = useI18n()
const { state } = useRegistration()

function selectTicket(id) {
  state.ticketTypeId = id
}

// Selecting any merchandise add-on makes the shipping address required.
const merchandiseIds = new Set(
  addons.filter((a) => a.category === 'merchandise').map((a) => a.id),
)
const requiresShipping = computed(() =>
  Object.entries(state.addons).some(([id, sel]) => merchandiseIds.has(id) && sel.quantity > 0),
)

// The error surfaces only after the unified Step 4 validation runs.
const shippingError = computed(() =>
  state.validationAttempted && requiresShipping.value && !state.attendee.shippingAddress.trim()
    ? t('attendee.shippingAddress.required')
    : '',
)
</script>

<template>
  <section class="flex flex-col gap-8">
    <!-- Ticket type selection -->
    <div class="flex flex-col gap-4">
      <h2 class="q-my-none text-subtitle1 text-neutral">{{ $t('ticket.sectionTitle') }}</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TicketCard
          v-for="ticket in event.ticketTypes"
          :key="ticket.id"
          :ticket="ticket"
          :selected="state.ticketTypeId === ticket.id"
          @select="selectTicket"
        />
      </div>
    </div>

    <!-- Attendee information: 32px between the heading and the form -->
    <div class="flex flex-col gap-8">
      <h2 class="q-my-none text-h3 font-bold text-neutral">{{ $t('attendee.sectionTitle') }}</h2>
      <!-- Form: every row is spaced 20px apart -->
      <div class="flex flex-col gap-5">
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <LabeledInput
            v-model="state.attendee.fullName"
            :label="$t('attendee.fullName.label')"
            :placeholder="$t('attendee.fullName.placeholder')"
          />
          <LabeledInput
            v-model="state.attendee.email"
            type="email"
            :label="$t('attendee.email.label')"
            :placeholder="$t('attendee.email.placeholder')"
          />
          <LabeledInput
            v-model="state.attendee.phone"
            type="tel"
            :label="$t('attendee.phone.label')"
            :placeholder="$t('attendee.phone.placeholder')"
          />
          <LabeledInput
            v-model="state.attendee.company"
            :label="$t('attendee.company.label')"
            :placeholder="$t('attendee.company.placeholder')"
          />
        </div>
        <LabeledInput
          v-model="state.attendee.jobTitle"
          :label="$t('attendee.jobTitle.label')"
          :placeholder="$t('attendee.jobTitle.placeholder')"
        />
        <LabeledInput
          v-model="state.attendee.shippingAddress"
          :label="$t('attendee.shippingAddress.label')"
          :label-suffix="$t('attendee.shippingAddress.optional')"
          :placeholder="$t('attendee.shippingAddress.placeholder')"
          :required="requiresShipping"
          :error="shippingError"
        />
      </div>
    </div>
  </section>
</template>
