import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'

type Tone = 'prompt' | 'cmd' | 'path' | 'label' | 'text' | 'accent' | 'ok' | 'dim'

export type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; tone: Tone; text: string }
  | { kind: 'rule' }
  | { kind: 'blank' }

/**
 * The panel is a self-contained device that keeps a dark shell in both themes,
 * so every colour inside it comes from the `--pf-term-*` set rather than the
 * page palette. Previously the body inherited `var(--pf-fg-muted)`, which in
 * light mode is navy `#4a5468` and measured 2.65:1 against `#05070d` — the
 * whole role description was effectively unreadable in light mode.
 */
const TONE_VAR: Record<Tone, string> = {
  prompt: 'var(--pf-term-prompt)',
  cmd: 'var(--pf-term-fg)',
  path: 'var(--pf-term-path)',
  label: 'var(--pf-term-label)',
  text: 'var(--pf-term-muted)',
  accent: 'var(--pf-term-path)',
  ok: 'var(--pf-term-ok)',
  dim: 'var(--pf-term-dim)',
}

/** Renders one terminal line, colouring a `key:` prefix differently from the value. */
function OutLine({ line }: { line: Extract<Line, { kind: 'out' }> }) {
  const separator = line.text.indexOf(':')
  const hasKey = separator > 0 && separator < 18

  return (
    <span style={{ color: TONE_VAR[line.tone] }}>
      {hasKey ? (
        <>
          <span style={{ color: TONE_VAR.label }}>{line.text.slice(0, separator)}</span>
          <span style={{ color: TONE_VAR.dim }}>:</span>
          {line.text.slice(separator + 1)}
        </>
      ) : (
        line.text
      )}
    </span>
  )
}

/**
 * Multi-colour CMD-style terminal. Types out scripted commands, pauses on
 * each result, and colour-codes prompt / command / label / body independently.
 */
export function TerminalReplay({
  lines,
  className,
  title = 'keshav@ai-mission-control — experience.log',
  shell = 'zsh',
  typing = true,
  bodyClassName,
  speed = 16,
  holdMs = 260,
}: {
  lines: Line[]
  className?: string
  /** Window title shown in the title bar. */
  title?: string
  /** Shell name shown at the right of the title bar. */
  shell?: string
  /**
   * When false the panel renders every line at once with no typing. Used where
   * the terminal is an inset detail inside a card rather than the main subject,
   * so a scripted replay would just delay reading it.
   */
  typing?: boolean
  /** Replaces the body layout classes wholesale; `cn` does not merge Tailwind. */
  bodyClassName?: string
  speed?: number
  holdMs?: number
}) {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  // Seed with everything up to and including the first command so the panel is
  // never an empty black box on first paint.
  const seedCount = useMemo(() => {
    const first = lines.findIndex((line) => line.kind === 'cmd')
    return first === -1 ? 0 : first + 1
  }, [lines])

  const staticRender = reduce || !typing
  const [typed, setTyped] = useState<Line[]>(staticRender ? lines : lines.slice(0, seedCount))
  // The command currently being typed. Kept separate from `typed` so each
  // keystroke replaces one line instead of appending a new one per character.
  const [partial, setPartial] = useState<Line | null>(null)

  useEffect(() => {
    if (staticRender || !inView) return
    const timers: number[] = []
    let delay = 260

    const at = (extra: number, run: () => void) => {
      delay += extra
      timers.push(window.setTimeout(run, delay))
    }

    lines.forEach((line, index) => {
      if (index < seedCount) return

      if (line.kind === 'blank') {
        at(0, () => setTyped((prev) => [...prev, line]))
        return
      }
      if (line.kind === 'rule') {
        at(holdMs, () => setTyped((prev) => [...prev, line]))
        return
      }

      if (line.kind === 'cmd') {
        at(0, () => setPartial(line))
        for (let i = 1; i <= line.text.length; i += 1) {
          const prefix = line.text.slice(0, i)
          at(speed, () => setPartial({ kind: 'cmd', text: prefix }))
        }
        at(holdMs, () => {
          setTyped((prev) => [...prev, line])
          setPartial(null)
        })
        at(holdMs, () => setTyped((prev) => [...prev, { kind: 'out', tone: 'ok', text: 'ok' }]))
        return
      }

      at(holdMs, () => setTyped((prev) => [...prev, line]))
    })

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [lines, seedCount, inView, staticRender, speed, holdMs])

  const visible = partial ? [...typed, partial] : typed

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-xl border shadow-lifted',
        className,
      )}
      style={{ backgroundColor: 'var(--pf-term-bg)', borderColor: 'var(--pf-term-line)' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 border-b px-3 py-2"
        style={{
          backgroundColor: 'var(--pf-term-chrome)',
          borderColor: 'var(--pf-term-line)',
        }}
      >
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate font-mono text-2xs tracking-tight" style={{ color: 'var(--pf-term-dim)' }}>
          {title}
        </span>
        <span
          className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-2xs"
          style={{ color: 'var(--pf-term-dim)' }}
          aria-hidden="true"
        >
          <span className="size-1.5 rounded-full bg-[#28c840] motion-safe:animate-pulse" />
          {shell}
        </span>
      </div>

      {/* Body */}
      <div
        className={cn('font-mono text-xs leading-relaxed', bodyClassName ?? 'min-h-56 p-4 sm:min-h-64 sm:p-5')}
      >
        <div className="flex flex-col gap-0.5">
          {visible.map((line, i) => {
            if (line.kind === 'blank') return <div key={i} className="h-2" />
            if (line.kind === 'rule')
              return <div key={i} className="my-1.5 h-px w-full" style={{ backgroundColor: 'var(--pf-term-line)' }} />

            if (line.kind === 'cmd') {
              return (
                <div key={i} className="flex gap-1.5">
                  <ChevronRight
                    className="mt-[3px] size-3 shrink-0"
                    style={{ color: TONE_VAR.prompt }}
                    aria-hidden="true"
                  />
                  <span style={{ color: TONE_VAR.cmd }}>{line.text}</span>
                  {i === visible.length - 1 ? (
                    <span
                      className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] motion-safe:animate-pulse"
                      style={{ backgroundColor: 'var(--pf-term-fg)' }}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              )
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration.fast / 1000, ease: easing.standard }}
                className="pl-[18px]"
              >
                <OutLine line={line} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
