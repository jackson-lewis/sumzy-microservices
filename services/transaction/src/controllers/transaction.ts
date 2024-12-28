import { Request, Response } from 'express'
import { sendTransactionEvent } from '../rabbitmq'
import { formatDate } from '../lib/utils'
import { Prisma, Frequency, Transaction } from '@prisma/client'
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
    direction,
    frequency,
    from,
    to
  }: {
    direction?: 'expense' | 'income'
    frequency?: Frequency
    from?: string
    to?: string
  } = req.query

  const where: Prisma.TransactionWhereInput = {
    userId: Number(userId as string)
  }

  if (direction === 'expense') {
    where.amount = {
      lt: 0
    }
  } else if (direction === 'income') {
    where.amount = {
      gt: 0
    }
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
      where,
      orderBy: {
        date: 'desc'
      }
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

export async function batch(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const {
    transactions
  }: {
    transactions: Omit<Transaction, 'id'>[]
  } = req.body

  const stored = []
  if (transactions) {
    for (const tx of transactions) {
      const {
        amount,
        category,
        frequency,
        description,
        date
      } = tx
      const trueDate = new Date(date)

      const transaction = await prisma.transaction.create({
        data: {
          userId: Number(userId as string),
          amount: Number(amount),
          category: Number(category),
          date: trueDate.toISOString(),
          frequency,
          description
        }
      })
      stored.push(transaction)
      sendTransactionEvent(transaction, 'created')
    }
  }

  res.status(200).send(stored)
}