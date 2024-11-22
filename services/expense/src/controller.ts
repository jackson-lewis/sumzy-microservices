import { Request, Response } from 'express'
import { Expense } from './model'


export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { amount, category, date } = req.body

  const expense = new Expense({
    userId,
    amount,
    category,
    date
  })

  await expense.save()

  res.status(201).send(expense)
}

export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const expenses = await Expense.find({ userId })

  res.status(200).send(expenses)
}

export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.query
  await Expense.deleteOne({ _id: id })

  res.status(200).send({ success: true })
}

export async function update(req: Request, res: Response) {
  const { _id, amount, category } = req.body
  const updateRes = await Expense.updateOne({ _id }, { amount, category })

  res.status(200).send({ success: !!updateRes.modifiedCount })
}

class ExpenseTest {
  constructor(args: any) {
    console.log('test')
  }
}

export async function createTest(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { amount, category, date } = req.body

  const expense = new ExpenseTest({
    userId,
    amount,
    category,
    date
  })

  // await expense.save()

  res.status(201).send(expense)
}