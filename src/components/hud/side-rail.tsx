import { motion } from 'motion/react'
import { navItems } from '@/content/profile'
import { useActiveSection } from '@/components/interactive/use-scroll'
import { useI18n } from '@/lib/use-preferences'
import { cn } from '@/lib/cn'

const labelKey = {
  home: 'nav.home',
  about: 'nav.about',
  skills: 'nav.skills',
  experience: 'nav.experience',
  projects: 'nav.projects',
  education: 'nav.education',
  contact: 'nav.contact',
} as const

const ids = navItems.map((item) => item.id)

export function SideRail() {
  const active = useActiveSection(ids)
  const { t } = useI18n()

  return (
    <nav
      aria-label={t('common.sectionProgress')}
      className="pointer-events-none fixed right-4 top-1/2 z-rail hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col items-end gap-3">
        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id} className="group flex items-center justify-end gap-2.5">
              <span
                className={cn(
                  'font-mono text-2xs tracking-label uppercase transition-all duration-300 ease-standard',
                  isActive
                    ? 'text-accent opacity-100'
                    : 'text-fg-subtle opacity-0 group-hover:opacity-70',
                )}
              >
                {t(labelKey[item.id as keyof typeof labelKey])}
              </span>
              <a
                href={item.href}
                aria-label={t(labelKey[item.id as keyof typeof labelKey])}
                aria-current={isActive ? 'true' : undefined}
                className="pointer-events-auto relative grid size-4 place-items-center"
              >
                {isActive ? (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute size-3.5 rounded-full border border-accent bg-accent-soft"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="size-1.5 rounded-full bg-line-strong transition-colors duration-300 group-hover:bg-accent/60" />
                )}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
