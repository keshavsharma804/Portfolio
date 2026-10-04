import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-media-query'
import { useI18n } from '@/lib/use-preferences'
import { Monogram } from '@/components/ui/monogram'
import { duration, easing } from '@/lib/tokens'

const SESSION_KEY = 'pf-boot-seen'

// Storage access throws in blocked-cookie and some private-browsing modes.
// A failed read/write must never stop the site from rendering.
function sessionSeen(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}
const MIN_MS = 2600
const MAX_MS = 5200

const bootLines = [
  { t: 'initialising render pipeline', s: 'ok' },
  { t: 'mounting design token graph', s: 'ok' },
  { t: 'compiling motion primitives', s: 'ok' },
  { t: 'calibrating radar sweep', s: 'ok' },
  { t: 'resolving content manifest', s: 'ok' },
  { t: 'portfolio ready', s: 'done' },
]

type Blip = { angle: number; dist: number; born: number; period: number }

function palette() {
  const styles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
  return {
    accent: read('--pf-accent', '#4d7cfe'),
    accent2: read('--pf-accent-2', '#7c5cff'),
    accent3: read('--pf-accent-3', '#2ee6c5'),
  }
}

export function BootSequence() {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(() => (typeof window === 'undefined' ? false : !sessionSeen()))
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'radar' | 'charge' | 'burst' | 'exit'>('radar')
  const [lineCount, setLineCount] = useState(0)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (!visible) return

    // Registered FIRST, before any bail-out below. This overlay covers the whole
    // viewport, so a failure while setting up must never leave it on screen and
    // swallow every click.
    const failsafe = window.setTimeout(() => {
      markSeen()
      setVisible(false)
    }, MAX_MS + 4000)

    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return () => window.clearTimeout(failsafe)
    const ctx = canvas.getContext('2d')
    if (!ctx) return () => window.clearTimeout(failsafe)

    const started = performance.now()
    const colors = palette()
    const blips: Blip[] = Array.from({ length: 9 }, (_, i) => ({
      angle: (i / 9) * Math.PI * 2 + 0.4,
      dist: 0.26 + ((i * 7) % 11) / 26,
      born: -((i * 900) % 5200),
      period: 5200,
    }))

    let raf = 0
    let done = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const draw = (time: number) => {
      const elapsed = time - started
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.36

      ctx.clearRect(0, 0, w, h)

      const charge = Math.min(1, Math.max(0, (elapsed - MIN_MS * 0.45) / (MIN_MS * 0.55)))
      const burst = Math.max(0, Math.min(1, (elapsed - MIN_MS) / 620))

      ctx.lineWidth = 1

      for (let i = 1; i <= 5; i++) {
        const p = i / 5
        ctx.beginPath()
        ctx.arc(cx, cy, R * p, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + charge * 0.05})`
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.moveTo(cx - R * 1.15, cy)
      ctx.lineTo(cx + R * 1.15, cy)
      ctx.moveTo(cx, cy - R * 1.15)
      ctx.lineTo(cx, cy + R * 1.15)
      ctx.strokeStyle = `rgba(255,255,255,${0.045 + charge * 0.05})`
      ctx.stroke()

      const sweepAngle = (elapsed / 1900) * Math.PI * 2
      const grad = ctx.createConicGradient
        ? ctx.createConicGradient(sweepAngle - 1.1, cx, cy)
        : null

      if (grad) {
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(0.82, 'rgba(0,0,0,0)')
        grad.addColorStop(1, `${colors.accent}00`)
        const hex = colors.accent.replace('#', '')
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        grad.addColorStop(0.995, `rgba(${r},${g},${b},0.45)`)
      }

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()
      if (grad) {
        ctx.fillStyle = grad
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2)
      }

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(sweepAngle) * R, cy + Math.sin(sweepAngle) * R)
      ctx.strokeStyle = `rgba(255,255,255,0.5)`
      ctx.stroke()
      ctx.restore()

      for (const blip of blips) {
        const age = ((elapsed - blip.born) % blip.period + blip.period) % blip.period
        const p = age / blip.period
        const relative = (sweepAngle - blip.angle) % (Math.PI * 2)
        const lit = relative < 0.18 || relative > Math.PI * 2 - 0.18
        const x = cx + Math.cos(blip.angle) * R * blip.dist
        const y = cy + Math.sin(blip.angle) * R * blip.dist

        if (lit) {
          ctx.beginPath()
          ctx.arc(x, y, 2.4 + p * 9, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 0.55 * (1 - p * 5))})`
          ctx.lineWidth = 1.2
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = p < 1.4 ? colors.accent3 : 'rgba(255,255,255,0.18)'
        ctx.fill()
      }

      const waveCount = reduce ? 3 : 9
      for (let i = 0; i < waveCount; i++) {
        const p = ((elapsed / 2100) + i / waveCount) % 1
        const rr = R * (0.18 + p * 1.5) + charge * R * 0.25
        ctx.beginPath()
        ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.16 * (0.4 + charge)})`
        ctx.stroke()
      }

      const coreR = 6 + charge * 16 + burst * 70
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)')
      coreGrad.addColorStop(0.35, `${colors.accent2}cc`)
      coreGrad.addColorStop(1, `${colors.accent}00`)
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.fill()

      if (burst > 0) {
        ctx.beginPath()
        ctx.arc(cx, cy, R * (0.4 + burst * 1.9), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${(1 - burst) * 0.75})`
        ctx.lineWidth = 2 + burst * 6
        ctx.stroke()
      }
    }

    const tick = (time: number) => {
      // A throw inside draw would silently kill the loop. Swallow it: the
      // timers below still drive progress and dismissal.
      try {
        draw(time)
      } catch {
        /* keep the overlay dismissible */
      }
      raf = requestAnimationFrame(tick)
    }

    if (reduce) {
      try {
        draw(started)
      } catch {
        /* ignore */
      }
    } else {
      raf = requestAnimationFrame(tick)
    }

    const progressInterval = window.setInterval(() => {
      const ceiling = Math.min(96, ((time0() - started) / MAX_MS) * 100)
      setProgress((current) => (current >= ceiling ? current : current + (ceiling - current) * 0.1 + 0.5))
    }, 40)

    const lineInterval = window.setInterval(() => {
      setLineCount((count) => {
        if (count >= bootLines.length) return count
        return count + 1
      })
    }, 320)

    const finish = async () => {
      if (done) return
      done = true
      setPhase('burst')
      setProgress(100)
      setLineCount(bootLines.length)
      await new Promise((r) => window.setTimeout(r, reduce ? 0 : 520))
      setPhase('exit')
      await new Promise((r) => window.setTimeout(r, reduce ? 0 : duration.slow))
      markSeen()
      setVisible(false)
      window.scrollTo(0, 0)
    }

    const cap = window.setTimeout(finish, MIN_MS + (reduce ? 0 : 1400))
    const onSkip = () => void finish()
    window.addEventListener('keydown', onSkip)
    wrap.addEventListener('click', onSkip)

    // Safety net: never let the overlay outlive its budget. If anything above
    // stalls (throttled tab, interrupted animation) the page must stay usable.
    return () => {
      window.clearTimeout(cap)
      window.clearTimeout(failsafe)
      window.clearInterval(progressInterval)
      window.clearInterval(lineInterval)
      window.removeEventListener('keydown', onSkip)
      wrap.removeEventListener('click', onSkip)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [visible, reduce])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="boot"
          ref={wrapRef}
          className={cn(
            'fixed inset-0 z-boot cursor-pointer overflow-hidden bg-bg',
            // The wipe must never trap the page: as soon as it starts leaving,
            // clicks fall through to the nav and content underneath.
            phase !== 'radar' && phase !== 'charge' && 'pointer-events-none',
          )}
          initial={{ opacity: 1 }}
          animate={{
            y: phase === 'exit' ? '-100%' : 0,
            opacity: phase === 'exit' ? 0 : 1,
          }}
          transition={{ duration: reduce ? 0 : duration.slower / 1000, ease: easing.entrance }}
          role="status"
          aria-label={t('common.loading')}
        >
          <div className="absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
          <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />

          {reduce ? null : (
            <div
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 mix-blend-screen',
                phase === 'burst' && 'animate-[flash_0.5s_ease-out_forwards]',
              )}
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6">
            <motion.div
              className="relative grid place-items-center"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: duration.slow / 1000, ease: easing.entrance }}
            >
              <Monogram size="lg" tint decorative={false} />
            </motion.div>

            <div className="w-full max-w-sm">
              <ul className="flex flex-col gap-1 font-mono text-2xs tracking-label uppercase">
                {bootLines.slice(0, lineCount).map((line) => (
                  <motion.li
                    key={line.t}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between gap-4 text-fg-subtle"
                  >
                    <span className="truncate">{line.t}</span>
                    <span className={line.s === 'done' ? 'text-success' : 'text-accent'}>{line.s}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 h-px w-full overflow-hidden bg-line">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-2xs tracking-label text-fg-subtle uppercase">
                <span>{phase === 'exit' ? t('boot.ready') : t('boot.booting')}</span>
                <span className="tabular-nums">{String(Math.round(progress)).padStart(3, '0')}</span>
              </div>
            </div>
          </div>

          <p className="absolute bottom-8 w-full text-center font-mono text-2xs tracking-label text-fg-subtle uppercase">
            {t('boot.skip')}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function time0() {
  return performance.now()
}
