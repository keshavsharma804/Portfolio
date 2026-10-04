import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { duration, easing } from '@/lib/tokens'

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()

  const position =
    side === 'top' ? 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2' : 'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2'

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.96 }}
            transition={{ duration: duration.fast / 1000, ease: easing.entrance }}
            className={cn(
              'pointer-events-none absolute z-dropdown w-max max-w-56 rounded-lg border border-line bg-bg-elevated/95 px-3 py-2 text-xs leading-relaxed text-fg shadow-lifted backdrop-blur-xl',
              position,
              className,
            )}
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
