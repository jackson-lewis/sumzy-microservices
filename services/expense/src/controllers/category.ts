import { Request, Response } from 'express'
import { prisma } from '../prisma'
import { TransactionFrequency } from '@prisma/client'

export async function createCategory(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { name, type }: {
    type: TransactionFrequency
    [k: string]: string
  } = req.body

  try {
    const category = await prisma.category.create({
      data: {
        userId: Number(userId as string),
        name,
        type
      }
    })
  
    res.status(201).send(category)
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).send({
        message: `Category "${name}" already exists`
      })
    }
    res.status(400).send(error)
  }
}

export async function listCategories(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const categories = await prisma.category.findMany({
    where: {
      userId: Number(userId as string)
    }
  })

  res.status(200).send(categories)
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.query
  const category = await prisma.category.delete({
    where: {
      id: Number(id as string)
    }
  })

  res.status(200).send({ category })
}