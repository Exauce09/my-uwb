import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-uwb-red text-white hover:bg-uwb-red-dark shadow-sm shadow-uwb-red/25',
  secondary:
    'bg-uwb-blue text-white hover:bg-uwb-blue-deep shadow-sm shadow-uwb-blue/20',
  outline:
    'border border-white/70 text-white hover:bg-white/10 backdrop-blur-sm',
  ghost:
    'bg-white text-uwb-blue hover:bg-uwb-surface border border-uwb-blue/10',
  gold: 'bg-uwb-gold text-uwb-navy hover:bg-uwb-gold-soft shadow-sm shadow-uwb-gold/30',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = CommonProps & {
  to: string
  href?: undefined
  onClick?: () => void
}

type ButtonAsExternal = CommonProps & {
  href: string
  to?: undefined
  target?: string
  rel?: string
}

export function Button(props: ButtonAsButton | ButtonAsLink | ButtonAsExternal) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
  } = props

  const classes = `inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uwb-gold ${variants[variant]} ${sizes[size]} ${className}`

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={classes}
        target={props.target ?? '_blank'}
        rel={props.rel ?? 'noreferrer'}
      >
        {children}
      </a>
    )
  }

  const { type = 'button', ...rest } = props as ButtonAsButton
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
