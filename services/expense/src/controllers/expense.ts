import { Request, Response } from 'express'
import { sendExpenseEvent } from '../rabbitmq'
import { formatDate } from '../lib/utils'
import { Prisma, TransactionType } from '@prisma/client'
import { prisma } from '../prisma'

export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    type,
    amount,
    category,
    date,
    frequency
  }: {
    type: TransactionType
    frequency?: string
    [k: string]: string
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

  const expense = await prisma.expenses.create({
    data: {
      userId: Number(userId as string),
      type,
      amount: Number(amount as string),
      category: Number(category as string),
      date,
      frequency
    }
  })

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
    type?: TransactionType
    from?: string
    to?: string
  } = req.query

  if (['one_time', 'recurring'].indexOf(type) < 0) {
    res.status(401).send({ 
      message: 'Expense type invalid'
    })
    return
  }

  const where: Prisma.ExpensesWhereInput = {
    userId: Number(userId as string),
    type
  }

  /**
   * Support unix time stamp and YYYY-MM-DD or YYYY/MM/DD
   */
  if (from && to) {
    const fromDate = formatDate(from)
    const toDate = formatDate(to)

    if (fromDate && toDate) {
      where.date = {
        gte: fromDate.toISOString(),
        lt: toDate.toISOString()
      }
    }
  }

  const expenses = await prisma.expenses.findMany({
    where
  })
  res.status(200).send(expenses)
}

export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.query
  const expense = await prisma.expenses.delete({
    where: {
      id: Number(id as string)
    }
  })

  sendExpenseEvent(expense, 'deleted')
  res.status(200).send(expense)
}

export async function update(req: Request, res: Response) {
  const {
    id,
    amount,
    category,
    date
  }: {
    [k: string]: string
  } = req.body
  const expense = await prisma.expenses.update({
    where: {
      id: Number(id as string)
    },
    data: {
      amount: Number(amount),
      category: Number(category),
      date
    }
  })

  sendExpenseEvent(expense, 'updated')
  res.status(200).send(expense)
}
