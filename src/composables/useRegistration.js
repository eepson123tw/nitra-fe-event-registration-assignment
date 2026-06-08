import { reactive, provide, inject } from 'vue'

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
 */

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
  /** @type {RegistrationStore} */
  const store = { state }
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
