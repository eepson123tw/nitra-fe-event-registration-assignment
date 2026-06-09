// Pure order-pricing logic, derived from the registration state + mock data.
// Kept dependency-free and presentation-free (no currency/i18n formatting) so
// it's easy to reason about and reuse in Step 4.
import { event } from '../mocks/event.js'
import { addons } from '../mocks/addons.js'

/** VIP ticket holders get 10% off workshop add-ons. */
export const VIP_WORKSHOP_DISCOUNT = 0.1

/**
 * Build the order summary from the wizard state.
 * @returns {{
 *   ticket: { name: string, amount: number } | null,
 *   lines: { id: string, kind: 'workshop'|'meal'|'merchandise', name: string, quantity: number, amount: number }[],
 *   discount: number,
 *   total: number,
 * }}
 */
export function buildOrderSummary(state) {
  const ticket = event.ticketTypes.find((t) => t.id === state.ticketTypeId) ?? null
  const isVip = state.ticketTypeId === 'vip'

  const lines = []
  let workshopSubtotal = 0
  // addons.js is already ordered workshops -> meals -> merchandise.
  for (const addon of addons) {
    const sel = state.addons[addon.id]
    if (!sel || sel.quantity < 1) continue
    const quantity = addon.category === 'merchandise' ? sel.quantity : 1
    const amount = addon.price * quantity
    lines.push({ id: addon.id, kind: addon.category, name: addon.name, quantity, amount })
    if (addon.category === 'workshop') workshopSubtotal += amount
  }

  const discount = isVip ? workshopSubtotal * VIP_WORKSHOP_DISCOUNT : 0
  const ticketAmount = ticket ? ticket.price : 0
  const total = ticketAmount + lines.reduce((sum, l) => sum + l.amount, 0) - discount

  return {
    ticket: ticket ? { name: ticket.name, amount: ticket.price } : null,
    lines,
    discount,
    total,
  }
}
