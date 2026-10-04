import { cn } from '@/lib/cn'

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'outline'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'border-line bg-surface text-fg-muted',
  accent: 'border-transparent bg-accent-soft text-accent',
  success: 'border-transparent bg-[color-mix(in_oklab,var(--pf-success)_14%,transparent)] text-success',
  outline: 'border-line-strong bg-transparent text-fg-muted',
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-2xs tracking-label uppercase',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  )
}
