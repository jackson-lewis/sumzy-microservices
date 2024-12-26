import { Dispatch, SetStateAction } from 'react'
import styles from './style.module.scss'
import TransactionItem from '../item'
import { Transaction, TransactionDirection, TransactionFrequency } from '@/types'


export default function TransactionsList({
  transactions,
  setExpenses,
  direction,
  frequency
}: {
  transactions: Transaction[],
  setExpenses: Dispatch<SetStateAction<Transaction[]>>
  direction: TransactionDirection
  frequency: TransactionFrequency
}) {
  const filteredTxs = transactions
    .filter((tx) => {
      if (direction === 'expense') {
        return tx.amount < 0
      } else if (direction === 'income') {
        return tx.amount > 0
      }

      return false
    })
    .filter((tx) => {
      return tx.frequency === frequency
    })

  if (filteredTxs.length === 0) {
    return (
      <p>Your tranactions will show up here.</p>
    )
  }

  return (
    <div className={styles.list}>
      {filteredTxs.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          setExpenses={setExpenses}
        />
      ))}
    </div>
  )
}