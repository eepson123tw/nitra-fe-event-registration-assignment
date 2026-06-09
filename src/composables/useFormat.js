import { useI18n } from 'vue-i18n'
import { formatCurrency } from '../utils/currency.js'
import { formatTimeRange, formatDayLabel, formatDayTime } from '../utils/datetime.js'

/**
 * Locale-bound currency + date/time formatters. Components call these instead
 * of the raw utils so money and dates render in the active locale (e.g. zh-TW
 * → "US$599.00", "11月15日 上午9:00") and re-render when the locale changes.
 *
 * @returns {{
 *   currency: (value: number, opts?: { cents?: boolean }) => string,
 *   timeRange: (startISO: string, endISO: string) => string,
 *   dayLabel: (iso: string) => string,
 *   dayTime: (iso: string) => string,
 * }}
 */
export function useFormat() {
  const { locale } = useI18n({ useScope: 'global' })
  return {
    currency: (value, opts) => formatCurrency(value, { ...opts, locale: locale.value }),
    timeRange: (startISO, endISO) => formatTimeRange(startISO, endISO, locale.value),
    dayLabel: (iso) => formatDayLabel(iso, locale.value),
    dayTime: (iso) => formatDayTime(iso, locale.value),
  }
}
