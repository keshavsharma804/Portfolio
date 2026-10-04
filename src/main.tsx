import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import { ThemeProvider } from './lib/theme.tsx'
import { I18nProvider } from './lib/i18n.tsx'
import { PlainViewProvider } from './lib/plain-view.tsx'
import { ErrorBoundary, LocalizedErrorBoundary } from './components/feedback/error-boundary.tsx'
import { AppRoot } from './app-root.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The outer boundary catches a crash inside a provider itself, where no
        language is available yet. The inner one handles ordinary component
        crashes in the active language. */}
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <PlainViewProvider>
            <LocalizedErrorBoundary>
              <AppRoot />
            </LocalizedErrorBoundary>
          </PlainViewProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
