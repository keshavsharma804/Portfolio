import { Search } from 'lucide-react'
import { useCommandPalette } from '@/components/interactive/use-command-palette'
import { useI18n } from '@/lib/use-preferences'

function isApple() {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)
}

export function CommandPaletteTrigger({ className = '' }: { className?: string }) {
  const { open, setOpen } = useCommandPalette()
  const { t } = useI18n()
  const mod = isApple() ? '⌘' : 'Ctrl'

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-keyshortcuts="Control+K Meta+K"
      aria-expanded={open}
      aria-label={t('palette.open')}
      className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 font-mono text-2xs tracking-label text-fg-muted uppercase transition-colors duration-200 ease-standard hover:border-line-strong hover:text-fg ${className}`}
    >
      <Search className="size-3.5" aria-hidden="true" />
      <span className="hidden lg:inline">{t('palette.open')}</span>
      <kbd className="rounded border border-line px-1 py-0.5 font-mono text-2xs text-fg-subtle">
        {mod}K
      </kbd>
    </button>
  )
}
