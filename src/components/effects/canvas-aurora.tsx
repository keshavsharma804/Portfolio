import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

type Blob = {
  color: string
  ax: number
  ay: number
  fx: number
  fy: number
  px: number
  py: number
  radius: number
  alpha: number
}

function readPalette(): string[] {
  const styles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
  return [
    read('--pf-accent', '#4d7cfe'),
    read('--pf-accent-2', '#7c5cff'),
    read('--pf-accent-3', '#2ee6c5'),
  ]
}

function makeBlobs(colors: string[]): Blob[] {
  return colors.map((color, i) => ({
    color,
    ax: 0.16 + i * 0.05,
    ay: 0.1 + i * 0.035,
    fx: 0.00013 + i * 0.00004,
    fy: 0.00017 + i * 0.00003,
    px: i * 2.1,
    py: i * 1.3,
    radius: 0.42 - i * 0.05,
    alpha: 0.5 - i * 0.08,
  }))
}

export function CanvasAurora({
  className,
  scale = 0.16,
  intensity = 1,
  paused = false,
}: {
  className?: string
  scale?: number
  intensity?: number
  paused?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = usePrefersReducedMotion()
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let palette = readPalette()
    let blobs = makeBlobs(palette)

    const draw = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(window.innerWidth * scale))
      const h = Math.max(1, Math.round(window.innerHeight * scale))
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (const blob of blobs) {
        const t = time * 1
        const x = (0.5 + Math.sin(t * blob.fx * 1000 + blob.px) * blob.ax) * w
        const y = (0.42 + Math.cos(t * blob.fy * 1000 + blob.py) * blob.ay) * h
        const r = blob.radius * Math.max(w, h)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `${blob.color}${Math.round(blob.alpha * 255 * intensity).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(0.45, `${blob.color}1f`)
        gradient.addColorStop(1, `${blob.color}00`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
    }

    const still = () => draw(0)

    if (reduce) {
      still()
      return
    }

    let frame = requestAnimationFrame(function loop(time) {
      if (!pausedRef.current && document.visibilityState === 'visible') draw(time)
      frame = requestAnimationFrame(loop)
    })

    const observer = new MutationObserver(() => {
      palette = readPalette()
      blobs = makeBlobs(palette)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const onResize = () => draw(performance.now())
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [reduce, scale, intensity])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none h-full w-full', className)}
    />
  )
}
