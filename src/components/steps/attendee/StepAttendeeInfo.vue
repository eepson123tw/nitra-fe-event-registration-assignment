<script setup>
// Step 1 — Attendee Info: ticket type selection + attendee form.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from '../../../composables/useRegistration.js'
import { useCatalog } from '../../../composables/useCatalog.js'
import { useRovingFocus } from '../../../composables/useRovingFocus.js'
import { hasMerchandiseSelected } from '../../../utils/validation.js'
import TicketCard from './TicketCard.vue'
import LabeledInput from '../../LabeledInput.vue'

const { t } = useI18n()
const { state, validation } = useRegistration()
const { ticketTypes } = useCatalog()

// Field-level errors come from the shared unified validation, but only surface
// after a submit has been attempted — matching the spec's "no inline
// validation before Step 4". Returns a translated message, or '' when valid.
function fieldError(field) {
  if (!state.validationAttempted) return ''
  const f = validation.value.fields[field]
  return f ? t(f.messageKey) : ''
}

function selectTicket(id) {
  state.ticketTypeId = id
}

// Index of the option that holds the single tab stop — the selected card, or
// the first one when nothing is selected yet. Derived once per render.
const activeTicketIndex = computed(() => {
  const i = ticketTypes.value.findIndex((tk) => tk.id === state.ticketTypeId)
  return i === -1 ? 0 : i
})
// Ticket cards behave as a WAI-ARIA radiogroup: one tab stop (roving
// tabindex) and arrow keys move focus + selection between options.
const { setItemRef: setCardRef, onKeydown: onTicketKeydown } = useRovingFocus(
  () => ticketTypes.value.length,
  () => activeTicketIndex.value,
  (next) => selectTicket(ticketTypes.value[next].id),
)

// Selecting any merchandise add-on makes the shipping address required (shared
// with the validator so the asterisk and the rule can't drift).
const requiresShipping = computed(() => hasMerchandiseSelected(state))
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
        :aria-invalid="!!fieldError('ticketType')"
        aria-describedby="ticket-type-error"
        class="grid grid-cols-1 gap-4 md:grid-cols-3"
        @keydown="onTicketKeydown"
      >
        <TicketCard
          v-for="(ticket, index) in ticketTypes"
          :key="ticket.id"
          :ref="(el) => setCardRef(el, index)"
          :ticket="ticket"
          :selected="state.ticketTypeId === ticket.id"
          :tabindex="index === activeTicketIndex ? 0 : -1"
          @select="selectTicket"
        />
      </div>
      <p v-if="fieldError('ticketType')" id="ticket-type-error" class="m-0 text-md text-danger">
        {{ fieldError('ticketType') }}
      </p>
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
            :error="fieldError('fullName')"
          />
          <LabeledInput
            v-model="state.attendee.email"
            type="email"
            :label="$t('attendee.email.label')"
            :placeholder="$t('attendee.email.placeholder')"
            :error="fieldError('email')"
          />
          <LabeledInput
            v-model="state.attendee.phone"
            type="tel"
            :label="$t('attendee.phone.label')"
            :placeholder="$t('attendee.phone.placeholder')"
            :error="fieldError('phone')"
          />
          <LabeledInput
            v-model="state.attendee.company"
            :label="$t('attendee.company.label')"
            :placeholder="$t('attendee.company.placeholder')"
            :error="fieldError('company')"
          />
        </div>
        <LabeledInput
          v-model="state.attendee.jobTitle"
          :label="$t('attendee.jobTitle.label')"
          :placeholder="$t('attendee.jobTitle.placeholder')"
          :error="fieldError('jobTitle')"
        />
        <LabeledInput
          v-model="state.attendee.shippingAddress"
          :label="$t('attendee.shippingAddress.label')"
          :label-suffix="$t('attendee.shippingAddress.optional')"
          :placeholder="$t('attendee.shippingAddress.placeholder')"
          :required="requiresShipping"
          :error="fieldError('shippingAddress')"
        />
      </div>
    </div>
  </section>
</template>
