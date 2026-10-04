import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'
import { useIsFinePointer, usePrefersReducedMotion } from '@/lib/use-media-query'

/*
 * This module used to also export Counter, ScrambleText and TypewriterText.
 * Those live in components/data/counter and components/effects/text-fx, which
 * are what hero.tsx actually renders, so the copies here were dead weight with
 * divergent prop signatures.
 */

export function WordReveal({
  text,
  className,
  wordClassName,
  delayStep = 0.045,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  wordClassName?: string
  delayStep?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
}) {
  const reduce = usePrefersReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            aria-hidden="true"
            className={cn('inline-block', wordClassName)}
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: duration.slow / 1000,
              delay: i * delayStep,
              ease: easing.entrance,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-gradient', className)}>
      {children}
    </span>
  )
}

export function AvailabilityPill({ label, className }: { label: string; className?: string }) {
  const reduce = usePrefersReducedMotion()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line surface-glass px-3 py-1.5 font-mono text-2xs tracking-label uppercase text-fg-muted',
        className,
      )}
    >
      <span className="relative grid size-2 place-items-center">
        <span className="absolute size-2 rounded-full bg-success" />
        {!reduce ? (
          <span className="absolute size-2 rounded-full bg-success motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />
        ) : null}
      </span>
      {label}
    </span>
  )
}

export function CursorGlow() {
  const reduce = usePrefersReducedMotion()
  const fine = useIsFinePointer()
  const enabled = fine && !reduce
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{
        left: sx,
        top: sy,
        x: '-50%',
        y: '-50%',
        background: 'radial-gradient(closest-side, color-mix(in oklab, var(--pf-accent) 22%, transparent), transparent 70%)',
      }}
    />
  )
}
