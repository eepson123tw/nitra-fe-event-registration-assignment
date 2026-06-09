<script setup>
// Step 1 — Attendee Info: ticket type selection + attendee form.
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { event } from '../../../mocks/event.js'
import { addons } from '../../../mocks/addons.js'
import { useRegistration } from '../../../composables/useRegistration.js'
import TicketCard from './TicketCard.vue'
import LabeledInput from '../../LabeledInput.vue'

const { t } = useI18n()
const { state } = useRegistration()

const tickets = event.ticketTypes

function selectTicket(id) {
  state.ticketTypeId = id
}

// Ticket cards behave as a WAI-ARIA radiogroup: one tab stop (roving
// tabindex) and arrow keys move focus + selection between options.
const cardRefs = ref([])
function setCardRef(el, index) {
  cardRefs.value[index] = el
}
// Index of the option that holds the single tab stop — the selected card, or
// the first one when nothing is selected yet. Derived once per render.
const activeTicketIndex = computed(() => {
  const i = tickets.findIndex((tk) => tk.id === state.ticketTypeId)
  return i === -1 ? 0 : i
})
function onTicketKeydown(e) {
  const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
  const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
  if (!forward && !backward) return
  e.preventDefault()
  const next = (activeTicketIndex.value + (forward ? 1 : -1) + tickets.length) % tickets.length
  selectTicket(tickets[next].id)
  cardRefs.value[next]?.focus()
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
      <h2 id="ticket-type-heading" class="q-my-none text-subtitle1 text-neutral">
        {{ $t('ticket.sectionTitle') }}
      </h2>
      <div
        role="radiogroup"
        aria-labelledby="ticket-type-heading"
        class="grid grid-cols-1 gap-4 md:grid-cols-3"
        @keydown="onTicketKeydown"
      >
        <TicketCard
          v-for="(ticket, index) in tickets"
          :key="ticket.id"
          :ref="(el) => setCardRef(el, index)"
          :ticket="ticket"
          :selected="state.ticketTypeId === ticket.id"
          :tabindex="index === activeTicketIndex ? 0 : -1"
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
