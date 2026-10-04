import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'motion/react'
import { cn } from '@/lib/cn'
import { useIsTouch } from '@/lib/use-media-query'
import { hoverLift, springSoft, tapPress } from '@/lib/motion'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
  lift?: boolean
  glow?: boolean
  /**
   * When false the card contributes only the pointer-tracked highlight, leaving
   * border and background to the caller. Needed whenever the child is already
   * an interactive control with its own chrome, because `cn` does not merge
   * conflicting Tailwind classes.
   */
  chrome?: boolean
}

export function SpotlightCard({
  children,
  className,
  as = 'div',
  lift = true,
  glow = true,
  chrome = true,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useIsTouch()
  const px = useMotionValue(-200)
  const py = useMotionValue(-200)
  const opacity = useMotionValue(0)

  const x = useSpring(px, { stiffness: 260, damping: 30 })
  const y = useSpring(py, { stiffness: 260, damping: 30 })
  const o = useSpring(opacity, { stiffness: 200, damping: 30 })

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set(event.clientX - rect.left)
    py.set(event.clientY - rect.top)
    o.set(1)
  }

  const handleLeave = () => o.set(0)

  const Component = motion[as] as typeof motion.div

  return (
    <Component
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={lift ? hoverLift : undefined}
      whileTap={lift ? tapPress : undefined}
      transition={springSoft}
      className={cn(
        'group relative isolate overflow-hidden',
        chrome &&
          'rounded-xl border border-line bg-elev-1 shadow-elev-1 transition-[background-color,border-color,box-shadow] duration-300 ease-standard hover:border-[var(--pf-accent-line)] hover:bg-elev-2 hover:shadow-elev-2',
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        data-fx="decorative"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-100"
        style={
          {
            opacity: o,
            background:
              'radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--pf-accent) 15%, transparent), transparent 62%)',
            '--spot-x': x,
            '--spot-y': y,
          } as unknown as CSSProperties
        }
      />
      {glow ? (
        <span
          aria-hidden="true"
          data-fx="decorative"
          className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-[var(--pf-accent-line)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
      {children}
    </Component>
  )
}

type TiltCardProps = {
  children: ReactNode
  className?: string
  max?: number
}

export function TiltCard({ children, className, max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const touch = useIsTouch()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const rotateX = useSpring(useTransform(rx, [-max, max], [max, -max]), { stiffness: 200, damping: 22 })
  const rotateY = useSpring(useTransform(ry, [-max, max], [-max, max]), { stiffness: 200, damping: 22 })

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (touch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rx.set(((event.clientY - rect.top) / rect.height - 0.5) * 2)
    ry.set(((event.clientX - rect.left) / rect.width - 0.5) * 2)
  }

  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  )
}

export function GradientBorder({
  children,
  className,
  active = true,
}: {
  children: ReactNode
  className?: string
  active?: boolean
}) {
  return (
    <div className={cn('relative isolate rounded-xl', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 rounded-xl transition-opacity duration-500',
          active ? 'opacity-70' : 'opacity-0',
        )}
        style={{
          padding: '1px',
          background: 'conic-gradient(from 0deg, transparent 0%, var(--pf-accent) 18%, var(--pf-accent-2) 32%, transparent 55%)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  )
}

export function Shimmer({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className,
      )}
    >
      <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent motion-safe:animate-[shimmer_2.6s_ease-in-out_infinite]" />
    </span>
  )
}

const containerVariants: Variants = {
  hidden: {},
  hover: { transition: { staggerChildren: 0.03 } },
}

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
}

export function BadgeCascade({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn('flex flex-wrap gap-2', className)}
      variants={containerVariants}
      initial="hidden"
      whileHover="hover"
    >
      {children}
    </motion.div>
  )
}

export function BadgeCascadeItem({ children }: { children: ReactNode }) {
  return (
    <motion.span variants={badgeVariants} className="contents">
      {children}
    </motion.span>
  )
}
