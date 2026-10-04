import { contentEn } from '../src/content/content-en'
import {
  profile,
  experience,
  education,
  skillGroups,
  projects as projectData,
} from '../src/content/profile'

const esc = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const RESUME_PRESENT = 'Present'

function dateRange(start: string, end: string | null) {
  return `${start} – ${end ?? RESUME_PRESENT}`
}

function experienceHtml() {
  return experience
    .map((entry) => {
      const copy = contentEn.experience.find((item) => item.id === entry.id)
      const bullets = (copy?.bullets ?? []).map((line) => `      <li>${esc(line)}</li>`).join('\n')
      return `    <article class="entry">
      <h3>${esc(copy?.role ?? entry.id)} — ${esc(entry.company)}</h3>
      <p class="meta">${esc(dateRange(entry.start, entry.end))}${copy?.location ? ` · ${esc(copy.location)}` : ''}</p>
      <ul>
${bullets}
      </ul>
      <p class="stack"><strong>Stack:</strong> ${entry.stack.map(esc).join(', ')}</p>
    </article>`
    })
    .join('\n')
}

function projectsHtml() {
  return contentEn.projects
    .map((project) => {
      const data = projectData.find((item) => item.slug === project.slug)
      const metrics = project.metrics
        .map((metric) => {
          const value = data?.metrics.find((item) => item.id === metric.id)?.value
          return value ? `${esc(metric.label)}: ${esc(value)}` : null
        })
        .filter((line): line is string => line !== null)
      const stack = data?.stack ?? []
      return `    <article class="entry">
      <h3>${esc(project.title)}</h3>
      <p>${esc(project.summary)}</p>
      <p>${esc(project.role)}</p>
${metrics.length ? `      <p class="stack"><strong>Measured:</strong> ${metrics.join(' · ')}</p>\n` : ''}${
        stack.length ? `      <p class="stack"><strong>Stack:</strong> ${stack.map(esc).join(', ')}</p>\n` : ''
      }    </article>`
    })
    .join('\n')
}

function skillsHtml() {
  return contentEn.skillGroups
    .map((group) => {
      const items = skillGroups.find((item) => item.id === group.id)?.items ?? []
      return `      <div class="skill">
        <dt>${esc(group.label)}</dt>
        <dd>${items.map(esc).join(', ')}</dd>
      </div>`
    })
    .join('\n')
}

function educationHtml() {
  return education
    .map((entry) => {
      const copy = contentEn.education.find((item) => item.id === entry.id)
      return `    <article class="entry">
      <h3>${esc(copy?.degree ?? entry.id)} — ${esc(entry.institution)}</h3>
      <p class="meta">${esc(dateRange(entry.start, entry.end))}${copy?.detail ? ` · ${esc(copy.detail)}` : ''}</p>
    </article>`
    })
    .join('\n')
}

