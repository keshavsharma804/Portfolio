import { cn } from '@/lib/cn'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean
}

export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-line bg-surface text-fg',
        'transition-[transform,border-color,box-shadow,background-color] duration-300 ease-standard',
        interactive && 'hover:-translate-y-0.5 hover:border-[var(--pf-accent-line)] hover:bg-surface-hover hover:shadow-lifted',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-h4 font-semibold text-fg', className)} {...props} />
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-6 text-sm leading-relaxed text-fg-muted', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-3 border-t border-line px-6 py-4', className)} {...props} />
}
