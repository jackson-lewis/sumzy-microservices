import Link, { LinkProps } from 'next/link'
import styles from './style.module.scss'

type ButtonStyle = 'fill' | 'outline'
type ButtonColor = 'green' | 'white'

export type ButtonProps = {
  style?: ButtonStyle
  color?: ButtonColor
}

function mergeClassNames(
  className?: string,
  style: ButtonStyle = 'outline',
  color: ButtonColor = 'white'
) {
  const defaultClassNames = [
    styles.button,
    styles[style],
    styles[color]
  ].join(' ')

  let merged = defaultClassNames

  if (className) {
    merged += ` ${className}`
  }

  return merged
}

export default function LinkButton({
  children,
  style = 'outline',
  color = 'white',
  ...rest
}: ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & React.RefAttributes<HTMLAnchorElement> ) {
  return (
    <Link
      {...rest}
      className={mergeClassNames(rest.className, style, color)}
    >
      {children}
    </Link>
  )
}

export function Button({
  children,
  style = 'outline',
  color = 'white',
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement> ) {
  return (
    <button
      {...rest}
      className={mergeClassNames(rest.className, style, color)}
    >
      {children}
    </button>
  )
}