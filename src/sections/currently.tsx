import { SectionShell } from '@/components/ui/section-shell'
import { HudPanel, HudRule } from '@/components/hud/frame'
import { useContent } from '@/lib/use-content'
import { useI18n } from '@/lib/use-preferences'

export function Currently() {
  const { t } = useI18n()
  const { currently } = useContent()

  return (
    <SectionShell
      id="currently"
      index={t('currently.index')}
      path={t('currently.path')}
      title={t('currently.title')}
      description={t('currently.description')}
      aside={
        <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{currently.updated}</p>
      }
    >
      <div className="flex flex-col gap-5">
        <HudRule />
        <div className="grid gap-5 md:grid-cols-3">
          {currently.items.map((item, i) => (
            <HudPanel key={item.id} value={item.label} delay={i * 0.08}>
              <p className="text-sm leading-relaxed text-fg-muted">{item.detail}</p>
            </HudPanel>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
