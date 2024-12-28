'use client'

import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import { useTx } from '@/lib/swr'

export default function Incmoe() {
  const { data } = useTx()

  return (
    <>
      <h1>Income</h1>
      <CategoryLink />
      <FrequencySelector direction="income" />
      <TransactionsList
        transactions={data}
      />
    </>
  )
}