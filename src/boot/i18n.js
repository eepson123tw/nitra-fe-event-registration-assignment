import { createI18n } from 'vue-i18n'
import messages from '../i18n/index.js'

// Register vue-i18n (Composition API mode) on the Quasar app instance.
export default ({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'en-US',
    globalInjection: true,
    messages,
  })

  app.use(i18n)
}
