import { Request, Response } from 'express'
import { User } from './model'
// import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function create(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body

  const existing = await User.findOne({ email })
  
  if (existing) {
    res.status(400).send({ message: 'Email address already in use' })
    return
  }

  // const hashedPassword = await bcrypt.hash(password, 10)
  const hashedPassword = password

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })

  await user.save()

  res.status(201).send({ id: user.id })
}


const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '1h'
  })
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  
  if (!user) {
   res.status(400).send({ message: 'Email address or password invalid' })
   return
  }

  // const isPasswordValid = bcrypt.compare(password, user.password)
  const isPasswordValid = password === user.password

  if (!isPasswordValid) {
    res.status(400).send({ message: 'Email address or password invalid' })
    return
  }

  const token = generateToken(user.id)

  res.status(200).send({ token })
}
