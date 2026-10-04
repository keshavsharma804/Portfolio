import { useState } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { SectionShell } from '@/components/ui/section-shell'
import { Stagger, StaggerItem } from '@/components/motion/reveal'
import { Container } from '@/components/ui/container'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/brand-icons'
import { MagneticHover } from '@/components/interactive/magnetic'
import { RippleLink } from '@/components/interactive/ripple-button'
import { Monogram } from '@/components/ui/monogram'
import { education, profile } from '@/content/profile'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { buttonClass } from '@/lib/button-style'
import { cn } from '@/lib/cn'

export function Education() {
  const { t } = useI18n()
  const content = useContent()

  return (
    <SectionShell
      id="education"
      index={t('education.index')}
      path={t('education.path')}
      title={t('education.title')}
    >
      <Stagger className="grid gap-x-10 gap-y-8 sm:grid-cols-2" interval={0.08}>
        {education.map((entry) => {
          const copy = content.education.find((item) => item.id === entry.id)
          return (
            <StaggerItem key={entry.id}>
              <div className="flex flex-col gap-1 border-t border-line pt-5">
                <h3 className="text-h4 font-semibold text-fg">{copy?.degree ?? entry.id}</h3>
                <p className="text-sm text-fg-muted">{entry.institution}</p>
                <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
                  {entry.start} — {entry.end ?? t('common.present')}
                </p>
                {copy?.detail ? <p className="mt-2 text-sm text-fg-muted">{copy.detail}</p> : null}
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </SectionShell>
  )
}

/*
 * No `outline-none` here. It is a Tailwind *utility*, so it sits in the
 * utilities cascade layer and silently beat the global `:focus-visible` ring in
 * @layer base, leaving the subject and message fields as the only focusable
 * controls on the site with no visible focus indicator. The border and fill
 * changes below stay as supplementary cues; the 2px --pf-ring outline is what
 * actually satisfies focus visibility.
 */
const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-fg transition-colors duration-200 placeholder:text-fg-subtle focus:border-[var(--pf-accent-line)] focus:bg-surface-hover'

const MAIL_PROVIDERS = [
  {
    id: 'gmail',
    label: 'Gmail',
    build: (to: string, subject: string, body: string) =>
      `https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`,
  },
  {
    id: 'outlook',
    label: 'Outlook',
    build: (to: string, subject: string, body: string) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${body}`,
  },
  {
    id: 'zoho',
    label: 'Zoho',
    build: (to: string, subject: string, body: string) =>
      `https://mail.zoho.com/mail/compose?to=${to}&subject=${subject}&body=${body}`,
  },
  {
    id: 'other',
    label: 'Other',
    build: (to: string, subject: string, body: string) =>
      `mailto:${to}?subject=${subject}&body=${body}`,
  },
] as const

function MailComposer() {
  const { t } = useI18n()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
        {t('contact.compose')}
      </p>
      <p className="-mt-2 text-sm text-fg-muted">{t('contact.composeHint')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
            {t('contact.subject')}
          </span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder={t('contact.subjectPlaceholder')}
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-2xs tracking-label text-fg-subtle uppercase">
            {t('contact.message')}
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={2}
            placeholder={t('contact.messagePlaceholder')}
            className={cn(fieldClass, 'resize-none')}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MAIL_PROVIDERS.map((provider) => {
          const external = provider.id !== 'other'
          return (
            <MagneticHover key={provider.id} className="w-full">
              <RippleLink
                href={provider.build(
                  profile.email,
                  encodeURIComponent(subject),
                  encodeURIComponent(message),
                )}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className={buttonClass('secondary', 'md')}
              >
                <Mail className="size-4" aria-hidden="true" />
                {provider.label}
              </RippleLink>
            </MagneticHover>
          )
        })}
      </div>
    </div>
  )
}

export function Contact() {
  const { t } = useI18n()

  const channels = [
    profile.links.linkedin ? { label: 'LinkedIn', href: profile.links.linkedin, icon: 'linkedin' } : null,
    profile.links.github ? { label: 'GitHub', href: profile.links.github, icon: 'github' } : null,
    { label: profile.email, href: `mailto:${profile.email}`, icon: 'mail' },
  ].filter(Boolean) as { label: string; href: string; icon: string }[]

  return (
    <SectionShell
      id="contact"
      index={t('contact.index')}
      path={t('contact.path')}
      title={t('contact.title')}
      description={t('contact.description')}
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Stagger className="flex flex-col gap-8" interval={0.08}>
          <StaggerItem>
            <MailComposer />
          </StaggerItem>
        </Stagger>

        <Stagger className="flex flex-col gap-4" interval={0.08}>
          {channels.map((channel) => (
            <StaggerItem key={channel.label}>
              <MagneticHover className="w-full">
                <RippleLink
                  href={channel.href}
                  target={channel.icon === 'mail' ? undefined : '_blank'}
                  rel={channel.icon === 'mail' ? undefined : 'noreferrer noopener'}
                  className="group w-full flex items-center justify-between gap-4 rounded-lg border border-line bg-surface/50 p-5 text-left backdrop-blur-sm transition-colors duration-200 ease-standard hover:border-[var(--pf-accent-line)] hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-fg-muted transition-colors duration-200 group-hover:text-fg">
                      {channel.icon === 'linkedin' ? (
                        <LinkedInIcon className="size-5" />
                      ) : channel.icon === 'mail' ? (
                        <Mail className="size-5" />
                      ) : (
                        <GitHubIcon className="size-5" />
                      )}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-fg">{channel.label}</span>
                      <span className="font-mono text-2xs text-fg-subtle">
                        {linkHandle(channel.href)}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                    aria-hidden="true"
                  />
                </RippleLink>
              </MagneticHover>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  )
}

function linkHandle(href: string) {
  try {
    const url = new URL(href)
    return `${url.host.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return href
  }
}

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="relative border-t border-line py-12">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Monogram />
            <span className="font-mono text-sm text-fg">{profile.name}</span>
          </div>

          <nav aria-label={t('common.footer')} className="flex flex-wrap gap-5">
            {[
              { label: t('common.top'), href: '#home' },
              { label: t('nav.projects'), href: '#projects' },
              { label: t('nav.contact'), href: '#contact' },
              // Plain, dependency-free document for ATS parsers and slow networks.
              { label: t('nav.resumeDoc'), href: '/resume' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                // The footer type is deliberately small, so the tap target is
                // grown with padding and pulled back in with a matching negative
                // margin: 33px+ to hit without moving anything.
                className="-m-2 p-2 font-mono text-2xs tracking-label text-fg-subtle uppercase transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-2xs text-fg-subtle">{t('contact.footer')}</p>
        </div>
      </Container>
    </footer>
  )
}
