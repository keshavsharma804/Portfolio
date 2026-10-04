import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { PlainViewContext } from './preferences-context'
import { unlock } from './gamify'

const PLAIN_KEY = 'pf-plain'

function readInitial(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(PLAIN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Owns recruiter-view state and mirrors it onto `<html data-plain>` so the
 * stylesheet can strip animation globally with `!important` rules that a
 * component-level implementation could never match.
 */
export function PlainViewProvider({ children }: { children: ReactNode }) {
  const [plain, setPlainState] = useState(readInitial)

  useEffect(() => {
    document.documentElement.dataset.plain = plain ? 'on' : 'off'
  }, [plain])

  const setPlain = useCallback((next: boolean) => {
    setPlainState(() => {
      try {
        window.localStorage.setItem(PLAIN_KEY, next ? '1' : '0')
      } catch {
        /* storage unavailable — the toggle still works for this session */
      }
      if (!next) unlock('plain')
      return next
    })
  }, [])

  const toggle = useCallback(() => {
    setPlainState((current) => {
      const value = !current
      try {
        window.localStorage.setItem(PLAIN_KEY, value ? '1' : '0')
      } catch {
        /* storage unavailable — the toggle still works for this session */
      }
      if (!value) unlock('plain')
      return value
    })
  }, [])

  return <PlainViewContext.Provider value={{ plain, setPlain, toggle }}>{children}</PlainViewContext.Provider>
}
