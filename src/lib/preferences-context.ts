import { createContext } from 'react'
import { en, type Dictionary, type MessageKey } from '@/locales/en'
import { hi } from '@/locales/hi'
import { pa } from '@/locales/pa'
import { fr } from '@/locales/fr'

export const locales = ['en', 'hi', 'pa', 'fr'] as const
export type Locale = (typeof locales)[number]

export const localeMeta: Record<Locale, { label: string; native: string; htmlLang: string }> = {
  en: { label: 'English', native: 'EN', htmlLang: 'en' },
  hi: { label: 'Hindi', native: 'हि', htmlLang: 'hi' },
  pa: { label: 'Punjabi', native: 'ਪੰ', htmlLang: 'pa' },
  fr: { label: 'Français', native: 'FR', htmlLang: 'fr' },
}

export const dictionaries: Record<Locale, Dictionary> = { en, hi, pa, fr }
export type { MessageKey }

export type I18nValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  toggleLocale: () => void
  t: (key: MessageKey) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

export type Theme = 'dark' | 'light'

export type ThemeValue = {
  theme: Theme
  setTheme: (next: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeValue | null>(null)

/**
 * "Recruiter view" — a no-motion, no-chrome reading mode.
 *
 * This lives in a context rather than a plain hook because the pieces that have
 * to react to it (the boot overlay, the ambient canvas, the custom cursor) are
 * mounted far below the toggle. A local hook per component would give each of
 * them its own independent state.
 */
export type PlainViewValue = {
  plain: boolean
  setPlain: (next: boolean) => void
  toggle: () => void
}

export const PlainViewContext = createContext<PlainViewValue | null>(null)
