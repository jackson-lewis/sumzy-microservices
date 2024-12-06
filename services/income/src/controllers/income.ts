import { Request, Response } from 'express'
import { sendIncomeEvent } from '../rabbitmq'
import { prisma } from '../prisma'


export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id'] as string
  const {
    amount,
    type,
    category,
    date,
  }: {
    type: 'one_time' | 'recurring'
    [k: string]: string
  } = req.body

  const trueDate = new Date(date)

  const income = await prisma.incomes.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      type,
      category: Number(category as string),
      date: trueDate.toISOString()
    }
  })

  sendIncomeEvent(income, 'created')
  res.status(201).send(income)
}

export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id'] as string
  const incomes = await prisma.incomes.findMany({
    where: {
      userId: Number(userId)
    }
  })

  res.status(200).send(incomes)
}

export async function deleteIncome(req: Request, res: Response) {
  const { id } = req.query
  const income = await prisma.incomes.delete({
    where: {
      id: Number(id as string)
    }
  })

  sendIncomeEvent(income, 'deleted')
  res.status(200).send({ success: true })
}

export async function update(req: Request, res: Response) {
  const { id, amount, category, date } = req.body
  const income = await prisma.incomes.update({
    where: {
      id: Number(id as string)
    },
    data: {
      amount,
      category,
      date
    }
  })

  sendIncomeEvent(income, 'updated')
  res.status(200).send({ income })
}
