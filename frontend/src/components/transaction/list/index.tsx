import { Dispatch, SetStateAction } from 'react'
import styles from './style.module.scss'
import TransactionItem from '../item'
import { Transaction } from '@/types'


export default function TransactionsList({
  transactions,
  setExpenses
}: {
  transactions: Transaction[] | undefined,
  setExpenses?: Dispatch<SetStateAction<Transaction[]>>
}) {

  if (!transactions || transactions.length === 0) {
    return <p>Your tranactions will show up here.</p>
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  )
}