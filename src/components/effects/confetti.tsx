import { useEffect, useRef } from 'react'

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  vr: number
}

const COLORS = ['var(--pf-accent)', 'var(--pf-accent-2)', 'var(--pf-accent-3)', 'var(--pf-fg)']

/** One-shot canvas confetti. Mount it and call nothing — it fires on mount. */
export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const pieces: Piece[] = Array.from({ length: 90 }, () => ({
      x: w * (0.3 + Math.random() * 0.4),
      y: h * 0.62,
      vx: (Math.random() - 0.5) * 11,
      vy: -6 - Math.random() * 9,
      size: 5 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.28,
    }))

    let raf = 0
    let last = 0

    const tick = (time: number) => {
      const delta = last === 0 ? 16 : Math.min(time - last, 48)
      last = time
      ctx.clearRect(0, 0, w, h)

      let alive = false
      for (const p of pieces) {
        p.vy += 0.34
        p.vx *= 0.995
        p.x += p.vx * delta
        p.y += p.vy * delta
        p.rot += p.vr * delta
        if (p.y < h + 40) alive = true

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - (p.y - h * 0.6) / (h * 0.6))
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }
      ctx.globalAlpha = 1

      if (alive) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, w, h)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={active ? 'pointer-events-none fixed inset-0 z-toast' : 'hidden'}
    />
  )
}
