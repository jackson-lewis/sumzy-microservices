import { Request, Response } from 'express'
import { Income } from '../models/income'
import { sendIncomeEvent } from '../rabbitmq'


export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    amount,
    type,
    date,
  } = req.body

  const income = new Income({
    userId,
    amount,
    type,
    date
  })

  await income.save()
  sendIncomeEvent(income, 'created')

  res.status(201).send(income)
}

export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const incomes = await Income.find({ userId }).sort({ date: 'desc' })

  res.status(200).send(incomes)
}

export async function deleteIncome(req: Request, res: Response) {
  const { id: _id } = req.query
  const income = await Income.findOne({ _id })
  await Income.deleteOne({ _id })
  sendIncomeEvent(income, 'deleted')

  res.status(200).send({ success: true })
}

export async function update(req: Request, res: Response) {
  const { _id, amount, category, date } = req.body
  const updateRes = await Income.updateOne({ _id }, { amount, category, date })

  const expense = await Income.findOne({ _id })
  sendIncomeEvent(expense, 'updated')

  res.status(200).send({ success: !!updateRes.modifiedCount })
}
