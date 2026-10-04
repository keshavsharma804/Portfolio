import { cn } from '@/lib/cn'
import { useIsFinePointer } from '@/lib/use-media-query'

export type CapabilityRow = { id: string; label: string; detail: string; metric: string }

/**
 * The console's capability list: what the system does, with the figure that
 * backs each line. The figure is the point — a row with a measured value behind
 * it is telemetry, whereas the same words in a pill row would just be badges.
 *
 * The detail line expands on hover, and is simply always visible without a
 * fine pointer: on touch there is no hover to reveal it, so a collapsed row
 * would be content the phone user could never reach.
 */
export function CoreCapabilities({
  rows,
  activeRow,
  onHover,
  className,
}: {
  rows: CapabilityRow[]
  activeRow: number | null
  onHover: (index: number | null) => void
  className?: string
}) {
  const fine = useIsFinePointer()

  return (
    <ul className={cn('flex flex-col divide-y divide-line/60', className)}>
      {rows.map((row, index) => {
        const active = activeRow === index

        return (
          <li
            key={row.id}
            data-cursor="inspect"
            onPointerEnter={() => onHover(index)}
            onPointerLeave={() => onHover(null)}
            className="relative py-0.5 pl-3"
          >
            {/* Status rail: a lit channel down the edge of the hovered row. */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-y-0.5 left-0 w-px origin-center bg-accent transition-transform duration-200 ease-standard',
                active ? 'scale-y-100' : 'scale-y-0',
              )}
            />

            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-1.5 shrink-0 translate-y-px rounded-full bg-success"
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'truncate font-mono text-2xs tracking-[0.14em] uppercase transition-colors duration-200',
                    active ? 'text-fg' : 'text-fg-muted',
                  )}
                >
                  {row.label}
                </span>
              </span>
              <span className="shrink-0 font-mono text-2xs whitespace-nowrap text-accent tabular-nums">
                {row.metric}
              </span>
            </div>

            {/*
              Collapsing through `grid-template-rows` rather than a height
              animation: 0fr→1fr transitions to whatever the content measures, so
              translated text of any length expands without a fixed height.
            */}
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-standard',
                fine ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                active && fine ? 'grid-rows-[1fr]' : null,
              )}
            >
              <p className="overflow-hidden font-mono text-2xs leading-relaxed text-fg-muted">
                {row.detail}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
