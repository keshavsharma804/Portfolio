import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-media-query'
import { usePlainView, useI18n } from '@/lib/use-preferences'
import { useContent } from '@/lib/use-content'
import { duration, easing } from '@/lib/tokens'
import { cn } from '@/lib/cn'

/**
 * Scroll-driven narrative: the roles read as chapters of one career story
 * instead of three separate cards.
 *
 * The reader controls the pace. One spring drives the progress rail, the
 * chapter markers, the travelling glow and which chapter is on screen, so
 * they can never drift apart. Under reduced motion or recruiter view this
 * degrades to a plain stacked list: every chapter fully rendered, no
 * scroll-linked state, nothing hidden behind a reveal.
 */
export function StoryChapter({ className }: { className?: string }) {
  const { story } = useContent()
  const reduce = usePrefersReducedMotion()
  const { plain } = usePlainView()
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)

  const chapters = story.chapters
  const last = Math.max(1, chapters.length - 1)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.4'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.5 })

  // Float position across the chapter range, e.g. 0.4 between chapters 0 and 1.
  const position = useTransform(progress, [0, 1], [0, last])
  const [nearest, setNearest] = useState(0)
  useNearestInteger(position, setNearest)

  const railScale = useTransform(progress, [0, 1], [0, 1])
  const glowLeft = useTransform(progress, [0, 1], ['12%', '88%'])

  // Recruiter view gets every chapter on screen at once, which is the whole
  // point: a reviewer should be able to read the full career record top to
  // bottom without scrolling to trigger reveals.
  const staticRead = reduce || plain
  const active = staticRead ? null : nearest

  return (
    <div ref={ref} className={cn('relative', className)}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-line pb-4">
        {/*
          Was an <h3> at text-2xs, so a heading rendered at 12px — smaller than
          the body copy it introduced. Promoted to a real heading size, with the
          monospace eyebrow demoted to a plain span above it.
        */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-2xs tracking-label text-accent uppercase" aria-hidden="true">
            {t('about.path')}
          </span>
          <h3 className="text-h3 font-semibold text-fg">{story.label}</h3>
        </div>
        {staticRead ? null : (
          /*
            Instructional copy, so it is set at full strength. It was
            `text-fg-subtle/70`, which compounded an already-failing token and
            measured 2.6:1 — the one piece of text the reader most needs.
          */
          <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
            {story.hint}
          </span>
        )}
      </header>

      <div className="relative grid gap-8 pt-8 md:grid-cols-[3.5rem_1fr] md:gap-10">
        {staticRead ? null : (
          <>
            {/* Spine the story runs along, with a marker per chapter. */}
            <div className="relative hidden md:col-start-1 md:block" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 w-px bg-line" />
              <motion.span
                className="absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3"
                style={{ scaleY: railScale }}
              />
              {chapters.map((chapter, index) => (
                <ChapterMarker key={chapter.id} position={position} index={index} count={chapters.length} />
              ))}
            </div>

            {/*
              Reading position, so the number is not the only signal. Was
              text-6xl (60px) at fg/5 — larger than any heading in the document,
              which let a decorative marker out-size the content it annotated.
              Now a watermark: smaller than the h3 above it and fainter.
            */}
            <div className="pointer-events-none absolute -top-1 right-0 hidden font-mono text-4xl leading-none font-bold text-fg/[0.07] select-none md:block">
              <ChapterNumber position={position} count={chapters.length} />
            </div>

            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -z-10 size-72 rounded-full bg-accent/10 blur-3xl"
              style={{ left: glowLeft }}
            />
          </>
        )}

        <div className="flex flex-col md:col-start-2">
          {chapters.map((chapter, index) => {
            const isActive = active === null || active === index

            return (
              /*
               * Every stage reserves its height whether or not it holds the
               * active chapter. Without this the column collapses to the height
               * of whichever body is on screen, the scroll range shrinks as the
               * reader moves, and the chapter boundaries start jumping.
               *
               * The reserve is deliberately tight (18rem/22rem rather than the
               * 24rem/30rem it used to be). A chapter body tops out around 17rem,
               * so the old figures left a visible empty band under every body
               * and, with only one body rendered at a time, that band read as a
               * gap between chapters while scrolling.
               */
              <article
                key={chapter.id}
                className={cn('relative', staticRead ? 'py-6' : 'min-h-[18rem] py-6 md:min-h-[22rem] md:first:pt-0')}
              >
                {staticRead ? null : <MobileChapterProgress position={position} index={index} count={chapters.length} />}

                {/*
                 * Not mode="wait". Each chapter owns its own AnimatePresence, so
                 * "wait" only serialised the outgoing body before the incoming
                 * one appeared, leaving the stage blank mid-scroll. The default
                 * crossfade overlaps them, so one body is always on screen.
                 */}
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      key="body"
                      initial={staticRead ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={staticRead ? undefined : { opacity: 0, y: -16, filter: 'blur(6px)' }}
                      transition={{ duration: duration.slow / 1000, ease: easing.entrance }}
                      className="flex flex-col gap-4"
                    >
                      <p className="flex flex-wrap items-center gap-x-3 font-mono text-2xs tracking-label uppercase">
                        <span className="text-accent">{chapter.phase}</span>
                        <span aria-hidden="true" className="text-fg-subtle/50">
                          /
                        </span>
                        <span className="text-fg-subtle">{chapter.period}</span>
                      </p>

                      <h4 className="max-w-2xl text-balance font-mono text-h4 leading-[1.25] font-semibold text-fg">
                        {chapter.headline}
                      </h4>

                      <p className="max-w-2xl leading-relaxed text-fg-muted">{chapter.body}</p>

                      <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-5">
                        {chapter.metrics.map((metric) => (
                          <div key={metric.id} className="flex flex-col gap-1">
                            <dd className="font-mono text-h3 font-semibold text-fg tabular-nums">
                              {metric.value}
                            </dd>
                            <dt className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                              {metric.label}
                            </dt>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ChapterMarker({
  position,
  index,
  count,
}: {
  position: MotionValue<number>
  index: number
  count: number
}) {
  const last = Math.max(1, count - 1)
  const top = `${(index / last) * 100}%`
  const opacity = useTransform(position, [index - 0.6, index, index + 0.6], [0.3, 1, 0.3])
  const scale = useTransform(position, [index - 0.6, index, index + 0.6], [1, 1.6, 1])

  return (
    <motion.span
      className="absolute -left-[3px] size-[7px] rounded-full bg-accent"
      style={{ top, opacity, scale }}
    />
  )
}

/** Horizontal rail for narrow screens, where the vertical spine is hidden. */
function MobileChapterProgress({
  position,
  index,
  count,
}: {
  position: MotionValue<number>
  index: number
  count: number
}) {
  const last = Math.max(1, count - 1)
  const width = useTransform(position, [index / last, (index + 1) / last], ['0%', '100%'])

  return (
    <div className="mb-5 h-px w-full overflow-hidden bg-line md:hidden" aria-hidden="true">
      <motion.span className="block h-full bg-accent" style={{ width }} />
    </div>
  )
}

function ChapterNumber({ position, count }: { position: MotionValue<number>; count: number }) {
  const [value, setValue] = useState(0)
  useNearestInteger(position, setValue)
  return <>{String(Math.min(count, value + 1)).padStart(2, '0')}</>
}

/**
 * Mirrors a float motion value into React state, but only when the rounded
 * integer changes — so this re-renders a few times per scroll, not every frame.
 */
function useNearestInteger(value: MotionValue<number>, onChange: (n: number) => void) {
  const lastSent = useRef(Math.round(value.get()))

  useMotionValueEvent(value, 'change', (latest) => {
    const next = Math.round(latest)
    if (next === lastSent.current) return
    lastSent.current = next
    onChange(next)
  })
}
