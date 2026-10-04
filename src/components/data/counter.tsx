import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

export function Counter({
  value,
  suffix = '',
  prefix = '',
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = usePrefersReducedMotion()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18, mass: 0.8 })
  const [display, setDisplay] = useState(0)

  useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring])

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      spring.jump(value)
      return
    }
    motionValue.set(value)
  }, [inView, reduce, value, motionValue, spring])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{display.toLocaleString('en-US')}</span>
      {suffix}
    </span>
  )
}
