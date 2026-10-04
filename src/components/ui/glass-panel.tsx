import { cn } from '@/lib/cn'

type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  elevation?: 'flat' | 'raised'
}

export function GlassPanel({ elevation = 'flat', className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl surface-glass',
        elevation === 'raised' && 'shadow-lifted',
        className,
      )}
      {...props}
    />
  )
}
