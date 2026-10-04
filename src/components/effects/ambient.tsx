import { MissionBackground } from '@/components/effects/mission-background'
import { SpotlightGlow } from '@/components/effects/spotlight'

/**
 * Page background stack, bottom to top:
 * base colour → mesh + node graph (one canvas) → vignette → dot grid →
 * spotlight reveal → grain. Every layer is inert to pointer events.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg grain">
      <MissionBackground />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,transparent_30%,var(--pf-bg)_76%)]" />

      <div className="dot-grid edge-fade absolute inset-0 opacity-70" />

      <SpotlightGlow />

      <div className="scanlines absolute inset-0 opacity-[0.18]" />
    </div>
  )
}
