import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { event } from '../mocks/event.js'
import { sessions } from '../mocks/sessions.js'
import { addons } from '../mocks/addons.js'

/**
 * Locale-aware view of the mock catalog. The mocks stay the English source of
 * truth (they stand in for an API); for non-English locales we overlay the
 * `data` translation block from that locale's messages (keyed by entity id),
 * falling back to the mock value for anything untranslated (and for proper
 * nouns we deliberately leave untranslated — speaker/company/event names).
 *
 * Returns reactive computeds, so the whole UI re-localizes when the locale
 * changes. Ids, prices, dates, capacities are never touched here.
 *
 * @returns {{
 *   ticketTypes: import('vue').ComputedRef<object[]>,
 *   sessions: import('vue').ComputedRef<object[]>,
 *   addons: import('vue').ComputedRef<object[]>,
 * }}
 */
export function useCatalog() {
  const { locale, getLocaleMessage } = useI18n({ useScope: 'global' })
  const data = computed(() => getLocaleMessage(locale.value)?.data ?? {})

  const trackLabel = (track) => data.value.tracks?.[track] ?? track

  const ticketTypes = computed(() =>
    event.ticketTypes.map((tk) => {
      const tr = data.value.tickets?.[tk.id]
      return tr ? { ...tk, name: tr.name, description: tr.description, perks: tr.perks } : tk
    }),
  )

  const localizedSessions = computed(() =>
    sessions.map((s) => {
      const tr = data.value.sessions?.[s.id]
      return {
        ...s,
        title: tr?.title ?? s.title,
        speakerTitle: tr?.speakerTitle ?? s.speakerTitle,
        trackLabel: trackLabel(s.track),
      }
    }),
  )

  const localizedAddons = computed(() =>
    addons.map((a) => {
      const tr = data.value.addons?.[a.id]
      return tr ? { ...a, name: tr.name, description: tr.description } : a
    }),
  )

  return {
    ticketTypes,
    sessions: localizedSessions,
    addons: localizedAddons,
  }
}
