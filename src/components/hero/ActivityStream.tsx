import { motion } from 'motion/react'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

/**
 * The console log: four statements of what the system does, each one a line from
 * the CV rather than an invented event. There is no live feed behind the panel,
 * so nothing here claims a timestamp, a throughput or a connection.
 */
export function ActivityStream({ lines, className }: { lines: { id: string; text: string }[]; className?: string }) {
  const reduce = usePrefersReducedMotion()

  return (
    <ol className={className}>
      {lines.map((line, index) => (
        <motion.li
          key={line.id}
          initial={reduce ? { opacity: 1 } : { opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: duration.base / 1000,
            ease: easing.entrance,
            delay: reduce ? 0 : 0.2 + index * 0.05,
          }}
          className="flex items-baseline gap-1.5 font-mono text-2xs leading-relaxed"
        >
          <span aria-hidden="true" className="text-accent">
            →
          </span>
          <span className="text-fg-muted">{line.text}</span>
        </motion.li>
      ))}
    </ol>
  )
}
