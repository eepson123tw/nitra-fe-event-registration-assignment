<script setup>
// Step 4 — Review & Submit. Read-only recap of Steps 1–3 with per-section Edit
// links, an itemized pricing summary, and (after a failed submit) an error
// banner listing every issue. Submission + success are owned by the host page;
// this component only surfaces state and re-emits "navigate" for Edit links.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { event } from '../../../mocks/event.js'
import { sessions } from '../../../mocks/sessions.js'
import { addons } from '../../../mocks/addons.js'
import { useRegistration } from '../../../composables/useRegistration.js'
import { hasMerchandiseSelected } from '../../../utils/validation.js'
import { buildOrderSummary } from '../../../utils/pricing.js'
import { formatCurrency } from '../../../utils/currency.js'
import { formatDayTime } from '../../../utils/datetime.js'
import ReviewSection from './ReviewSection.vue'

const { t } = useI18n()
const { state, validation } = useRegistration()

defineEmits(['navigate'])

const summary = computed(() => buildOrderSummary(state))
const stepHasError = computed(() => validation.value.stepHasError)
// The banner only appears once a submit has been attempted.
const showErrors = computed(() => state.validationAttempted && validation.value.hasErrors)
// Each issue carries the step it belongs to, surfaced as "Step N: <message>".
// Deduped by (step + text) so several same-message issues (e.g. two
// merchandise items missing a size) collapse to a single banner line.
const bannerIssues = computed(() => {
  const seen = new Set()
  const out = []
  for (const i of validation.value.issues) {
    const text = t(i.messageKey)
    const key = `${i.step}|${text}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ step: i.step, text })
  }
  return out
})

const ticketValue = computed(() => {
  const tk = event.ticketTypes.find((x) => x.id === state.ticketTypeId)
  return tk ? `${tk.name} (${formatCurrency(tk.price, { cents: false })})` : ''
})

const attendeeRows = computed(() => {
  const a = state.attendee
  const rows = [
    { label: t('review.fields.name'), value: a.fullName },
    { label: t('review.fields.email'), value: a.email },
    { label: t('review.fields.phone'), value: a.phone },
    { label: t('review.fields.company'), value: a.company },
    { label: t('review.fields.jobTitle'), value: a.jobTitle },
    { label: t('review.fields.ticketType'), value: ticketValue.value },
  ]
  // Shipping is only relevant — and only required — once merchandise is added.
  if (hasMerchandiseSelected(state)) {
    rows.push({ label: t('attendee.shippingAddress.label'), value: a.shippingAddress })
  }
  return rows
})

const sessionRows = computed(() =>
  sessions
    .filter((s) => state.selectedSessionIds.includes(s.id))
    .map((s) => ({ label: formatDayTime(s.date), value: s.title })),
)

const addonRows = computed(() => {
  const rows = []
  // addons.js is ordered workshops -> meals -> merchandise.
  for (const addon of addons) {
    const sel = state.addons[addon.id]
    if (!sel || sel.quantity < 1) continue
    let value = `${addon.name} (${formatCurrency(addon.price, { cents: false })})`
    if (addon.category === 'merchandise') {
      const extra = [sel.size, sel.quantity > 1 ? `×${sel.quantity}` : ''].filter(Boolean)
      if (extra.length) value += ` — ${extra.join(' ')}`
    }
    rows.push({ label: t(`review.categories.${addon.category}`), value })
  }
  return rows
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <!-- Validation summary sits above the heading (per the design), surfaced
         only after a submit attempt -->
    <div
      v-if="showErrors"
      id="review-error-banner"
      role="alert"
      tabindex="-1"
      class="flex flex-col gap-2 rounded-[6px] border border-solid border-danger-muted bg-danger-muted-rest p-4 text-danger outline-none"
    >
      <p class="m-0 text-sm font-medium">{{ $t('review.banner.title') }}</p>
      <ul class="m-0 flex list-none flex-col gap-2 p-0">
        <li v-for="(item, i) in bannerIssues" :key="i" class="text-sm font-regular">
          • {{ $t('review.banner.line', { step: item.step, message: item.text }) }}
        </li>
      </ul>
    </div>

    <h2 class="q-my-none text-h3 font-bold text-neutral">{{ $t('review.title') }}</h2>

    <!-- Attendee Information -->
    <ReviewSection
      :title="$t('review.sections.attendee')"
      :step="1"
      :has-error="stepHasError[1]"
      @navigate="$emit('navigate', $event)"
    >
      <div
        v-for="row in attendeeRows"
        :key="row.label"
        class="flex items-start justify-between gap-4 text-[12px] font-regular leading-[16px]"
      >
        <span class="shrink-0 text-neutral-muted">{{ row.label }}</span>
        <span
          class="text-right"
          :class="row.value ? 'text-neutral' : showErrors ? 'text-danger' : 'text-neutral-muted'"
        >
          {{ row.value || $t('review.required') }}
        </span>
      </div>
    </ReviewSection>

    <!-- Selected Sessions -->
    <ReviewSection
      :title="$t('review.sections.sessions')"
      :step="2"
      :has-error="stepHasError[2]"
      @navigate="$emit('navigate', $event)"
    >
      <div
        v-for="row in sessionRows"
        :key="row.value"
        class="flex items-start justify-between gap-4 text-[12px] font-regular leading-[16px]"
      >
        <span class="shrink-0 text-neutral-muted">{{ row.label }}</span>
        <span class="text-right text-neutral">{{ row.value }}</span>
      </div>
      <p v-if="!sessionRows.length" class="m-0 text-[12px] leading-[16px] text-neutral-quiet">
        {{ $t('review.empty.sessions') }}
      </p>
    </ReviewSection>

    <!-- Add-ons -->
    <ReviewSection
      :title="$t('review.sections.addons')"
      :step="3"
      :has-error="stepHasError[3]"
      @navigate="$emit('navigate', $event)"
    >
      <div
        v-for="row in addonRows"
        :key="row.value"
        class="flex items-start justify-between gap-4 text-[12px] font-regular leading-[16px]"
      >
        <span class="shrink-0 text-neutral-muted">{{ row.label }}</span>
        <span class="text-right text-neutral">{{ row.value }}</span>
      </div>
      <p v-if="!addonRows.length" class="m-0 text-[12px] leading-[16px] text-neutral-quiet">
        {{ $t('review.empty.addons') }}
      </p>
    </ReviewSection>

    <!-- Pricing Summary (no Edit link — it mirrors the choices above) -->
    <section
      class="flex flex-col gap-2 rounded-[6px] border border-solid border-neutral-muted bg-surface-l1 p-5"
    >
      <h3 class="m-0 text-subtitle1 text-neutral">{{ $t('review.pricing.title') }}</h3>

      <div
        v-if="summary.ticket"
        class="flex items-start justify-between gap-4 text-[12px] font-regular leading-[16px] text-neutral-muted"
      >
        <span>{{ $t('review.pricing.ticket', { name: summary.ticket.name }) }}</span>
        <span>{{ formatCurrency(summary.ticket.amount) }}</span>
      </div>

      <div
        v-for="line in summary.lines"
        :key="line.id"
        class="flex items-start justify-between gap-4 text-[12px] leading-[16px]"
        :class="line.kind === 'merchandise' ? 'font-medium text-brand-emphasis' : 'font-regular text-neutral-muted'"
      >
        <span>{{ line.kind === 'merchandise' ? `${line.name} × ${line.quantity}` : line.name }}</span>
        <span>{{ formatCurrency(line.amount) }}</span>
      </div>

      <div
        v-if="summary.discount > 0"
        class="flex items-start justify-between gap-4 text-[11px] leading-[14px] text-brand-emphasis"
      >
        <span>{{ $t('review.pricing.workshopDiscount') }}</span>
        <span>-{{ formatCurrency(summary.discount) }}</span>
      </div>

      <div class="h-px w-full bg-[var(--divider-muted)]" />

      <div
        class="flex items-start justify-between gap-4 text-[12px] font-medium leading-[16px] text-neutral"
      >
        <span>{{ $t('review.pricing.total') }}</span>
        <span>{{ formatCurrency(summary.total) }}</span>
      </div>
    </section>
  </section>
</template>
