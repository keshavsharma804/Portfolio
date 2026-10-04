import { cn } from '@/lib/cn'

export function Section({
  id,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { id?: string }) {
  return (
    <section id={id} className={cn('relative scroll-mt-24 py-section', className)} {...props}>
      {children}
    </section>
  )
}
