import { motion } from 'motion/react'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

/**
 * Metric 02 as a coverage matrix.
 *
 * One segment per skill area in a 3×3 block, so the count is something a
 * reader can count rather than something they are told. The visual is fed the
 * number from the CV, never a second hard-coded list: if the figure changes,
 * the matrix changes with it.
 */
export function SkillMatrix({ segments, active }: { segments: number; active: boolean }) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      className="flex items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.045 } } }}
    >
      <div className="grid grid-cols-3 gap-px">
        {Array.from({ length: segments }, (_, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.6 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: reduce ? 0 : duration.base / 1000, ease: easing.entrance },
              },
            }}
            className={[
              'size-2.5 rounded-[3px] border transition-[background-color,border-color] duration-200',
              active ? 'border-accent/80 bg-accent/85' : 'border-accent/25 bg-accent/45',
            ].join(' ')}
          />
        ))}
      </div>
    </motion.div>
  )
}
