import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { profile } from '@/content/profile'

type MonogramProps = {
  className?: string
  /** Glyph size. The box scales with it via em-relative padding. */
  size?: 'sm' | 'md' | 'lg'
  /** Adds a faint accent wash behind the glyph. Kept off by default. */
  tint?: boolean
  /**
   * Hide from assistive tech when the full name sits next to it, so the link
   * is not announced as "KS keshavsharma".
   */
  decorative?: boolean
  /** Only the nav mark lifts on hover. */
  interactive?: boolean
}

const sizeClass = {
  sm: 'size-7 text-2xs',
  md: 'size-9 text-xs',
  lg: 'size-16 text-xl',
} as const

/**
 * The site mark. Deliberately an outlined box rather than a filled gradient:
 * the surrounding design language is hairlines, corner brackets and monospace
 * labels, and a saturated fill was the only loud thing in the header.
 *
 * Glyph colour is `text-accent` on the page background, which measures 5.4:1 in
 * dark and 5.1:1 in light. White on the old accent gradient was 3.7:1, and
 * white on --pf-accent-3 (the boot mark's third stop) was 1.6:1 — both below
 * the 4.5:1 AA threshold for small text.
 */
export function Monogram({
  className,
  size = 'sm',
  tint = false,
  decorative = true,
  interactive = false,
}: MonogramProps) {
  return (
    <motion.span
      aria-hidden={decorative || undefined}
      whileHover={interactive ? { scale: 1.04 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'grid shrink-0 place-items-center rounded-md border font-mono font-semibold tracking-tight',
        'border-line-strong text-accent transition-colors duration-300 ease-standard',
        'group-hover:border-[var(--pf-accent-line)]',
        tint && 'bg-accent-soft',
        sizeClass[size],
        className,
      )}
    >
      {profile.initials}
    </motion.span>
  )
}
