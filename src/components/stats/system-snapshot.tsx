import { CornerBrackets } from '@/components/hud/frame'
import { Stagger, StaggerItem } from '@/components/motion/reveal'
import { stats } from '@/content/profile'
import { cn } from '@/lib/cn'
import { useContent } from '@/lib/use-content'
import { TelemetryModule, type ModuleVariant } from './telemetry-module'

/**
 * Each figure gets a drawing that can only work at its own count — three units
 * on the track, nine cells in the matrix, three nodes, five stages — so the
 * panel can be read without trusting the number next to it.
 */
const VARIANTS: Record<string, ModuleVariant> = {
  years: 'track',
  areas: 'matrix',
  systems: 'graph',
  stages: 'pipeline',
}

/**
 * The four headline metrics as one telemetry surface.
 *
 * A single panel with a header strip, so the numbers read as one instrument
 * reporting a snapshot rather than four unrelated badges. The header state says
 * "read-only" and uses a square marker rather than a blinking dot: these are
 * figures restated from the CV, and nothing here is connected to anything.
 */
export function SystemSnapshot({ className }: { className?: string }) {
  const content = useContent()
  const { snapshot } = content
  const tags = new Map(snapshot.tags.map((tag) => [tag.id, tag.text]))

  return (
    <div data-surface="snapshot" className={cn('relative', className)}>
      {/* Ambient light behind the panel: the room light an instrument casts. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -bottom-6 top-2 hidden bg-[radial-gradient(60%_120%_at_50%_0%,var(--pf-accent-glow),transparent_70%)] opacity-40 blur-2xl lg:block"
      />

      <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated/50">
        <span aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-30" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/[0.06] to-transparent"
        />

        <div className="relative flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
          <span className="font-mono text-2xs tracking-[0.14em] text-fg-muted uppercase">{snapshot.title}</span>
          <span className="flex items-center gap-2 font-mono text-2xs tracking-[0.14em] text-fg-subtle uppercase">
            <span aria-hidden="true" className="size-1 bg-success" />
            {snapshot.state}
          </span>
        </div>

        <h2 className="relative max-w-[32ch] px-4 pt-6 pb-1 text-h3 font-medium text-balance text-fg sm:px-5">
          {snapshot.heading}
        </h2>

<Stagger
          className="relative mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-4"
          interval={0.09}
          amount={0.15}
        >
          {stats.map((stat, position) => (
            <StaggerItem key={stat.id} variant="fade" className="min-w-0">
              <TelemetryModule
                index={String(position + 1).padStart(2, '0')}
                value={stat.value}
                label={content.stats.find((entry) => entry.id === stat.id)?.label ?? ''}
                tag={tags.get(stat.id) ?? ''}
                variant={VARIANTS[stat.id] ?? 'track'}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <CornerBrackets />
    </div>
  )
}
