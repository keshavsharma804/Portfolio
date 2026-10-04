import { AnimatePresence, motion } from 'motion/react'
import { Trophy } from 'lucide-react'
import { useAchievements } from '@/lib/gamify'
import { useMotionValue, useSpring, useTransform } from 'motion/react'
import { useScroll } from 'motion/react'
import { duration, easing } from '@/lib/tokens'

export function AchievementToast() {
  const achievement = useAchievements()

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-24 z-toast flex flex-col items-end gap-2"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {achievement ? (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ duration: duration.base / 1000, ease: easing.entrance }}
            className="flex items-center gap-3 rounded-lg border border-[var(--pf-accent-line)] bg-bg-elevated/95 px-4 py-3 shadow-lifted backdrop-blur-xl"
          >
            <span className="grid size-8 place-items-center rounded-md bg-accent-soft text-accent">
              <Trophy className="size-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-fg">{achievement.title}</span>
              <span className="font-mono text-2xs tracking-tight text-fg-subtle">{achievement.detail}</span>
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/** Thin XP-style bar that fills as the page is read. */
export function XpBar() {
  const { scrollYProgress } = useScroll()
  const raw = useMotionValue(0)
  const width = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  })

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-nav h-0.5 bg-line/40"
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        style={{ width, scaleX: 1 }}
      />
      <motion.div style={{ opacity: raw }} />
    </div>
  )
}
