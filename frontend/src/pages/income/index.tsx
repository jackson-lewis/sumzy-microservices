import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import useExpenses from '@/lib/use-expenses'

export default function IncomePage() {
  const {
    transactions,
    setExpenses,
    showEditModal
  } = useExpenses()

  return (
    <main>
      <h1>Income</h1>
      <CategoryLink />
      <FrequencySelector direction="income" />
      <button
        onClick={() => {
          showEditModal('income', 'one_time')
        }}
      >
        Add
      </button>
      <TransactionsList
        transactions={transactions}
        setExpenses={setExpenses}
        direction="income"
        frequency="one_time"
      />
    </main>
  )
}