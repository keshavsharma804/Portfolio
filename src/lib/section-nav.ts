import { getScrollEngine } from '@/lib/scroll-lock'

/**
 * Lenis adds its offset to the destination, so the negative value scrolls past
 * the section to leave room for the sticky header above it.
 */
const SCROLL_OFFSET = -90

/**
 * The single "go to a section" path, shared by the nav links, the skip link and
 * the command palette so all three behave identically.
 *
 * Three things have to happen together. The smooth-scroll engine owns the
 * scrolling, so the hash is written by hand to keep the URL shareable, and focus
 * is moved onto the destination so assistive tech learns the page moved instead
 * of silently stranding it on the link that was activated. Reduced motion
 * leaves the engine unmounted, so the jump is native.
 */
export function goToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return

  const engine = getScrollEngine()
  if (engine) {
    engine.scrollTo(section, SCROLL_OFFSET)
  } else {
    const top = section.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET
    window.scrollTo({ top, behavior: 'auto' })
  }

  if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
  if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1')
  section.focus({ preventScroll: true })
}
