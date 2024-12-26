import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import useExpenses from '@/lib/use-expenses'

export default function RecurringIncome() {
  const {
    transactions,
    setExpenses,
    showEditModal
  } = useExpenses()

  return (
    <main>
      <h1>Recurring Incomes</h1>
      <FrequencySelector direction="income" />
      <button
        onClick={() => {
          showEditModal('income', 'recurring')
        }}
      >
        Add
      </button>
      <TransactionsList
        transactions={transactions}
        setExpenses={setExpenses}
        direction="income"
        frequency="recurring"
      />
    </main>
  )
}