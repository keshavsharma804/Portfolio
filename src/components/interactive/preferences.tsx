import { motion } from 'motion/react'
import { Languages, Moon, Sun, Zap, ZapOff } from 'lucide-react'
import { localeMeta, locales } from '@/lib/preferences-context'
import { useI18n, usePlainView, useTheme } from '@/lib/use-preferences'
import { cn } from '@/lib/cn'

const control =
  'grid size-9 place-items-center rounded-full border border-line text-fg-muted transition-colors duration-200 ease-standard hover:border-line-strong hover:bg-surface-hover hover:text-fg'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('nav.theme')}
      title={t('nav.theme')}
      className={cn(control, className)}
    >
      <span className="relative block size-4">
        <motion.span
          className="absolute inset-0 grid place-items-center"
          animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -70, scale: isDark ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          <Moon className="size-4" aria-hidden="true" />
        </motion.span>
        <motion.span
          className="absolute inset-0 grid place-items-center"
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? 70 : 0, scale: isDark ? 0.6 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <Sun className="size-4" aria-hidden="true" />
        </motion.span>
      </span>
    </button>
  )
}

export function PlainToggle({ className }: { className?: string }) {
  const { plain, toggle } = usePlainView()
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={plain}
      aria-label={t('nav.plain')}
      title={t('nav.plain')}
      className={cn(control, plain && 'border-[var(--pf-accent-line)] bg-accent-soft text-accent', className)}
    >
      {plain ? <ZapOff className="size-4" aria-hidden="true" /> : <Zap className="size-4" aria-hidden="true" />}
    </button>
  )
}

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className={cn(
        'flex items-center gap-1 rounded-full border border-line p-0.5 pl-1.5',
        className,
      )}
    >
      <Languages className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
      {locales.map((code) => {
        const isActive = code === locale
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            title={localeMeta[code].label}
            className={cn(
              // min-h-8 keeps each pill at a comfortable 32px touch target, which
              // also lines the group up with the size-9 icon buttons beside it.
              'relative min-h-8 rounded-full px-2.5 py-1 font-mono text-2xs tracking-label transition-colors duration-200',
              isActive ? 'text-white' : 'text-fg-subtle hover:text-fg',
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="lang-active"
                className="absolute inset-0 rounded-full bg-accent-solid"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            ) : null}
            <span className="relative">{localeMeta[code].native}</span>
          </button>
        )
      })}
    </div>
  )
}
