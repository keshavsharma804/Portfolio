type ScrollEngine = {
  stop: () => void
  start: () => void
  resize: () => void
  scrollTo: (target: HTMLElement, offset: number) => void
}

let engine: ScrollEngine | null = null
let locks = 0

export function registerScrollEngine(next: ScrollEngine | null) {
  engine = next
}

/** Null when reduced motion left the smooth-scroll engine unmounted. */
export function getScrollEngine() {
  return engine
}

export function isScrollLocked() {
  return locks > 0
}

export function lockScroll() {
  locks += 1
  if (locks > 1) return
  engine?.stop()
  const y = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${y}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  const top = Number.parseFloat(document.body.style.top || '0')
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  window.scrollTo(0, -top)
  engine?.start()
  engine?.resize()
}
