'use client'

import TransactionItem from '../item'
import { useTx } from '@/lib/swr'
import styles from './style.module.scss'


export default function TransactionsList() {
  const { data } = useTx()

  if (!data || data.length === 0) {
    return <p>Your tranactions will show up here.</p>
  }

  return (
    <div className={styles.list}>
      {data.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  )
}