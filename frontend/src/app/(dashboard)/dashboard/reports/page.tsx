'use client'

import { useSearchParams } from 'next/navigation'
import MonthlySelector from '@/components/reports/monthly-selector'
import MonthlySummaryReport from '@/components/reports/monthly-summary'
import { useReports } from '@/lib/swr'

export function useActiveYear() {
  const searchParams = useSearchParams()
  const today = new Date()

  return searchParams.get('year') || 
    today.getFullYear().toString()
}

export function useActiveMonth() {
  const searchParams = useSearchParams()
  const today = new Date()

  return searchParams.get('month') || 
    (today.getMonth() + 1).toString()
}

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