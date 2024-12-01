import { addExpense, updateExpense } from '@/lib/expense'
import { Expense, TransactionType } from '@/types'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import DateSelector from './date-selector'
import useCategories from '@/lib/use-expenses'
import CurrencyInput from '@/components/global/currency-input'
import styles from './style.module.scss'
import useExpenses from '@/lib/use-expenses'
import { getFormDataAs } from '@/lib/form-submit'
import { sortTransactionsByDate } from '@/lib/shared'


export default function ExpenseDialog({
  expense,
  setExpenses,
  defaultType = 'one_time'
}: {
  expense?: Expense
  setExpenses: Dispatch<SetStateAction<Expense[]>>
  defaultType?: TransactionType
}) {
  const update = !!expense
  const { categories } = useCategories()
  const { closeEditModal, dialogRef } = useExpenses()
  const [categoryValue, setCategoryValue] = useState<string>()
  const [type, setType] = useState(defaultType)
  const headingPrefix = update ? 'Edit' : 'Add new'

  useEffect(() => {
    if (expense) {
      setCategoryValue(expense.category)
    }
  }, [expense])

  function closeAction(form: HTMLFormElement) {
    closeEditModal()
    setCategoryValue('')
    form.reset()
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <p className={styles.heading}>{headingPrefix} expense</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          const form = event.target as HTMLFormElement
          const data = getFormDataAs(form, 'expense')

          let apiData: Expense | Error | { success: boolean }
          let updated: Expense

          if (update) {
            updated = {
              ...expense,
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
            let newExpenses: Expense[]

            if (update) {
              newExpenses = expenses.map((_e) => {
                if (_e._id === expense._id) {
                  return updated
                }
                return _e
              })
            } else {
              newExpenses = [
                ...expenses,
                apiData as Expense
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
                setType(event.target.value as TransactionType)
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
                setType(event.target.value as TransactionType)
              }}
            />
            <label htmlFor="type-recurring">Recurring</label>
          </div>
        </div>
        <CurrencyInput autoFocus={true} value={expense?.amount} />
        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={categoryValue}
            required
            onChange={(event) => {
              setCategoryValue(event.target.value)
            }}
          >
            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <DateSelector value={expense?.date} />
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
