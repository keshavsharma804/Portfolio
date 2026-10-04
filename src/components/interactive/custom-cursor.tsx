import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { useIsFinePointer, usePrefersReducedMotion } from '@/lib/use-media-query'

/*
 * Any `[data-cursor]` value switches the ring on and supplies its label, so a
 * read-only region can advertise itself as inspectable without pretending to be
 * a control: `[data-cursor="hover"]` here, `[data-cursor="inspect"]` on the
 * hero console's capability rows.
 */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, [data-cursor], summary'

export function CustomCursor() {
  const fine = useIsFinePointer()
  const reduce = usePrefersReducedMotion()
  const enabled = fine && !reduce

  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState<string | null>(null)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.45 })
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.45 })
  const dotX = useSpring(x, { stiffness: 1400, damping: 60, mass: 0.2 })
  const dotY = useSpring(y, { stiffness: 1400, damping: 60, mass: 0.2 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.style.cursor = 'none'

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      if (!visible) setVisible(true)

      const target = (event.target as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null
      setActive(Boolean(target))
      setLabel(target?.dataset?.cursor ?? null)
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y, visible])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-cursor isolate">
      <motion.div
        className="absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
        style={{ left: dotX, top: dotY, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className={cn(
          'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border backdrop-blur-[1px]',
          active
            ? 'border-[var(--pf-accent-line)] bg-accent/10'
            : 'border-line-strong bg-transparent',
        )}
        style={{ left: ringX, top: ringY, opacity: visible ? 1 : 0 }}
        animate={{ width: active ? 44 : 30, height: active ? 44 : 30, rotate: active ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {label ? (
          <motion.span
            className="absolute inset-0 grid place-items-center font-mono text-[0.5rem] tracking-label text-accent uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  )
}
