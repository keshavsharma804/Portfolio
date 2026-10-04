import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'motion/react'

export function useActiveSection(ids: string[], offset = 140): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) current = id
      }
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 80
      if (atBottom) current = ids[ids.length - 1] ?? current
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offset])

  return active
}

export function useHideOnScroll(threshold = 120) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - last.current
      if (y < threshold) setHidden(false)
      else if (delta > 6) setHidden(true)
      else if (delta < -6) setHidden(false)
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}

export function useScrollProgress(): number {
  const { scrollYProgress } = useScroll()
  const [value, setValue] = useState(0)

  useEffect(() => scrollYProgress.on('change', setValue), [scrollYProgress])

  return value
}
