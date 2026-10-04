import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

/**
 * The measured numbers, and only the measured numbers.
 *
 * Every value here is already a verified figure from the CV, so this block
 * carries no invented latency, throughput or uptime: a missing number is left
 * out rather than estimated. The check mark states that the figure passed, which
 * is exactly what the underlying counts mean.
 */
export function CoreTelemetry({
  items,
  className,
}: {
  items: { id: string; label: string; value: string }[]
  className?: string
}) {
  const reduce = usePrefersReducedMotion()

  return (
    <ul className={cn('grid grid-cols-3 divide-x divide-line/60 border-y border-line/60', className)}>
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: duration.base / 1000,
            ease: easing.entrance,
            delay: reduce ? 0 : 0.1 + index * 0.06,
          }}
          className="flex min-w-0 flex-col gap-1 px-3 py-1.5"
        >
          <span className="font-mono text-[0.6875rem] leading-tight tracking-[0.14em] text-fg-muted uppercase">
            {item.label}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3 shrink-0 text-success" strokeWidth={3} aria-hidden="true" />
            <span className="font-mono text-sm font-semibold text-fg tabular-nums">{item.value}</span>
          </span>
        </motion.li>
      ))}
    </ul>
  )
}
