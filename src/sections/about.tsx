import { SectionShell } from '@/components/ui/section-shell'
import { Reveal } from '@/components/motion/reveal'
import { CornerBrackets } from '@/components/hud/frame'
import { StoryChapter } from '@/components/data/story-chapter'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'

export function About() {
  const { t } = useI18n()
  const { profile: copy } = useContent()

  return (
    <SectionShell
      id="about"
      index={t('about.index')}
      path={t('about.path')}
      title={t('about.title')}
      tone="accent-2"
    >
      {/*
        Deliberately not a StaggerItem.

        `variant="up"` translates the card 22px on its way in. The layout box
        never moves, but the card is a visible surface, so it reads as a gap
        opening under the "Who I am" heading and then snapping shut. And as a
        child of a Stagger that also wrapped StoryChapter (~1800px), the reveal
        fired off the container's 25% viewport threshold rather than the card's
        own, so the card could sit invisible well after it was readable.

        A self-contained opacity fade triggers on the card itself and leaves no
        gap: nothing about its position changes, only its opacity.
      */}
      <div className="flex flex-col gap-6">
        <Reveal variant="fade">
          <div className="glass-pane relative overflow-hidden rounded-2xl px-6 py-9 sm:px-10 sm:py-12">
            <CornerBrackets size={18} />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 right-[-4rem] size-72 rounded-full bg-accent/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-accent-2/12 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-3 right-6 font-mono text-5xl leading-none font-bold text-fg/[0.055] select-none sm:right-8"
            >
              {t('about.index')}
            </span>

            <div className="relative flex flex-col gap-9">
              <div className="flex gap-4 sm:gap-5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-accent via-accent-2 to-transparent"
                />
                <p className="text-display-lg font-semibold text-balance">{copy.summaryLead}</p>
              </div>

              {copy.summaryRest ? (
                <p className="max-w-3xl border-t border-line/70 pt-8 text-read text-fg-muted">
                  {copy.summaryRest}
                </p>
              ) : null}

              <div className="grid gap-3 border-t border-line/70 pt-8 sm:grid-cols-3">
                {copy.outcomes.map((outcome) => (
                  <div key={outcome.id} className="card-surface flex flex-col gap-1.5 rounded-lg p-4">
                    <span className="font-mono text-h3 font-semibold text-fg tabular-nums">
                      {outcome.value}
                    </span>
                    <span className="text-sm leading-relaxed text-fg-muted">{outcome.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up">
          <StoryChapter />
        </Reveal>
      </div>
    </SectionShell>
  )
}
