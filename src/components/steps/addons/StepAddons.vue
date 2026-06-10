<script setup>
// Step 3 — Add-ons: workshops / meals / merchandise grouped under category
// tabs, with a live order summary. Workshops are disabled when sold out or
// when they overlap a session selected in Step 2.
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from '../../../composables/useRegistration.js'
import { useCatalog } from '../../../composables/useCatalog.js'
import { hasMerchandiseSelected, workshopConflictsWithSessions } from '../../../utils/validation.js'
import TabPills from '../../TabPills.vue'
import InfoNote from './InfoNote.vue'
import AddonCard from './AddonCard.vue'
import MerchandiseCard from './MerchandiseCard.vue'
import OrderSummary from '../../OrderSummary.vue'

const { t } = useI18n()
const { state, validation } = useRegistration()
const { addons } = useCatalog()

// Inline "select a size" error for a specific merchandise item — sourced from
// the shared validation (path `addons.<id>`) and gated until a submit attempt.
function sizeError(id) {
  const f = validation.value.fields[`addons.${id}`]
  return state.validationAttempted && f ? t(f.messageKey) : ''
}

const categories = [
  { key: 'workshop', label: t('addons.tabs.workshop') },
  { key: 'meal', label: t('addons.tabs.meal') },
  { key: 'merchandise', label: t('addons.tabs.merchandise') },
]
const activeCategory = ref('workshop')

const byCategory = computed(() => {
  const map = { workshop: [], meal: [], merchandise: [] }
  for (const a of addons.value) map[a.category]?.push(a)
  return map
})

// A workshop is unavailable when its slot overlaps a session chosen in Step 2
// (shared rule — the store auto-removes one that becomes conflicting).
function isWorkshopConflict(addon) {
  return workshopConflictsWithSessions(addon, state)
}
// Any workshop currently unavailable because of a session clash — drives the
// reminder banner (incl. when an added workshop was just auto-removed).
const hasWorkshopConflict = computed(() =>
  byCategory.value.workshop.some((w) => isWorkshopConflict(w)),
)

function isSelected(id) {
  const sel = state.addons[id]
  return !!sel && sel.quantity > 0
}

// Per-card status + disabled state (workshops only carry a status line).
function statusFor(addon) {
  if (addon.category !== 'workshop') return { text: '', tone: 'quiet', disabled: false }
  if (addon.registered >= addon.capacity) {
    return { text: t('addons.soldOut'), tone: 'danger', disabled: true }
  }
  if (isWorkshopConflict(addon)) {
    return { text: t('addons.unavailable'), tone: 'danger', disabled: true }
  }
  const remaining = addon.capacity - addon.registered
  return { text: t('addons.spotsRemaining', { count: remaining }, remaining), tone: 'quiet', disabled: false }
}

// Per-card status computed once each (not re-evaluated 3× per card in the
// template's :disabled / :status / :status-tone bindings).
const cardStatus = computed(() =>
  Object.fromEntries(addons.value.map((a) => [a.id, statusFor(a)])),
)

function toggleAddon(id) {
  if (state.addons[id]) delete state.addons[id]
  else state.addons[id] = { quantity: 1, size: null }
}
function updateMerch(id, { quantity, size }) {
  if (quantity > 0) state.addons[id] = { quantity, size }
  else delete state.addons[id]
}

// Shared with the validator so the banner and the shipping-required rule agree.
const anyMerchSelected = computed(() => hasMerchandiseSelected(state))
</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="q-my-none text-h3 font-bold text-neutral">{{ $t('addons.sectionTitle') }}</h2>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      <!-- Left: category tabs + the active category's add-ons -->
      <div class="flex flex-col gap-6">
        <TabPills v-model="activeCategory" :tabs="categories" :aria-label="$t('addons.sectionTitle')" />

        <div role="tabpanel" class="flex flex-col gap-6">
          <!-- Reminder: a workshop overlaps a selected session (any that was
               already added has been removed from the order automatically). -->
          <InfoNote v-if="activeCategory === 'workshop' && hasWorkshopConflict">
            <p class="m-0 text-md text-neutral">{{ $t('addons.workshopConflict') }}</p>
          </InfoNote>

          <!-- Workshops / Meals: selectable cards -->
          <template v-if="activeCategory !== 'merchandise'">
            <AddonCard
              v-for="a in byCategory[activeCategory]"
              :key="a.id"
              :addon="a"
              :selected="isSelected(a.id)"
              :disabled="cardStatus[a.id].disabled"
              :status="cardStatus[a.id].text"
              :status-tone="cardStatus[a.id].tone"
              @toggle="toggleAddon"
            />
          </template>

          <!-- Merchandise: shipping banner (once anything is added) + qty cards -->
          <template v-else>
            <InfoNote v-if="anyMerchSelected">
              <p class="m-0 text-md font-semibold text-neutral">{{ $t('addons.banner.title') }}</p>
              <p class="m-0 text-md text-neutral">{{ $t('addons.banner.text') }}</p>
            </InfoNote>
            <MerchandiseCard
              v-for="a in byCategory.merchandise"
              :key="a.id"
              :addon="a"
              :quantity="state.addons[a.id]?.quantity || 0"
              :size="state.addons[a.id]?.size || ''"
              :error="sizeError(a.id)"
              @update="(payload) => updateMerch(a.id, payload)"
            />
          </template>
        </div>
      </div>

      <!-- Right: live order summary -->
      <OrderSummary class="self-start" />
    </div>
  </section>
</template>
