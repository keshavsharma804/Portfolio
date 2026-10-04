import { useEffect, useRef } from 'react'

/** Light that follows the pointer and reveals the dot grid beneath it. */
export function SpotlightGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!fine.matches) return

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let idle = 0

    const onMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      idle = 0
    }

    const loop = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      el.style.setProperty('--x', `${cx.toFixed(1)}px`)
      el.style.setProperty('--y', `${cy.toFixed(1)}px`)

      idle += 1
      const settled = Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5
      if (settled && idle > 20) return
      raf = requestAnimationFrame(loop)
    }

    const onLeave = () => {
      cancelAnimationFrame(raf)
    }
    const onEnter = () => {
      idle = 0
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      style={
        {
          background:
            'radial-gradient(340px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--pf-accent) 12%, transparent), transparent 70%)',
        } as React.CSSProperties
      }
    />
  )
}
