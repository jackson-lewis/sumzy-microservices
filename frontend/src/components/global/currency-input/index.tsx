import { ChangeEvent } from 'react'
import styles from './style.module.scss'

export default function CurrencyInput(props: {
  value?: number
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  autoFocus?: boolean
}) {
  return (
    <div className={styles.wrapper}>
      <span>£</span>
      <input
        type="text"
        name="amount"
        inputMode="decimal"
        pattern="[0-9.]*"
        required
        {...props}
      />
    </div>
  )
}