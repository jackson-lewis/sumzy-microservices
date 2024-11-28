import { Request, Response } from 'express'
import { Event } from '../models/event'
import { Report } from '../models/report'
import { Expense } from '../types'

/**
 * A report is a monthly summary of expenses.
 */
export async function generateReport(userId: string) {
  const events = await Event.find({
    'eventData.userId': userId
  })
    .sort({ createdAt: 1 })

  if (!events.length) {
    return
  }

  const expenseDate = new Date(events[0].eventData.date)
  const date = new Date(expenseDate.getFullYear(), expenseDate.getMonth())

  let total = 0
  const categories = {}

  events.map((event) => {
    const expense = event.eventData

    switch (event.eventType) {
      case 'created':
        total += expense.amount

        categories[expense.category] = expense.amount + 
          (categories[expense.category] || 0)
        break
    }
  })

  const reportData = {
    userId,
    total,
    categories,
    date
  }

  const existingReport = await Report.findOne({ userId, date })

  if (existingReport) {
    await Report.updateOne({ _id: existingReport._id }, reportData)
    return
  }

  const report = new Report(reportData)
  await report.save()
}


export async function get(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { year, month } = req.params

  const date = new Date(Number(year), Number(month) - 1)
  const report = await Report.findOne({ userId, date })

  res.status(200).send(report)
}
