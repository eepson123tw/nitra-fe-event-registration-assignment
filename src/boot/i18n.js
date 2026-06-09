import { createI18n } from 'vue-i18n'
import messages from '../i18n/index.js'

export const SUPPORTED_LOCALES = ['en-US', 'zh-TW']
export const LOCALE_STORAGE_KEY = 'locale'

/**
 * Resolve the initial locale: a locale the user previously chose wins; otherwise
 * detect it from the browser/system language (any `zh*` → zh-TW), falling back
 * to en-US.
 */
function resolveInitialLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  } catch {
    // localStorage may be unavailable (private mode); fall through to detection.
  }
  const detected = (navigator.languages && navigator.languages[0]) || navigator.language || ''
  return /^zh/i.test(detected) ? 'zh-TW' : 'en-US'
}

// Register vue-i18n (Composition API mode) on the Quasar app instance.
export default ({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: resolveInitialLocale(),
    fallbackLocale: 'en-US',
    globalInjection: true,
    messages,
  })

  app.use(i18n)
}
