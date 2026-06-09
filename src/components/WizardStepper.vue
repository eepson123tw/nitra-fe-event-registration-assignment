<script setup>
/**
 * Horizontal progress indicator for the wizard.
 * Completed steps show a check, the active step shows its number, upcoming
 * steps are muted. Clicking a step header requests navigation to it.
 */
defineProps({
  /** @type {{ key: string, label: string }[]} */
  steps: { type: Array, required: true },
  /** 1-based index of the active step. */
  current: { type: Number, required: true },
})

const emit = defineEmits(['navigate'])

function stateOf(index, current) {
  if (index < current) return 'done'
  if (index === current) return 'active'
  return 'upcoming'
}
</script>

<template>
  <nav class="bg-surface-l0 q-px-md divider-b">
    <ol class="row no-wrap items-center q-py-lg wizard-shell my-0">
      <li
        v-for="(step, i) in steps"
        :key="step.key"
        class="row items-center"
        :class="{ 'col-grow': i < steps.length - 1 }"
      >
        <button
          type="button"
          class="row items-center no-wrap bg-transparent border-none cursor-pointer q-pa-none"
          @click="emit('navigate', i + 1)"
        >
          <!-- Circle -->
          <span
            class="flex flex-center text-md font-semibold rounded-full"
            style="width: 32px; height: 32px"
            :class="stateOf(i + 1, current) === 'upcoming'
              ? 'bg-surface-l2 text-neutral-quiet'
              : 'bg-brand-emphasis-rest text-inverse'"
          >
            <q-icon v-if="stateOf(i + 1, current) === 'done'" name="check" size="18px" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <!-- Label: done + active share the selected (dark) style; only
               upcoming steps stay muted. -->
          <span
            class="q-ml-sm text-md whitespace-nowrap"
            :class="stateOf(i + 1, current) === 'upcoming'
              ? 'font-medium text-neutral-quiet'
              : 'font-semibold text-neutral'"
          >
            {{ step.label }}
          </span>
        </button>
        <!-- Connector: 2px line; turns brand-coloured once its preceding step
             is completed, otherwise stays a muted surface-L2 line. -->
        <span
          v-if="i < steps.length - 1"
          class="col-grow q-mx-md"
          style="height: 2px; border-radius: 1px"
          :class="i + 1 < current ? 'bg-brand-emphasis-rest' : 'bg-surface-l2'"
        />
      </li>
    </ol>
  </nav>
</template>
