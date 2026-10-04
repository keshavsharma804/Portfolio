import { motion, useScroll, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { layers } from '@/lib/tokens'

export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, zIndex: layers.toast }}
      className={cn(
        'fixed inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3',
        className,
      )}
    />
  )
}
