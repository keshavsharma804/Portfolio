import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { SectionShell } from '@/components/ui/section-shell'
import { Stagger, StaggerItem } from '@/components/motion/reveal'
import { CornerBrackets } from '@/components/hud/frame'
import { TiltCard } from '@/components/data/compare'
import { GradientBorder, Shimmer, BadgeCascade, BadgeCascadeItem } from '@/components/effects/cards'
import { projects } from '@/content/profile'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'

function metricRatio(value: string) {
  const match = value.replace(/,/g, '').match(/[\d.]+/)
  if (!match) return 1
  const n = Number(match[0])
  if (value.includes('/')) {
    const [a, b] = value.split('/')
    const denom = Number(b.replace(/,/g, '').match(/[\d.]+/)?.[0] ?? 0)
    return denom > 0 ? Number(a) / denom : 1
  }
  return Math.min(1, n / 200)
}

/**
 * One labelled step of the case study. The label is a mono eyebrow and the
 * body is prose, so the step reads as a titled passage rather than as a field
 * label sitting on top of a paragraph.
 */
function CaseStep({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-2 font-mono text-2xs tracking-label text-accent uppercase">
        <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
        {label}
      </span>
      {children}
    </div>
  )
}

export function Projects() {
  const [open, setOpen] = useState<string | null>(null)
  const { t } = useI18n()
  const content = useContent()

  return (
    <SectionShell
      id="projects"
      index={t('projects.index')}
      path={t('projects.path')}
      title={t('projects.title')}
      description={t('projects.description')}
      tone="accent-2"
    >
      <Stagger className="flex flex-col gap-4" interval={0.08}>
        {projects.map((project, i) => {
          const isOpen = open === project.slug
          const copy = content.projects.find((item) => item.slug === project.slug)
          const metrics = project.metrics.map((metric) => ({
            ...metric,
            label: copy?.metrics.find((m) => m.id === metric.id)?.label ?? metric.id,
          }))

          return (
            <StaggerItem key={project.slug}>
              <TiltCard max={2.5}>
              <GradientBorder active={project.featured}>
              <div
                className={cn(
                  'card-surface relative overflow-hidden rounded-lg transition-colors duration-300',
                  isOpen && 'border-[var(--pf-accent-line)] shadow-elev-3',
                )}
              >
                <CornerBrackets size={12} className={isOpen ? 'opacity-100' : 'opacity-0'} />
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : project.slug)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 p-5 text-left sm:p-6"
                >
                  <span className="font-mono text-2xs text-fg-subtle tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="text-h3 font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
                      {copy?.title ?? project.slug}
                    </span>
                    <span className="text-sm text-fg-muted">{copy?.summary}</span>
                    {metrics.length > 0 ? (
                      <span className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
                        {metrics.map((metric) => (
                          <span key={metric.id} className="flex items-center gap-2">
                            <span className="font-mono text-2xs text-accent tabular-nums">{metric.value}</span>
                            <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                              {metric.label}
                            </span>
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: duration.base / 1000, ease: easing.standard }}
                    className="shrink-0 text-fg-subtle"
                  >
                    <ChevronDown className="size-5" aria-hidden="true" />
                  </motion.span>
                </button>


                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: duration.slow / 1000, ease: easing.standard }}
                      className="overflow-hidden"
                    >
                      {/*
                        Case-study layout. The narrative steps sit in a labelled
                        two-column grid at reading size, and the measured
                        outcomes move into their own bordered panel, so the
                        numbers stop competing with the prose for the same
                        visual weight.
                      */}
                      <div className="flex flex-col gap-6 border-t border-line px-5 py-6 sm:px-6">
                        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                          <CaseStep label={t('projects.problem')}>
                            <p className="text-read text-fg-muted">{copy?.problem}</p>
                          </CaseStep>
                          <CaseStep label={t('projects.approach')}>
                            <p className="text-read text-fg-muted">{copy?.role}</p>
                          </CaseStep>
                        </div>

                        {metrics.length > 0 ? (
                          <div className="card-inset flex flex-col gap-3.5 rounded-lg p-5">
                            <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                              {t('projects.metrics')}
                            </span>
                            {metrics.map((metric) => (
                              <div key={metric.id} className="flex flex-col gap-1.5">
                                <div className="flex items-baseline justify-between gap-3">
                                  <span className="text-sm text-fg-muted">{metric.label}</span>
                                  <span className="font-mono text-sm font-medium text-accent tabular-nums">
                                    {metric.value}
                                  </span>
                                </div>
                                <div className="relative h-1 overflow-hidden rounded-full bg-line">
                                  <Shimmer />
                                  <motion.div
                                    className="relative h-full rounded-full bg-gradient-to-r from-accent to-accent-3"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metricRatio(metric.value) * 100}%` }}
                                    transition={{ duration: duration.slower / 1000, ease: easing.standard }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="flex flex-col gap-2.5">
                          <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                            {t('projects.stack')}
                          </span>
                          <BadgeCascade className="gap-1.5">
                            {project.stack.map((tech) => (
                              <BadgeCascadeItem key={tech}>
                                <span className="rounded border border-line bg-elev-1 px-2 py-1 font-mono text-2xs text-fg-muted transition-colors duration-200 group-hover:border-[var(--pf-accent-line)] group-hover:text-fg">
                                  {tech}
                                </span>
                              </BadgeCascadeItem>
                            ))}
                          </BadgeCascade>
                        </div>

                        {project.links.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {project.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={cn(
                                  'inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg-muted',
                                  'transition-colors duration-200 hover:border-[var(--pf-accent-line)] hover:text-fg',
                                )}
                              >
                                {link.label}
                                <ExternalLink className="size-3.5" aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              </GradientBorder>
              </TiltCard>
            </StaggerItem>
          )
        })}
      </Stagger>
    </SectionShell>
  )
}
