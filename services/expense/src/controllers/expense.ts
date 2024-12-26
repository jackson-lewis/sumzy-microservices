import { Request, Response } from 'express'
import { sendExpenseEvent } from '../rabbitmq'
import { formatDate } from '../lib/utils'
import { Prisma, TransactionFrequency } from '@prisma/client'
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
    type: TransactionFrequency
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

  const trueDate = new Date(date)

  try {
    const expense = await prisma.expense.create({
      data: {
        userId: Number(userId as string),
        type,
        amount: Number(amount as string),
        category: Number(category as string),
        date: trueDate.toISOString(),
        frequency
      }
    })
  
    sendExpenseEvent(expense, 'created')
    res.status(201).send(expense)
  } catch (error) {
    console.error(error)
    res.status(500).send('Expected error occured')
  }
}


export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    type = 'one_time',
    from,
    to
  }: {
    type?: TransactionFrequency
    from?: string
    to?: string
  } = req.query

  if (['one_time', 'recurring'].indexOf(type) < 0) {
    res.status(401).send({ 
      message: 'Expense type invalid'
    })
    return
  }

  const where: Prisma.ExpenseWhereInput = {
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

  try {
    const expenses = await prisma.expense.findMany({
      where
    })
    res.status(200).send(expenses)
  } catch (error) {
    console.log(error)
    res.status(500).send('Unexpected error occured.')
  }
}

export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.query
  const expense = await prisma.expense.delete({
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
  const trueDate = new Date(date)
  const expense = await prisma.expense.update({
    where: {
      id: Number(id as string)
    },
    data: {
      amount: Number(amount),
      category: Number(category),
      date: trueDate
    }
  })

  sendExpenseEvent(expense, 'updated')
  res.status(200).send(expense)
}
