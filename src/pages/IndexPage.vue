<script setup>
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { provideRegistration } from '../composables/useRegistration.js'
import AppHeader from '../components/AppHeader.vue'
import WizardStepper from '../components/WizardStepper.vue'
import StepAttendeeInfo from '../components/steps/attendee/StepAttendeeInfo.vue'
import StepSessionSelection from '../components/steps/sessions/StepSessionSelection.vue'
import StepAddons from '../components/steps/addons/StepAddons.vue'
import StepReview from '../components/steps/review/StepReview.vue'
import SuccessScreen from '../components/steps/review/SuccessScreen.vue'

const { t } = useI18n()

// Create + provide the shared wizard state for all steps.
const { state, validation, validateAll, resetValidation } = provideRegistration()

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
// Set once submission succeeds — swaps the wizard for the confirmation screen.
const submitted = ref(false)
const confirmationCode = ref('')

const steps = computed(() =>
  stepDefs.map((s) => ({ key: s.key, label: t(`steps.${s.key}.label`) })),
)
// Steps to flag red in the stepper — only after a submit has been attempted.
const errorSteps = computed(() =>
  state.validationAttempted
    ? [1, 2, 3].filter((s) => validation.value.stepHasError[s])
    : [],
)
// Submit stays enabled for the first attempt (so it can reveal the errors);
// once errors are showing, it's disabled until they're all resolved (the
// post-attempt watch keeps validity live as the user fixes fields).
const submitDisabled = computed(
  () => state.validationAttempted && validation.value.hasErrors,
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
async function onSubmit() {
  // Run unified validation across all steps (vee-validate + zod). On failure,
  // surface errors in place (banner + red stepper) so the user can jump to any
  // offending step; on success, generate a confirmation and show the success.
  state.validationAttempted = true
  const { valid } = await validateAll()
  if (!valid) {
    // The error banner lives at the top of the review; the Submit button is at
    // the bottom of a long page. Bring the banner into view (and focus it for
    // screen readers) so the validation result is obvious, not silent.
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.getElementById('review-error-banner')?.focus({ preventScroll: true })
    })
    return
  }
  confirmationCode.value = `TC2025-${Math.floor(10000 + Math.random() * 90000)}`
  submitted.value = true
}

function restart() {
  // Reset to a clean wizard for a fresh registration.
  Object.assign(state.attendee, {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    shippingAddress: '',
  })
  state.ticketTypeId = null
  state.selectedSessionIds = []
  state.addons = {}
  state.validationAttempted = false
  resetValidation()
  submitted.value = false
  confirmationCode.value = ''
  current.value = 1
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-surface-l0">
    <!-- Header stays; the stepper shows only while moving through the wizard.
         Pinned so the user keeps their place on long steps. -->
    <div class="sticky top-0 z-10 bg-surface-l0">
      <AppHeader />
      <WizardStepper
        v-if="!submitted"
        :steps="steps"
        :current="current"
        :error-steps="errorSteps"
        @navigate="goTo"
      />
    </div>

    <!-- Confirmation screen: centred in the area left below the header -->
    <Transition name="success">
      <SuccessScreen v-if="submitted" :code="confirmationCode" @restart="restart" />
    </Transition>

    <template v-if="!submitted">
      <!-- Step content (animated on step change) -->
      <main class="col-grow full-width q-px-md">
        <div class="wizard-shell py-10">
          <Transition name="step" mode="out-in">
            <component :is="currentComponent" :key="current" @navigate="goTo" />
          </Transition>
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
          class="bg-surface-l2 rounded-[10px] text-md font-medium text-neutral transition-colors duration-150 hover:bg-surface-l3"
          @click="goBack"
        />
        <q-btn
          v-if="!isLastStep"
          unelevated
          no-caps
          color="accent"
          :label="nextLabel"
          padding="10px 16px"
          class="rounded-[10px] text-md font-semibold transition-all duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0"
          @click="goNext"
        />
        <q-btn
          v-else
          unelevated
          no-caps
          color="accent"
          :label="$t('nav.submit')"
          :disable="submitDisabled"
          padding="10px 16px"
          class="rounded-[10px] text-md font-semibold transition-all duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0"
          @click="onSubmit"
        />
      </div>
      </footer>
    </template>
  </div>
</template>
