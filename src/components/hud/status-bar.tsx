import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'

export function StatusBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const [pct, setPct] = useState(0)
  const { locale } = useI18n()
  const content = useContent()

  useEffect(() => scrollYProgress.on('change', (v) => setPct(Math.round(v * 100))), [scrollYProgress])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-nav hidden border-t border-line/70 bg-bg/70 backdrop-blur-md lg:block"
      aria-hidden="true"
    >
      <motion.div
        className="h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        style={{ scaleX }}
      />
      <div className="container-page flex h-9 items-center justify-between gap-4 font-mono text-2xs tracking-label text-fg-subtle uppercase">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success" />
          {content.profile.role}
        </span>
        <span className="hidden md:inline">{content.profile.tagline}</span>
        <span className="flex items-center gap-4">
          <span>{content.profile.location}</span>
          <span className="tabular-nums">{String(pct).padStart(3, '0')}%</span>
          <span className="uppercase">{locale}</span>
        </span>
      </div>
    </div>
  )
}
