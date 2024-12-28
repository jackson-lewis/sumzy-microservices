import Link, { LinkProps } from 'next/link'
import styles from './style.module.scss'

type ButtonStyle = 'fill' | 'outline'
type ButtonColor = 'green' | 'white'

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
}: Readonly<{
  children: React.ReactNode
  style?: ButtonStyle
  color?: ButtonColor
}> & React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & React.RefAttributes<HTMLAnchorElement> ) {
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
}: Readonly<{
  children: React.ReactNode
  style?: ButtonStyle
  color?: ButtonColor
}> & React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement> ) {
  return (
    <button
      {...rest}
      className={mergeClassNames(rest.className, style, color)}
    >
      {children}
    </button>
  )
}