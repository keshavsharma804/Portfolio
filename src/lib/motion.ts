import type { Transition, Variants } from 'motion/react'
import { duration, easing } from '@/lib/tokens'

type EaseTuple = [number, number, number, number]

export const easeStandard: EaseTuple = [...easing.standard]
export const easeEntrance: EaseTuple = [...easing.entrance]
export const easeExit: EaseTuple = [...easing.exit]

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  mass: 0.9,
}

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.7,
}

export const tween = (seconds: number, ease: EaseTuple = easeStandard): Transition => ({
  duration: seconds,
  ease,
})

const hidden = { opacity: 0 }
const shown = { opacity: 1, transition: { duration: duration.base / 1000, ease: easing.standard } }

export const fadeIn: Variants = { hidden, shown }

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  shown: { opacity: 1, scale: 1, transition: tween(duration.slow / 1000, easing.entrance) },
}

const riseDistance = 22

export const slideUp: Variants = {
  hidden: { opacity: 0, y: riseDistance },
  shown: { opacity: 1, y: 0, transition: tween(duration.slow / 1000, easing.entrance) },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: riseDistance },
  shown: { opacity: 1, x: 0, transition: tween(duration.slow / 1000, easing.entrance) },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -riseDistance },
  shown: { opacity: 1, x: 0, transition: tween(duration.slow / 1000, easing.entrance) },
}

export const blurUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  shown: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: tween(duration.slow / 1000, easing.entrance),
  },
}

export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren, delayChildren } },
})

export const staggerTight = stagger(0.04)

export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' } as const

export const viewportOnceTop = { once: true, amount: 0.1, margin: '0px 0px -5% 0px' } as const

export const hoverLift = {
  y: -4,
  transition: springSoft,
}

export const tapPress = { scale: 0.97 }

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: tween(duration.base / 1000) },
  exit: { opacity: 0, transition: tween(duration.fast / 1000, easing.exit) },
}

export const modalTransition: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  shown: { opacity: 1, scale: 1, y: 0, transition: tween(duration.base / 1000, easing.entrance) },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: tween(duration.fast / 1000, easing.exit) },
}
