// Date/time helpers for the wizard.
//
// Mock timestamps are ISO strings in UTC (e.g. "2028-11-15T09:00:00Z") and the
// design shows them as wall-clock times (09:00Z -> "9:00 AM"). We therefore
// format in UTC via Intl so the output is stable regardless of the viewer's
// timezone — no date library needed for this clean, fixed data.

const TZ = 'UTC'

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TZ,
})

const dayLabelFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: TZ,
})

/** "9:00 AM – 10:00 AM" (en dash), formatted in UTC. */
export function formatTimeRange(startISO, endISO) {
  return `${timeFormat.format(new Date(startISO))} – ${timeFormat.format(new Date(endISO))}`
}

/** Stable day grouping key, e.g. "2028-11-15" (the UTC date part). */
export function dayKey(iso) {
  return iso.slice(0, 10)
}

/** Short day label for tabs, e.g. "Nov 15". */
export function formatDayLabel(iso) {
  return dayLabelFormat.format(new Date(iso))
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
