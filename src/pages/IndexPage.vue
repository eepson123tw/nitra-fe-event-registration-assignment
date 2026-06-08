<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { provideRegistration } from '../composables/useRegistration.js'
import AppHeader from '../components/AppHeader.vue'
import WizardStepper from '../components/WizardStepper.vue'
import StepAttendeeInfo from '../components/steps/StepAttendeeInfo.vue'
import StepSessionSelection from '../components/steps/StepSessionSelection.vue'
import StepAddons from '../components/steps/StepAddons.vue'
import StepReview from '../components/steps/StepReview.vue'

const { t } = useI18n()

// Create + provide the shared wizard state for all steps.
provideRegistration()

// Step registry: order drives the stepper, the rendered component, and the
// "next" button label. `nextLabel` is null on the final step (shows submit).
const stepDefs = [
  { key: 'attendee', component: StepAttendeeInfo, nextKey: 'sessions' },
  { key: 'sessions', component: StepSessionSelection, nextKey: 'addons' },
  { key: 'addons', component: StepAddons, nextKey: 'review' },
  { key: 'review', component: StepReview, nextKey: null },
]
const STEP_COUNT = stepDefs.length

const current = ref(1)

const steps = computed(() =>
  stepDefs.map((s) => ({ key: s.key, label: t(`steps.${s.key}.label`) })),
)
const currentDef = computed(() => stepDefs[current.value - 1])
const currentComponent = computed(() => currentDef.value.component)
const isFirstStep = computed(() => current.value === 1)
const isLastStep = computed(() => current.value === STEP_COUNT)
const nextLabel = computed(() => t(`nav.next.${currentDef.value.nextKey}`))

function goTo(step) {
  if (step >= 1 && step <= STEP_COUNT) current.value = step
}
function goNext() {
  goTo(current.value + 1)
}
function goBack() {
  goTo(current.value - 1)
}
function onSubmit() {
  // Unified validation + submission handled in the Review phase.
}
</script>

<template>
  <div class="flex flex-col" style="min-height: 100vh; background: var(--bg-surface-l0)">
    <AppHeader />
    <WizardStepper :steps="steps" :current="current" @navigate="goTo" />

    <!-- Step content -->
    <main class="col-grow full-width q-px-md">
      <div class="q-mx-auto py-[40px]" style="max-width: 1200px">
        <component :is="currentComponent" />
      </div>
    </main>

    <!-- Footer navigation -->
    <footer class="bg-surface-l0 q-px-md" style="border-top: 1px solid var(--divider-default)">
      <div
        class="row items-center q-mx-auto q-py-md"
        :class="isFirstStep ? 'justify-end' : 'justify-between'"
        style="max-width: 1200px"
      >
        <q-btn
          v-if="!isFirstStep"
          flat
          no-caps
          :label="$t('nav.back')"
          class="text-md font-medium text-neutral"
          @click="goBack"
        />
        <q-btn
          v-if="!isLastStep"
          unelevated
          no-caps
          color="accent"
          :label="nextLabel"
          class="q-px-lg q-py-sm rounded-[10px] text-md font-semibold"
          @click="goNext"
        />
        <q-btn
          v-else
          unelevated
          no-caps
          color="accent"
          :label="$t('nav.submit')"
          class="q-px-lg q-py-sm rounded-[10px] text-md font-semibold"
          @click="onSubmit"
        />
      </div>
    </footer>
  </div>
</template>
