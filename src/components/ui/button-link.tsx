import { cn } from '@/lib/cn'
import { buttonClass, type ButtonSize, type ButtonVariant } from '@/lib/button-style'

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  external?: boolean
}

export function ButtonLink({
  variant,
  size,
  className,
  external,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(buttonClass(variant, size), className)}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
      {...props}
    >
      {children}
    </a>
  )
}
