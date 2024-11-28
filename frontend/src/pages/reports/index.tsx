import Money from '@/components/global/money'
import Category from '@/components/reports/category'
import MonthlySelector from '@/components/reports/monthly-selector'
import { getExpenseReports } from '@/lib/reports'
import { Report } from '@/types'
import { useEffect, useState } from 'react'

export default function Reports() {
  const [report, setReport] = useState<Report>()

  const date = new Date()
  const [activeYM, setActiveYM] = useState<[number, number]>([
    date.getFullYear(),
    date.getMonth() + 1
  ])

  useEffect(() => {
    async function getData() {
      const data = await getExpenseReports(activeYM[0], activeYM[1])

      if (data instanceof Error) {
        alert(data.message)
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
          <Money amount={report.total} />
          {Object.keys(report.categories).map((categoryId) => (
            <Category
              key={categoryId}
              categoryId={categoryId}
              total={report.categories[categoryId]}
            />
          ))}
        </>
      ) : null}
    </main>
  )
}