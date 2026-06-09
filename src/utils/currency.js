/**
 * Format a numeric amount as a USD currency string.
 *
 * @param {number} value            Amount in dollars.
 * @param {Object} [options]
 * @param {boolean} [options.cents=true]  Include cents (`$1,234.00`) vs. whole dollars (`$1,234`).
 * @param {string} [options.locale='en-US']  BCP-47 locale for grouping/symbol (e.g. zh-TW → "US$1,234.00").
 * @returns {string} e.g. "$1,234.00" or "$299"
 */
export function formatCurrency(value, { cents = true, locale = 'en-US' } = {}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(value ?? 0)
}
