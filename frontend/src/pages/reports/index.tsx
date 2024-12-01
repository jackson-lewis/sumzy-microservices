import MonthlySelector from '@/components/reports/monthly-selector'
import MonthlySummaryReport from '@/components/reports/monthly-summary'
import { getExpenseReports } from '@/lib/reports'
import { Report } from '@/types'
import { useEffect, useState } from 'react'

export default function Reports() {
  const [report, setReport] = useState<Report | null>(null)
  const [title, setTitle] = useState('')

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

    const date = new Date(activeYM[0], activeYM[1] - 1)
    const monthYear = date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    })
    setTitle(`${monthYear} Report`)
  }, [activeYM])

  return (
    <main>
      <MonthlySelector
        activeYM={activeYM}
        setActiveYM={setActiveYM}
      />
      <h1>{title}</h1>
      <MonthlySummaryReport report={report} />
    </main>
  )
}