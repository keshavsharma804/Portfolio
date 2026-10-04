import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CommandPalette } from '@/components/interactive/command-palette'
import { CommandPaletteContext } from '@/components/interactive/command-palette-context'

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false)
  // Mirrors `open` so the setter can read the current value without being
  // rebuilt on every state change.
  const openRef = useRef(false)
  // Whatever was focused when the palette opened gets it back on close, so
  // dismissing it never strands keyboard users on <body>. The element has to be
  // captured at the moment of opening: the palette focuses its own input from a
  // child effect, which runs before this provider's, so reading
  // document.activeElement afterwards would only ever capture the palette.
  const restoreTo = useRef<HTMLElement | null>(null)

  const setOpen = useCallback((next: boolean) => {
    if (next === openRef.current) return
    if (next) {
      restoreTo.current = document.activeElement as HTMLElement | null
    } else {
      const previous = restoreTo.current
      restoreTo.current = null
      if (previous?.isConnected) requestAnimationFrame(() => previous.focus())
    }
    openRef.current = next
    setOpenState(next)
  }, [])

  const close = useCallback((options?: { keepFocus?: boolean }) => {
    const previous = restoreTo.current
    restoreTo.current = null
    setOpen(false)
    // An action that already focused its destination keeps it: pulling focus
    // back to the trigger here would undo the navigation it just performed.
    if (options?.keepFocus) return
    if (previous?.isConnected) requestAnimationFrame(() => previous.focus())
  }, [setOpen])

  const toggle = useCallback(() => setOpen(!openRef.current), [setOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, setOpen, toggle])

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onClose={close} />
    </CommandPaletteContext.Provider>
  )
}
