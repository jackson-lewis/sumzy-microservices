import { Request, Response } from 'express'
import { Expense } from '../models/expense'
import { sendExpenseEvent } from '../rabbitmq'
import { RootFilterQuery } from 'mongoose'
import { Expense as ExpenseType } from '../../types'
import { formatDate } from '../lib/utils'

export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    type,
    amount,
    category,
    date,
    frequency
  } = req.body

  if (['one_time', 'recurring'].indexOf(type) < 0) {
    res.status(401).send({ 
      message: 'Expense type invalid'
    })
  }

  if (type === 'recurring' && !frequency) {
    res.status(401).send({
      message: 'Field frequency not set for recurring expense'
    })
  }

  const expense = new Expense({
    userId,
    type,
    amount,
    category,
    date,
    frequency
  })

  await expense.save()
  sendExpenseEvent(expense, 'created')

  res.status(201).send(expense)
}


export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    type = 'one_time',
    from,
    to
  }: {
    type?: string
    from?: string
    to?: string
  } = req.query

  if (['one_time', 'recurring'].indexOf(type) < 0) {
    res.status(401).send({ 
      message: 'Expense type invalid'
    })
    return
  }

  const find: RootFilterQuery<ExpenseType> = {
    userId,
    type
  }

  /**
   * Support unix time stamp and YYYY-MM-DD or YYYY/MM/DD
   */
  if (from && to) {
    const fromDate = formatDate(from)
    const toDate = formatDate(to)

    if (fromDate && toDate) {
      find.date = {
        $gte: fromDate.toISOString(),
        $lt: toDate.toISOString()
      }
    }
  }

  const expenses = await Expense
    .find(find)
    .sort({ date: 'desc' })

  res.status(200).send(expenses)
}

export async function deleteExpense(req: Request, res: Response) {
  const { id: _id } = req.query
  const expense = await Expense.findOne({ _id })
  await Expense.deleteOne({ _id })
  sendExpenseEvent(expense, 'deleted')

  res.status(200).send({ success: true })
}

export async function update(req: Request, res: Response) {
  const { _id, amount, category, date } = req.body
  const updateRes = await Expense.updateOne({ _id }, { amount, category, date })

  const expense = await Expense.findOne({ _id })
  sendExpenseEvent(expense, 'updated')

  res.status(200).send({ success: !!updateRes.modifiedCount })
}

export async function batchCreate(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    expenses
  }: {
    expenses: []
  } = req.body

  expenses.map(async (expenseData) => {
    const {
      type,
      amount,
      category,
      date,
      frequency
    } = expenseData

    if (['one_time', 'recurring'].indexOf(type) < 0) {
      res.status(401).send({ 
        message: 'Expense type invalid'
      })
    }
  
    if (type === 'recurring' && !frequency) {
      res.status(401).send({
        message: 'Field frequency not set for recurring expense'
      })
    }
  
    const expense = new Expense({
      userId,
      type,
      amount,
      category,
      date,
      frequency
    })
  
    await expense.save()
    sendExpenseEvent(expense, 'created')
  })

  res.status(201)
}
