import { useI18n } from 'vue-i18n'
import { useRegistration } from './useRegistration.js'

/**
 * Translated per-field error lookup against the shared unified validation.
 * Returns '' until a submit has been attempted — matching the spec's "no
 * inline validation before Step 4" — then the translated message, or '' when
 * the field is valid. Accepts nested paths too (e.g. `addons.<id>`).
 *
 * @returns {(field: string) => string}
 */
export function useFieldError() {
  const { t } = useI18n()
  const { state, validation } = useRegistration()
  return (field) => {
    if (!state.validationAttempted) return ''
    const f = validation.value.fields[field]
    return f ? t(f.messageKey) : ''
  }
}
