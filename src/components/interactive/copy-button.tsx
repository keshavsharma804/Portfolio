import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { copyText } from '@/lib/clipboard'

const COPY_MS = 1400

export function CopyButton({
  value,
  className,
  children,
  idleLabel = 'Copy',
  copiedLabel = 'Copied',
  errorLabel = 'Failed',
}: {
  value: string
  className?: string
  children?: React.ReactNode
  idleLabel?: string
  copiedLabel?: string
  errorLabel?: string
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    setState((await copyText(value)) ? 'copied' : 'error')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), COPY_MS)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-2xs tracking-label uppercase transition-colors duration-200 ease-standard',
        state === 'copied' && 'text-success',
        state === 'error' && 'text-danger',
        state === 'idle' && 'text-fg-muted hover:text-fg',
        className,
      )}
    >
      {children ?? (state === 'idle' ? idleLabel : state === 'copied' ? copiedLabel : errorLabel)}
    </button>
  )
}
