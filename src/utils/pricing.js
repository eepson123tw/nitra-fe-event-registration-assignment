// Pure order-pricing logic, derived from the registration state + mock data.
// Kept dependency-free and presentation-free (no currency/i18n formatting) so
// it's easy to reason about and reuse in Step 4.
import { event } from '../mocks/event.js'
import { addons } from '../mocks/addons.js'

// VIP ticket holders get 10% off workshop add-ons. The user-facing discount
// label states the rate too (i18n `summary.workshopDiscount`) — keep them in sync.
const VIP_WORKSHOP_DISCOUNT = 0.1

/**
 * Build the order summary from the wizard state.
 *
 * `catalog` (optional) supplies locale-aware `ticketTypes` + `addons` so the
 * line names come out translated; it falls back to the English mock data.
 * Prices/ids/quantities are identical across locales.
 * @param {import('../composables/useRegistration.js').RegistrationState} state  Current wizard state.
 * @param {{ ticketTypes?: object[], addons?: object[] }} [catalog]  Locale-aware catalog; defaults to the English mocks.
 * @returns {{
 *   ticket: { name: string, amount: number } | null,
 *   lines: { id: string, kind: 'workshop'|'meal'|'merchandise', name: string, quantity: number, amount: number }[],
 *   discount: number,
 *   total: number,
 * }}
 */
export function buildOrderSummary(state, catalog = {}) {
  const ticketTypes = catalog.ticketTypes ?? event.ticketTypes
  const allAddons = catalog.addons ?? addons

  const ticket = ticketTypes.find((t) => t.id === state.ticketTypeId) ?? null
  const isVip = state.ticketTypeId === 'vip'

  const lines = []
  let workshopSubtotal = 0
  // addons.js is already ordered workshops -> meals -> merchandise.
  for (const addon of allAddons) {
    const sel = state.addons[addon.id]
    if (!sel || sel.quantity < 1) continue
    // Merchandise carries a quantity (clamped to maxQuantity as defence-in-depth
    // even though the picker already caps it); everything else is a single unit.
    const quantity =
      addon.category === 'merchandise'
        ? Math.min(sel.quantity, addon.maxQuantity ?? Infinity)
        : 1
    const amount = addon.price * quantity
    lines.push({ id: addon.id, kind: addon.category, name: addon.name, quantity, amount })
    if (addon.category === 'workshop') workshopSubtotal += amount
  }

  const ticketAmount = ticket ? ticket.price : 0
  // Round monetary outputs to cents so the returned numbers (not just their
  // formatted display) are free of binary-float dust (e.g. 32.800000000000004).
  const discount = round2(isVip ? workshopSubtotal * VIP_WORKSHOP_DISCOUNT : 0)
  const total = round2(ticketAmount + lines.reduce((sum, l) => sum + l.amount, 0) - discount)

  return {
    ticket: ticket ? { name: ticket.name, amount: ticket.price } : null,
    lines,
    discount,
    total,
  }
}

/** Round to 2 decimal places (cents). */
function round2(n) {
  return Math.round(n * 100) / 100
}
