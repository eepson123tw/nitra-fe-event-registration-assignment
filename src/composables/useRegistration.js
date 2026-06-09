import { reactive, ref, computed, watch, provide, inject } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  registrationSchema,
  toFormValues,
  STEP_BY_FIELD,
  FIELD_ORDER,
  conflictingSelectedWorkshopIds,
} from '../utils/validation.js'

/**
 * @typedef {Object} AttendeeInfo
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} company
 * @property {string} jobTitle
 * @property {string} shippingAddress  Optional; required once merchandise is selected.
 *
 * @typedef {Object} AddonSelection
 * @property {number} quantity         Selected quantity (>= 1 when present).
 * @property {string|null} size        Selected size, for items that offer sizes.
 *
 * @typedef {Object} RegistrationState
 * @property {AttendeeInfo} attendee
 * @property {string|null} ticketTypeId           One of the ticket type ids (general/vip/student).
 * @property {string[]} selectedSessionIds        Ids of chosen sessions.
 * @property {Record<string, AddonSelection>} addons  Add-on id -> selection.
 * @property {boolean} validationAttempted        Flipped true once Step 4 runs the unified validation.
 *
 * @typedef {Object} RegistrationStore
 * @property {RegistrationState} state
 * @property {import('vue').ComputedRef<{ issues: object[], fields: object, stepHasError: object, hasErrors: boolean }>} validation
 * @property {() => Promise<{ valid: boolean, errors: object }>} validateAll  Runs the schema over the whole store.
 * @property {() => void} resetValidation  Clears validation errors + form state.
 */

/**
 * Reshape vee-validate's flat `{ path: messageKey }` errors into the structure
 * the views consume: a step-tagged issue list, a per-field lookup, and which
 * steps have errors (for the stepper marks).
 */
function buildValidation(errors) {
  // Paths may be nested (e.g. "addons.merch1"); the step + ordering key off the
  // top-level segment.
  const base = (field) => field.split('.')[0]
  const issues = Object.entries(errors)
    .filter(([, messageKey]) => messageKey)
    .map(([field, messageKey]) => ({
      field,
      messageKey,
      step: STEP_BY_FIELD[base(field)] ?? 1,
    }))
    .sort(
      (a, b) =>
        a.step - b.step || FIELD_ORDER.indexOf(base(a.field)) - FIELD_ORDER.indexOf(base(b.field)),
    )
  const fields = {}
  const stepHasError = { 1: false, 2: false, 3: false }
  for (const it of issues) {
    if (!fields[it.field]) fields[it.field] = { messageKey: it.messageKey }
    stepHasError[it.step] = true
  }
  return { issues, fields, stepHasError, hasErrors: issues.length > 0 }
}

/** Injection key for the shared registration store. */
export const REGISTRATION_KEY = Symbol('registration')

/**
 * Create the initial, empty wizard state.
 * @returns {RegistrationState}
 */
function createState() {
  return reactive({
    attendee: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      shippingAddress: '',
    },
    ticketTypeId: null,
    selectedSessionIds: [],
    addons: {},
    validationAttempted: false,
  })
}

/**
 * Create the registration store and provide it to descendant components.
 * Call once, from the wizard host component (IndexPage).
 * @returns {RegistrationStore} the shared store
 */
export function provideRegistration() {
  const state = createState()

  // vee-validate owns the validation run; the zod schema is the rule source.
  // Inputs stay bound to the store (not to vee-validate fields), so we feed the
  // flattened values in and validate imperatively rather than per-field.
  const form = useForm({ validationSchema: toTypedSchema(registrationSchema) })

  // Latest flat errors ({ path: messageKey }) surfaced to every step.
  const errorMap = ref({})
  async function validateAll() {
    form.setValues(toFormValues(state), false)
    const result = await form.validate()
    errorMap.value = result.errors ?? {}
    return result
  }

  // After the first submit attempt, re-validate as the user edits so errors
  // clear (and reappear) live — validation stays deferred until then.
  watch(
    () => toFormValues(state),
    () => {
      if (state.validationAttempted) validateAll()
    },
    { deep: true },
  )

  // Sessions are the primary schedule: when a session selection makes an
  // already-chosen workshop overlap, that workshop becomes "unavailable" and is
  // dropped from the order (it can't be in two places at once). This keeps the
  // invariant "no selected workshop clashes with a selected session" in both
  // directions — Step 3 prevents adding a clashing one; this prunes the reverse.
  watch(
    () => state.selectedSessionIds,
    () => {
      for (const id of conflictingSelectedWorkshopIds(state)) delete state.addons[id]
    },
    { deep: true },
  )

  // Clear validation state (used when restarting the wizard) so a prior run's
  // errors don't linger in the form/errorMap.
  function resetValidation() {
    errorMap.value = {}
    form.resetForm()
  }

  const validation = computed(() => buildValidation(errorMap.value))
  /** @type {RegistrationStore} */
  const store = { state, validation, validateAll, resetValidation }
  provide(REGISTRATION_KEY, store)
  return store
}

/**
 * Inject the shared registration store. Call from any step/descendant component.
 * @returns {RegistrationStore}
 * @throws {Error} when no ancestor has called provideRegistration()
 */
export function useRegistration() {
  const store = inject(REGISTRATION_KEY)
  if (!store) {
    throw new Error('useRegistration() must be used under a component that called provideRegistration()')
  }
  return store
}
