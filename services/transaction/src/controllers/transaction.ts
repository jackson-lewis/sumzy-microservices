import { Request, Response } from 'express'
import { sendTransactionEvent } from '../rabbitmq'
import { formatDate } from '../lib/utils'
import { Prisma, Frequency } from '@prisma/client'
import { prisma } from '../prisma'

export async function create(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    amount,
    category,
    date,
    frequency,
    description
  }: {
    frequency: Frequency
    [k: string]: string
  } = req.body

  const trueDate = new Date(date)

  try {
    const expense = await prisma.transaction.create({
      data: {
        userId: Number(userId as string),
        amount: Number(amount),
        category: Number(category),
        date: trueDate.toISOString(),
        frequency,
        description
      }
    })
  
    sendTransactionEvent(expense, 'created')
    res.status(201).send(expense)
  } catch (error) {
    console.error(error)
    res.status(500).send('Expected error occured')
  }
}


export async function list(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    frequency,
    from,
    to
  }: {
    frequency?: Frequency
    from?: string
    to?: string
  } = req.query

  const where: Prisma.TransactionWhereInput = {
    userId: Number(userId as string)
  }

  if (frequency) {
    where.frequency = frequency
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
    const expenses = await prisma.transaction.findMany({
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
  const expense = await prisma.transaction.delete({
    where: {
      id: Number(id as string)
    }
  })

  sendTransactionEvent(expense, 'deleted')
  res.status(200).send(expense)
}

export async function update(req: Request, res: Response) {
  const {
    id,
    amount,
    category,
    description,
    date
  }: {
    [k: string]: string
  } = req.body
  const trueDate = new Date(date)
  const expense = await prisma.transaction.update({
    where: {
      id: Number(id as string)
    },
    data: {
      amount: Number(amount),
      category: Number(category),
      description,
      date: trueDate
    }
  })

  sendTransactionEvent(expense, 'updated')
  res.status(200).send(expense)
}
