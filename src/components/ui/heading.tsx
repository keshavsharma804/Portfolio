import { cn } from '@/lib/cn'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4
  size?: 'display' | 'display-lg' | 'h1' | 'h2' | 'h3' | 'h4'
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  gradient?: boolean
}

const sizeClass: Record<NonNullable<HeadingProps['size']>, string> = {
  display: 'text-display-xl font-semibold',
  'display-lg': 'text-display-lg font-semibold',
  h1: 'text-h1 font-semibold',
  h2: 'text-h2 font-semibold',
  h3: 'text-h3 font-semibold',
  h4: 'text-h4 font-semibold',
}

export function Heading({
  level = 2,
  size,
  as,
  gradient,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = (as ?? `h${level}`) as 'h1'
  const resolved = size ?? (['h1', 'h2', 'h3', 'h4'] as const)[level - 1]

  return (
    <Tag className={cn(sizeClass[resolved], gradient && 'text-gradient', className)} {...props}>
      {children}
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col gap-4',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-2xs tracking-label text-accent uppercase">{eyebrow}</span>
      ) : null}
      <Heading as="h2" size="h2" className="text-balance">
        {title}
      </Heading>
      {description ? <p className="text-body-lg leading-relaxed text-fg-muted">{description}</p> : null}
    </div>
  )
}
