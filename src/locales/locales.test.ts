import { describe, expect, it } from 'vitest'
import { en } from './en'
import { fr } from './fr'
import { hi } from './hi'
import { pa } from './pa'
import { navItems } from '@/content/profile'

const dictionaries = { en, fr, hi, pa } as const
type Locale = keyof typeof dictionaries

const base = Object.keys(en).sort()

describe('locale dictionaries', () => {
  it('has no duplicate keys (a duplicate silently shadows the first)', () => {
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      const keys = Object.keys(dictionary)
      expect(new Set(keys).size, `${locale} has duplicate keys`).toBe(keys.length)
    }
  })

  it.each(Object.keys(dictionaries).filter((l) => l !== 'en') as Locale[])(
    '%s defines exactly the English keys',
    (locale) => {
      expect(Object.keys(dictionaries[locale]).sort()).toEqual(base)
    },
  )

  it.each(Object.keys(dictionaries) as Locale[])('%s has no empty strings', (locale) => {
    for (const [key, value] of Object.entries(dictionaries[locale])) {
      expect(value, `${locale}:${key}`).not.toBe('')
      expect(value.trim(), `${locale}:${key}`).toBe(value)
    }
  })

  it.each(Object.keys(dictionaries) as Locale[])('%s numbers its sections 01..07 in order', (locale) => {
    const ordered = ['about', 'skills', 'experience', 'projects', 'currently', 'education', 'contact']
    const values = ordered.map((section) => dictionaries[locale][`${section}.index` as keyof typeof en])
    expect(values).toEqual(['01', '02', '03', '04', '05', '06', '07'])
  })

  it('has a label for every nav item in every language', () => {
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      for (const item of navItems) {
        expect(dictionary[`nav.${item.id}` as keyof typeof en], `${locale}:nav.${item.id}`).toBeTruthy()
      }
    }
  })

  it('keeps the same interpolation tokens in every language', () => {
    const tokens = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

    for (const [key, english] of Object.entries(en)) {
      if (tokens(english).length === 0) continue
      for (const [locale, dictionary] of Object.entries(dictionaries)) {
        if (locale === 'en') continue
        const translated = dictionary[key as keyof typeof en]
        expect(tokens(translated), `${locale}:${key}`).toEqual(tokens(english))
      }
    }
  })
})
