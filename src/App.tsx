import { Suspense, lazy, useCallback, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { AmbientBackground } from '@/components/effects/ambient'
import { Confetti } from '@/components/effects/confetti'
import { CustomCursor } from '@/components/interactive/custom-cursor'
import { CommandPaletteProvider } from '@/components/interactive/command-palette-provider'
import { Navigation } from '@/components/layout/navigation'
import { BootSequence } from '@/components/motion/boot-sequence'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { SideRail } from '@/components/hud/side-rail'
import { StatusBar } from '@/components/hud/status-bar'
import { AchievementToast, XpBar } from '@/components/hud/feedback'
import { Hero } from '@/sections/hero'
import { About } from '@/sections/about'
import { useI18n, usePlainView } from '@/lib/use-preferences'
import { useAchievementTriggers, useKonami } from '@/lib/gamify'

/*
 * Hero and About stay in the initial chunk — they are above the fold. Everything
 * below is split out so the first paint ships a fraction of the 543 kB bundle.
 */
const Skills = lazy(() => import('@/sections/skills').then((m) => ({ default: m.Skills })))
const Experience = lazy(() => import('@/sections/experience').then((m) => ({ default: m.Experience })))
const Projects = lazy(() => import('@/sections/projects').then((m) => ({ default: m.Projects })))
const Currently = lazy(() => import('@/sections/currently').then((m) => ({ default: m.Currently })))
const Education = lazy(() => import('@/sections/contact').then((m) => ({ default: m.Education })))
const Contact = lazy(() => import('@/sections/contact').then((m) => ({ default: m.Contact })))
const SiteFooter = lazy(() => import('@/sections/contact').then((m) => ({ default: m.SiteFooter })))

function SectionFallback() {
  return <div aria-hidden="true" className="min-h-[60vh]" />
}

export default function App() {
  const { t } = useI18n()
  const [confetti, setConfetti] = useState(false)
  const { plain } = usePlainView()

  // Recruiter view must not silently consume achievements: the toast is hidden
  // there, so unlocking would mark milestones "seen" with no visible feedback.
  useAchievementTriggers(!plain)

  const disco = useCallback(() => {
    setConfetti(true)
    document.documentElement.dataset.discos = 'on'
    window.setTimeout(() => {
      delete document.documentElement.dataset.discos
    }, 6000)
  }, [])
  useKonami(disco, !plain)

  return (
    /*
     * `reducedMotion="always"` is the part the stylesheet could never do. The
     * `data-plain` rules kill CSS animations, but Motion writes transforms as
     * inline styles from JS, so without this the recruiter view still animated.
     */
    <MotionConfig reducedMotion={plain ? 'always' : 'never'}>
      {/* The palette stays available in recruiter view — a keyboard-driven
          jump-to-section is exactly what that mode is for. */}
      <CommandPaletteProvider>
      {/* No bg-* here on purpose: the base colour lives on <body>, and this
          element must stay transparent or it paints over the -z-10 ambient layer. */}
      <div className="relative min-h-dvh">
        {/* Recruiter view skips the boot overlay entirely — it is a blocking
            2.6-4.0s splash, and the whole point of the mode is to get to content. */}
        {plain ? null : <BootSequence />}
        {plain ? null : <SmoothScroll />}
        {plain ? null : <AmbientBackground />}

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-boot focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          {t('nav.skip')}
        </a>

        <Navigation />
        {/* The rail, status bar and XP bar are decorative chrome, so recruiter
            view drops them and leaves a clean document. */}
        {plain ? null : <SideRail />}
        {plain ? null : <StatusBar />}
        {plain ? null : <XpBar />}
        {plain ? null : <CustomCursor />}

        {/* tabIndex lets the skip link actually move focus, not just the viewport. */}
        <main id="main" tabIndex={-1} className="pb-8 outline-none lg:pb-9">
          <Hero />
          <About />
          <Suspense fallback={<SectionFallback />}>
            <Skills />
            <Experience />
            <Projects />
            <Currently />
            <Education />
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>

        {plain ? null : <AchievementToast />}
        {plain ? null : <Confetti active={confetti} />}
      </div>
      </CommandPaletteProvider>
    </MotionConfig>
  )
}
