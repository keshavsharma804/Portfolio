import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

export function Marquee({
  children,
  speed = 38,
  reverse = false,
  className,
  fade = true,
}: {
  children: ReactNode
  speed?: number
  reverse?: boolean
  className?: string
  fade?: boolean
}) {
  const reduce = usePrefersReducedMotion()

  return (
    <div
      className={cn('group relative flex overflow-hidden', className)}
      style={
        {
          maskImage: fade ? 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' : undefined,
          WebkitMaskImage: fade ? 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' : undefined,
        } as never
      }
    >
      <div
        className="flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused] motion-safe:animate-[marquee_var(--speed)_linear_infinite]"
        style={
          {
            '--speed': `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
            animationPlayState: reduce ? 'paused' : 'running',
          } as never
        }
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused] motion-safe:animate-[marquee_var(--speed)_linear_infinite]"
        style={
          {
            '--speed': `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
            animationPlayState: reduce ? 'paused' : 'running',
          } as never
        }
      >
        {children}
      </div>
    </div>
  )
}

export function MarqueeItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('flex shrink-0 items-center gap-3 text-fg-subtle', className)}>{children}</span>
  )
}
