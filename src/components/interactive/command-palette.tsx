import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Search } from 'lucide-react'
import { navItems, profile } from '@/content/profile'
import { cn } from '@/lib/cn'
import { copyText } from '@/lib/clipboard'
import { goToSection } from '@/lib/section-nav'
import { duration, easing } from '@/lib/tokens'
import { usePrefersReducedMotion } from '@/lib/use-media-query'
import { useI18n, useTheme } from '@/lib/use-preferences'

const labelKey = {
  home: 'nav.home',
  about: 'nav.about',
  skills: 'nav.skills',
  experience: 'nav.experience',
  projects: 'nav.projects',
  currently: 'nav.currently',
  education: 'nav.education',
  contact: 'nav.contact',
} as const

type Action = {
  id: string
  label: string
  group: string
  keywords: string
  run: () => void
  keepOpen?: boolean
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  /** `keepFocus` is for actions that already moved focus themselves, so the
   *  provider must not pull it back to the trigger. */
  onClose: (options?: { keepFocus?: boolean }) => void
}) {
  const [state, setState] = useState({ query: '', index: 0 })
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const { query, index } = state
  const reduce = usePrefersReducedMotion()
  const { t } = useI18n()
  const { toggleTheme } = useTheme()

  useEffect(() => {
    if (!open || status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 1600)
    return () => window.clearTimeout(timer)
  }, [status, open])

  const actions: Action[] = [
    ...navItems.map((item) => {
      const label = t(labelKey[item.id as keyof typeof labelKey])
      return {
        id: `nav-${item.id}`,
        label,
        group: t('palette.groupNavigate'),
        keywords: `${label} ${item.id} section go to`,
        run: () => goToSection(item.id),
      }
    }),
    {
      id: 'theme',
      label: t('nav.theme'),
      group: t('palette.groupActions'),
      keywords: 'theme dark light mode',
      run: toggleTheme,
    },
    {
      id: 'copy-email',
      label: t('contact.email'),
      group: t('palette.groupActions'),
      keywords: 'copy email contact clipboard',
      keepOpen: true,
      run: () => {
        void copyText(profile.email).then((ok) => setStatus(ok ? 'copied' : 'error'))
      },
    },
  ]

  const filtered = actions.filter((action) =>
    `${action.label} ${action.group} ${action.keywords}`.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setState((s) => ({ ...s, index: Math.min(s.index + 1, filtered.length - 1) }))
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setState((s) => ({ ...s, index: Math.max(s.index - 1, 0) }))
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        const action = filtered[index]
        if (action) {
          action.run()
          if (!action.keepOpen) onClose({ keepFocus: true })
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, index, onClose])

  return (
    <AnimatePresence>
      {open ? (
      <motion.div
        key="palette"
        data-open={open}
        initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast / 1000 }}
          className="fixed inset-0 z-overlay flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('palette.title')}
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: duration.base / 1000, ease: easing.entrance }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-bg-elevated/95 shadow-lifted backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setState({ query: event.target.value, index: 0 })}
                placeholder={t('palette.search')}
                aria-label={t('palette.search')}
                className="h-13 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
              />
              {status === 'idle' ? (
                <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-2xs text-fg-subtle">
                  esc
                </kbd>
              ) : (
                <span
                  className={cn(
                    'shrink-0 font-mono text-2xs tracking-label uppercase',
                    status === 'copied' ? 'text-success' : 'text-danger',
                  )}
                >
                  {status === 'copied' ? t('contact.copiedAction') : t('contact.copyFailed')}
                </span>
              )}
            </div>

            <p role="status" aria-live="polite" className="sr-only">
              {status === 'copied' ? t('contact.copiedAction') : status === 'error' ? t('contact.copyFailed') : ''}
            </p>

            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-fg-subtle">{t('palette.noMatches')}</li>
              ) : (
                filtered.map((action, i) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setState((s) => ({ ...s, index: i }))}
                      onClick={() => {
                        action.run()
                        if (!action.keepOpen) onClose({ keepFocus: true })
                      }}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150',
                        i === index ? 'bg-surface-hover text-fg' : 'text-fg-muted hover:bg-surface',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-16 font-mono text-2xs tracking-label text-fg-subtle uppercase">
                          {action.group}
                        </span>
                        {action.label}
                      </span>
                      {i === index && !reduce ? (
                        <CornerDownLeft className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
