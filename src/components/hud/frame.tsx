import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'

export function CornerBrackets({ className, size = 14 }: { className?: string; size?: number }) {
  const common = 'absolute size-3 border-accent/70'
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <span className={cn(common, 'top-0 left-0 border-t border-l')} style={{ width: size, height: size }} />
      <span className={cn(common, 'top-0 right-0 border-t border-r')} style={{ width: size, height: size }} />
      <span className={cn(common, 'bottom-0 left-0 border-b border-l')} style={{ width: size, height: size }} />
      <span className={cn(common, 'right-0 bottom-0 border-r border-b')} style={{ width: size, height: size }} />
    </span>
  )
}

export function HudPanel({
  children,
  className,
  label,
  value,
  accent = false,
  delay = 0,
}: {
  children?: ReactNode
  className?: string
  label?: string
  value?: ReactNode
  accent?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: duration.slow / 1000, ease: easing.entrance, delay }}
      className={cn(
        'relative overflow-hidden rounded-lg border border-line bg-surface/60 p-5 backdrop-blur-sm',
        accent && 'border-[var(--pf-accent-line)] bg-accent-soft/40',
        className,
      )}
    >
      <CornerBrackets size={10} />
      {label ? (
        <div className="mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{label}</span>
        </div>
      ) : null}
      {value ? <div className="text-h3 font-semibold text-fg tabular-nums">{value}</div> : null}
      {children}
    </motion.div>
  )
}

export function TelemetryRow({
  label,
  value,
  status = 'ok',
  delay = 0,
}: {
  label: string
  value: string
  status?: 'ok' | 'live' | 'idle'
  delay?: number
}) {
  const dot =
    status === 'live' ? 'bg-accent animate-pulse' : status === 'idle' ? 'bg-fg-subtle' : 'bg-success'
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: duration.base / 1000, ease: easing.entrance, delay }}
      className="flex items-center justify-between gap-3 border-b border-line/60 py-1.5 font-mono text-2xs last:border-0"
    >
      <span className="flex items-center gap-2 tracking-label text-fg-subtle uppercase">
        <span className={cn('size-1.5 rounded-full', dot)} aria-hidden="true" />
        {label}
      </span>
      <span className="truncate tracking-tight text-fg-muted">{value}</span>
    </motion.div>
  )
}

export function HudRule({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-1', className)}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <span className="size-1 rotate-45 bg-accent/70" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    </div>
  )
}
