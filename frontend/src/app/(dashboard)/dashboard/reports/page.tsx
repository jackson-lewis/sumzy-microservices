'use client'

import MonthlySelector from '@/components/reports/monthly-selector'
import MonthlySummaryReport from '@/components/reports/monthly-summary'
import { useReports } from '@/lib/swr'
import { useActiveMonth, useActiveYear } from '@/lib/form-submit'

export default function Reports() {
  const { data: report } = useReports()
  const year = useActiveYear()
  const month = useActiveMonth()

  const date = new Date(Number(year), Number(month) - 1)
  const monthYear = date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <main>
      <MonthlySelector />
      <h1>{monthYear} Report</h1>
      <MonthlySummaryReport report={report} />
    </main>
  )
}