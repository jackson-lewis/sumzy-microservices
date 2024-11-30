import { Request, Response } from 'express'
import { Event } from '../models/event'
import { Report } from '../models/report'
import {
  Expense,
  ExpenseType, 
  Event as EventType, 
  AggregateType, 
  ExpenseEvent
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

  let total = 0
  const categories = {}

  /**
   * Get expense events by expense type
   */
  function getExpenseEventsByType(type: ExpenseType) {
    const expenses: {
      [k: Expense['_id']]: ExpenseEvent[]
    } = {}
    const deletedExpenses: string[] = []

    ;(events as ExpenseEvent[])
      .filter((event) => {
        return (
          event.aggregateType === 'expense' &&
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

  const oneTimeExpenseEvents = getExpenseEventsByType('one_time')
  const recurringExpenseEvents = getExpenseEventsByType('recurring')

  function calculateTotals(events: ExpenseEvent[]) {
    events
      .forEach((event) => {
        const { eventData: expense } = event
      
        total += expense.amount
    
        categories[expense.category] = expense.amount + 
          (categories[expense.category] || 0)
      })
  }

  /**
   * Handle one-time expenses
   */
  calculateTotals(oneTimeExpenseEvents
    .map((events) => {
      return events.pop()
    })
    .filter((event) => {
      const expenseDate = new Date(event.eventData.date)

      /**
       * Expenses from a previous month may be changes, so this
       * check should always be against the expense date rather
       * than the event date itself.
       */
      return expenseDate > date && expenseDate < endOfMonth
    }))

  /**
   * Handle recurring expenses
   */
  calculateTotals(recurringExpenseEvents
    .map((events) => {
      if (!events.length) {
        return
      }

      let latestEvent = null
      
      events.map((event) => {
        const eventDate = new Date(event.createdAt)

        if (eventDate < endOfMonth) {
          latestEvent = event
        }
      })

      return latestEvent
    })
    .filter(Boolean))

  const reportData = {
    userId,
    total,
    categories,
    date
  }

  const existingReport = await Report.findOne({ userId, date })

  if (existingReport) {
    await Report.updateOne({ _id: existingReport._id }, reportData)
    return {
      total,
      categories
    }
  }

  const report = new Report(reportData)
  await report.save()

  return {
    total,
    categories
  }
}


export async function get(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { year, month } = req.params

  const date = new Date(Number(year), Number(month) - 1)
  const report = await Report.findOne({ userId, date })

  res.status(200).send(report)
}


export async function generate(req: Request, res: Response) {
  const userId = req.headers['x-user-id'] as string
  const { year, month } = req.params

  const data = await generateReport(userId, Number(year), Number(month))

  res.status(200).send(data)
}