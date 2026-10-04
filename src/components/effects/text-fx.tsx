import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/** Flickers through random glyphs, then settles on the real value. */
export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 34,
}: {
  text: string
  className?: string
  delay?: number
  speed?: number
}) {
  const reduce = usePrefersReducedMotion()
  const [out, setOut] = useState(reduce ? text : '')

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let start = 0
    const queue = text.split('').map((char, i) => ({
      from: Math.floor(Math.random() * 24),
      to: char,
      start: delay * 1000 + i * speed,
      end: delay * 1000 + i * speed + speed * 5,
    }))

    const tick = (time: number) => {
      if (!start) start = time
      let done = 0
      let result = ''
      for (const item of queue) {
        if (time >= item.end) {
          done += 1
          result += item.to
        } else if (time >= item.start) {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        } else {
          result += ' '
        }
      }
      setOut(result)
      if (done === queue.length) {
        setOut(text)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, speed, reduce])

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

/** Types a value out, holds, then cycles to the next. */
export function Typewriter({
  items,
  className,
  typeSpeed = 62,
  holdMs = 1500,
  deleteSpeed = 34,
}: {
  items: string[]
  className?: string
  typeSpeed?: number
  holdMs?: number
  deleteSpeed?: number
}) {
  const reduce = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [out, setOut] = useState(reduce ? items[0] ?? '' : '')
  const deleting = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (reduce) return
    const current = items[index] ?? ''

    if (!deleting.current && out === current) {
      timer.current = window.setTimeout(() => {
        deleting.current = true
      }, holdMs)
      return () => window.clearTimeout(timer.current)
    }

    if (deleting.current && out === '') {
      deleting.current = false
      setIndex((i) => (i + 1) % items.length)
      return
    }

    timer.current = window.setTimeout(
      () => {
        setOut(current.slice(0, out.length + (deleting.current ? -1 : 1)))
      },
      deleting.current ? deleteSpeed : typeSpeed,
    )
    return () => window.clearTimeout(timer.current)
  }, [out, index, items, holdMs, typeSpeed, deleteSpeed, reduce])

  return (
    <span className={cn('inline-flex items-baseline', className)}>
      <span aria-live="polite">{out}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent motion-safe:animate-pulse"
      />
    </span>
  )
}

/** Terminal lines that type in one after another, with a blinking caret. */
export function TerminalLines({
  lines,
  className,
  interval = 620,
}: {
  lines: { text: string; tone?: 'ok' | 'live' | 'plain' }[]
  className?: string
  interval?: number
}) {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [count, setCount] = useState(reduce ? lines.length : 1)

  useEffect(() => {
    if (reduce) return
    if (!inView) return
    if (count >= lines.length) return
    const id = window.setTimeout(() => setCount((c) => c + 1), interval)
    return () => window.clearTimeout(id)
  }, [inView, count, lines.length, interval, reduce])

  return (
    <ol ref={ref} className={cn('flex flex-col gap-1.5 font-mono text-2xs tracking-tight', className)}>
      {lines.slice(0, count).map((line) => (
        <motion.li
          key={line.text}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <span
            className={cn(
              'shrink-0',
              line.tone === 'live' ? 'text-accent' : line.tone === 'ok' ? 'text-success' : 'text-fg-subtle',
            )}
            aria-hidden="true"
          >
            {line.tone === 'plain' ? '·' : line.tone === 'live' ? '>' : 'ok'}
          </span>
          <span className="text-fg-muted">{line.text}</span>
        </motion.li>
      ))}
      {count < lines.length ? (
        <li className="flex items-center gap-2" aria-hidden="true">
          <span className="text-fg-subtle">_</span>
        </li>
      ) : null}
    </ol>
  )
}
