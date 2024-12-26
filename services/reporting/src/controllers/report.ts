import { Request, Response } from 'express'
import {
  TransactionFrequency,
  AggregateType,
  Transaction,
  ComparePeriod,
  ReportTotals,
  CompareTotals,
  Totals,
} from '../types'
import { prisma } from '../prisma'
import { Event, Report } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'


function getEventField(event: Event, field: string) {
  if (event.eventData && typeof event.eventData === 'object') {
    const eventData = event.eventData as JsonObject
    return eventData[field]
  }
  return false
}

/**
 * A report is a monthly summary of expenses.
 */
export async function generateReport(
  userId: string,
  year: number,
  month: number
) {
  console.log(`Generating report for ${year}/${month}`)

  const events = await prisma.event.findMany({
    where: {
      eventData: {
        path: ['userId'],
        equals: Number(userId)
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  if (!events.length) {
    return
  }

  const date = new Date(
    year,
    month - 1
  )

  const endOfMonth = new Date(date)
  endOfMonth.setDate(30)

  const totals: ReportTotals = {
    income: 0,
    expense: 0,
    surplus: 0,
    expenseCategories: {}
  }

  /**
   * Get events by transaction type
   */
  function getEventsByType<T extends AggregateType>(
    aggregateType: T,
    type: TransactionFrequency
  ) {
    const expenses: {
      [k: Transaction['id']]: Event[]
    } = {}
    const deletedExpenses: number[] = []

    ;(events)
      .filter((event) => {
        const TransactionFrequency = getEventField(event, 'type')
        return (
          event.aggregateType === aggregateType &&
          TransactionFrequency === type
        )
      })
      .map((event) => {
        const { aggregateId } = event

        if (event.eventType == 'deleted') {
          deletedExpenses.push(aggregateId)
        }
    
        if (expenses[aggregateId]) {
          expenses[aggregateId].push(event)
        } else {
          expenses[aggregateId] = [event]
        }
      })

    deletedExpenses.forEach((expenseId) => {
      delete expenses[expenseId]
    })

    return Object.values(expenses)
  }

  function filterOneTimeEvents(
    events: Event[][]
  ) {
    return events
      .map((events) => {
        return events.pop()
      })
      .filter((event) => {
        const _transactionDate = getEventField(event, 'date') as string
        if (!_transactionDate) {
          return false
        }
        const transactionDate = new Date(_transactionDate)

        /**
         * Transactions from a previous month may be changes, so this
         * check should always be against the transaction date rather
         * than the event date itself.
         */
        return transactionDate > date && transactionDate < endOfMonth
      })
  }

  function filterRecurringEvents(
    events: Event[][]
  ) {
    return events
      .map((events) => {
        if (!events.length) {
          return
        }

        let latestEvent: Event = null
        
        events.map((event) => {
          const transactionDate = getEventField(event, 'date') as string
          const eventDate = new Date(
            event.eventType === 'created' && transactionDate ?
              transactionDate : event.createdAt
          )

          if (eventDate < endOfMonth) {
            latestEvent = event
          }
        })

        return latestEvent
      })
      .filter(Boolean)
  }

  function calculateTransactionTotals<T extends AggregateType>(
    aggregateType: T,
    TransactionFrequency: TransactionFrequency,
    reducerFn: (event: Event) => void
  ) {
    const events = getEventsByType(aggregateType, TransactionFrequency)

    const filterFn = TransactionFrequency === 'one_time' ?
      filterOneTimeEvents :
      filterRecurringEvents

    filterFn(events).forEach(reducerFn)
  }

  /**
   * Calculate the totals for an aggregate type.
   * 
   * @param aggregateType The aggregate type to calculate
   * @param callback Optional callback function called with
   * `Array.forEach` after main total added
   */
  function calculateTotals<T extends AggregateType>(
    aggregateType: T,
    callback: ((event: Event) => void) | undefined = null
  ) {
    function calculateTotals(event: Event) {
      const amount = getEventField(event, 'amount') as number

      totals[aggregateType] += amount
      if (typeof callback === 'function') {
        callback(event)
      }
    }

    calculateTransactionTotals(aggregateType, 'one_time', calculateTotals)
    calculateTransactionTotals(aggregateType, 'recurring', calculateTotals)
  }

  calculateTotals(
    'expense',
    function(event: Event) {
      const category = getEventField(event, 'category') as number
      const amount = getEventField(event, 'amount') as number

      totals.expenseCategories[category] = amount + 
        (totals.expenseCategories[category] || 0) || 0
    }
  )
  calculateTotals('income')

  totals.surplus = totals.income - totals.expense

  /**
   * Compare this report:
   * - previous month
   * - year on year
   */
  async function compareTotals(
    period: ComparePeriod
  ): Promise<CompareTotals | null> {
    const compareDate = new Date(date)

    if (period === 'prevMonth') {
      if (month === 1) {
        compareDate.setMonth(11)
        compareDate.setFullYear(year - 1)
      } else {
        compareDate.setMonth(month - 2)
      }
    } else {
      compareDate.setFullYear(year - 1)
    }

    const compareReport = await prisma.report.findFirst({
      where: {
        userId: Number(userId),
        date: compareDate
      }
    })

    if (!compareReport) {
      return null
    }

    const compareTotals: ReportTotals = {
      income: compareReport.tIncome,
      expense: compareReport.tExpense,
      surplus: compareReport.tSurplus
    }

    function calculateCompareTotal(type: keyof Totals) {
      const total = totals[type]
      const compareTotal = compareTotals[type]

      if (compareTotal === undefined) {
        return null
      }

      return {
        amount: total - compareTotal,
        percentage: Number((((total - compareTotal) / total) * 100).toFixed(2))
      }
    }

    const returnTotals = {
      income: calculateCompareTotal('income'),
      expense: calculateCompareTotal('expense'),
      surplus: calculateCompareTotal('surplus')
    }

    const allNull = Object
      .values(returnTotals)
      .filter((totalValue) => {
        return !!totalValue
      })

    if (allNull.length > 0) {
      return returnTotals
    }

    return null
  }

  const compare: {
    [k in ComparePeriod]: CompareTotals | null
  } & JsonObject = {
    prevMonth: await compareTotals('prevMonth'),
    yearOverYear: await compareTotals('yearOverYear')
  }

  const lastUpdatedDate = new Date()

  const reportData: Omit<Report, 'id'> = {
    userId: Number(userId),
    tExpense: totals.expense || 0,
    tIncome: totals.income || 0,
    tSurplus: totals.surplus || 0,
    tExpenseCats: totals.expenseCategories,
    compare,
    date,
    lastUpdatedDate
  }

  async function regenerateComparableReport(period: 'nextMonth' | 'yearOverYear') {
    const compareDate = new Date(date)

    if (period === 'nextMonth') {
      if (month === 12) {
        compareDate.setMonth(0)
        compareDate.setFullYear(year + 1)
      } else {
        compareDate.setMonth(month)
      }
    } else {
      compareDate.setFullYear(year + 1)
    }

    const report = await prisma.report.findFirst({
      where: {
        userId: Number(userId),
        date: compareDate
      }
    })

    if (report) {
      await generateReport(
        userId,
        compareDate.getFullYear(),
        compareDate.getMonth() + 1
      )
    }
  }

  const existingReport = await prisma.report.findFirst({
    where: {
      userId: Number(userId),
      date
    }
  })

  if (existingReport) {
    await prisma.report.update({
      where: {
        id: existingReport.id
      },
      data: reportData
    })

    /**
     * update comparable reports
     */
    await regenerateComparableReport('nextMonth')
    await regenerateComparableReport('yearOverYear')

    return reportData
  }

  return await prisma.report.create({
    data: reportData
  })
}


export async function get(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { year, month } = req.params
  const date = new Date(Number(year), Number(month) - 1)
  const report = await prisma.report.findFirst({
    where: {
      userId: Number(userId),
      date
    }
  })

  if (report) {
    res.status(200).send(report)
    return
  }

  res.status(400).send({ message: 'Report not found' })
}


export async function generate(req: Request, res: Response) {
  const userId = req.headers['x-user-id'] as string
  const { year, month } = req.params

  const data = await generateReport(userId, Number(year), Number(month))
  console.log(`handling req for ${year}/${month}`)

  res.status(200).send(data)
}