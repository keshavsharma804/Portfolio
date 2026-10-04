import { Fragment } from 'react'

/**
 * Metric 03 as a small graph.
 *
 * One node per system, joined in a chain, so the shape says "these three are
 * connected" without drawing an architecture that does not exist. Nodes are
 * HTML rather than SVG on purpose: the pulse then falls under the same
 * reduced-motion and plain-view rules as every other decorative animation on
 * the site instead of needing its own guard.
 */
export function SystemNodes({ nodes, active }: { nodes: number; active: boolean }) {
  const count = Math.max(nodes, 2)

  return (
    <div aria-hidden="true" className="flex h-8 items-center">
      {Array.from({ length: count }, (_, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <span
              className={[
                'h-px w-5 shrink-0 transition-colors duration-200',
                active ? 'bg-accent/60' : 'bg-line-strong',
              ].join(' ')}
            />
          )}
          <span className="relative grid size-3 shrink-0 place-items-center">
            <span
              className={[
                'absolute inset-0 rounded-full border transition-colors duration-200',
                active ? 'border-accent/60' : 'border-accent/30',
                'motion-safe:animate-[pulse-ring_2.6s_ease-out_infinite]',
              ].join(' ')}
              style={{ animationDelay: `${index * 0.55}s` }}
            />
            <span
              className={[
                'size-1.5 rounded-full transition-colors duration-200',
                active ? 'bg-accent' : 'bg-accent/70',
              ].join(' ')}
            />
          </span>
        </Fragment>
      ))}
    </div>
  )
}
