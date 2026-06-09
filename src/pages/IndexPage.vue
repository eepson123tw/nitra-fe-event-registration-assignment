<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { provideRegistration } from '../composables/useRegistration.js'
import AppHeader from '../components/AppHeader.vue'
import WizardStepper from '../components/WizardStepper.vue'
import StepAttendeeInfo from '../components/steps/attendee/StepAttendeeInfo.vue'
import StepSessionSelection from '../components/steps/sessions/StepSessionSelection.vue'
import StepAddons from '../components/steps/addons/StepAddons.vue'
import StepReview from '../components/steps/review/StepReview.vue'

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
  <div class="flex flex-col min-h-screen bg-surface-l0">
    <AppHeader />
    <WizardStepper :steps="steps" :current="current" @navigate="goTo" />

    <!-- Step content -->
    <main class="col-grow full-width q-px-md">
      <div class="wizard-shell py-[40px]">
        <component :is="currentComponent" />
      </div>
    </main>

    <!-- Footer navigation -->
    <footer class="bg-surface-l0 q-px-md divider-t">
      <div
        class="row items-center q-py-md wizard-shell"
        :class="isFirstStep ? 'justify-end' : 'justify-between'"
      >
        <q-btn
          v-if="!isFirstStep"
          unelevated
          no-caps
          :label="$t('nav.back')"
          padding="10px 16px"
          class="bg-surface-l2 rounded-[10px] text-md font-medium text-neutral"
          @click="goBack"
        />
        <q-btn
          v-if="!isLastStep"
          unelevated
          no-caps
          color="accent"
          :label="nextLabel"
          padding="10px 16px"
          class="rounded-[10px] text-md font-semibold"
          @click="goNext"
        />
        <q-btn
          v-else
          unelevated
          no-caps
          color="accent"
          :label="$t('nav.submit')"
          padding="10px 16px"
          class="rounded-[10px] text-md font-semibold"
          @click="onSubmit"
        />
      </div>
    </footer>
  </div>
</template>
