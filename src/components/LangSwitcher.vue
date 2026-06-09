<script setup>
// Language toggle — switches the app-wide locale and remembers the choice.
// Styled like the wizard's day/category tab pills for consistency.
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY } from '../boot/i18n.js'

const { t, locale } = useI18n({ useScope: 'global' })

const LANGS = [
  { code: 'en-US', label: 'EN' },
  { code: 'zh-TW', label: '中文' },
]

function setLocale(code) {
  locale.value = code
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code)
  } catch {
    // Persistence is best-effort; switching still works for this session.
  }
}
</script>

<template>
  <div
    role="group"
    :aria-label="t('app.language')"
    class="row items-center no-wrap shrink-0 gap-1 self-center rounded-2 bg-surface-l2 p-1"
  >
    <button
      v-for="l in LANGS"
      :key="l.code"
      type="button"
      :aria-pressed="locale === l.code"
      class="cursor-pointer rounded-[6px] border-none px-3 py-1 text-[13px] transition-colors duration-150"
      :class="locale === l.code
        ? 'bg-brand-emphasis-rest text-inverse font-semibold hover:bg-brand-emphasis-hover'
        : 'bg-transparent text-neutral-muted font-medium hover:bg-surface-l3 hover:text-neutral'"
      @click="setLocale(l.code)"
    >
      {{ l.label }}
    </button>
  </div>
</template>
