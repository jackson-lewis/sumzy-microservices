import { addExpense, sortExpensesByDate, updateExpense } from '@/lib/expense'
import { Expense } from '@/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DateSelector from './date-selector'
import useCategories from '@/lib/use-expenses'
import CurrencyInput from '@/components/global/currency-input'
import styles from './style.module.scss'
import useExpenses from '@/lib/use-expenses'

export default function ExpenseDialog({
  expense,
  setExpenses
}: {
  expense?: Expense
  setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
  const update = !!expense
  const { categories } = useCategories()
  const { closeEditModal, dialogRef } = useExpenses()
  const [categoryValue, setCategoryValue] = useState<string>()
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

          const data = new FormData(event.target as HTMLFormElement)
          const formDataEntries: unknown = Object.fromEntries(data.entries())
          const formDataExpense = formDataEntries as Expense
          let apiData: Expense | Error | { success: boolean }
          let updated: Expense

          if (update) {
            updated = {
              ...expense,
              ...formDataExpense
            }
        
            apiData = await updateExpense(updated)
          } else {
            apiData = await addExpense(formDataExpense)
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

            return newExpenses.sort(sortExpensesByDate)
          })

          closeAction(event.target as HTMLFormElement)
        }}
      >
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
        <button className={styles.submit}>{update ? 'Update' : 'Add'}</button>
        <button
          type="button"
          onClick={(event) => {
            closeAction((event.target as HTMLButtonElement).form as HTMLFormElement)
          }}
        >
          Cancel
        </button>
      </form>
    </dialog>
  )
}
