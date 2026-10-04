import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/cn'
import { buttonClass } from '@/lib/button-style'
import { duration, easing } from '@/lib/tokens'
import { lockScroll, unlockScroll } from '@/lib/scroll-lock'
import { profile } from '@/content/profile'
import { useI18n } from '@/lib/use-preferences'

// The document is a single A4 page (595.276 x 841.89pt), so every iframe here is
// shaped to that ratio. Fitting a differently-proportioned frame is what makes
// Chrome's viewer paint its grey backdrop down both sides and, on the thumbnail,
// grow a scrollbar — neither can happen once the frame matches the page.
const PAGE_RATIO = 'aspect-[595.276/841.89]'
// 880pt of frame per 595.276pt of page: 6.4% of headroom below the sheet, so
// the fitted page is always width-constrained and never overflows vertically.
const PREVIEW_RATIO = 'aspect-[595.276/880]'

// view=FitH fits the whole page width, view=Fit fits the whole page.
const PREVIEW_SRC = `${profile.cv.file}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`
const READER_SRC = `${profile.cv.file}#view=Fit&toolbar=0&navpanes=0&scrollbar=0`

/**
 * Live render of page 1 of the real PDF, cropped to the A4 page itself so the
 * whole sheet is legible. Clicking opens the reader modal. The iframe is inert
 * so the wheel never gets trapped inside the embedded document.
 */
export function CvPreviewCard({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()
  // Closing the reader must hand focus back to the thumbnail that opened it.
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  const ref = useMotionValue(0)
  const ry = useTransform(ref, [-0.5, 0.5], [7, -7])
  const rx = useTransform(ref, [-0.5, 0.5], [5, -5])
  const gx = useTransform(ref, [-0.5, 0.5], ['-30%', '30%'])
  const gy = useTransform(ref, [-0.5, 0.5], ['-30%', '30%'])

  return (
    <>
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        className={cn('group relative', className)}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            ref.set((event.clientX - rect.left) / rect.width - 0.5)
          }}
          onPointerLeave={() => ref.set(0)}
          aria-label={`${t('common.open')} ${profile.cv.label}`}
          className="relative block w-full overflow-hidden rounded-lg bg-white transition-shadow duration-300 hover:shadow-glow"
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={
              {
                background:
                  'radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), color-mix(in oklab, var(--pf-accent) 16%, transparent), transparent 68%)',
                '--gx': gx,
                '--gy': gy,
              } as never
            }
          />

          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none relative block w-full overflow-hidden bg-white shadow-lifted',
              PAGE_RATIO,
            )}
          >
            <iframe
              src={PREVIEW_SRC}
              title=""
              tabIndex={-1}
              aria-hidden="true"
              scrolling="no"
              className={cn('pointer-events-none absolute inset-x-0 top-0 w-full border-0', PREVIEW_RATIO)}
            />
          </span>
        </button>
      </motion.div>

      <CvPreviewModal open={open} onClose={close} />
    </>
  )
}

/**
 * Reader dialog for the whole document.
 *
 * The document is NOT scaled to fit the viewport. Fitting an A4 sheet to a
 * laptop height renders body text at roughly 8px, which is unreadable and
 * forces a browser zoom; zooming then overflows the frame and Chrome's own
 * viewer adds a scrollbar inside the iframe, so the wheel is trapped in a
 * nested scroller with no way out.
 *
 * Instead the sheet is pinned to a legible width and the panel scrolls. The
 * iframe is given the exact A4 aspect ratio with view=Fit, so the page fills
 * its frame edge to edge and the viewer never needs a scrollbar of its own.
 * That leaves exactly one scroller: this panel.
 */
export function CvPreviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const { t } = useI18n()

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    lockScroll()
    panelRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const stops = rootRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!stops || stops.length === 0) {
        event.preventDefault()
        panelRef.current?.focus()
        return
      }

      // The document itself is not tabbable, so the ring is the action bar.
      const first = stops[0]
      const last = stops[stops.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || active === panelRef.current)) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={rootRef}
          role="dialog"
          aria-modal="true"
          aria-label={profile.cv.label}
          className="fixed inset-0 z-modal flex flex-col items-center gap-4 overflow-hidden bg-bg/80 px-4 pt-24 pb-10 backdrop-blur-sm sm:px-8 lg:pb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast / 1000 }}
          onClick={onClose}
        >
          {/*
            The wrapper takes the leftover height so the panel can be capped to
            it, which keeps the action bar pinned below and the sheet scrolling
            behind it.
          */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: duration.base / 1000, ease: easing.entrance }}
            className="flex min-h-0 w-full max-w-[54rem] flex-1 items-start justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              className="max-h-full w-full overflow-y-auto overscroll-contain rounded-lg shadow-lifted ring-1 ring-white/10 outline-none"
            >
              {/* 840px of A4 is ~1.41x print size, so 10pt body copy lands near 14px. */}
              <div className="mx-auto w-full bg-white" style={{ maxWidth: '52.5rem' }}>
                <iframe
                  src={READER_SRC}
                  title={`${profile.name} — ${profile.cv.label}`}
                  scrolling="no"
                  className={cn('block w-full border-0', PAGE_RATIO)}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: duration.base / 1000, ease: easing.entrance }}
            className="flex shrink-0 items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <a
              href={profile.cv.file}
              download={`${profile.name.replace(/\s+/g, '-')}-CV.pdf`}
              className={buttonClass('primary', 'sm')}
            >
              <Download className="size-3.5" aria-hidden="true" />
              {t('cv.download')}
            </a>
            <button type="button" onClick={onClose} className={buttonClass('secondary', 'sm')}>
              {t('nav.close')}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
