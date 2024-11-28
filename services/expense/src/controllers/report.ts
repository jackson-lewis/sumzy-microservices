import { Request, Response } from 'express'
import { Expense } from '../models/expense'
import { Report } from '../models/report'

export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id'] as string
  const {
    year,
    month
  } = req.body

  const reports = await generateReports(userId, year, month)

  if (Array.isArray(reports)) {
    res.status(201)
    return
  }

  res.status(401).send(reports.message)
}

export async function generateReports(
  userId: string,
  year: number,
  month: number
): Promise<any[] | { message: string }> {
  const startDate = new Date(`${year}-${month}-01`)
  const endDate = new Date(startDate)
  endDate.setMonth(startDate.getMonth() + 1)

  try {
    const report = await Expense.aggregate([
      {
        $match: {
          userId,
          type: "one_time",
          date: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $concat: [
              "$userId",
              "$category"  
            ]
          },
          userId: {
            $first: "$userId"
          },
          category: {
            $first: "$category"
          },
          total: {
            $sum: "$amount"
          }
        }
      },
      {
        $out: {
          db: "expenses",
          coll: "reports"
        }
      }
    ])

    return report
  } catch (error) {
    return error
  }
}


export async function get(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const aggregations = await Report.find({ userId })

  res.status(200).send(aggregations)
}