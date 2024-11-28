import Money from '@/components/global/money'
import Category from '@/components/reports/category'
import { getExpenseReports } from '@/lib/reports'
import { Report } from '@/types'
import { useEffect, useState } from 'react'

export default function Reports() {
  const [report, setReport] = useState<Report>()

  useEffect(() => {
    async function getData() {
      const data = await getExpenseReports(2024, 11)

      if (data instanceof Error) {
        alert(data.message)
        return
      }

      setReport(data)
    }
    getData()
  }, [])

  return (
    <main>
      <h1>Monthly Reports</h1>
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