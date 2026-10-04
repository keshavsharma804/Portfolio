import { useEffect } from 'react'
import Lenis from 'lenis'
import { isScrollLocked, registerScrollEngine } from '@/lib/scroll-lock'
import { goToSection } from '@/lib/section-nav'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

export function SmoothScroll() {
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      duration: 0.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      syncTouch: false,
    })
    registerScrollEngine({
      stop: () => lenis.stop(),
      start: () => lenis.start(),
      resize: () => lenis.resize(),
      scrollTo: (target, offset) => lenis.scrollTo(target, { offset }),
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (isScrollLocked()) return
      const target = event.target as HTMLElement | null
      if (target?.closest?.('[role="dialog"], [data-modal]')) return
      const anchor = target?.closest?.('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const id = href.slice(1)
      if (!document.getElementById(id)) return
      event.preventDefault()
      goToSection(id)
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
      registerScrollEngine(null)
    }
  }, [reduce])

  return null
}
