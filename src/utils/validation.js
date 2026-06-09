// Unified, presentation-free validation for the whole wizard.
//
// Per the spec, no step validates inline — Step 4 runs this across every step
// at submit time. The function is pure (state + mock data in, issues out) and
// returns i18n message keys (+ params) rather than translated strings, so the
// view layer owns all wording. Each issue is tagged with the 1-based step it
// belongs to, which drives both the Review banner and the stepper error marks.
import { sessions } from '../mocks/sessions.js'
import { addons } from '../mocks/addons.js'
import { intervalsOverlap } from './datetime.js'

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
  return Object.entries(state.addons).some(
    ([id, sel]) => MERCH_IDS.has(id) && sel.quantity > 0,
  )
}

/**
 * Validate the entire registration.
 * @returns {{
 *   issues: { step: number, field: string, messageKey: string, params?: object }[],
 *   fields: Record<string, { messageKey: string, params?: object }>,
 *   stepHasError: Record<number, boolean>,
 *   hasErrors: boolean,
 * }}
 */
export function validateRegistration(state) {
  const issues = []
  const a = state.attendee
  const push = (step, field, messageKey, params) =>
    issues.push({ step, field, messageKey, ...(params ? { params } : {}) })

  // ── Step 1: attendee info + ticket type ──
  if (!a.fullName.trim()) push(1, 'fullName', 'review.errors.fullName')

  if (!a.email.trim()) push(1, 'email', 'review.errors.emailRequired')
  else if (!EMAIL_RE.test(a.email.trim())) push(1, 'email', 'review.errors.emailInvalid')

  if (!a.phone.trim()) push(1, 'phone', 'review.errors.phoneRequired')
  else if (!isValidPhone(a.phone.trim())) push(1, 'phone', 'review.errors.phoneInvalid')

  if (!a.company.trim()) push(1, 'company', 'review.errors.company')
  if (!a.jobTitle.trim()) push(1, 'jobTitle', 'review.errors.jobTitle')
  if (!state.ticketTypeId) push(1, 'ticketType', 'review.errors.ticketType')

  if (hasMerchandiseSelected(state) && !a.shippingAddress.trim()) {
    push(1, 'shippingAddress', 'review.errors.shipping')
  }

  // ── Step 2: time conflicts among the selected sessions ──
  const selected = sessions.filter((s) => state.selectedSessionIds.includes(s.id))
  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      const x = selected[i]
      const y = selected[j]
      if (intervalsOverlap(x.date, x.endDate, y.date, y.endDate)) {
        push(2, `conflict:${x.id}:${y.id}`, 'review.errors.sessionConflict', {
          a: x.title,
          b: y.title,
        })
      }
    }
  }

  // ── Step 3: merchandise with sizes selected but no size chosen ──
  for (const addon of addons) {
    if (!addon.sizes?.length) continue
    const sel = state.addons[addon.id]
    if (sel && sel.quantity > 0 && !sel.size) {
      push(3, `size:${addon.id}`, 'review.errors.addonSize', { name: addon.name })
    }
  }

  // Index issues by field (first wins) and by step for the view layer.
  const fields = {}
  const stepHasError = { 1: false, 2: false, 3: false }
  for (const issue of issues) {
    if (!fields[issue.field]) {
      fields[issue.field] = { messageKey: issue.messageKey, params: issue.params }
    }
    stepHasError[issue.step] = true
  }

  return { issues, fields, stepHasError, hasErrors: issues.length > 0 }
}
