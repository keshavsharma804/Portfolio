import { education, experience, profile, projects as projectData, skillGroups } from '@/content/profile'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'
import { fill } from '@/lib/use-content'

/**
 * The CV, rendered as real markup in the site's own design system.
 *
 * This deliberately does not embed `cv.pdf` in an iframe. An iframe hands the
 * document to the browser's built-in PDF viewer, which brings its own toolbar,
 * grey backdrop, scrollbar and focus handling — none of which match the site,
 * and none of which can be styled. Rendering the same content as HTML means
 * the preview, the modal and the standalone `/resume` document are all the
 * same component, so they cannot drift apart.
 *
 * Purely presentational: no anchors, no buttons, no state. The hover preview
 * scales it down with a transform, and the modal wraps it in the only
 * scroll container, which keeps the focus trap down to the action bar.
 */
export function ResumeDocument({ className }: { className?: string }) {
  const { t } = useI18n()
  const content = useContent()
  const copy = content.profile

  const technologyCount = skillGroups.reduce((total, group) => total + group.items.length, 0)

  return (
    <article
      className={
        className ??
        'font-sans text-fg-muted text-[0.8125rem] leading-[1.6] antialiased'
      }
    >
      {/* Identity */}
      <header className="border-b border-line-strong pb-5">
        <h2 className="text-display-xl leading-[1.02] font-semibold text-fg">{profile.name}</h2>
        <p className="mt-2 text-h4 font-medium text-gradient">{copy.role}</p>
        <p className="mt-1.5 text-sm text-fg-muted">{copy.tagline}</p>

        <dl className="mt-4 grid gap-x-6 gap-y-1 font-mono text-2xs tracking-tight text-fg-subtle sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="shrink-0 text-fg-subtle/70">{t('cv.contact')}</dt>
            <dd className="min-w-0 truncate text-fg-muted">{copy.location}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-fg-subtle/70">Email</dt>
            <dd className="min-w-0 truncate text-fg-muted">{profile.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-fg-subtle/70">Phone</dt>
            <dd className="min-w-0 truncate text-fg-muted">{profile.phone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-fg-subtle/70">GitHub</dt>
            <dd className="min-w-0 truncate text-fg-muted">
              {profile.links.github.replace('https://', '')}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-fg-subtle/70">LinkedIn</dt>
            <dd className="min-w-0 truncate text-fg-muted">
              {profile.links.linkedin.replace('https://www.', '')}
            </dd>
          </div>
        </dl>
      </header>

      {/* Summary */}
      <Section title={t('cv.summary')}>
        <p className="text-fg-muted">
          <span className="text-fg">{copy.summaryLead}</span> {copy.summaryRest}
        </p>
      </Section>

      {/* Experience */}
      <Section title={t('experience.title')}>
        {experience.map((entry) => {
          const entryCopy = content.experience.find((item) => item.id === entry.id)
          return (
            <div key={entry.id} className="mb-4 last:mb-0">
              <h4 className="text-sm font-semibold text-fg">
                {entryCopy?.role ?? entry.id}
                <span className="text-fg-subtle"> · {entry.company}</span>
              </h4>
              <p className="mt-0.5 font-mono text-2xs tracking-tight text-fg-subtle tabular-nums">
                {entry.start} — {entry.end ?? t('common.present')}
                {entryCopy?.location ? ` · ${entryCopy.location}` : ''}
              </p>
              <ul className="mt-1.5 space-y-1">
                {(entryCopy?.bullets ?? []).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.55em] size-1 shrink-0 rounded-full bg-accent/70" />
                    <span className="min-w-0">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 font-mono text-2xs tracking-tight text-fg-subtle">
                <span className="text-fg-subtle/70">{content.experienceStackLabel}: </span>
                {entry.stack.join(' · ')}
              </p>
            </div>
          )
        })}
      </Section>

      {/* Projects */}
      <Section title={t('projects.title')}>
        {content.projects.map((project) => {
          const data = projectData.find((item) => item.slug === project.slug)
          const metrics = project.metrics
            .map((metric) => {
              const value = data?.metrics.find((item) => item.id === metric.id)?.value
              return value ? `${metric.label}: ${value}` : null
            })
            .filter((line): line is string => line !== null)

          return (
            <div key={project.slug} className="mb-4 last:mb-0">
              <h4 className="text-sm font-semibold text-fg">{project.title}</h4>
              <p className="mt-1">{project.summary}</p>
              {metrics.length ? (
                <p className="mt-1 font-mono text-2xs tracking-tight text-accent tabular-nums">
                  {metrics.join(' · ')}
                </p>
              ) : null}
              {data?.stack.length ? (
                <p className="mt-1 font-mono text-2xs tracking-tight text-fg-subtle">
                  <span className="text-fg-subtle/70">Stack: </span>
                  {data.stack.join(' · ')}
                </p>
              ) : null}
            </div>
          )
        })}
      </Section>

      {/* Skills */}
      <Section title={t('skills.title')}>
        <p className="mb-2.5 font-mono text-2xs tracking-tight text-fg-subtle">
          {fill(content.skills.technologiesAndCategories, {
            technologies: technologyCount,
            categories: skillGroups.length,
          })}
        </p>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {content.skillGroups.map((group) => {
            const items = skillGroups.find((item) => item.id === group.id)?.items ?? []
            return (
              <div key={group.id} className="min-w-0">
                <dt className="font-mono text-2xs tracking-label text-accent uppercase">{group.label}</dt>
                <dd className="mt-0.5 text-xs text-fg-muted">{items.join(' · ')}</dd>
              </div>
            )
          })}
        </dl>
      </Section>

      {/* Education */}
      <Section title={t('education.title')}>
        {education.map((entry) => {
          const entryCopy = content.education.find((item) => item.id === entry.id)
          return (
            <div key={entry.id} className="mb-2 last:mb-0">
              <h4 className="text-sm font-semibold text-fg">
                {entryCopy?.degree ?? entry.id}
                <span className="text-fg-subtle"> · {entry.institution}</span>
              </h4>
              <p className="mt-0.5 font-mono text-2xs tracking-tight text-fg-subtle tabular-nums">
                {entry.start} — {entry.end ?? t('common.present')}
                {entryCopy?.detail ? ` · ${entryCopy.detail}` : ''}
              </p>
            </div>
          )
        })}
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-2.5 flex items-center gap-2.5 font-mono text-2xs tracking-label text-fg-subtle uppercase">
        <span>{title}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </h3>
      {children}
    </section>
  )
}
