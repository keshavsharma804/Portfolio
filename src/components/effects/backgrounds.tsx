import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function GridLines({
  className,
  fade = true,
  size = 64,
}: {
  className?: string
  fade?: boolean
  size?: number
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={
        {
          backgroundImage:
            'linear-gradient(to right, var(--pf-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--pf-grid-line) 1px, transparent 1px)',
          backgroundSize: `${size}px ${size}px`,
          maskImage: fade
            ? 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 78%)'
            : undefined,
          WebkitMaskImage: fade
            ? 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 78%)'
            : undefined,
        } as never
      }
    />
  )
}

export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 grid-lines', className)}>
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, #000 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, #000 10%, transparent 75%)',
        }}
      />
    </div>
  )
}

export function Noise({ className, opacity = 0.035 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 mix-blend-overlay', className)}
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

export function MeshGradient({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute -top-1/3 left-1/2 size-[70rem] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--pf-accent) 55%, transparent), transparent 70%)',
          opacity: 0.34 * intensity,
        }}
      />
      <div
        className="absolute -right-1/4 top-1/4 size-[40rem] rounded-full opacity-50 blur-[110px]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--pf-accent-2) 50%, transparent), transparent 70%)',
          opacity: 0.26 * intensity,
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 size-[36rem] rounded-full opacity-50 blur-[110px]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--pf-accent-3) 34%, transparent), transparent 70%)',
          opacity: 0.2 * intensity,
        }}
      />
    </div>
  )
}

export function RadialGlow({
  className,
  color = 'var(--pf-accent)',
  size = '32rem',
  intensity = 0.5,
}: {
  className?: string
  color?: string
  size?: string
  intensity?: number
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute rounded-full blur-[90px]', className)}
      style={{
        width: size,
        height: size,
        opacity: intensity,
        background: `radial-gradient(closest-side, ${color}, transparent 72%)`,
      }}
    />
  )
}

export function Particles({
  className,
  count = 18,
  color = 'var(--pf-accent)',
}: {
  className?: string
  count?: number
  color?: string
}) {
  const seed = 7
  const rand = (n: number) => {
    const x = Math.sin(n * 9301 + seed * 49297) * 233280
    return x - Math.floor(x)
  }

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {Array.from({ length: count }, (_, i) => {
        const durationSeconds = 16 + rand(i) * 20
        const delay = -rand(i + 40) * 30
        const size = 2 + rand(i + 80) * 3
        return (
          <span
            key={i}
            className="absolute rounded-full motion-safe:animate-[float_var(--dur)_linear_infinite]"
            style={
              {
                left: `${rand(i + 1) * 100}%`,
                top: `${rand(i + 2) * 100}%`,
                width: size,
                height: size,
                opacity: 0.15 + rand(i + 3) * 0.35,
                background: color,
                boxShadow: `0 0 ${size * 4}px ${color}`,
                '--dur': `${durationSeconds}s`,
                animationDelay: `${delay}s`,
              } as never
            }
          />
        )
      })}
    </div>
  )
}

export function LightRays({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute -top-40 left-1/4 h-[70rem] w-64 rotate-[18deg] opacity-[0.07] blur-3xl"
        style={{ background: 'linear-gradient(to bottom, var(--pf-accent), transparent 70%)' }}
      />
      <div
        className="absolute -top-40 right-1/4 h-[60rem] w-48 rotate-[-14deg] opacity-[0.05] blur-3xl"
        style={{ background: 'linear-gradient(to bottom, var(--pf-accent-2), transparent 70%)' }}
      />
    </div>
  )
}

export function SectionBackdrop({
  effect = 'grid',
  className,
  children,
}: {
  effect?: 'grid' | 'mesh' | 'glow' | 'none'
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {effect === 'grid' ? <GridLines /> : null}
      {effect === 'mesh' ? <MeshGradient /> : null}
      {effect === 'glow' ? (
        <>
          <RadialGlow className="-top-24 left-1/3" intensity={0.32} />
          <RadialGlow className="-bottom-32 right-0" color="var(--pf-accent-2)" intensity={0.2} />
        </>
      ) : null}
      {children}
    </div>
  )
}
