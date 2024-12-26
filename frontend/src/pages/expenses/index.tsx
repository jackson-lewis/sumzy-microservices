import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import useExpenses from '@/lib/use-expenses'

export default function Expenses() {
  const {
    transactions,
    setExpenses,
    showEditModal
  } = useExpenses()

  return (
    <main>
      <h1>Expenses</h1>
      <CategoryLink />
      <FrequencySelector direction="expense" />
      <button onClick={() => showEditModal('expense', 'one_time')}>Add</button>
      <TransactionsList
        transactions={transactions}
        setExpenses={setExpenses}
        direction="expense"
        frequency="one_time"
      />
    </main>
  )
}