export function renderResume(): string {
  const { profile: copy } = contentEn
  const summary = `${copy.summaryLead} ${copy.summaryRest}`

  const contact = [
    `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`,
    `<a href="tel:${esc(profile.phone.replace(/\s+/g, ''))}">${esc(profile.phone)}</a>`,
    profile.links.github ? `<a href="${esc(profile.links.github)}">github.com/${esc(profile.links.github.split('/').filter(Boolean).pop() ?? '')}</a>` : '',
    profile.links.linkedin ? `<a href="${esc(profile.links.linkedin)}">linkedin.com/in/${esc(profile.links.linkedin.split('/').filter(Boolean).pop() ?? '')}</a>` : '',
    esc(copy.location),
  ].filter(Boolean)

  const technologyCount = skillGroups.reduce((total, group) => total + group.items.length, 0)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(profile.name)} — ${esc(copy.role)}</title>
    <meta name="description" content="${esc(`${profile.name}, ${copy.role}. ${copy.tagline}. ${copy.location}.`)}" />
    <link rel="canonical" href="/resume" />
    <style>
      :root { color-scheme: light dark; --fg: #14161a; --muted: #4a5058; --line: #d8dce2; --accent: #2f6f4f; --bg: #ffffff; }
      @media (prefers-color-scheme: dark) {
        :root { --fg: #e8eaed; --muted: #a2a8b0; --line: #2a2e35; --accent: #6ee7a8; --bg: #0d0f12; }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 2.5rem 1.25rem 4rem;
        background: var(--bg);
        color: var(--fg);
        font: 16px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-text-size-adjust: 100%;
      }
      main { max-width: 46rem; margin: 0 auto; }
      header { border-bottom: 2px solid var(--fg); padding-bottom: 1.25rem; margin-bottom: 2rem; }
      h1 { margin: 0 0 0.25rem; font-size: 1.9rem; letter-spacing: -0.02em; }
      .role { margin: 0 0 0.75rem; font-size: 1.05rem; color: var(--accent); font-weight: 600; }
      .tagline { margin: 0 0 1rem; color: var(--muted); }
      ul.contact { list-style: none; display: flex; flex-wrap: wrap; gap: 0.35rem 1.1rem; margin: 0; padding: 0; font-size: 0.9rem; }
      ul.contact a { color: inherit; }
      section { margin-bottom: 2.25rem; }
      h2 {
        margin: 0 0 0.9rem;
        padding-bottom: 0.35rem;
        border-bottom: 1px solid var(--line);
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
      }
      h3 { margin: 0 0 0.2rem; font-size: 1.02rem; }
      p { margin: 0 0 0.5rem; }
      .meta { margin: 0 0 0.6rem; font-size: 0.85rem; color: var(--muted); }
      .entry { margin-bottom: 1.5rem; page-break-inside: avoid; }
      .entry ul { margin: 0 0 0.5rem; padding-left: 1.15rem; }
      .entry li { margin-bottom: 0.25rem; }
      .stack { font-size: 0.85rem; color: var(--muted); }
      dl { display: grid; gap: 0.7rem; margin: 0; }
      .skill { display: grid; gap: 0.15rem; }
      dt { font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); font-weight: 600; }
      dd { margin: 0; }
      footer { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); }
      @media print {
        body { padding: 0; font-size: 11pt; }
        h2 { break-after: avoid; }
        .entry { break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>${esc(profile.name)}</h1>
        <p class="role">${esc(copy.role)}</p>
        <p class="tagline">${esc(copy.tagline)}</p>
        <ul class="contact">
${contact.map((line) => `          <li>${line}</li>`).join('\n')}
        </ul>
      </header>

      <section>
        <h2>Summary</h2>
        <p>${esc(summary)}</p>
      </section>

      <section>
        <h2>Experience</h2>
${experienceHtml()}
      </section>

      <section>
        <h2>Projects</h2>
${projectsHtml()}
      </section>

      <section>
        <h2>Skills</h2>
        <p class="meta">${technologyCount} technologies across ${skillGroups.length} categories.</p>
        <dl>
${skillsHtml()}
        </dl>
      </section>

      <section>
        <h2>Education</h2>
${educationHtml()}
      </section>

      <footer>
        <p>Generated from the portfolio source of truth — the same content that renders the site, so it cannot drift out of date.</p>
      </footer>
    </main>
  </body>
</html>
`
}

const RESUME_PATHS = new Set(['/resume', '/resume/', '/resume.html'])

/**
 * Emits a dependency-free `resume.html` straight from the content bundle.
 *
 * The point is that it is plain semantic HTML with no JavaScript: an ATS parser
 * gets a clean text stream, and the page still renders if the app bundle fails
 * to load at all.
 */
export function resumePage() {
  const html = () => renderResume()

  return {
    name: 'pf-resume-page',

    generateBundle(this: { emitFile: (file: { type: 'asset'; fileName: string; source: string }) => void }) {
      this.emitFile({ type: 'asset', fileName: 'resume.html', source: html() })
    },

    configureServer(server: { middlewares: { use: (fn: Middleware) => void } }) {
      server.middlewares.use(resumeMiddleware)
    },

    configurePreviewServer(server: { middlewares: { use: (fn: Middleware) => void } }) {
      server.middlewares.use(resumeMiddleware)
    },
  }
}

type Middleware = (
  req: { url?: string },
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (body: string) => void },
  next: () => void,
) => void

const resumeMiddleware: Middleware = (req, res, next) => {
  const path = (req.url ?? '').split('?')[0]
  if (!RESUME_PATHS.has(path)) {
    next()
    return
  }
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.end(renderResume())
}
