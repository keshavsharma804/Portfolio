# Portfolio

Personal portfolio for **Keshav Sharma** — Full-Stack AI Developer. A multilingual,
motion-heavy single-page site with a generated, ATS-readable resume.

Built with React 19, TypeScript, Vite, Tailwind CSS v4 and Motion.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5175
```

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Dev server, pinned to port 5175 (`--strictPort`)           |
| `npm run build`     | `tsc -b` typecheck, then production build to `dist/`      |
| `npm run preview`   | Serve the built output, including `/resume`               |
| `npm test`          | Vitest, single run                                        |
| `npm run test:watch`| Vitest in watch mode                                      |
| `npm run lint`      | oxlint                                                    |

The port is pinned in `package.json` rather than passed per-command, so a stale
process on 5175 fails loudly instead of silently moving the site to 5176 and
breaking the desktop launcher.

---

## Architecture

```
src/
  app-root.tsx      Lazy boundary for <App> with the boot fallback
  main.tsx          Entry point: provider tree + error boundaries
  App.tsx           Section composition, Recruiter view, Motion config
  sections/         One file per page section (hero, about, currently, …)
  components/
    data/           Presentational data components (charts, comparisons, story)
    effects/        Decorative backdrops and ambient layers
    feedback/       Error boundary, boot fallback
    hud/            Frame primitives, status bar, side rail
    interactive/    Buttons, toggles, command palette, clipboard
    layout/         Navigation, footer
    motion/         Reveal / stagger wrappers, boot sequence, smooth scroll
    ui/             Section shell, container, modal
  content/          Source of truth: profile.ts + content-en.ts + types
  locales/          UI strings and content overrides for fr / hi / pa
  lib/              Contexts, hooks, tokens, clipboard, utilities
plugins/
  resume-page.ts    Vite plugin that generates /resume from the content bundle
```

### One rule that shapes everything: content lives apart from structure

`src/content/profile.ts` holds facts that never change with the language — names,
dates, tech names, metric values, link URLs.

`src/content/content-en.ts` holds every reader-facing sentence. Other locales
provide a partial override in `src/locales/content-*.ts` and merge over English.

Two rules make that merge safe:

- **Arrays merge by stable `id` / `slug`, never by position.** Reordering a
  locale file cannot silently move a translation onto the wrong entry.
- **Missing keys fall back to English.** A half-translated locale renders
  completely instead of showing raw keys or empty strings.

`mergeContent` and both rules are covered in `src/content/content.test.ts`.

### Adding a language

1. Copy `src/locales/en.ts` to `src/locales/<code>.ts` and type it as `Dictionary`.
2. Copy `src/locales/content-fr.ts` to `src/locales/content-<code>.ts` as a
   `ContentOverride` and fill in what you can.
3. Add the code to `locales` in `src/lib/preferences-context.ts` (the `Locale`
   type derives from it, and the `LanguageToggle` iterates the same list), and
   register the content override in the `OVERRIDES` map in
   `src/lib/use-content.ts`.

`src/locales/locales.test.ts` fails the build if the key sets ever diverge, if a
string is empty, or if an interpolation token is dropped in translation.

---

## Recruiter view

A toggle in the navigation strips the site down to a plain, fast, printable
document: no boot splash, no ambient canvas, no custom cursor, no confetti, no
scroll-linked animation, no achievement triggers.

It is not only a CSS concern. `data-plain` on `<html>` kills CSS animations, but
Motion writes transforms as inline styles from JavaScript, so `App.tsx` also sets
`MotionConfig reducedMotion="always"`. Without that the view still animated.

The preference persists in `localStorage` under `pf-plain`.

Two details worth keeping: achievements are **disabled** in Recruiter view rather
than merely hidden, because the toast is hidden too and a milestone would be
marked "seen" with no feedback; and the command palette stays available, because a
keyboard-driven jump-to-section is exactly what that mode is for.

---

## The `/resume` page

`/resume` is generated at build time by `plugins/resume-page.ts`, straight from
`content-en.ts` and `profile.ts`. Consequences:

- It cannot drift out of date — change the content bundle and rebuild.
- It is semantic HTML with **zero JavaScript and zero external assets**, so an ATS
  parser gets a clean text stream and the page still works if the app bundle
  fails entirely.
- The same HTML is served in dev, in `preview`, and emitted to `dist/resume.html`.

**Hosting note.** `public/_redirects` maps `/resume` → `/resume.html` for Netlify
and Cloudflare Pages. On other hosts add the equivalent:

- Vercel — `vercel.json`: `{ "rewrites": [{ "source": "/resume", "destination": "/resume.html" }] }`
- GitHub Pages — add a `404.html` copy of the resume, or link to `/resume.html`
  directly.

The footer links to `/resume` as "Resume (text)"; the header button opens the
PDF preview of `public/cv.pdf`.

---

## Motion and accessibility

- `prefers-reduced-motion` is respected via `usePrefersReducedMotion` /
  `useReducedMotion`, and again globally through `MotionConfig`.
- The skip link targets `<main id="main" tabIndex={-1}>` so it moves focus, not
  just the viewport.
- Decorative layers are `aria-hidden`; the command palette is a labelled
  `role="dialog"` with arrow-key and Enter handling.
- Two nested error boundaries: an outer one that catches a crash inside a
  provider (where no language is available yet, so it falls back to English) and
  an inner one that renders the fallback in the active language.

---

## Testing

53 tests across four files, all pure Node — no DOM environment needed.

| File                              | Covers                                                        |
| --------------------------------- | ------------------------------------------------------------- |
| `src/content/content.test.ts`     | Merge semantics, id-keyed arrays, reordering, partial overrides, entry/id alignment across locales |
| `src/locales/locales.test.ts`     | Key parity, duplicates, empty strings, section numbering, interpolation tokens |
| `src/lib/util.test.ts`            | `skillLevel`, `cn`, `fill`                                    |
| `plugins/resume-page.test.ts`     | No scripts/handlers, one `h1`, all roles/projects/skills present, no `undefined` output |

```bash
npm test
```

---

## Deployment

`npm run build` produces a fully static `dist/`. No server runtime is required.

```bash
npm run build
npm run preview   # verify /resume and routing before deploying
```

---

## Notes

- Language: English, French, Hindi, Punjabi.
- The `/cv.pdf` preview and the contact form's submit handler need wiring to a
  real endpoint and mail service; both are clearly marked in the code.
