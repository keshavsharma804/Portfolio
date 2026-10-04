import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useIsTouch } from '@/lib/use-media-query'
import { springSoft } from '@/lib/motion'

/**
 * Pulls its child toward the cursor while hovered, then springs back.
 * Inert on touch and when the user prefers reduced motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  radius = 90,
}: {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const touch = useIsTouch()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.35 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.35 })

  const handleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (touch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)
    // No pull once the pointer is far away, so the magnet has a real field.
    const falloff = Math.max(0, 1 - distance / (radius + Math.max(rect.width, rect.height) / 2))
    mx.set(dx * strength * falloff)
    my.set(dy * strength * falloff)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerDown={reset}
      style={{ x, y }}
      transition={springSoft}
      className={className}
    >
      {children}
    </motion.span>
  )
}

/** Magnetic wrapper that also scales slightly while hovered. */
export function MagneticHover({
  children,
  className,
  strength = 0.24,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const touch = useIsTouch()

  return (
    <Magnetic strength={strength} className={className}>
      <motion.span
        className="inline-flex"
        whileHover={touch ? undefined : { scale: 1.04 }}
        whileTap={touch ? undefined : { scale: 0.97 }}
        transition={springSoft}
      >
        {children}
      </motion.span>
    </Magnetic>
  )
}
