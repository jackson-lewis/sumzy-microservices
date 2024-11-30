import Money from '@/components/global/money'
import { Report } from '@/types'
import styles from './style.module.scss'
import ExpenseCategories from './expense-categories'

export default function MonthlySummaryReport({
  report
} : {
  report: Report | null
}) {
  if (!report) {
    return (
      <p>Report could not be found.</p>
    )
  }

  return (
    <>
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