import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { Container } from '@/components/ui/container'
import { SectionVein, SectionWash } from '@/components/ui/section-vein'
import { Reveal } from '@/components/motion/reveal'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

export function SectionShell({
  id,
  index,
  path,
  title,
  description,
  children,
  aside,
  className,
  tone = 'accent',
}: {
  id: string
  index: string
  path: string
  title: string
  description?: string
  children?: ReactNode
  aside?: ReactNode
  className?: string
  /** Ambient wash tint. Alternating the accent keeps long pages from reading flat. */
  tone?: 'accent' | 'accent-2' | 'none'
}) {
  const ref = useRef<HTMLElement>(null)
  const reduce = usePrefersReducedMotion()
  // Driven directly by scroll position, not by a timer, so the line is always
  // in sync with the viewport no matter how the user navigates.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <section id={id} ref={ref} className={cn('relative scroll-mt-24 py-section', className)}>
      {/* Continuity between sections: a hairline that fades in from the page
          edge, plus a masked accent wash. Both are inert and non-interactive. */}
      <SectionVein tone={tone === 'none' ? 'none' : 'accent'} />
      <SectionWash tone={tone} />

      <Container>
        <div className="flex flex-col gap-8">
          <Reveal variant="up">
            <div className="relative flex flex-col gap-4 border-b border-line pb-6 lg:sticky lg:top-18 lg:z-20 lg:bg-bg/85 lg:py-4 lg:backdrop-blur-xl">
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px overflow-hidden">
                <motion.span
                  className="block h-full w-full origin-left bg-gradient-to-r from-accent via-accent-2 to-transparent"
                  style={reduce ? { scaleX: 1, opacity: 0.45 } : { scaleX: progress }}
                />
              </span>

              <div className="flex flex-wrap items-center gap-3 font-mono text-2xs tracking-label uppercase">
                <span className="text-fg-subtle">{index}</span>
                <span className="text-fg-subtle" aria-hidden="true">
                  ·
                </span>
                <span className="text-accent">{path}</span>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex max-w-2xl flex-col gap-3">
                  <h2 className="text-h1 font-semibold tracking-[-0.025em] text-fg">{title}</h2>
                  {description ? (
                    <p className="text-read text-fg-muted">{description}</p>
                  ) : null}
                </div>
                {aside ? <div className="shrink-0">{aside}</div> : null}
              </div>
            </div>
          </Reveal>

          {children}
        </div>
      </Container>
    </section>
  )
}

export function CommandLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 font-mono text-2xs tracking-label text-fg-subtle uppercase', className)}>
      <span className="text-success" aria-hidden="true">
        $
      </span>
      {children}
    </p>
  )
}
