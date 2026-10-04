export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  'transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-standard ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variant: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-solid text-white shadow-[0_8px_30px_-12px_var(--pf-accent-glow)] ' +
    'hover:bg-[color-mix(in_oklab,var(--pf-accent)_88%,white)] hover:shadow-[0_10px_38px_-10px_var(--pf-accent-glow)]',
  secondary:
    'border border-line-strong bg-surface text-fg hover:border-[var(--pf-accent-line)] hover:bg-surface-hover',
  ghost: 'text-fg-muted hover:bg-surface-hover hover:text-fg',
  subtle: 'bg-surface text-fg hover:bg-surface-hover',
}

const size: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

export function buttonClass(variantName: ButtonVariant = 'primary', sizeName: ButtonSize = 'md', className?: string) {
  return [base, variant[variantName], size[sizeName], className].filter(Boolean).join(' ')
}
