'use client'

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import DateSelector from './date-selector'
import CurrencyInput from '@/components/global/currency-input'
import useExpenses from '@/lib/use-transactions'
import {
  TransactionDirection,
  TransactionFrequency,
} from '@/types'
import styles from './style.module.scss'
import Form from 'next/form'
import { transactionAction } from '@/lib/form-actions'
import { useCategories } from '@/lib/swr'


export default function TransactionDialog() {
  const {
    closeEditModal,
    dialogRef,
    transaction,
    transactionSetup,
    setTransactionSetup
  } = useExpenses()
  const [amountValue, setAmountValue] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<number>()
  const [descValue, setDescValue] = useState<string>('')
  const update = !!transaction
  const [state, formAction, pending] = useActionState(
    transactionAction,
    null
  )
  const { data: categories } = useCategories()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (transaction) {
      setAmountValue(transaction.amount.toString())
      setCategoryValue(transaction.category)
      setDescValue(transaction.description)
    }
  }, [transaction])

  useEffect(() => {
    if (state?.transaction) {
      closeAction()
    }
  }, [state])

  function closeAction() {
    closeEditModal()
    setCategoryValue(0)
    formRef.current?.reset()
  }

  function handleDirectionChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (update) {
      return
    }

    setTransactionSetup((setup) => {
      return [
        event.target.value as TransactionDirection,
        setup[1]
      ]
    })
  }

  function handleFrequencyChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (update) {
      return
    }

    setTransactionSetup((setup) => {
      return [
        setup[0],
        event.target.value as TransactionFrequency
      ]
    })
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <Form action={formAction} ref={formRef}>
        <input
          type="hidden"
          name="update"
          value={update ? 'true' : 'false'}
        />
        <input
          type="hidden"
          name="id"
          value={transaction?.id}
        />
        <fieldset name="direction">
          <div className={[styles.field, styles.type].join(' ')}>
            <div>
              <input
                type="radio"
                name="direction"
                value="income"
                id="direction-income"
                checked={transactionSetup[0] === 'income'}
                onChange={handleDirectionChange}
              />
              <label htmlFor="direction-income">Income</label>
            </div>
            <div>
              <input
                type="radio"
                name="direction"
                value="expense"
                id="direction-expense"
                checked={transactionSetup[0] === 'expense'}
                onChange={handleDirectionChange}
              />
              <label htmlFor="direction-expense">Expense</label>
            </div>
          </div>
        </fieldset>
        <fieldset name="frequency">
          <div className={[styles.field, styles.type].join(' ')}>
            <div>
              <input
                type="radio"
                name="frequency"
                value="one_time"
                id="frequency-one_time"
                checked={transactionSetup[1] === 'one_time'}
                onChange={handleFrequencyChange}
              />
              <label htmlFor="frequency-one_time">One-time</label>
            </div>
            <div>
              <input
                type="radio"
                name="frequency"
                value="recurring"
                id="frequency-recurring"
                checked={transactionSetup[1] === 'recurring'}
                onChange={handleFrequencyChange}
              />
              <label htmlFor="frequency-recurring">Recurring</label>
            </div>
          </div>
        </fieldset>
        <fieldset name="details">
          <CurrencyInput
            autoFocus={true}
            value={Number(amountValue)}
            setAmountValue={setAmountValue}
          />
          <label htmlFor="desc">Description</label>
          <input
            type="text"
            name="description"
            id="desc"
            value={descValue}
            onChange={(event) => setDescValue(event.target.value)}
          />
          {categories ? (
            <div className={styles.field}>
              <label htmlFor="category">Category</label>
              <select
                name="category"
                id="category"
                value={categoryValue}
                required
                onChange={(event) => {
                  setCategoryValue(Number(event.target.value))
                }}
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>Failed to load categories</p>
          )}
          <DateSelector value={transaction?.date} />
          <button
            className={styles.submit}
            disabled={pending}
          >
            {update ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => {
              closeAction()
            }}
          >
            Cancel
          </button>
        </fieldset>
      </Form>
    </dialog>
  )
}
