import { useState } from 'react'
import { motion } from 'motion/react'
import { SectionShell } from '@/components/ui/section-shell'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal'
import { SkillRadar } from '@/components/data/skill-radar'
import { Tooltip } from '@/components/ui/tooltip'
import { TechMarquee } from '@/components/data/tech-marquee'
import { SpotlightCard } from '@/components/effects/cards'
import { skillGroups } from '@/content/profile'
import { useContent, fill as fillTemplate } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { skillLevel } from '@/lib/skill-level'
import { usePrefersReducedMotion } from '@/lib/use-media-query'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'

export function Skills() {
  const [active, setActive] = useState<number | null>(null)
  const { t } = useI18n()
  const content = useContent()
  const reduce = usePrefersReducedMotion()

  const deepest = Math.max(...skillGroups.map((group) => group.items.length))
  const technologies = skillGroups.reduce((sum, group) => sum + group.items.length, 0)
  const level = Math.max(1, Math.floor(technologies / 10))
  const xp = (technologies % 10) * 10

  const labelFor = (id: string) => content.skillGroups.find((group) => group.id === id)?.label ?? id

  return (
    <SectionShell
      id="skills"
      index={t('skills.index')}
      path={t('skills.path')}
      title={t('skills.title')}
      description={t('skills.description')}
      aside={<TechMarquee className="w-full max-w-56 rounded-lg" />}
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal variant="left" delay={0.05} className="lg:sticky lg:top-28">
          <SkillRadar activeIndex={active} onHover={setActive} className="w-full" />
        </Reveal>

        <Stagger className="grid gap-3 sm:grid-cols-2" interval={0.05}>
          {skillGroups.map((group, index) => {
            const count = group.items.length
            const open = active === index
            const fill = Math.round((count / deepest) * 100)

            return (
              <StaggerItem key={group.id}>
                <SpotlightCard chrome={false} lift={false} className="rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActive(open ? null : index)}
                    onPointerEnter={() => setActive(index)}
                    onPointerLeave={() => setActive((current) => (current === index ? null : current))}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive((current) => (current === index ? null : current))}
                    aria-pressed={open}
                    className={cn(
                      'relative flex w-full flex-col gap-2.5 rounded-lg border p-4 text-left transition-colors duration-200 ease-standard',
                      open
                        ? 'border-[var(--pf-accent-line)] bg-accent-soft/40'
                        : 'border-line bg-surface/40 hover:border-line-strong hover:bg-surface-hover',
                    )}
                  >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          'grid size-6 shrink-0 place-items-center rounded-md font-mono text-2xs font-semibold tabular-nums',
                          /*
                           * Open reads as the accent-filled chip; closed stays
                           * neutral. `text-accent` on the 10% accent tint only
                           * reached 3.87:1 in dark and 4.37:1 in light, and a
                           * decorative ordinal should not out-shout the group
                           * label next to it anyway.
                           */
                          open ? 'bg-accent-solid text-white' : 'bg-accent-soft text-fg-muted',
                        )}
                      >
                        {String(count).padStart(2, '0')}
                      </span>
                      <span className="truncate text-sm font-medium text-fg">{labelFor(group.id)}</span>
                    </span>
                    <span className="shrink-0 font-mono text-2xs tracking-label text-fg-muted uppercase">
                      {content.skills.levelLabel} {skillLevel(count)}
                    </span>
                  </span>

                  <span
                    role="progressbar"
                    aria-valuenow={fill}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={labelFor(group.id)}
                    className="h-1 w-full overflow-hidden rounded-full bg-line"
                  >
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${fill}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: reduce ? 0 : duration.slower / 1000,
                        ease: easing.standard,
                        delay: reduce ? 0 : index * 0.05,
                      }}
                    />
                  </span>

                  <span className="flex flex-wrap gap-1">
                    {group.items.map((item) => (
                      <Tooltip
                        key={item}
                        side="bottom"
                        content={
                          <span className="flex flex-col gap-0.5">
                            <span className="font-medium text-fg">{item}</span>
                            <span className="text-fg-muted">
                              {labelFor(group.id)} · {content.skills.levelLabel} {skillLevel(count)} ·{' '}
                              {fillTemplate(content.skills.inCategory, { count })}
                            </span>
                          </span>
                        }
                      >
                        <span
                          className={cn(
                            'rounded border px-1.5 py-0.5 font-mono text-2xs tracking-tight transition-colors duration-200',
                            open ? 'border-[color:var(--pf-accent-line)]/60 text-fg' : 'border-line/70 text-fg-muted',
                          )}
                        >
                          {item}
                        </span>
                      </Tooltip>
                    ))}
                  </span>
                </button>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-2xs tracking-label text-fg-subtle uppercase">
        {/*
          * Solid accent chip rather than a tinted one: `text-accent` on the 10%
          * accent tint only reached 3.97:1 in dark and 4.47:1 in light. This is
          * the one saturated element in the summary row, which is what the row
          * needs anyway.
          */}
        <span className="rounded-full border border-transparent bg-accent-solid px-2.5 py-1 text-white">
          {content.skills.levelLabel} {level}
        </span>
        <span>{fillTemplate(content.skills.xpToNext, { xp, next: level + 1 })}</span>
        <span aria-hidden="true">·</span>
        <span>
          {fillTemplate(content.skills.technologiesAndCategories, {
            technologies,
            categories: skillGroups.length,
          })}
        </span>
        <span aria-hidden="true">·</span>
        <span>{content.skills.radarHint}</span>
      </div>
    </SectionShell>
  )
}
