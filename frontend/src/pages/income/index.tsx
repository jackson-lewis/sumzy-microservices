import Date from '@/components/global/date'
import Money from '@/components/global/money'
import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import { getIncomes } from '@/lib/income'
import { Transaction } from '@/types'
import { useEffect, useState } from 'react'

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Transaction[]>([])

  useEffect(() => {
    async function getData() {
      const incomes = await getIncomes()
      if (Array.isArray(incomes)) {
        setIncomes(incomes)
      }

      if (incomes instanceof Error) {
        alert(incomes.message)
      }
    }
    getData()
  }, [])
  return (
    <main>
      <h1>Income</h1>
      <CategoryLink direction="income" />
      <FrequencySelector direction="income" />
      <ul>
        {incomes.map((income) => (
          <li key={income.id}>
            <Money amount={income.amount} />
            <Date date={income.date} />
          </li>
        ))}
      </ul>
    </main>
  )
}