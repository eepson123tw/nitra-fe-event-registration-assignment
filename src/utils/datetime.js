// Date/time helpers for the wizard.
//
// Mock timestamps are ISO strings in UTC (e.g. "2028-11-15T09:00:00Z") and the
// design shows them as wall-clock times (09:00Z -> "9:00 AM"). We therefore
// format in UTC via Intl so the output is stable regardless of the viewer's
// timezone — no date library needed for this clean, fixed data.

const TZ = 'UTC'

// Memoize Intl formatters per (locale + kind) — building them is relatively
// expensive and the set of locales is tiny.
const cache = new Map()
function formatter(locale, kind, opts) {
  const key = `${locale}|${kind}`
  let f = cache.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...opts, timeZone: TZ })
    cache.set(key, f)
  }
  return f
}
const timeFormat = (locale) => formatter(locale, 'time', { hour: 'numeric', minute: '2-digit' })
const dayLabelFormat = (locale) => formatter(locale, 'day', { month: 'short', day: 'numeric' })

/** "9:00 AM – 10:00 AM" (en dash), formatted in UTC for the given locale. */
export function formatTimeRange(startISO, endISO, locale = 'en-US') {
  const f = timeFormat(locale)
  return `${f.format(new Date(startISO))} – ${f.format(new Date(endISO))}`
}

/** Combined day + start time for review rows, e.g. "Nov 15, 9:00 AM". */
export function formatDayTime(iso, locale = 'en-US') {
  const d = new Date(iso)
  return `${dayLabelFormat(locale).format(d)}, ${timeFormat(locale).format(d)}`
}

/** Stable day grouping key, e.g. "2028-11-15" (the UTC date part). Locale-free. */
export function dayKey(iso) {
  return iso.slice(0, 10)
}

/** Short day label for tabs, e.g. "Nov 15". */
export function formatDayLabel(iso, locale = 'en-US') {
  return dayLabelFormat(locale).format(new Date(iso))
}

/**
 * Half-open interval overlap test, compared on epoch millis.
 * Two intervals overlap iff aStart < bEnd && bStart < aEnd.
 * Shared by session<->session and workshop<->session conflict checks.
 */
export function intervalsOverlap(aStartISO, aEndISO, bStartISO, bEndISO) {
  return (
    Date.parse(aStartISO) < Date.parse(bEndISO) &&
    Date.parse(bStartISO) < Date.parse(aEndISO)
  )
}

/**
 * Given items shaped `{ id, date, endDate }`, return the Set of ids that overlap
 * at least one other item. Shared by the Step-4 conflict validation and the
 * Step-2 inline conflict highlighting so the two always agree.
 */
export function findOverlappingIds(items) {
  const ids = new Set()
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (intervalsOverlap(items[i].date, items[i].endDate, items[j].date, items[j].endDate)) {
        ids.add(items[i].id)
        ids.add(items[j].id)
      }
    }
  }
  return ids
}
