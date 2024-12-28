'use client'

import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import { useTx } from '@/lib/swr'

export default function Expenses() {
  const { data } = useTx()

  return (
    <>
      <h1>Expenses</h1>
      <CategoryLink />
      <FrequencySelector direction="expense" />
      <TransactionsList
        transactions={data}
      />
    </>
  )
}