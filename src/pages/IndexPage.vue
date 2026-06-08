<script setup>
import { ref, computed } from 'vue'
import { provideRegistration } from '../composables/useRegistration.js'
import StepAttendeeInfo from '../components/steps/StepAttendeeInfo.vue'
import StepSessionSelection from '../components/steps/StepSessionSelection.vue'
import StepAddons from '../components/steps/StepAddons.vue'
import StepReview from '../components/steps/StepReview.vue'

// Create + provide the shared wizard state for all steps.
provideRegistration()

const STEP_COUNT = 4
const step = ref(1)

const isFirstStep = computed(() => step.value === 1)
const isLastStep = computed(() => step.value === STEP_COUNT)

function goNext() {
  if (step.value < STEP_COUNT) step.value += 1
}

function goBack() {
  if (step.value > 1) step.value -= 1
}

function onSubmit() {
  // Unified validation + submission handled in the Review phase.
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center q-pa-md">
        <q-stepper
          v-model="step"
          animated
          flat
          header-nav
          class="full-width"
          style="max-width: 900px"
        >
          <q-step :name="1" :title="$t('steps.attendee.label')" icon="person" :done="step > 1">
            <StepAttendeeInfo />
          </q-step>

          <q-step :name="2" :title="$t('steps.sessions.label')" icon="event" :done="step > 2">
            <StepSessionSelection />
          </q-step>

          <q-step :name="3" :title="$t('steps.addons.label')" icon="add_shopping_cart" :done="step > 3">
            <StepAddons />
          </q-step>

          <q-step :name="4" :title="$t('steps.review.label')" icon="fact_check">
            <StepReview />
          </q-step>

          <template #navigation>
            <q-stepper-navigation class="row justify-between">
              <q-btn
                flat
                :label="$t('nav.back')"
                :disable="isFirstStep"
                @click="goBack"
              />
              <q-btn
                v-if="!isLastStep"
                color="primary"
                :label="$t('nav.continue')"
                @click="goNext"
              />
              <q-btn
                v-else
                color="primary"
                :label="$t('nav.submit')"
                @click="onSubmit"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
