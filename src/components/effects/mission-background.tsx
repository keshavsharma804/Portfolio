import { useEffect, useRef } from 'react'
import { useIsMobile, usePrefersReducedMotion } from '@/lib/use-media-query'

type Blob = { x: number; y: number; r: number; vx: number; vy: number; hue: number }
type Node = { x: number; y: number; vx: number; vy: number }
type Pulse = { a: number; b: number; t: number }

const FRAME_MS = 33
const SPRITE = 192
const ALPHA_BUCKETS = 4

function readVars() {
  const s = getComputedStyle(document.documentElement)
  const read = (n: string, f: string) => s.getPropertyValue(n).trim() || f
  return {
    accent: read('--pf-accent', '#4d7cfe'),
    accent2: read('--pf-accent-2', '#7c5cff'),
    accent3: read('--pf-accent-3', '#2ee6c5'),
    line: read('--pf-line', 'rgba(255,255,255,0.08)'),
  }
}

/** Soft radial blob, rasterised once and blitted each frame. */
function makeBlobSprite(hex: string): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = SPRITE
  c.height = SPRITE
  const ctx = c.getContext('2d')
  if (ctx) {
    const r = SPRITE / 2
    const g = ctx.createRadialGradient(r, r, 0, r, r, r)
    g.addColorStop(0, `${hex}1f`)
    g.addColorStop(0.5, `${hex}0a`)
    g.addColorStop(1, `${hex}00`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, SPRITE, SPRITE)
  }
  return c
}

function makeDotSprite(hex: string): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 24
  c.height = 24
  const ctx = c.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(12, 12, 0, 12, 12, 12)
    g.addColorStop(0, `${hex}99`)
    g.addColorStop(1, `${hex}00`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 24, 24)
  }
  return c
}

/**
 * Single canvas stacking every background layer so they composite in one pass:
 * soft mesh gradient, drifting neural node graph, and edge pulses.
 *
 * Cost control: blobs and pulse glows are pre-rasterised sprites, proximity
 * links are batched into a handful of strokes instead of one per pair, the
 * backing store is capped at 1.5x DPR, the loop is throttled to ~30fps, and it
 * stops entirely while the tab is hidden.
 */
export function MissionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { accent, accent2, accent3, line } = readVars()
    const blobSprites = [makeBlobSprite(accent), makeBlobSprite(accent2), makeBlobSprite(accent3)]
    const dotSprite = makeDotSprite(accent3)
    const colors = [accent, accent2, accent3]

    let w = 0
    let h = 0
    let paused = document.hidden

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 180)
    }
    window.addEventListener('resize', onResize, { passive: true })

    const blobCount = isMobile ? 3 : 5
    const blobs: Blob[] = Array.from({ length: blobCount }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.min(w, h) * (0.22 + Math.random() * 0.2),
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      hue: i,
    }))

    const nodeCount = isMobile ? 14 : 30
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
    }))

    const pulses: Pulse[] = Array.from({ length: isMobile ? 2 : 5 }, () => ({
      a: Math.floor(Math.random() * nodeCount),
      b: Math.floor(Math.random() * nodeCount),
      t: Math.random(),
    }))

    const linkDist = isMobile ? 96 : 132
    const buckets: number[][] = Array.from({ length: ALPHA_BUCKETS }, () => [])
    let raf = 0
    let last = 0

    const draw = (time: number) => {
      const delta = last === 0 ? 16 : Math.min(time - last, 48)
      last = time
      ctx.clearRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'

      for (const blob of blobs) {
        if (!reduce) {
          blob.x += blob.vx * delta
          blob.y += blob.vy * delta
          if (blob.x < -blob.r || blob.x > w + blob.r) blob.vx *= -1
          if (blob.y < -blob.r || blob.y > h + blob.r) blob.vy *= -1
        }
        const breathe = reduce ? 1 : 1 + Math.sin(time / 4200 + blob.hue) * 0.12
        const r = blob.r * breathe
        ctx.drawImage(blobSprites[blob.hue % blobSprites.length], blob.x - r, blob.y - r, r * 2, r * 2)
      }

      for (const node of nodes) {
        if (reduce) break
        node.x += node.vx * delta
        node.y += node.vy * delta
        if (node.x < 0) node.x = w
        if (node.x > w) node.x = 0
        if (node.y < 0) node.y = h
        if (node.y > h) node.y = 0
      }

      for (let i = 0; i < ALPHA_BUCKETS; i += 1) buckets[i].length = 0
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > linkDist * linkDist) continue
          const fade = 1 - Math.sqrt(d2) / linkDist
          const bucket = Math.min(ALPHA_BUCKETS - 1, Math.floor(fade * ALPHA_BUCKETS))
          buckets[bucket].push(a.x, a.y, b.x, b.y)
        }
      }

      ctx.lineWidth = 1
      ctx.strokeStyle = line
      for (let i = 0; i < ALPHA_BUCKETS; i += 1) {
        const seg = buckets[i]
        if (seg.length === 0) continue
        ctx.globalAlpha = ((i + 0.5) / ALPHA_BUCKETS) * 0.9
        ctx.beginPath()
        for (let k = 0; k < seg.length; k += 4) {
          ctx.moveTo(seg[k], seg[k + 1])
          ctx.lineTo(seg[k + 2], seg[k + 3])
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      ctx.fillStyle = colors[0]
      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2)
        ctx.globalAlpha = 0.5
        ctx.fill()
      }
      ctx.globalAlpha = 1

      for (const pulse of pulses) {
        if (!reduce) pulse.t = (pulse.t + delta * 0.00022) % 1
        const a = nodes[pulse.a]
        const b = nodes[pulse.b]
        const x = a.x + (b.x - a.x) * pulse.t
        const y = a.y + (b.y - a.y) * pulse.t
        ctx.drawImage(dotSprite, x - 10, y - 10, 20, 20)
        ctx.beginPath()
        ctx.arc(x, y, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = colors[2]
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (time: number) => {
      if (paused) return
      if (time - last >= FRAME_MS) draw(time)
      raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      paused = document.hidden
      if (paused) {
        cancelAnimationFrame(raf)
        return
      }
      last = 0
      raf = requestAnimationFrame(loop)
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduce, isMobile])

  return <canvas ref={canvasRef} aria-hidden="true" />
}
