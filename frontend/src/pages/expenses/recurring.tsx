import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import useExpenses from '@/lib/use-expenses'

export default function RecurringExpenses() {
  const {
    transactions,
    setExpenses,
    showEditModal
  } = useExpenses()

  return (
    <main>
      <h1>Expenses</h1>
      <FrequencySelector direction="expense" />
      <button
        onClick={() => {
          showEditModal('expense', 'recurring')
        }}
      >
        Add
      </button>
      <TransactionsList
        transactions={transactions}
        setExpenses={setExpenses}
        direction="expense"
        frequency="recurring"
      />
    </main>
  )
}