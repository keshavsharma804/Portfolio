import { SectionShell } from '@/components/ui/section-shell'
import { TerminalReplay, type Line } from '@/components/data/terminal-replay'
import { CornerBrackets } from '@/components/hud/frame'
import { Reveal } from '@/components/motion/reveal'
import { experience } from '@/content/profile'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { cn } from '@/lib/cn'

/** Shell-safe slug so each role keeps its own `roles/<file>.json` path. */
function rolePath(company: string): string {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

/**
 * The description bullets, styled as terminal output. Copy comes from the
 * content bundle so the lines read in the active language, while company and
 * tech names stay as authored. The stack is deliberately not repeated here: it
 * lives outside the card, so listing it here too would double every tech name.
 */
function buildBody(bullets: string[] | undefined): Line[] {
  return (bullets ?? []).map((bullet) => ({
    kind: 'out' as const,
    tone: 'text' as const,
    text: `▸ ${bullet}`,
  }))
}

export function Experience() {
  const { t } = useI18n()
  const content = useContent()
  const present = t('common.present')
  const stackLabel = content.experienceStackLabel

  return (
    <SectionShell
      id="experience"
      index={t('experience.index')}
      path={t('experience.path')}
      title={t('experience.title')}
      description={t('experience.description')}
    >
      <div className="flex flex-col gap-10">
        {experience.map((entry, i) => {
          const copy = content.experience.find((item) => item.id === entry.id)
          const period = `${entry.start} — ${entry.end ?? present}`
          const isCurrent = entry.end === null

          return (
            <Reveal key={entry.id} variant="fade" delay={i * 0.06}>
              <div className="flex flex-col gap-4">
                {/*
                  Card: role, company, period, and the terminal description.
                  The current role is marked with an accent rail and a live
                  indicator so the active position is findable at a glance
                  instead of relying on reading the dates.
                */}
                <article
                  className={cn(
                    'card-surface relative overflow-hidden rounded-lg p-5 sm:p-6',
                    isCurrent && 'border-[var(--pf-accent-line)]',
                  )}
                >
                  {isCurrent ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-accent via-accent-2 to-transparent"
                    />
                  ) : null}
                  <CornerBrackets size={12} className={isCurrent ? 'opacity-80' : 'opacity-50'} />

                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2.5 font-mono text-2xs text-fg-subtle tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                      {isCurrent ? (
                        <>
                          <span className="size-1.5 rounded-full bg-success motion-safe:animate-pulse" aria-hidden="true" />
                          <span className="text-success">{present}</span>
                        </>
                      ) : null}
                    </span>
                    <h3 className="text-h2 font-semibold text-fg">{copy?.role}</h3>
                    <p className="text-h4 font-medium text-accent">{entry.company}</p>
                    <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                      {period}
                      {copy?.location ? ` · ${copy.location}` : ''}
                    </p>
                  </div>

                  <TerminalReplay
                    lines={buildBody(copy?.bullets)}
                    typing={false}
                    title={`keshav@ai-mission-control — roles/${rolePath(entry.company)}.json`}
                    shell="cat"
                    className="mt-5"
                    bodyClassName="p-4"
                  />
                </article>

                {/* Stack sits outside the card, as requested. */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                    {stackLabel}
                  </span>
                  {entry.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-line bg-elev-1 px-2 py-1 font-mono text-2xs text-fg-muted transition-colors duration-200 hover:border-[var(--pf-accent-line)] hover:text-fg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}
