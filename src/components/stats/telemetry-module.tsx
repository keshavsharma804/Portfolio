import { useState } from 'react'
import { Counter } from '@/components/data/counter'
import { cn } from '@/lib/cn'
import { ExperienceTrack } from './experience-track'
import { SkillMatrix } from './skill-matrix'
import { StagePipeline } from './stage-pipeline'
import { SystemNodes } from './system-nodes'

export type ModuleVariant = 'track' | 'matrix' | 'graph' | 'pipeline'

/**
 * Splits a figure like `2+` into the part that can be counted and the part
 * that qualifies it, so the counter animates the number and the qualifier
 * travels with it.
 */
function splitValue(value: string): { count: number; prefix: string; suffix: string } {
  const match = /^(\D*)(\d[\d,]*)(.*)$/.exec(value)
  if (!match) return { count: 0, prefix: value, suffix: '' }
  return { count: Number(match[2].replace(/,/g, '')), prefix: match[1], suffix: match[3] }
}

function ModuleVisual({ variant, count, active }: { variant: ModuleVariant; count: number; active: boolean }) {
  switch (variant) {
    case 'track':
      return <ExperienceTrack filled={count} active={active} />
    case 'matrix':
      return <SkillMatrix segments={count} active={active} />
    case 'graph':
      return <SystemNodes nodes={count} active={active} />
    case 'pipeline':
      return <StagePipeline stages={count} active={active} />
  }
}

/**
 * One metric inside the telemetry surface.
 *
 * A figure, the label the CV gives it, a one-word name for the drawing and the
 * drawing itself. Nothing is clickable: hovering only raises contrast, so the
 * module adds no tab stop and nothing is revealed that a keyboard would miss.
 */
export function TelemetryModule({
  index,
  value,
  label,
  tag,
  variant,
  className,
}: {
  index: string
  value: string
  label: string
  tag: string
  variant: ModuleVariant
  className?: string
}) {
  const [active, setActive] = useState(false)
  const { count, prefix, suffix } = splitValue(value)

  return (
      <div
        data-module={variant}
        data-active={active || undefined}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        className={cn(
          'group relative flex h-full min-w-0 flex-col gap-3 px-4 py-5 transition-colors duration-200',
          'data-[active]:bg-accent/[0.04]',
          className,
        )}
      >
        {/*
          Hover bar: the module reports that it is the one being read. It
          wipes in from the left rather than fading, which is how the rest of
          the site draws an active state.
        */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-standard',
            'group-data-[active]:scale-x-100',
          )}
        />

        {/*
          Index and connector: the figure is numbered and hung off a hairline
          that ends in a node, so the four read as one instrument instead of
          four cards. The rail is dropped once the modules stack.
        */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-2xs tracking-[0.14em] text-fg-subtle tabular-nums transition-colors duration-200 group-data-[active]:text-accent">
            {index}
          </span>
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-line transition-colors duration-200 group-data-[active]:bg-accent/50 sm:block"
          />
          <span
            aria-hidden="true"
            className="hidden size-1 shrink-0 rounded-full bg-line-strong transition-colors duration-200 group-data-[active]:bg-accent sm:block"
          />
        </div>

        <p className="text-h1 font-semibold text-fg transition-transform duration-200 ease-standard group-data-[active]:-translate-y-0.5">
          <Counter value={count} prefix={prefix} suffix={suffix} />
        </p>

        <span className="text-2xs tracking-[0.08em] text-fg-muted uppercase">{label}</span>

        {/*
          `mt-auto` pins the drawing and its nameplate to the bottom of the
          cell, so the four line up as one baseline row even when a translated
          label wraps to two lines.
        */}
        <div className="mt-auto pt-3">{ModuleVisual({ variant, count, active })}</div>

        <span className="text-right font-mono text-2xs tracking-[0.14em] text-fg-subtle uppercase">{tag}</span>
      </div>
  )
}
