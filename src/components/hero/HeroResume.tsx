import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Download, FileText, Mail, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { buttonClass } from '@/lib/button-style'
import { duration, easing } from '@/lib/tokens'
import { lockScroll, unlockScroll } from '@/lib/scroll-lock'
import { usePrefersReducedMotion, useIsFinePointer } from '@/lib/use-media-query'
import { useI18n } from '@/lib/use-preferences'
import { profile } from '@/content/profile'
import { ResumeDocument } from './ResumeDocument'

/**
 * The CV is never a direct download link. Clicking opens a readable document
 * in place; downloading is offered from inside the dialog, once the reader has
 * decided they actually want the file.
 *
 * Hover (or keyboard focus) reveals a genuine miniature of that same document,
 * not a screenshot, so what the popover promises is what the modal delivers.
 */

/* The document lays out at a fixed 640px. The popover shows a 280px window, so
 * 280 / 640 = 0.4375 is the one scale factor that makes it fit edge to edge. */
const PREVIEW_WIDTH = 280
const PREVIEW_HEIGHT = 336
const DOCUMENT_WIDTH = 640
const PREVIEW_SCALE = PREVIEW_WIDTH / DOCUMENT_WIDTH

export function HeroResume() {
  const { t } = useI18n()
  const reduce = usePrefersReducedMotion()
  const fine = useIsFinePointer()

  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="hover"
        className="group relative"
        aria-haspopup="dialog"
      >
        {/*
          `group-hover`/`focus-visible` rather than a JS timer: the popover is
          decoration only (no pointer events, nothing focusable inside), so it
          never needs to stay open for its own sake and a CSS transition cannot
          desync from React state. Skipped on touch, where there is no hover to
          speak of and the tap should just open the document.
        */}
        <span
          className={cn(
            buttonClass('secondary', 'md'),
            'cursor-pointer',
            !reduce && 'group-hover:-translate-y-0.5',
          )}
        >
          <FileText className="size-3.5" aria-hidden="true" />
          {t('nav.cv')}
        </span>

        {fine ? <ResumePopover reduce={reduce} label={profile.cv.label} /> : null}
      </button>

      <ResumeDialog open={open} onClose={close} />
    </>
  )
}

function ResumePopover({ reduce, label }: { reduce: boolean; label: string }) {
  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 block"
      style={{ width: PREVIEW_WIDTH }}
      variants={{
        hidden: { opacity: 0, y: 8, scale: 0.97 },
        shown: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: duration.base / 1000, ease: easing.entrance }}
    >
      <span
        className={cn(
          'block origin-bottom overflow-hidden rounded-lg shadow-lifted',
          'opacity-0 transition-opacity duration-200',
          'group-hover:opacity-100 group-focus-visible:opacity-100',
          // The bar above the sheet, so the popover reads as a document
          // lifting out of the button rather than a floating rectangle.
          'before:absolute before:inset-x-5 before:-bottom-1.5 before:h-1.5 before:rounded-full before:bg-bg-elevated',
        )}
      >
        <span
          className="block overflow-hidden bg-bg-elevated"
          style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
        >
          <span
            className="block origin-top-left"
            style={{
              width: DOCUMENT_WIDTH,
              transform: `scale(${PREVIEW_SCALE})`,
            }}
          >
            <ResumeDocument className="px-6 py-5 font-sans text-fg-muted text-[0.8125rem] leading-[1.6] antialiased" />
          </span>
        </span>
      </span>

      <span className="sr-only">{label}</span>
      {reduce ? null : null}
    </motion.span>
  )
}

function ResumeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

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

      // The document body holds no focusable elements, so the ring is the bar.
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
          aria-labelledby={titleId}
          // `data-lenis-prevent` is what makes the document scrollable at all:
          // the smooth-scroll engine owns the wheel for the page, and a locked
          // scroll makes it `preventDefault` every wheel event before it can
          // reach this panel, so without the attribute the sheet is stuck.
          data-lenis-prevent
          className="fixed inset-x-0 top-0 z-modal flex h-[100dvh] items-start justify-center overflow-hidden bg-bg/88 px-4 pt-[5.5rem] pb-5 backdrop-blur-sm sm:px-6 sm:pb-6 lg:pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast / 1000 }}
          onClick={onClose}
        >
          {/*
            `dvh` rather than `vh`: on a phone with a collapsing URL bar, `vh`
            is the tall viewport, so a vh-capped panel plus page padding pushes
            the footer actions below the fold. dvh tracks what is actually
            visible, which is what "fits on a small window" has to mean.
            The cap is the height the overlay leaves over: 88px of top padding
            clears the floating nav (mt-4 + h-14 = 72px plus a gap) and the
            bottom padding clears the lg status bar, so the sheet is the only
            thing that shrinks and the actions are never pushed off screen.
            No border and no ring anywhere — the sheet is a document, not
            dialog chrome.
          */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: duration.base / 1000, ease: easing.entrance }}
            className="flex max-h-full w-full max-w-[44rem] flex-col overflow-hidden rounded-xl bg-bg-elevated shadow-lifted outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="sr-only">
              {profile.cv.label}
            </h2>

            {/* The one scroller: it takes the leftover height, so the sheet caps
                to the window instead of the window clipping the sheet. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
              <ResumeDocument />
            </div>

            {/*
              Pinned by the flex column above, not by stickiness: the document
              is far taller than a short window, so the actions would scroll out
              of reach if they were an ordinary row inside the sheet.
            */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line bg-bg-elevated/95 px-5 py-3 backdrop-blur-sm sm:px-8">

              <a
                href={profile.links.email}
                className={buttonClass('secondary', 'sm')}
                data-cursor="hover"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                {t('contact.compose')}
              </a>
              <a
                href={profile.cv.file}
                download={`${profile.name.replace(/\s+/g, '-')}-CV.pdf`}
                className={buttonClass('primary', 'sm')}
                data-cursor="hover"
              >
                <Download className="size-3.5" aria-hidden="true" />
                {t('cv.download')}
              </a>
              <button
                type="button"
                onClick={onClose}
                className={cn(buttonClass('ghost', 'sm'), 'ml-auto')}
                data-cursor="hover"
              >
                <X className="size-3.5" aria-hidden="true" />
                {t('nav.close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
