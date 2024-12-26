import ExpensesList from '@/components/expenses/list'
import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import useExpenses from '@/lib/use-expenses'

export default function Expenses() {
  const {
    expenses,
    setExpenses,
    showEditModal
  } = useExpenses()

  return (
    <main>
      <h1>Expenses</h1>
      <CategoryLink direction="expense" />
      <FrequencySelector direction="expense" />
      <button onClick={() => showEditModal()}>Add</button>
      <ExpensesList
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </main>
  )
}