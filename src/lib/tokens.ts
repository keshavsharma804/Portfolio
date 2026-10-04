export const fontFamily = {
  sans: '"Inter Variable", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const

export const fontSize = {
  'display-xl': 'clamp(2.75rem, 1.55rem + 5.2vw, 6rem)',
  'display-lg': 'clamp(2.25rem, 1.5rem + 3.3vw, 4.25rem)',
  h1: 'clamp(2rem, 1.42rem + 2.4vw, 3.25rem)',
  h2: 'clamp(1.7rem, 1.35rem + 1.5vw, 2.5rem)',
  h3: 'clamp(1.3rem, 1.15rem + 0.7vw, 1.625rem)',
  h4: 'clamp(1.075rem, 1.03rem + 0.2vw, 1.2rem)',
  'body-lg': 'clamp(1.0125rem, 0.98rem + 0.17vw, 1.125rem)',
  base: '1rem',
  sm: '0.875rem',
  xs: '0.8125rem',
  '2xs': '0.75rem',
} as const

export const lineHeight = {
  display: '1.02',
  heading: '1.12',
  'heading-lg': '1.2',
  body: '1.65',
  tight: '1.35',
} as const

export const letterSpacing = {
  display: '-0.035em',
  heading: '-0.025em',
  body: '-0.005em',
  label: '0.08em',
} as const

export const spacing = {
  section: 'clamp(4.5rem, 2.5rem + 8vw, 8.5rem)',
  'section-sm': 'clamp(3.5rem, 2rem + 6vw, 6rem)',
  gutter: 'clamp(1.25rem, 0.6rem + 2.6vw, 2.5rem)',
  'nav-height': '4.5rem',
} as const

export const radius = {
  xs: '0.375rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const

export const container = {
  width: '78rem',
  prose: '46rem',
} as const

export const duration = {
  instant: 80,
  fast: 160,
  base: 260,
  slow: 420,
  slower: 640,
} as const

export const easing = {
  standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  entrance: [0.16, 1, 0.3, 1] as [number, number, number, number],
  exit: [0.4, 0, 1, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const

export const layers = {
  base: 0,
  content: 10,
  nav: 50,
  dropdown: 60,
  overlay: 100,
  modal: 110,
  cursor: 120,
  toast: 130,
} as const

export const breakpoint = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
} as const

export const tokens = {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  spacing,
  radius,
  container,
  duration,
  easing,
  layers,
  breakpoint,
} as const

export type Tokens = typeof tokens
