import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

/** One viewBox for the whole instrument, so every ring shares a centre. */
const VIEW = 200
const CX = VIEW / 2
const CY = VIEW / 2

/**
 * Ring radii, outermost first. The composition is concentric by construction:
 * nothing crosses anything, so no label can ever collide with a stroke and the
 * graphic keeps its shape at every size.
 */
const FRAME = 92
const RAIL = 68
const CORE = 34

/** Seconds per revolution. Opposite directions, so the two never lock in step. */
const SWEEP = 38
const ORBIT = 56

/** Circumference of the frame ring, for the sweep arc's dash length. */
const FRAME_ARC = 2 * Math.PI * FRAME

/** The waveform that identifies the core: one drawn line, not a glyph. */
const WAVE = 'M 64 100 T 76 91 T 88 100 T 100 91 T 112 100 T 124 91 T 136 100'

/** Where a point sits on a circle of `radius`, `deg` clockwise from the top. */
function polar(deg: number, radius: number) {
  const radians = (deg * Math.PI) / 180
  return { x: CX + Math.cos(radians) * radius, y: CY + Math.sin(radians) * radius }
}

/**
 * The abstract core: concentric instrument rings around a small energy disc,
 * with one sweep, three orbiting data points and a pulse breathing out of it.
 *
 * Deliberately not a diagram of the stack. It states "there is a system running
 * here" and leaves the actual capabilities to the list underneath, which is
 * where the verifiable claims live.
 *
 * `active` (the pointer is over the console) only lifts the glow: no transform
 * changes, so the reaction is identical for a keyboard, a touch or a mouse and
 * costs nothing under reduced motion.
 */
export function AiCore({ active = false, className }: { active?: boolean; className?: string }) {
  const reduce = usePrefersReducedMotion()
  const gradientId = `core-${useId()}`
  const origin = `${CX}px ${CY}px`

  // Rotations and the pulse are the only continuous work in the panel, so they
  // are the first thing reduced motion switches off.
  const rotation = reduce ? undefined : { rotate: 360 }
  const counter = reduce ? undefined : { rotate: -360 }
  const linear = { duration: SWEEP, repeat: Infinity, ease: 'linear' as const }
  const counterLinear = { duration: ORBIT, repeat: Infinity, ease: 'linear' as const }

  return (
    <div className={cn('relative grid place-items-center', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--pf-accent)_30%,transparent),transparent_68%)] blur-2xl transition-opacity duration-500 ease-standard"
        style={{ opacity: active ? 0.9 : 0.5 }}
      />

      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        aria-hidden="true"
        focusable="false"
        className="relative size-full overflow-visible"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="46%">
            <stop offset="0%" stopColor="var(--pf-accent-3)" stopOpacity="0.5" />
            <stop offset="52%" stopColor="var(--pf-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--pf-accent-2)" stopOpacity="0.06" />
          </radialGradient>
        </defs>

        {/* Reference ring: the static scale the sweep runs against. */}
        <circle
          cx={CX}
          cy={CY}
          r={FRAME}
          fill="none"
          stroke="var(--pf-line-strong)"
          strokeWidth={1}
          strokeDasharray="1.5 7"
        />

        {/* The sweep, and the one signal travelling with it. */}
        <motion.g style={{ transformOrigin: origin }} animate={rotation} transition={linear}>
          <circle
            cx={CX}
            cy={CY}
            r={FRAME}
            fill="none"
            stroke="var(--pf-accent)"
            strokeOpacity={0.55}
            strokeWidth={1.25}
            strokeDasharray={`${FRAME_ARC * 0.12} ${FRAME_ARC}`}
            strokeLinecap="round"
          />
          <circle cx={CX} cy={CY - FRAME} r={2.5} fill="var(--pf-accent-3)" />
        </motion.g>

        {/* Orbit rail with instrument ticks on the diagonals. */}
        <circle cx={CX} cy={CY} r={RAIL} fill="none" stroke="var(--pf-line)" strokeWidth={1} />
        {[45, 135, 225, 315].map((deg) => {
          const from = polar(deg, RAIL - 5)
          const to = polar(deg, RAIL + 5)
          return (
            <line
              key={deg}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--pf-line-strong)"
              strokeWidth={1}
            />
          )
        })}

        {/* Data points, travelling the other way. */}
        <motion.g style={{ transformOrigin: origin }} animate={counter} transition={counterLinear}>
          {[
            { deg: 0, fill: 'var(--pf-accent)' },
            { deg: 132, fill: 'var(--pf-accent-2)' },
            { deg: 248, fill: 'var(--pf-accent-3)' },
          ].map((point) => {
            const at = polar(point.deg, RAIL)
            return <circle key={point.deg} cx={at.x} cy={at.y} r={2} fill={point.fill} fillOpacity={0.85} />
          })}
        </motion.g>

        {/* One pulse leaving the core, so the centre reads as the active part. */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={CORE}
          fill="none"
          stroke="var(--pf-accent)"
          strokeWidth={1}
          initial={false}
          animate={reduce ? undefined : { r: [CORE, CORE + 32], opacity: [0.4, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* The core itself. */}
        <circle cx={CX} cy={CY} r={CORE} fill={`url(#${gradientId})`} />
        <motion.circle
          cx={CX}
          cy={CY}
          r={CORE}
          fill="none"
          stroke="var(--pf-accent)"
          strokeWidth={1}
          initial={false}
          animate={{ opacity: active ? 0.9 : 0.5 }}
          transition={{ duration: duration.slow / 1000, ease: easing.standard }}
        />
        <motion.path
          d={WAVE}
          fill="none"
          stroke="var(--pf-accent-3)"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={reduce ? undefined : { pathLength: 1, opacity: 0.85 }}
          transition={{ duration: duration.slower / 1000, delay: 0.15, ease: easing.standard }}
        />
      </svg>
    </div>
  )
}
