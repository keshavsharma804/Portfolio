import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, dictionaries, localeMeta, locales, type I18nValue, type Locale } from './preferences-context'
import { en } from '@/locales/en'

const STORAGE_KEY = 'pf-locale'

function readStored(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return locales.includes(stored as Locale) ? (stored as Locale) : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStored)

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next = locales[(locales.indexOf(current) + 1) % locales.length]
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: (key) => dictionaries[locale][key] ?? en[key],
    }),
    [locale, setLocale, toggleLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
