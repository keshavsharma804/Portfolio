import { Component, useContext, type ErrorInfo, type ReactNode } from 'react'
import { I18nContext } from '@/lib/preferences-context'

type Labels = {
  kicker: string
  title: string
  body: string
  reload: string
  resume: string
}

const fallbackLabels: Labels = {
  kicker: 'Something broke',
  title: 'This page hit an error and could not finish rendering.',
  body: 'Reloading usually clears it. If it keeps happening, the details are in the browser console.',
  reload: 'Reload page',
  resume: 'View my resume instead',
}

type Props = { children: ReactNode; labels?: Partial<Labels> }
type State = { error: Error | null }

/**
 * Keeps a render-time throw from blanking the whole page.
 *
 * Without this, any error above a route boundary unmounts everything and the
 * visitor gets a blank white document — which is exactly what an ATS parser or
 * a recruiter on a bad network connection would see.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const copy = { ...fallbackLabels, ...this.props.labels }

    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-5 px-6">
        <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{copy.kicker}</p>
        <h1 className="text-balance font-mono text-h2 font-semibold text-fg">{copy.title}</h1>
        <p className="leading-relaxed text-fg-muted">{copy.body}</p>
        <pre className="max-h-48 overflow-auto rounded-lg border border-line bg-surface p-4 font-mono text-2xs whitespace-pre-wrap text-fg-subtle">
          {error.message}
        </pre>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-accent-solid px-4 py-2.5 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
          >
            {copy.reload}
          </button>
          <a
            href="/resume"
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg"
          >
            {copy.resume}
          </a>
        </div>
      </div>
    )
  }
}

/**
 * Same boundary, but it reads the active language when one is available and
 * silently falls back to English when the i18n provider itself is what broke.
 */
export function LocalizedErrorBoundary({ children }: { children: ReactNode }) {
  const i18n = useContext(I18nContext)
  const t = i18n?.t
  if (!t) return <ErrorBoundary>{children}</ErrorBoundary>
  return (
    <ErrorBoundary
      labels={{
        kicker: t('error.kicker'),
        title: t('error.title'),
        body: t('error.body'),
        reload: t('error.reload'),
        resume: t('error.resume'),
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
