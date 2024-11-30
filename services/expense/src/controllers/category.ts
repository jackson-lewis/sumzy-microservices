import { Request, Response } from 'express'
import { Category } from '../models/category'

export async function createCategory(req: Request, res: Response) {
  const userId = req.headers['x-user-id']
  const { name, type } = req.body

  try {
    const category = new Category({
      userId,
      name,
      type
    })
  
    await category.save()
  
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
  const categories = await Category.find({ userId })

  res.status(200).send(categories)
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.query
  const delRes = await Category.deleteOne({ _id: id })

  res.status(200).send({ success: delRes.deletedCount > 0 })
}