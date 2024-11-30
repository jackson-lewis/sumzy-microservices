import Money from '@/components/global/money'
import { Report } from '@/types'
import Category from '../category'
import { useState } from 'react'
import styles from './style.module.scss'
import ExpenseCategories from './expense-categories'

export default function MonthlySummaryReport({
  report
} : {
  report: Report | null
}) {
  const [showExpenseCats, setExpenseCats] = useState(false)
  if (!report) {
    return (
      <p>Report could not be found.</p>
    )
  }

  return (
    <>
      <button onClick={() => {
        setExpenseCats(!showExpenseCats)
      }}>{showExpenseCats ? 'Hide' : 'Show'} expense categories</button>
      <ExpenseCategories
        categories={report.totals.expenseCategories}
      />
      <dl className={styles.totals}>
        <dt>Income</dt>
        <dd>
          <Money amount={report.totals.income} />
        </dd>
        <dt>Expenses</dt>
        <dd>
          <Money amount={report.totals.expense} />
        </dd>
        <dt>Surplus</dt>
        <dd>
          <Money amount={report.totals.surplus} />
        </dd>
      </dl>
    </>
  )    
}