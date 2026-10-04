import { motion } from 'motion/react'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

/**
 * Metric 01 as a progression track.
 *
 * The track is three units long — the first two are the `2+` years, and the
 * third is left open because the figure says the count is still rising. The
 * fill stops exactly on the second tick, so the "+" is drawn rather than
 * asserted. Nothing here is dated: the CV holds the dates, and this is a
 * picture of the claim, not a second source of it.
 */
export function ExperienceTrack({ filled, active }: { filled: number; active: boolean }) {
  const reduce = usePrefersReducedMotion()
  const span = filled + 1
  const share = (filled / span) * 100

  return (
    <div className="relative flex h-8 w-full items-center">
      {/* The full span. The fill below covers only the part already counted. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />

      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-accent to-accent-2"
        initial={reduce ? { width: `${share}%` } : { width: 0 }}
        whileInView={{ width: `${share}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: reduce ? 0 : duration.slower / 1000, ease: easing.standard }}
      >
        {/*
          The marker rides the right edge of the fill, so it travels with the
          growth instead of needing its own tween to stay in step.
        */}
        <span
          className="absolute top-1/2 size-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent"
          style={{ boxShadow: active ? '0 0 0 3px color-mix(in oklab, var(--pf-accent) 18%, transparent)' : undefined }}
        />
      </motion.span>

      {/* One tick per unit, so the eye can count the years it is being shown. */}
      {Array.from({ length: span }, (_, index) => {
        const reached = index < filled
        const passed = index === filled
        return (
          <span
            key={index}
            aria-hidden="true"
            className={[
              'absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-200',
              reached ? 'border-accent bg-accent' : 'border-line-strong bg-bg',
              passed ? 'border-accent/70' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: `${(index / (span - 1)) * 100}%` }}
          />
        )
      })}

      {/* Open end: the count has not stopped. */}
      <span
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-2xs leading-none text-accent/70"
      >
        +
      </span>
    </div>
  )
}
