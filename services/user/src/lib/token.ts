import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'

export function generateSignInToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '1d'
  })
}

export function generateEmailVerifyLink(user: User) {
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '2d'
  })

  return `${process.env.FRONTEND_URL}/verify-email?token=${token}`
}

export function verifyEmailToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: number }
}
