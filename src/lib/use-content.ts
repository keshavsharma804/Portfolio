import { useMemo } from 'react'
import { useI18n } from './use-preferences'
import { contentEn } from '@/content/content-en'
import { mergeContent, type ContentBundle } from '@/content/content-types'
import { contentFr } from '@/locales/content-fr'
import { contentHi } from '@/locales/content-hi'
import { contentPa } from '@/locales/content-pa'
import type { Locale } from './preferences-context'

const OVERRIDES = {
  en: null,
  fr: contentFr,
  hi: contentHi,
  pa: contentPa,
} as const

/**
 * Portfolio copy for the active locale.
 *
 * Locale files only carry what they have translated; anything missing falls
 * back to English rather than rendering a raw key or an empty string.
 */
export function useContent(): ContentBundle {
  const { locale } = useI18n()

  return useMemo(() => {
    const override = OVERRIDES[locale as Locale]
    return override ? mergeContent(contentEn, override) : contentEn
  }, [locale])
}

/** Fills `{token}` placeholders in a translated string. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, token: string) =>
    token in values ? String(values[token]) : match,
  )
}
