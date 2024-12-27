import {
  DetailedHTMLProps,
  HTMLAttributes,
  useEffect,
  useState
} from 'react'
import styles from './style.module.scss'
import { Transaction } from '@/types'

/**
 * Props are passed to the `<input />` except for `value`
 * and `onChange` which get overridden 
 */
export default function CurrencyInput(props: {
  value?: Transaction['amount']
  autoFocus?: boolean
} & DetailedHTMLProps<
  HTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(() => {
      const rawValue = props.value
      let parsedValue = ''
    
      if (rawValue) {
        parsedValue = (rawValue < 0 ?
          (rawValue * -1) :
          rawValue).toString()

        console.log({
          raw: rawValue < 0,
          rawValue,
          pos: (rawValue * -1),
          parsedValue })
      }

      return parsedValue
    })
  }, [props])

  const newProps = {
    ...props,
    value: inputValue
  }

  return (
    <div className={styles.wrapper}>
      <span>£</span>
      <input
        type="number"
        name="amount"
        step="0.01"
        required
        {...newProps}
        onChange={(event) => {
          setInputValue(
            (event.target as HTMLInputElement)
              .value
          )
        }}
      />
    </div>
  )
}