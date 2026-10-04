import { Suspense, lazy } from 'react'
import { BootFallback } from '@/components/feedback/boot-fallback'

/*
 * Hero and About stay in the initial chunk because they are above the fold.
 * Everything below is split out so the first paint ships a fraction of the
 * bundle — the homepage was previously one 543 kB block with no splitting.
 */
const App = lazy(() => import('@/App'))

export function AppRoot() {
  return (
    <Suspense fallback={<BootFallback />}>
      <App />
    </Suspense>
  )
}
