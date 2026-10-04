import { useRef, useState, type ReactNode } from 'react'
import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui/button'
import { cn } from '@/lib/cn'

type Ripple = { id: number; x: number; y: number }

export function RippleButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>) {
  const ref = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])

  const spawn = (event: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const id = performance.now()

    setRipples((list) => [...list, { id, x, y }])
    window.setTimeout(() => setRipples((list) => list.filter((r) => r.id !== id)), 640)
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
      onClick={(event) => {
        spawn(event)
        props.onClick?.(event)
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          className="pointer-events-none absolute size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 motion-safe:animate-[ripple_0.6s_ease-out_forwards]"
          style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
        />
      ))}
      <span className="relative z-content inline-flex items-center gap-2">{children}</span>
    </Button>
  )
}

/**
 * Anchor variant of {@link RippleButton}, for links that must keep native
 * navigation, new-tab and keyboard behaviour.
 */
export function RippleLink({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'className'
>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])

  const spawn = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const id = performance.now()

    setRipples((list) => [...list, { id, x, y }])
    window.setTimeout(() => setRipples((list) => list.filter((r) => r.id !== id)), 640)
  }

  return (
    <a
      ref={ref}
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
      onClick={(event) => {
        spawn(event)
        props.onClick?.(event)
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          className="pointer-events-none absolute size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 motion-safe:animate-[ripple_0.6s_ease-out_forwards]"
          style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
        />
      ))}
      <span className="relative z-content inline-flex items-center gap-2">{children}</span>
    </a>
  )
}
