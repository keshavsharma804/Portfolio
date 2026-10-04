import { cn } from '@/lib/cn'
import { buttonClass, type ButtonSize, type ButtonVariant } from '@/lib/button-style'

export type { ButtonSize, ButtonVariant }

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({ variant, size, className, type = 'button', ref, ...props }: ButtonProps) {
  return <button ref={ref} type={type} className={cn(buttonClass(variant, size), className)} {...props} />
}
