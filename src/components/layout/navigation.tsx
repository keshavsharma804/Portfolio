import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { navItems, profile } from '@/content/profile'
import { cn } from '@/lib/cn'
import { ScrollProgress } from '@/components/interactive/scroll-progress'
import { useActiveSection } from '@/components/interactive/use-scroll'
import { LanguageToggle, PlainToggle, ThemeToggle } from '@/components/interactive/preferences'
import { CommandPaletteTrigger } from '@/components/interactive/command-palette-trigger'
import { CvPreviewModal } from '@/components/ui/cv-preview'
import { Monogram } from '@/components/ui/monogram'
import { MagneticHover } from '@/components/interactive/magnetic'
import { useI18n } from '@/lib/use-preferences'
import { duration, easing } from '@/lib/tokens'

const sectionIds = navItems.map((item) => item.id)
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

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const active = useActiveSection(sectionIds)
  const { t } = useI18n()
  const burgerRef = useRef<HTMLButtonElement>(null)
  // Closing the reader returns focus to whatever opened it. The mobile entry
  // point closes the menu as it opens the modal, so that button is gone by the
  // time the modal closes and the burger stands in for it.
  const cvRestoreRef = useRef<HTMLElement | null>(null)

  const closeCv = useCallback(() => {
    setCvOpen(false)
    const target = cvRestoreRef.current
    cvRestoreRef.current = null
    if (!target?.isConnected) return
    requestAnimationFrame(() => target.focus())
  }, [])

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: duration.slow / 1000, ease: easing.entrance, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-nav"
      >
        {/* Opaque band: page content scrolls underneath this, never through it. */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 bg-bg/85 backdrop-blur-xl transition-opacity duration-300 ease-standard',
            'border-b border-line/60',
            compact ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div className="container-page">
          <motion.nav
            aria-label={t('nav.primary')}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: duration.slow / 1000, delay: 0.15, ease: easing.entrance }}
            className={cn(
              'mt-4 flex h-14 items-center justify-between gap-3 rounded-full border border-line bg-bg-elevated/90 px-3 shadow-lifted backdrop-blur-xl transition-colors duration-300 ease-standard sm:px-5',
              compact ? 'border-line-strong' : 'border-line/80',
            )}
          >
            <a
              href="#home"
              // The mark is a deliberately small 28px glyph, so the tap target is
              // grown with padding and pulled back in with a matching negative
              // margin rather than enlarging the mark itself.
              className="group -m-1 flex shrink-0 items-center gap-2.5 p-1"
              aria-label={t('common.toTop')}
            >
              <Monogram interactive />
              <span className="hidden font-mono text-sm tracking-tight text-fg md:inline">
                {profile.name.toLowerCase().replace(/\s+/g, '')}
              </span>
            </a>

            <ul className="relative hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ease-standard',
                        isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-full bg-surface-hover ring-1 ring-[var(--pf-accent-line)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      {t(labelKey[item.id as keyof typeof labelKey])}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex shrink-0 items-center gap-1.5">
              <LanguageToggle className="hidden sm:flex" />
              <CommandPaletteTrigger className="hidden sm:inline-flex" />
              <ThemeToggle />
              <PlainToggle />

              <MagneticHover className="hidden sm:inline-flex">
                <button
                  type="button"
                  onClick={(event) => {
                    cvRestoreRef.current = event.currentTarget
                    setCvOpen(true)
                  }}
                  className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-88"
                >
                  {t('nav.cv')}
                </button>
              </MagneticHover>

              <button
                ref={burgerRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t('nav.close') : t('nav.open')}
                className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors duration-200 ease-standard hover:bg-surface-hover lg:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: duration.fast / 1000, ease: easing.standard }}
                    className="absolute grid place-items-center"
                  >
                    {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </motion.nav>

          <AnimatePresence>
            {open ? (
              <motion.div
                key="mobile-menu"
                id="mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: duration.base / 1000, ease: easing.entrance }}
                className="mt-2 origin-top overflow-hidden rounded-xl border border-line surface-glass p-2 shadow-lifted lg:hidden"
              >
                <motion.ul
                  className="flex flex-col"
                  initial="hidden"
                  animate="shown"
                  variants={{ shown: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } } }}
                >
                  {navItems.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        shown: { opacity: 1, x: 0, transition: { duration: 0.28, ease: easing.entrance } },
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'block rounded-lg px-4 py-3 text-sm transition-colors duration-200 ease-standard hover:bg-surface-hover hover:text-fg',
                          active === item.id ? 'text-fg' : 'text-fg-muted',
                        )}
                      >
                        {t(labelKey[item.id as keyof typeof labelKey])}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
                  <LanguageToggle />
                  <CommandPaletteTrigger />
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      cvRestoreRef.current = burgerRef.current
                      setCvOpen(true)
                    }}
                    className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg"
                  >
                    {t('nav.cv')}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.header>

      <CvPreviewModal open={cvOpen} onClose={closeCv} />
    </>
  )
}
