import { Fragment } from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

/**
 * Metric 04 as an execution pipeline.
 *
 * Five stages in a row with a signal travelling across them — the same
 * hand-off the agent work actually performs. The stages are labelled nowhere
 * and dated nowhere, so the drawing stays a picture of the count rather than a
 * claim about timings or throughput.
 */
export function StagePipeline({ stages, active }: { stages: number; active: boolean }) {
  const reduce = usePrefersReducedMotion()

  return (
    <div aria-hidden="true" className="relative flex h-8 items-center">
      {Array.from({ length: stages }, (_, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <span className="flex w-5 shrink-0 items-center">
              <span
                className={[
                  'h-px flex-1 transition-colors duration-200',
                  active ? 'bg-accent/50' : 'bg-line-strong',
                ].join(' ')}
              />
              <span
                className={[
                  '-ml-px size-1 rotate-45 border-r border-t transition-colors duration-200',
                  active ? 'border-accent/60' : 'border-line-strong',
                ].join(' ')}
              />
            </span>
          )}
          <span
            className={[
              'size-1.5 shrink-0 rounded-full transition-colors duration-200',
              active ? 'bg-accent' : 'bg-line-strong',
            ].join(' ')}
          />
        </Fragment>
      ))}

      {/*
        The rail is inset by half a stage so 0% and 100% land on the centres of
        the first and last stage instead of outside the pipeline. In reduced
        motion the signal parks on the first stage: a still drawing rather than
        no drawing.
      */}
      <span className="pointer-events-none absolute inset-x-[3px] top-2 h-0">
        <motion.span
          className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_6px_var(--pf-accent)] motion-safe:animate-[pulse-subtle_2.8s_ease-in-out_infinite]"
          initial={false}
          animate={reduce ? undefined : { left: ['0%', '100%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
          style={{ left: 0 }}
        />
      </span>
    </div>
  )
}
