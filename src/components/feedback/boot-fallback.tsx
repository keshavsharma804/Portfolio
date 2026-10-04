import { useI18n } from '@/lib/use-preferences'

export function BootFallback() {
  const { t } = useI18n()
  return (
    <div className="grid min-h-screen place-items-center bg-bg">
      <p className="font-mono text-2xs tracking-label text-fg-subtle uppercase">{t('app.loading')}</p>
    </div>
  )
}
