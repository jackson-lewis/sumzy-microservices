import { Report } from '@/types'
import { apiRequest } from './api'

/**
 * Retrieve a list of expenses for the authenticated user.
 */
export async function getExpenseReports(year: number, month: number)
: Promise<Report | Error> {
  return await apiRequest(
    `v1/reporting/${year}/${month}`,
    {},
    true
  )
}