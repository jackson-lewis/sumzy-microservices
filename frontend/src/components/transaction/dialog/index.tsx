import { ChangeEvent, useEffect, useState } from 'react'
import DateSelector from './date-selector'
import CurrencyInput from '@/components/global/currency-input'
import useExpenses from '@/lib/use-expenses'
import { getFormData } from '@/lib/form-submit'
import { sortTransactionsByDate } from '@/lib/shared'
import {
  createTransaction,
  updateTransaction
} from '@/lib/transactions'
import {
  Transaction,
  TransactionDirection,
  TransactionFrequency,
} from '@/types'
import styles from './style.module.scss'


export default function TransactionDialog() {
  const {
    categories,
    closeEditModal,
    dialogRef,
    setTransactions,
    transaction,
    transactionSetup,
    setTransactionSetup
  } = useExpenses()
  const [amountValue, setAmountValue] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<number>()
  const [descValue, setDescValue] = useState<string>('')
  const update = !!transaction

  useEffect(() => {
    if (transaction) {
      setAmountValue(transaction.amount.toString())
      setCategoryValue(transaction.category)
      setDescValue(transaction.description)
    }
  }, [transaction])

  function closeAction(form: HTMLFormElement) {
    closeEditModal()
    setCategoryValue(0)
    form.reset()
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          const form = event.target as HTMLFormElement
          const formData = new FormData(form)
          const data = getFormData(form)
          const direction = 
            formData.get('direction') as TransactionDirection

          let apiData: Transaction | Error | { success: boolean }
          let updated: Transaction

          if (direction === 'expense') {
            data.amount = data.amount * -1
          }

          if (update) {
            updated = {
              ...transaction,
              ...data
            }
        
            apiData = await updateTransaction(updated)
          } else {
            apiData = await createTransaction(data)
          }

          if (apiData instanceof Error) {
            console.error(apiData.message)
            return
          }

          setTransactions((transactions) => {
            let newTransactions: Transaction[]

            if (update) {
              newTransactions = transactions.map((_e) => {
                if (_e.id === transaction.id) {
                  return updated
                }
                return _e
              })
            } else {
              newTransactions = [
                ...transactions,
                apiData as Transaction
              ]
            }

            return newTransactions.sort(sortTransactionsByDate)
          })

          closeAction(form)
        }}
      >
        <fieldset name="direction">
          <div className={[styles.field, styles.type].join(' ')}>
            <div>
              <input
                type="radio"
                name="direction"
                value="income"
                id="direction-income"
                disabled={update}
                checked={transactionSetup[0] === 'income'}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setTransactionSetup((setup) => {
                    return [
                      event.target.value as TransactionDirection,
                      setup[1]
                    ]
                  })
                }}
              />
              <label htmlFor="direction-income">Income</label>
            </div>
            <div>
              <input
                type="radio"
                name="direction"
                value="expense"
                id="direction-expense"
                disabled={update}
                checked={transactionSetup[0] === 'expense'}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setTransactionSetup((setup) => {
                    return [
                      event.target.value as TransactionDirection,
                      setup[1]
                    ]
                  })
                }}
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
                disabled={update}
                checked={transactionSetup[1] === 'one_time'}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setTransactionSetup((setup) => {
                    return [
                      setup[0],
                      event.target.value as TransactionFrequency
                    ]
                  })
                }}
              />
              <label htmlFor="frequency-one_time">One-time</label>
            </div>
            <div>
              <input
                type="radio"
                name="frequency"
                value="recurring"
                id="frequency-recurring"
                disabled={update}
                checked={transactionSetup[1] === 'recurring'}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setTransactionSetup((setup) => {
                    return [
                      setup[0],
                      event.target.value as TransactionFrequency
                    ]
                  })
                }}
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
          <DateSelector value={transaction?.date} />
          <button
            className={styles.submit}
          >
            {update ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            onClick={(event) => {
              closeAction(
                (event.target as HTMLButtonElement)
                  .form as HTMLFormElement
              )
            }}
          >
            Cancel
          </button>
        </fieldset>
      </form>
    </dialog>
  )
}
