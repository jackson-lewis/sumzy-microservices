import { addExpense, updateExpense } from '@/lib/expense'
import { Transaction, TransactionFrequency } from '@/types'
import { ChangeEvent, useEffect, useState } from 'react'
import DateSelector from './date-selector'
import useCategories from '@/lib/use-expenses'
import CurrencyInput from '@/components/global/currency-input'
import styles from './style.module.scss'
import useExpenses from '@/lib/use-expenses'
import { getFormData } from '@/lib/form-submit'
import { sortTransactionsByDate } from '@/lib/shared'


export default function ExpenseDialog({
  defaultType = 'one_time'
}: {
  defaultType?: TransactionFrequency
}) {
  const { categories } = useCategories()
  const { closeEditModal, dialogRef, transaction, setExpenses } = useExpenses()
  const [categoryValue, setCategoryValue] = useState<number>()
  const [type, setType] = useState(defaultType)
  const update = !!transaction
  const headingPrefix = update ? 'Edit' : 'Add new'

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
      <p className={styles.heading}>{headingPrefix} expense</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          const form = event.target as HTMLFormElement
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
            apiData = await addExpense(data)
          }

          if (apiData instanceof Error) {
            console.error(apiData.message)
            return
          }

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

          closeAction(form)
        }}
      >
        <div className={[styles.field, styles.type].join(' ')}>
          <div>
            <input
              type="radio"
              name="type"
              value="one_time"
              id="type-one_time"
              disabled={update}
              checked={type === 'one_time'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setType(event.target.value as TransactionFrequency)
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
              checked={type === 'recurring'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setType(event.target.value as TransactionFrequency)
              }}
            />
            <label htmlFor="type-recurring">Recurring</label>
          </div>
        </div>
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
        {type === 'recurring' ? (
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
      </form>
    </dialog>
  )
}
