import Money from '@/components/global/money'
import Category from '@/components/reports/category'
import MonthlySelector from '@/components/reports/monthly-selector'
import { getExpenseReports } from '@/lib/reports'
import { Report } from '@/types'
import { useEffect, useState } from 'react'

export default function Reports() {
  const [report, setReport] = useState<Report | null>(null)

  const date = new Date()
  const [activeYM, setActiveYM] = useState<[number, number]>([
    date.getFullYear(),
    date.getMonth() + 1
  ])

  useEffect(() => {
    async function getData() {
      const data = await getExpenseReports(activeYM[0], activeYM[1])

      if (data instanceof Error) {
        setReport(null)
        return
      }

      setReport(data)
    }
    getData()
  }, [activeYM])

  return (
    <main>
      <h1>Monthly Reports</h1>
      <MonthlySelector
        activeYM={activeYM}
        setActiveYM={setActiveYM}
      />
      {report ? (
        <>
          <h2>Income</h2>
          <Money amount={report.totals.income} />
          <h2>Expense</h2>
          <Money amount={report.totals.expense} />
          {Object.keys(report.totals.expenseCategories).map((categoryId) => (
            <Category
              key={categoryId}
              categoryId={categoryId}
              total={report.totals.expenseCategories[categoryId]}
            />
          ))}
          <h2>Surplus</h2>
          <Money amount={report.totals.surplus} />
        </>
      ) : (
        <p>Report could not be found.</p>
      )}
    </main>
  )
}