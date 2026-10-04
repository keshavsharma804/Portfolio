import { useMemo, useSyncExternalStore } from 'react'

function subscribe(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }
}

const serverSnapshot = () => false

export function useMediaQuery(query: string): boolean {
  const { getSnapshot } = useMemo(
    () => ({ getSnapshot: () => window.matchMedia(query).matches }),
    [query],
  )
  return useSyncExternalStore(subscribe(query), getSnapshot, serverSnapshot)
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 63.999rem)')
}

export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)')
}

export function useIsFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
