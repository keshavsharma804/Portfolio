import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { CornerBrackets } from '@/components/hud/frame'
import { cn } from '@/lib/cn'
import { useContent } from '@/lib/use-content'
import { useTheme } from '@/lib/use-preferences'
import { useIsFinePointer, usePrefersReducedMotion } from '@/lib/use-media-query'
import { ActivityStream } from './ActivityStream'
import { AiCore } from './AiCore'
import { CoreCapabilities } from './CoreCapabilities'
import { CoreTelemetry } from './CoreTelemetry'

/** Section caption inside the console: a lit tick and a small caps label. */
function ConsoleLabel({ children }: { children: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium tracking-[0.14em] text-fg-muted uppercase">
      <span aria-hidden="true" className="size-1 rotate-45 bg-accent" />
      {children}
    </div>
  )
}

/**
 * The right-hand column: a compact console rather than an architecture diagram.
 *
 * Reading order is the console's own — header, core, capabilities, telemetry,
 * log — and every region carries one idea. The claims live in the data: each
 * capability is paired with the figure that backs it, the telemetry block holds
 * only measured counts, and the log restates the reliability work instead of
 * faking a live feed. Nothing here is needed to understand the page, so it is
 * supporting material, and it says so plainly.
 */
export function AiMissionControl({ className }: { className?: string }) {
  const { hero } = useContent()
  const { theme } = useTheme()
  const fine = useIsFinePointer()
  const reduce = usePrefersReducedMotion()

  /*
   * Light mode is a white panel with a navy hairline and a soft blue cast, not
   * an inversion of the dark one: the fills cannot separate white from the page
   * on their own, so the border and the shadow carry the edge.
   */
  const light = theme === 'light'

  const lightRef = useRef<HTMLDivElement>(null)
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const [pointerIn, setPointerIn] = useState(false)

  /*
   * The light follows the pointer by writing two custom properties straight to
   * the element. A motion value would re-render nothing but still schedule work
   * on every event; here the compositor owns the paint and React stays idle.
   */
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const layer = lightRef.current
    if (!layer) return
    const bounds = event.currentTarget.getBoundingClientRect()
    layer.style.setProperty('--mx', `${event.clientX - bounds.left}px`)
    layer.style.setProperty('--my', `${event.clientY - bounds.top}px`)
  }

  return (
    <figure
      onPointerMove={onPointerMove}
      onPointerEnter={() => setPointerIn(true)}
      onPointerLeave={() => setPointerIn(false)}
      className={cn(
        'relative isolate mx-auto flex w-full max-w-[34rem] flex-col overflow-hidden rounded-xl border',
        light ? 'border-line bg-white shadow-elev-2' : 'border-line bg-elev-1 shadow-lifted',
        className,
      )}
    >
      {/* Ambient light from the top of the console, so the surface has a source. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,color-mix(in_oklab,var(--pf-accent)_11%,transparent),transparent_70%)] opacity-70"
      />
      <div
        ref={lightRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-300 ease-standard',
          pointerIn && fine && !reduce ? 'opacity-100' : 'opacity-0',
        )}
        style={
          {
            background:
              'radial-gradient(240px circle at var(--mx,50%) var(--my,0%), color-mix(in oklab, var(--pf-accent) 13%, transparent), transparent 70%)',
          } as React.CSSProperties
        }
      />
      <CornerBrackets size={12} className="z-10" />

      <figcaption className="relative flex items-center justify-between gap-3 border-b border-line/70 px-4 py-2">
        <span className="truncate font-mono text-2xs tracking-[0.14em] text-fg-muted uppercase">
          {hero.console.title}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-2xs tracking-[0.14em] text-fg uppercase">
          <span className="relative flex size-1.5" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-success" />
            <span className="absolute inset-0 rounded-full bg-success animate-[pulse-ring_2.6s_ease-out_infinite]" />
          </span>
          {hero.console.state}
        </span>
      </figcaption>

      <div className="relative flex flex-1 flex-col">
        {/* The core, on its own inset screen so it is the one thing that glows. */}
        <div className="card-inset grain relative mx-4 mt-2.5 overflow-hidden rounded-lg">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

          <div className="relative flex flex-col items-center px-3 py-2">
            <AiCore active={pointerIn && fine} className="aspect-square w-32 sm:w-[8.5rem]" />

            <div className="mt-1 flex items-center gap-2.5">
              <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
              <span className="font-mono text-2xs tracking-[0.22em] text-fg uppercase">
                {hero.console.coreLabel}
              </span>
              <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
            </div>

            {/*
              One tick per capability, wired to the list below. It is the only
              thing that links the core to the rows, so the two halves read as
              one instrument instead of two stacked widgets.
            */}
            <ul aria-hidden="true" className="mt-1.5 flex items-end gap-1.5">
              {hero.buildRows.map((row, index) => (
                <li
                  key={row.id}
                  className={cn(
                    'h-2.5 w-[3px] rounded-full transition-colors duration-200 ease-standard',
                    activeRow === index ? 'bg-accent' : 'bg-line-strong',
                  )}
                />
              ))}
            </ul>
          </div>
        </div>

        <div className="px-4 pt-2">
          <ConsoleLabel>{hero.console.capabilities}</ConsoleLabel>
          <CoreCapabilities
            rows={hero.buildRows}
            activeRow={activeRow}
            onHover={setActiveRow}
          />
        </div>

        <CoreTelemetry items={hero.telemetry} className="mt-2" />

        <div className="px-4 pt-2 pb-2.5">
          <ConsoleLabel>{hero.console.activity}</ConsoleLabel>
          <ActivityStream lines={hero.console.lines} />
        </div>
      </div>
    </figure>
  )
}
