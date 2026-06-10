// Unified validation for the whole wizard, expressed as a zod schema.
//
// Per the spec, nothing validates inline — Step 4 runs this across every step
// at submit time (vee-validate drives the run; see useRegistration.js). The
// schema is the single source of rules; messages are i18n KEYS (translated in
// the view layer). Field-format rules and the cross-step business rules
// (conditional shipping, session time conflicts, merchandise size) all live in
// one superRefine so each path yields a single, predictable issue.
import { z } from 'zod'
import { sessions } from '../mocks/sessions.js'
import { addons } from '../mocks/addons.js'
import { intervalsOverlap, findOverlappingIds } from './datetime.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Lenient phone check: 7–15 digits, optionally with +, spaces, (), or -. */
function isValidPhone(value) {
  if (!/^[+\d][\d\s()-]*$/.test(value)) return false
  const digits = value.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}

const MERCH_IDS = new Set(
  addons.filter((a) => a.category === 'merchandise').map((a) => a.id),
)

/** Whether any selected add-on is merchandise (which makes shipping required). */
export function hasMerchandiseSelected(state) {
  return Object.entries(state.addons ?? {}).some(
    ([id, sel]) => MERCH_IDS.has(id) && sel.quantity > 0,
  )
}

/**
 * Does a workshop's time slot overlap any session the user has selected?
 * Sessions are the primary schedule — a workshop that clashes is "unavailable".
 * Shared by Step 3's availability display and the store's auto-prune.
 */
export function workshopConflictsWithSessions(workshop, state) {
  if (workshop.category !== 'workshop' || !workshop.date) return false
  return sessions.some(
    (s) =>
      state.selectedSessionIds.includes(s.id) &&
      intervalsOverlap(workshop.date, workshop.endDate, s.date, s.endDate),
  )
}

/** Ids of currently-selected workshops that now clash with a selected session. */
export function conflictingSelectedWorkshopIds(state) {
  return addons
    .filter((a) => a.category === 'workshop' && state.addons[a.id]?.quantity > 0)
    .filter((w) => workshopConflictsWithSessions(w, state))
    .map((w) => w.id)
}

/** Maps each schema path to the wizard step it belongs to (drives the stepper + banner). */
export const STEP_BY_FIELD = {
  fullName: 1,
  email: 1,
  phone: 1,
  company: 1,
  jobTitle: 1,
  ticketType: 1,
  shippingAddress: 1,
  sessions: 2,
  addons: 3,
}

/** Stable display order for the error banner — STEP_BY_FIELD's key order is the display order. */
export const FIELD_ORDER = Object.keys(STEP_BY_FIELD)

/** Flatten the reactive store into the plain object the schema validates. */
export function toFormValues(state) {
  const a = state.attendee
  return {
    fullName: a.fullName,
    email: a.email,
    phone: a.phone,
    company: a.company,
    jobTitle: a.jobTitle,
    shippingAddress: a.shippingAddress,
    ticketType: state.ticketTypeId,
    sessions: state.selectedSessionIds,
    addons: state.addons,
  }
}

export const registrationSchema = z
  .object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    company: z.string(),
    jobTitle: z.string(),
    shippingAddress: z.string(),
    ticketType: z.string().nullable(),
    sessions: z.array(z.string()),
    addons: z.record(z.string(), z.any()),
  })
  .superRefine((v, ctx) => {
    const fail = (field, message) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message })

    // ── Step 1: attendee info + ticket type ──
    if (!v.fullName.trim()) fail('fullName', 'review.errors.fullName')

    if (!v.email.trim()) fail('email', 'review.errors.emailRequired')
    else if (!EMAIL_RE.test(v.email.trim())) fail('email', 'review.errors.emailInvalid')

    if (!v.phone.trim()) fail('phone', 'review.errors.phoneRequired')
    else if (!isValidPhone(v.phone.trim())) fail('phone', 'review.errors.phoneInvalid')

    if (!v.company.trim()) fail('company', 'review.errors.company')
    if (!v.jobTitle.trim()) fail('jobTitle', 'review.errors.jobTitle')
    if (!v.ticketType) fail('ticketType', 'review.errors.ticketType')

    if (hasMerchandiseSelected({ addons: v.addons }) && !v.shippingAddress.trim()) {
      fail('shippingAddress', 'review.errors.shipping')
    }

    // ── Step 2: time conflicts among selected sessions ──
    const selected = sessions.filter((s) => v.sessions.includes(s.id))
    if (findOverlappingIds(selected).size > 0) fail('sessions', 'review.errors.sessionConflict')

    // ── Step 3: merchandise with sizes selected but no size chosen ──
    // One issue per offending item (path `addons.<id>`) so each card can show
    // its own inline error, not just the aggregate banner line.
    for (const a of addons) {
      if (a.sizes?.length && v.addons[a.id]?.quantity > 0 && !v.addons[a.id].size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['addons', a.id],
          message: 'review.errors.addonSize',
        })
      }
    }
  })
