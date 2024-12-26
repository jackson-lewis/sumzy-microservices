import { addExpense, updateExpense } from '@/lib/expense'
import {
  Transaction,
  TransactionDirection,
  TransactionFrequency,
} from '@/types'
import { ChangeEvent, useEffect, useState } from 'react'
import DateSelector from '../../expenses/dialog/date-selector'
import useCategories from '@/lib/use-expenses'
import CurrencyInput from '@/components/global/currency-input'
import styles from './style.module.scss'
import useExpenses from '@/lib/use-expenses'
import { getFormData } from '@/lib/form-submit'
import { sortTransactionsByDate } from '@/lib/shared'
import { createIncome } from '@/lib/income'


export default function TransactionDialog() {
  const { categories } = useCategories()
  const {
    closeEditModal,
    dialogRef,
    setExpenses,
    transaction,
    transactionSetup,
    setTransactionSetup
  } = useExpenses()
  const [categoryValue, setCategoryValue] = useState<number>()
  const update = !!transaction

  useEffect(() => {
    if (transaction) {
      setCategoryValue(transaction.category)
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
          const direction = formData.get('direction') as TransactionDirection
          const data = getFormData(form)

          let apiData: Transaction | Error | { success: boolean }
          let updated: Transaction

          if (update) {
            updated = {
              ...transaction,
              ...data
            }
        
            apiData = await updateExpense(updated)
          } else {
            if (direction === 'expense') {
              apiData = await addExpense(data)
            } else {
              apiData = await createIncome(data)
            }
          }

          if (apiData instanceof Error) {
            console.error(apiData.message)
            return
          }

          if (direction === 'expense') {
            setExpenses((expenses) => {
              let newExpenses: Transaction[]
  
              if (update) {
                newExpenses = expenses.map((_e) => {
                  if (_e.id === transaction.id) {
                    return updated
                  }
                  return _e
                })
              } else {
                newExpenses = [
                  ...expenses,
                  apiData as Transaction
                ]
              }
  
              return newExpenses.sort(sortTransactionsByDate)
            })
          }

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
                name="type"
                value="one_time"
                id="type-one_time"
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
              <label htmlFor="type-one_time">One-time</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                value="recurring"
                id="type-recurring"
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
              <label htmlFor="type-recurring">Recurring</label>
            </div>
          </div>
        </fieldset>
        <fieldset name="details">
          <CurrencyInput autoFocus={true} value={transaction?.amount} />
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
          {transactionSetup[1] === 'recurring' ? (
            <div className={styles.field}>
              <label htmlFor="frequency">Frequency</label>
              <select name="frequency" id="frequency">
                <option value="monthly">Monthly</option>
              </select>
            </div>
          ) : null}
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
