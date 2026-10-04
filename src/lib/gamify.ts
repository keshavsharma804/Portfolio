import { useEffect, useState } from 'react'
import { contentEn } from '@/content/content-en'
import { mergeContent } from '@/content/content-types'
import { contentFr } from '@/locales/content-fr'
import { contentHi } from '@/locales/content-hi'
import { contentPa } from '@/locales/content-pa'
import type { Locale } from './preferences-context'

export type Achievement = { id: string; title: string; detail: string }

const SEEN_KEY = 'pf-achievements'
const LOCALE_KEY = 'pf-locale'

/**
 * Milestone copy comes from the content bundle, so achievements match the
 * active language. `unlock` is called from scroll and keyboard listeners
 * outside React, so the locale is read from storage rather than context.
 */
function readLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(LOCALE_KEY)
  return stored === 'fr' || stored === 'hi' || stored === 'pa' ? stored : 'en'
}

function milestoneCopy(locale: Locale) {
  switch (locale) {
    case 'fr':
      return mergeContent(contentEn, contentFr).gamify
    case 'hi':
      return mergeContent(contentEn, contentHi).gamify
    case 'pa':
      return mergeContent(contentEn, contentPa).gamify
    default:
      return contentEn.gamify
  }
}

export function resolveMilestones(locale: Locale = readLocale()): Record<string, Achievement> {
  const copy = milestoneCopy(locale)
  return Object.fromEntries(
    Object.entries(copy).map(([id, value]) => [id, { id, title: value.title, detail: value.detail }]),
  )
}

function readSeen(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

type Listener = (achievement: Achievement | null) => void
const listeners = new Set<Listener>()

export function unlock(id: string) {
  const achievement = resolveMilestones()[id]
  if (!achievement) return
  const seen = readSeen()
  if (seen.includes(id)) return
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]))
  } catch {
    /* storage unavailable — still show it once */
  }
  listeners.forEach((fn) => fn(achievement))
}

export function useAchievements() {
  const [queue, setQueue] = useState<Achievement | null>(null)

  useEffect(() => {
    const listener: Listener = (achievement) => {
      setQueue(achievement)
      window.setTimeout(() => setQueue((current) => (current?.id === achievement?.id ? null : current)), 3400)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return queue
}

/** Wires scroll-based achievements. Safe to call once from the app shell. */
export function useAchievementTriggers(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    let scrolled = false
    const onScroll = () => {
      if (scrolled) return
      if (window.scrollY > 220) {
        scrolled = true
        unlock('firstScroll')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const sections: [string, string][] = [
      ['skills', 'skills'],
      ['projects', 'projects'],
      ['contact', 'contact'],
    ]
    const observers = sections.map(([id, key]) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) unlock(key)
        },
        { threshold: 0.35 },
      )
      observer.observe(el)
      return observer
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observers.forEach((o) => o?.disconnect())
    }
  }, [enabled])
}

/** Classic Konami sequence. Grants an achievement and flips the site to disco. */
export function useKonami(onActivate: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const sequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]
    let index = 0
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      if (key === sequence[index]) {
        index += 1
        if (index === sequence.length) {
          index = 0
          unlock('konami')
          onActivate()
        }
      } else {
        index = key === sequence[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onActivate, enabled])
}
