import { Request, Response } from 'express'
import { Expense } from '../models/expense'
import { generateReports } from './report'
import { sendToQueue } from '../rabbitmq'


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

  const genDate = new Date(date)

  await generateReports(
    userId as string,
    genDate.getFullYear(),
    genDate.getMonth() + 1
  )

  sendToQueue(JSON.stringify(expense))

  res.status(201).send(expense)
}

export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    type = 'one_time'
  }: {
    type?: string
  } = req.query

  if (['one_time', 'recurring'].indexOf(type) < 0) {
    res.status(401).send({ 
      message: 'Expense type invalid'
    })
    return
  }

  const expenses = await Expense.find({ userId, type }).sort({ date: 'desc' })

  res.status(200).send(expenses)
}

export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.query
  await Expense.deleteOne({ _id: id })

  res.status(200).send({ success: true })
}

export async function update(req: Request, res: Response) {
  const { _id, amount, category, date } = req.body
  const updateRes = await Expense.updateOne({ _id }, { amount, category, date })

  res.status(200).send({ success: !!updateRes.modifiedCount })
}
