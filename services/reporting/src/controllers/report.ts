import { Request, Response } from 'express'
import { Event } from '../models/event'
import { Report } from '../models/report'
import {
  TransactionType, 
  Event as EventType, 
  AggregateType,
  Transaction,
} from '../types'

/**
 * A report is a monthly summary of expenses.
 */
export async function generateReport(
  userId: string,
  year: number,
  month: number
) {
  console.log(`Generating report for ${year}/${month}`)
  const events: EventType<AggregateType>[] = 
    await Event.find({
      'eventData.userId': userId
    })
    .sort({ createdAt: 1 })

  if (!events.length) {
    return
  }

  const date = new Date(
    year,
    month - 1
  )

  const endOfMonth = new Date(date)
  endOfMonth.setDate(30)

  const totals: {
    income: number
    expense: number
    surplus: number
    expenseCategories: {
      [k: string]: number
    }
  } = {
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
    type: TransactionType
  ) {
    const expenses: {
      [k: Transaction['_id']]: EventType<T>[]
    } = {}
    const deletedExpenses: string[] = []

    ;(events as EventType<T>[])
      .filter((event) => {
        return (
          event.aggregateType === aggregateType &&
          event.eventData.type === type
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
    events: EventType<AggregateType>[][]
  ) {
    return events
      .map((events) => {
        return events.pop()
      })
      .filter((event) => {
        const transactionDate = new Date(event.eventData.date)

        /**
         * Transactions from a previous month may be changes, so this
         * check should always be against the transaction date rather
         * than the event date itself.
         */
        return transactionDate > date && transactionDate < endOfMonth
      })
  }

  function filterRecurringEvents(
    events: EventType<AggregateType>[][]
  ) {
    return events
      .map((events) => {
        if (!events.length) {
          return
        }

        let latestEvent: EventType = null
        
        events.map((event) => {
          const eventDate = new Date(event.createdAt)

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
    transactionType: TransactionType,
    reducerFn: (event: EventType<T>) => void
  ) {
    const events = getEventsByType(aggregateType, transactionType)

    const filterFn = transactionType === 'one_time' ?
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
    callback: ((event: EventType<AggregateType>) => void) | undefined = null
  ) {
    function calculateTotals(event: EventType<AggregateType>) {
      totals[aggregateType] += event.eventData.amount
      if (typeof callback === 'function') {
        callback(event)
      }
    }

    calculateTransactionTotals(aggregateType, 'one_time', calculateTotals)
    calculateTransactionTotals(aggregateType, 'recurring', calculateTotals)
  }

  calculateTotals(
    'expense',
    function(event: EventType<'expense'>) {
      const { eventData: expense } = event

      totals.expenseCategories[expense.category] = expense.amount + 
        (totals.expenseCategories[expense.category] || 0)
    }
  )
  calculateTotals('income')

  totals.surplus = totals.income - totals.expense

  const reportData = {
    userId,
    totals,
    date
  }

  const existingReport = await Report.findOne({ userId, date })

  if (existingReport) {
    await Report.updateOne({ _id: existingReport._id }, reportData)
    return totals
  }

  const report = new Report(reportData)
  await report.save()

  return totals
}


export async function get(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { year, month } = req.params

  const date = new Date(Number(year), Number(month) - 1)
  const report = await Report.findOne({ userId, date })

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