import { useEffect, useId, useRef } from 'react'
import { motion, useInView, useSpring } from 'motion/react'
import { skillGroups } from '@/content/profile'
import { skillLevel } from '@/lib/skill-level'
import { useContent, fill } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-media-query'
import { duration, easing } from '@/lib/tokens'

const VIEW = 300
const CX = VIEW / 2
const CY = VIEW / 2
const R = 104

function point(index: number, total: number, ratio: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return { x: CX + Math.cos(angle) * R * ratio, y: CY + Math.sin(angle) * R * ratio }
}

function polygon(ratios: number[], total: number) {
  return ratios
    .map((ratio, i) => {
      const p = point(i, total, ratio)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    })
    .join(' ')
}

export function SkillRadar({
  activeIndex,
  onHover,
  className,
}: {
  activeIndex: number | null
  onHover: (index: number | null) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()
  const gradientId = useId()
  const { t } = useI18n()
  const content = useContent()

  const total = skillGroups.length
  const deepest = Math.max(...skillGroups.map((group) => group.items.length))
  const density = skillGroups.map((group) => group.items.length / deepest)
  const ratios =
    activeIndex === null ? density : density.map((_, i) => (i === activeIndex ? 1 : 0.14))
  const active = activeIndex === null ? null : skillGroups[activeIndex]
  const labelFor = (id: string) => content.skillGroups.find((group) => group.id === id)?.label ?? id

  // Drives the polygon scale from the centre, so the shape grows into place
  // on scroll-in instead of snapping to full size.
  const reveal = useSpring(0, { stiffness: 90, damping: 22, mass: 0.6 })
  const inView = useInView(ref, { once: true, amount: 0.35 })
  useEffect(() => {
    if (reduce) {
      reveal.jump(1)
      return
    }
    if (inView) reveal.set(1)
  }, [inView, reduce, reveal])

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-4', className)}>
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-full max-w-[24rem]"
        role="img"
        aria-label={t('skills.radarLabel')}
        onPointerLeave={() => onHover(null)}
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="var(--pf-accent)" stopOpacity="0.42" />
            <stop offset="100%" stopColor="var(--pf-accent-2)" stopOpacity="0.14" />
          </radialGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={polygon(new Array(total).fill(ring), total)}
            fill="none"
            stroke="var(--pf-line)"
            strokeWidth="1"
          />
        ))}

        {density.map((_, i) => {
          const p = point(i, total, 1)
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke={activeIndex === i ? 'var(--pf-accent)' : 'var(--pf-line)'}
              strokeWidth={activeIndex === i ? 1.4 : 1}
              className="transition-colors duration-200"
            />
          )
        })}

        <motion.g style={{ scale: reveal, transformOrigin: `${CX}px ${CY}px` }}>
          <polygon
            points={polygon(ratios, total)}
            fill={`url(#${gradientId})`}
            stroke="var(--pf-accent)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="transition-opacity duration-200"
            opacity={reduce ? 1 : 0.999}
          />

          {density.map((ratio, i) => {
            const p = point(i, total, Math.max(ratio, 0.12))
            const on = activeIndex === i
            return (
              <g key={i}>
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  initial={false}
                  animate={{ r: on ? 6 : 4 }}
                  transition={{ duration: duration.fast / 1000, ease: easing.standard }}
                  fill={on ? 'var(--pf-accent-3)' : 'var(--pf-accent)'}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={16}
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerEnter={() => onHover(i)}
                />
              </g>
            )
          })}
        </motion.g>

        <text
          x={CX}
          y={CY - 2}
          textAnchor="middle"
          className="pointer-events-none fill-[var(--pf-fg)] text-[13px] font-semibold"
        >
          {active ? labelFor(active.id) : t('skills.radarTotal')}
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          className="pointer-events-none fill-[var(--pf-accent)] text-[11px] font-medium"
        >
          {active
            ? fill(t('skills.radarLevel'), { level: skillLevel(active.items.length), count: active.items.length })
            : fill(t('skills.radarMax'), { count: deepest })}
        </text>
      </svg>

      <div className="relative w-full">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-y-8 inset-x-0 -z-10">
          <div className="absolute inset-0 rounded-full bg-accent/25 blur-2xl" />
          <div className="absolute inset-y-2 left-1/4 w-2/5 rounded-full bg-accent-3/20 blur-2xl" />
          <div className="absolute inset-y-0 right-1/5 w-1/3 rounded-full bg-accent-2/25 blur-2xl" />
        </div>

        <ul className="glass-pane glass-sheen grid grid-cols-3 divide-x divide-[color:var(--pf-glass-edge)] overflow-hidden rounded-xl">
          {[
            { label: t('skills.statCategories'), value: String(total).padStart(2, '0') },
            { label: t('skills.statSkills'), value: String(skillGroups.reduce((s, g) => s + g.items.length, 0)).padStart(2, '0') },
            { label: t('skills.statDeepest'), value: String(deepest).padStart(2, '0') },
          ].map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col gap-0.5 bg-[rgb(255_255_255/0.035)] px-3 py-3 text-center"
            >
              <span className="font-mono text-2xl leading-none font-semibold text-fg tabular-nums drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]">
                {stat.value}
              </span>
              <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
