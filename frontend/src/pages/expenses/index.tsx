import ExpensesList from '@/components/expenses/list'
import useExpenses from '@/lib/use-expenses'
import { Link } from 'react-router-dom'

export default function Expenses() {
  const {
    expenses,
    setExpenses,
    showEditModal
  } = useExpenses()

  return (
    <main>
      <h1>Expenses</h1>
      <Link to="/expenses/recurring">Recurring</Link>
      <Link to="/expenses/categories">Categories</Link>
      <button onClick={() => showEditModal()}>Add</button>
      <ExpensesList
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </main>
  )
}