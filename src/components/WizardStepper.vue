<script setup>
/**
 * Horizontal progress indicator for the wizard.
 * Completed steps show a check, the active step shows its number, upcoming
 * steps are muted. Clicking a step header requests navigation to it.
 */
import { computed } from 'vue'

const props = defineProps({
  /** @type {{ key: string, label: string }[]} */
  steps: { type: Array, required: true },
  /** 1-based index of the active step. */
  current: { type: Number, required: true },
})

const emit = defineEmits(['navigate'])

// Derive each step's state once so the template doesn't recompute it per class
// binding. `done` also marks whether the trailing connector is filled.
const items = computed(() =>
  props.steps.map((step, i) => ({
    ...step,
    index: i + 1,
    done: i + 1 < props.current,
    active: i + 1 === props.current,
    upcoming: i + 1 > props.current,
    isLast: i === props.steps.length - 1,
  })),
)
</script>

<template>
  <nav class="bg-surface-l0 q-px-md divider-b">
    <ol class="row no-wrap items-center q-py-lg wizard-shell my-0">
      <li
        v-for="item in items"
        :key="item.key"
        class="row items-center"
        :class="{ 'col-grow': !item.isLast }"
      >
        <button
          type="button"
          class="row items-center no-wrap bg-transparent border-none cursor-pointer q-pa-none"
          @click="emit('navigate', item.index)"
        >
          <!-- Circle -->
          <span
            class="flex flex-center text-md font-semibold rounded-full"
            style="width: 32px; height: 32px"
            :class="item.upcoming
              ? 'bg-surface-l2 text-neutral-quiet'
              : 'bg-brand-emphasis-rest text-inverse'"
          >
            <q-icon v-if="item.done" name="check" size="18px" />
            <template v-else>{{ item.index }}</template>
          </span>
          <!-- Label: done + active share the selected (dark) style; only
               upcoming steps stay muted. Below the tablet breakpoint every
               label except the active one collapses, so the stepper can't
               overflow on small screens. -->
          <span
            class="step-label q-ml-sm text-md whitespace-nowrap"
            :class="[
              item.upcoming ? 'font-medium text-neutral-quiet' : 'font-semibold text-neutral',
              { 'step-label--active': item.active },
            ]"
          >
            {{ item.label }}
          </span>
        </button>
        <!-- Connector: 2px line; turns brand-coloured once its preceding step
             is completed, otherwise stays a muted surface-L2 line. -->
        <span
          v-if="!item.isLast"
          class="step-connector col-grow q-mx-md"
          style="height: 2px; border-radius: 1px"
          :class="item.done ? 'bg-brand-emphasis-rest' : 'bg-surface-l2'"
        />
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* Below the tablet breakpoint, collapse every label except the active step's
   so the horizontal stepper can't overflow on small screens. */
@media (max-width: 767px) {
  .step-label:not(.step-label--active) {
    display: none;
  }
  /* Tighter connectors so circles + the single active label still fit. */
  .step-connector {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>
