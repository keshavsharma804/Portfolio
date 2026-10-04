import { useCallback, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { useIsFinePointer, usePrefersReducedMotion } from '@/lib/use-media-query'

/** Draggable comparison of a manual process and the automated one. */
export function BeforeAfter({
  beforeLabel,
  afterLabel,
  before,
  after,
  className,
}: {
  beforeLabel: string
  afterLabel: string
  before: string[]
  after: string[]
  className?: string
}) {
  const [pos, setPos] = useState(52)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    setPos(Math.min(96, Math.max(4, ratio * 100)))
  }, [])

  return (
    <div className={cn('select-none', className)}>
      <div
        ref={trackRef}
        className="relative h-56 overflow-hidden rounded-lg border border-line select-none sm:h-64"
        onPointerDown={(event) => {
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          move(event.clientX)
        }}
        onPointerMove={(event) => {
          if (dragging.current) move(event.clientX)
        }}
        onPointerUp={(event) => {
          dragging.current = false
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
      >
        <div className="absolute inset-0 bg-surface/60 p-5">
          <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{afterLabel}</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {after.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm text-fg-muted">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent-3" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="absolute inset-0 overflow-hidden bg-bg-elevated/90 p-5"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{beforeLabel}</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {before.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm text-fg-subtle">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-fg-subtle" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-accent"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        >
          <span className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent bg-bg-elevated text-accent">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6 4 12l5 6M15 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="mt-2 flex justify-between font-mono text-2xs tracking-label text-fg-subtle uppercase">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  )
}

/**
 * 3D tilt that tracks the pointer, falling back to a plain hover lift on touch
 * and for anyone who asked for reduced motion.
 *
 * `data-fx="tilt"` is set here rather than by the caller so the plain-view rule
 * in index.css always has a target: that rule is what suppresses the transform
 * when plain mode is toggled at runtime, without a re-render.
 */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const fine = useIsFinePointer()
  const reduce = usePrefersReducedMotion()

  if (!fine || reduce) {
    return (
      <div
        data-fx="tilt"
        className={cn('transition-transform duration-300 hover:-translate-y-1', className)}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      data-fx="tilt"
      className={cn('group/tilt [perspective:1100px]', className)}
      whileHover={{ rotateX: 0, rotateY: 0 }}
      onPointerMove={(event) => {
        const el = event.currentTarget
        const rect = el.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(1100px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-4px)`
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)'
      }}
    >
      {children}
    </motion.div>
  )
}
