import Money from '@/components/global/money'
import { ComparePeriod, CompareTotal, Report } from '@/types'
import styles from './style.module.scss'
import ExpenseCategories from './expense-categories'
import { useState } from 'react'
import CompareSelector from './compare-selector'


function Total({
  title,
  total,
  compareTotal
} : {
  title: string
  total: number
  compareTotal: CompareTotal | undefined
}) {
  let direction = 'neutral'

  if (compareTotal !== undefined) {
    if (title === 'Expense') {
      if (compareTotal.amount > 0) {
        direction = 'negative'
      } else if (compareTotal.amount < 0) {
        direction = 'positive'
      }
    } else {
      if (compareTotal.amount > 0) {
        direction = 'positive'
      } else if (compareTotal.amount < 0) {
        direction = 'negative'
      }
    }
  }

  return (
    <>
      <dt>{title}</dt>
      <dd className={styles.total}>
        <Money amount={total} />
      </dd>
      {compareTotal !== undefined ? (
        <dd
          className={[
            styles.compare,
            styles[direction]
          ].join(' ')}
        >
          <Money amount={compareTotal.amount} />
          <span>{`${compareTotal.percentage}%`}</span>
        </dd>
      ) : <dd className={styles.compare} />}
    </>
  )
}

function LastUpdatedDate({ date } : { date: Date }) {
  const dateTime = date.toLocaleDateString('en-GB', {
    'dateStyle': 'medium'
  })

  const displayTime = date.toLocaleDateString('en-GB')

  return (
    <p>
      Last updated:
      {' '}
      <time dateTime={dateTime}>{displayTime}</time>
    </p>
  )
}

export default function MonthlySummaryReport({
  report
} : {
  report: Report | null
}) {
  const [comparePeriod, setComparePeriod] = 
    useState<ComparePeriod>('prevMonth')

  if (!report) {
    return (
      <p>Report could not be found.</p>
    )
  }

  return (
    <>
      <LastUpdatedDate date={new Date(report.lastUpdatedDate)} />
      <ExpenseCategories
        categories={report.totals.expenseCategories}
      />
      <dl className={styles.totals}>
        <Total
          title="Income"
          total={report.totals.income}
          compareTotal={report.compare[comparePeriod]?.income}
        />
        <Total
          title="Expense"
          total={report.totals.expense}
          compareTotal={report.compare[comparePeriod]?.expense}
        />
        <Total
          title="Surplus"
          total={report.totals.surplus}
          compareTotal={report.compare[comparePeriod]?.surplus}
        />
      </dl>
      <CompareSelector
        comparePeriod={comparePeriod}
        setComparePeriod={setComparePeriod}
        hasPrevMonthReport={!!report.compare.prevMonth}
        hasYearOverYearReport={!!report.compare.yearOverYear}
      />
    </>
  )    
}