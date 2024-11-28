import { DetailedHTMLProps, HTMLAttributes, useState } from 'react'
import styles from './style.module.scss'
import { Expense } from '@/types'

/**
 * Props are passed to the `<input />` except for `value` and
 * `onChange` which get overridden 
 */
export default function CurrencyInput(props: {
  value?: Expense['amount']
  autoFocus?: boolean
} & DetailedHTMLProps<
  HTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [inputValue, setInputValue] = useState(
    props.value
  )

  const newProps = {
    ...props,
    value: inputValue
  }

  return (
    <div className={styles.wrapper}>
      <span>£</span>
      <input
        type="text"
        name="amount"
        inputMode="decimal"
        pattern="[0-9.]*"
        required
        {...newProps}
        onChange={(event) => {
          setInputValue(Number((event.target as HTMLInputElement).value))
        }}
      />
    </div>
  )
}