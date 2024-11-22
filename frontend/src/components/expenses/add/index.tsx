import { addExpense } from '@/lib/expense'
import { Expense } from '@/types'
import { Dispatch, SetStateAction, useRef } from 'react'
import DateSelector from './date-selector'
import useCategories from '@/lib/use-categories'
import CurrencyInput from '@/components/global/currency-input'
import styles from './style.module.scss'

export default function AddExpense({
  setExpenses
}: {
  setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
  const { categories } = useCategories()
  const ref = useRef<HTMLDialogElement>(null)

  function handleDialogClose() {
    const dialog = ref.current

    if (!dialog) {
      console.error('Dialog element not found.')
      return
    }

    dialog.close()
  }

  return (
    <dialog open ref={ref} className={styles.dialog}>
      <p className={styles.heading}>Add new expense</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          const data = new FormData(event.target as HTMLFormElement)
          const expense: unknown = Object.fromEntries(data.entries())
          const added = await addExpense(expense as Expense)
          
          if (added instanceof Error) {
            console.error(added.message)
            return
          }

          setExpenses((expenses) => {
            return [
              ...expenses,
              added
            ]
          })
        }}
      >
        <CurrencyInput autoFocus={true} />
        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select name="category" id="category" required>
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
        <DateSelector />
        <button className={styles.submit}>Add</button>
        <button
          type="button"
          onClick={handleDialogClose}
        >
          Cancel
        </button>
      </form>
    </dialog>
  )
}
