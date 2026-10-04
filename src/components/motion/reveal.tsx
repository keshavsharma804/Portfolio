import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import {
  blurUp,
  fadeIn,
  scaleIn,
  slideLeft,
  slideRight,
  slideUp,
  stagger,
  viewportOnce,
} from '@/lib/motion'

type RevealVariant = 'fade' | 'up' | 'left' | 'right' | 'scale' | 'blur'

const variants: Record<RevealVariant, Variants> = {
  fade: fadeIn,
  up: slideUp,
  left: slideLeft,
  right: slideRight,
  scale: scaleIn,
  blur: blurUp,
}

const distance: Record<RevealVariant, number> = {
  fade: 0,
  up: 26,
  left: 30,
  right: -30,
  scale: 0,
  blur: 16,
}

type RevealProps = {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
  as?: 'div' | 'section' | 'li' | 'span' | 'article' | 'header'
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration,
  className,
  once = true,
  amount,
  as = 'div',
}: RevealProps) {
  void once
  const reduce = useReducedMotion()
  const Component = motion[as]
  const offset = distance[variant]

  const axis = variant === 'up' || variant === 'blur' ? 'y' : variant === 'left' ? 'x' : variant === 'right' ? 'x' : undefined

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ ...viewportOnce, once, ...(amount !== undefined ? { amount } : null) }}
      variants={reduce ? fadeIn : variants[variant]}
      transition={
        duration !== undefined
          ? { duration: duration / 1000, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : delay }
          : { delay: reduce ? 0 : delay }
      }
      style={axis ? ({ [axis]: offset } as never) : undefined}
    >
      {children}
    </Component>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  interval?: number
  delay?: number
  amount?: number
  once?: boolean
  as?: 'div' | 'ul' | 'section'
}

export function Stagger({ children, className, interval = 0.07, delay = 0, amount, once = true, as = 'div' }: StaggerProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ ...viewportOnce, once, ...(amount !== undefined ? { amount } : null) }}
      variants={stagger(interval, delay)}
    >
      {children}
    </Component>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  variant?: RevealVariant
  as?: 'div' | 'li' | 'article'
}

export function StaggerItem({ children, className, variant = 'up', as = 'div' }: StaggerItemProps) {
  const reduce = useReducedMotion()
  const Component = motion[as]
  return (
    <Component className={className} variants={reduce ? fadeIn : variants[variant]}>
      {children}
    </Component>
  )
}
