<script setup>
// Step 3 — Add-ons: workshops / meals / merchandise grouped under category
// tabs, with a live order summary. Workshops are disabled when sold out or
// when they overlap a session selected in Step 2.
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { addons } from '../../../mocks/addons.js'
import { sessions } from '../../../mocks/sessions.js'
import { useRegistration } from '../../../composables/useRegistration.js'
import { intervalsOverlap } from '../../../utils/datetime.js'
import { hasMerchandiseSelected } from '../../../utils/validation.js'
import AddonCard from './AddonCard.vue'
import MerchandiseCard from './MerchandiseCard.vue'
import OrderSummary from '../../OrderSummary.vue'

const { t } = useI18n()
const { state, validation } = useRegistration()

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
  for (const a of addons) map[a.category]?.push(a)
  return map
})

// Sessions chosen in Step 2 — used to flag workshop time conflicts.
const selectedSessions = computed(() =>
  sessions.filter((s) => state.selectedSessionIds.includes(s.id)),
)
function isWorkshopConflict(addon) {
  return selectedSessions.value.some((s) =>
    intervalsOverlap(addon.date, addon.endDate, s.date, s.endDate),
  )
}

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

// Category tabs: roving tabindex + arrow-key navigation.
const tabRefs = ref([])
function setTabRef(el, i) {
  tabRefs.value[i] = el
}
function onTabKeydown(e) {
  const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
  const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
  if (!forward && !backward) return
  e.preventDefault()
  const cur = categories.findIndex((c) => c.key === activeCategory.value)
  const next = (cur + (forward ? 1 : -1) + categories.length) % categories.length
  activeCategory.value = categories[next].key
  tabRefs.value[next]?.focus()
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <h2 class="q-my-none text-h3 font-bold text-neutral">{{ $t('addons.sectionTitle') }}</h2>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      <!-- Left: category tabs + the active category's add-ons -->
      <div class="flex flex-col gap-6">
        <div
          role="tablist"
          :aria-label="$t('addons.sectionTitle')"
          class="row items-center gap-1 self-start rounded-[10px] bg-surface-l2 p-1"
          @keydown="onTabKeydown"
        >
          <button
            v-for="(c, i) in categories"
            :key="c.key"
            :ref="(el) => setTabRef(el, i)"
            type="button"
            role="tab"
            :aria-selected="activeCategory === c.key"
            :tabindex="activeCategory === c.key ? 0 : -1"
            class="cursor-pointer rounded-2 border-none px-5 py-2 text-[13px]"
            :class="activeCategory === c.key
              ? 'bg-brand-emphasis-rest text-inverse font-semibold'
              : 'bg-transparent text-neutral-muted font-medium'"
            @click="activeCategory = c.key"
          >
            {{ c.label }}
          </button>
        </div>

        <div role="tabpanel" class="flex flex-col gap-6">
          <!-- Workshops / Meals: selectable cards -->
          <template v-if="activeCategory !== 'merchandise'">
            <AddonCard
              v-for="a in byCategory[activeCategory]"
              :key="a.id"
              :addon="a"
              :selected="isSelected(a.id)"
              :disabled="statusFor(a).disabled"
              :status="statusFor(a).text"
              :status-tone="statusFor(a).tone"
              @toggle="toggleAddon"
            />
          </template>

          <!-- Merchandise: shipping banner (once anything is added) + qty cards -->
          <template v-else>
            <div
              v-if="anyMerchSelected"
              role="note"
              class="flex items-start gap-3 rounded-2 border border-solid border-info-opacity bg-info-subtle-rest p-4"
            >
              <q-icon name="info" size="20px" class="shrink-0 text-blue-500" />
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <p class="m-0 text-md font-semibold text-neutral">{{ $t('addons.banner.title') }}</p>
                <p class="m-0 text-md text-neutral">{{ $t('addons.banner.text') }}</p>
              </div>
            </div>
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
