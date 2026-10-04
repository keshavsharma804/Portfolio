import { motion } from 'motion/react'
import { ArrowDown, ArrowRight, GitBranch, Link2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { AvailabilityPill } from '@/components/effects/text-animations'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal'
import { ScrambleText, Typewriter } from '@/components/effects/text-fx'
import { AiMissionControl, HeroResume } from '@/components/hero'
import { SystemSnapshot } from '@/components/stats'
import { profile } from '@/content/profile'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { buttonClass } from '@/lib/button-style'
import { duration, easing } from '@/lib/tokens'

export function Hero() {
  const { t } = useI18n()
  const content = useContent()

  return (
    <section id="home" className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-24">
      {/* Hero-specific background enhancements */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle radial glow behind left column */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--pf-accent)_4%,transparent)_0%,transparent_70%)] opacity-60 lg:left-[-100px]" />
        {/* Subtle radial glow behind right column */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--pf-accent-2)_3%,transparent)_0%,transparent_70%)] opacity-50 lg:right-[-50px]" />
        {/* Fine dot field */}
        <div className="dot-grid absolute inset-0 opacity-40" />
        {/* Fine grid lines */}
        <div className="grid-lines absolute inset-0 opacity-20" />
      </div>

      <Container>
        <div className="grid items-start gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* LEFT COLUMN: Identity & Primary Messaging */}
          <div className="flex min-w-0 flex-col items-start gap-7 lg:pr-4">
            <Reveal variant="blur" delay={0.05}>
              <AvailabilityPill label={content.profile.availability} />
            </Reveal>

            <Stagger className="flex min-w-0 flex-col items-start gap-5" interval={0.07}>
              <StaggerItem>
                <p className="font-mono text-xs tracking-label text-fg-subtle uppercase">
                  {t('hero.eyebrow')} — {content.profile.location}
                </p>
              </StaggerItem>

              <StaggerItem>
                <h1 className="flex flex-col items-start gap-3">
                  <span className="block text-display-lg leading-[1.02] font-semibold tracking-[-0.035em]">
                    <ScrambleText text={profile.name} />
                  </span>
                  <motion.span
                    className="text-gradient text-h2 block text-balance leading-[1.15]"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: duration.slow / 1000, delay: 0.45, ease: easing.entrance }}
                  >
                    <Typewriter items={content.hero.roles} />
                  </motion.span>
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="max-w-xl text-read text-fg-muted">{content.profile.tagline}</p>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-fg-subtle">
                  {content.profile.tagline.split('·').map((tech, i) => (
                    <span key={tech.trim()} className="group relative px-2 py-0.5 rounded transition-colors hover:text-accent cursor-default">
                      {tech.trim()}
                      {i < content.profile.tagline.split('·').length - 1 && (
                        <span className="mx-1 opacity-50 group-hover:opacity-100">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            </Stagger>

            {/* Primary CTA */}
            <Reveal variant="up" delay={0.35} className="w-full sm:w-auto">
              <a
                href="#projects"
                className={buttonClass('primary', 'lg')}
                data-cursor="hover"
              >
                {t('hero.viewProjects')}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Reveal>

            {/* Secondary actions. Resume reads as a document, not a file
                transfer: it previews on hover and opens in place on click, so
                the download happens after the decision, not instead of it. */}
            <Reveal variant="up" delay={0.45} className="flex flex-wrap items-center gap-3">
              <HeroResume />
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group -my-2 inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-fg-subtle transition-colors duration-200 hover:border-accent/50 hover:bg-surface-hover hover:text-fg"
                data-cursor="hover"
                aria-label="GitHub"
              >
                <GitBranch className="size-4" aria-hidden="true" />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group -my-2 inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-fg-subtle transition-colors duration-200 hover:border-accent/50 hover:bg-surface-hover hover:text-fg"
                data-cursor="hover"
                aria-label="LinkedIn"
              >
                <Link2 className="size-4" aria-hidden="true" />
              </a>
            </Reveal>

            {/* Scroll indicator */}
            <Reveal variant="up" delay={0.55}>
              <a
                href="#about"
                className="group -my-2 inline-flex items-center gap-2 py-2 font-mono text-2xs tracking-label text-fg-subtle uppercase transition-colors hover:text-fg"
              >
                <ArrowDown
                  className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
                {t('common.scroll')}
              </a>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: AI mission control console */}
          <Reveal variant="right" delay={0.15} className="min-w-0">
            <AiMissionControl />
          </Reveal>
        </div>

        {/* System snapshot: the headline metrics as one telemetry surface */}
        <SystemSnapshot className="mt-14" />
      </Container>
    </section>
  )
}