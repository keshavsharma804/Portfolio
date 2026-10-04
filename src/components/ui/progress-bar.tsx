import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number
  label?: string
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-fg-muted">{label}</span>
          <span className="font-mono text-2xs tabular-nums text-fg-subtle">{clamped}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="h-1 w-full overflow-hidden rounded-full bg-line"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
          initial={{ width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: duration.slower / 1000, ease: easing.standard }}
        />
      </div>
    </div>
  )
}
