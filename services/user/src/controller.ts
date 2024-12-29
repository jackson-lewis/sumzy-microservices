import { Request, Response } from 'express'
// import bcrypt from 'bcrypt'
import { prisma } from './prisma'
import { sendUserSignUpEvent } from './rabbitmq'
import {
  generateEmailVerifyLink,
  generateSignInToken,
  verifyEmailToken
} from './lib/token'



export async function handleVerifyEmailToken(req: Request, res: Response) {
  const { token }: { token: string } = req.body

  try {
    const { userId } = verifyEmailToken(token)

    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        verified: true
      }
    })

    const signInToken = generateSignInToken(user.id)
    res.status(200).send({ signInToken })
  } catch(error) {
    res.status(400).send({ message: error.message })
  }
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const user = await prisma.user.findFirst({
    where: {
      email
    }
  })
  
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

  if (!user.verified) {
    res.status(400).send({ message: 'Email address not verified' })
    return
  }

  const token = generateSignInToken(user.id)

  res.status(200).send({ token })
}


export async function create(req: Request, res: Response) {
  const {
    name,
    email,
    password
  }: {
    [k: string]: string
  } = req.body

  const existingUser = await prisma.user.findFirst({
    where: {
      email
    }
  })
  
  if (existingUser) {
    res.status(400).send({ message: 'Email address already in use' })
    return
  }

  // const hashedPassword = await bcrypt.hash(password, 10)
  const hashedPassword = password

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  const emailVerifyLink = generateEmailVerifyLink(user)
  sendUserSignUpEvent({...user, emailVerifyLink})
  res.status(201).send(user)
}


export async function get(req: Request, res: Response) {
  const userId = req.headers['x-user-id'] as string
  const user = await prisma.user.findFirst({
    where: {
      id: Number(userId)
    }
  })

  const userData = user
  delete userData.password

  res.status(200).send(userData)
}


export async function update(req: Request, res: Response) {
  const id = req.headers['x-user-id'] as string
  const {
    name,
    email
  }: {
    [k: string]: string
  } = req.body
  const user = await prisma.user.update({
    where: {
      id: Number(id as string)
    },
    data: {
      name,
      email
    }
  })

  res.status(200).send(user)
}
