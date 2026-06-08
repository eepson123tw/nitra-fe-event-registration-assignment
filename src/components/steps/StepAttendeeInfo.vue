<script setup>
// Step 1 — Attendee Info: ticket type selection + attendee form.
import { event } from '../../mocks/event.js'
import { useRegistration } from '../../composables/useRegistration.js'
import TicketCard from '../TicketCard.vue'
import LabeledInput from '../LabeledInput.vue'

const { state } = useRegistration()

function selectTicket(id) {
  state.ticketTypeId = id
}
</script>

<template>
  <section class="flex flex-col gap-10">
    <!-- Ticket type selection -->
    <div class="flex flex-col gap-4">
      <h2 class="text-h4 font-bold text-neutral">{{ $t('ticket.sectionTitle') }}</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TicketCard
          v-for="ticket in event.ticketTypes"
          :key="ticket.id"
          :ticket="ticket"
          :selected="state.ticketTypeId === ticket.id"
          @select="selectTicket"
        />
      </div>
    </div>

    <!-- Attendee information -->
    <div class="flex flex-col gap-6">
      <h2 class="text-h3 font-bold text-neutral">{{ $t('attendee.sectionTitle') }}</h2>
      <div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
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
      />
    </div>
  </section>
</template>
