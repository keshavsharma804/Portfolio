import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Visual continuity between sections.
 *
 * Each section used to be `py-section` plus a single `border-b` on its header,
 * so scrolling read as a stack of unrelated widgets. This draws a shared
 * connective tissue: a hairline that fades in from the page edge, plus a very
 * low-opacity accent wash anchored to the section's top edge. Both are
 * non-interactive and inert to the ambient background layer, so they add
 * structure without adding competing decoration.
 */
export function SectionVein({
  className,
  tone = 'accent',
}: {
  className?: string
  tone?: 'accent' | 'accent-2' | 'none'
}) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-x-0 top-0', className)}>
      <div className="container-page">
        <div className="relative h-px w-full">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-line-strong to-transparent" />
          {tone === 'none' ? null : (
            <span
              className={cn(
                'absolute left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent',
                tone === 'accent' ? 'via-accent/70' : 'via-accent-2/70',
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * The one place a section is allowed an ambient wash. Deliberately weak and
 * always masked to the top edge, so it reads as the accent colour bleeding
 * between sections rather than as a glow sitting on top of the content.
 */
export function SectionWash({
  className,
  tone = 'accent',
}: {
  className?: string
  tone?: 'accent' | 'accent-2' | 'accent-3' | 'none'
}) {
  if (tone === 'none') return null
  const tint =
    tone === 'accent' ? 'bg-accent' : tone === 'accent-2' ? 'bg-accent-2' : 'bg-accent-3'

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-[0.05] blur-3xl',
        tint,
        className,
      )}
      style={{
        maskImage: 'radial-gradient(ellipse 60% 100% at 50% 0%, #000 10%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 100% at 50% 0%, #000 10%, transparent 72%)',
      }}
    />
  )
}

/** Standard inner rhythm for a section body. */
export function SectionBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-7', className)}>{children}</div>
}
