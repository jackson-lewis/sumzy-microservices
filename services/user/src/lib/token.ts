import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'


type Token = {
  userId: number
  action: 'sign_in' | 'reset_password' | 'verify_email'
}


export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'


export function generateToken(
  userId: Token['userId'],
  action: Token['action'],
  expiresIn: string
) {
  return jwt.sign({ userId, action }, JWT_SECRET, {
    expiresIn
  })
}


export function generateSignInToken(userId: number) {
  return generateToken(userId, 'sign_in', '30d')
}


export function generateEmailVerifyLink(user: User) {
  const token = generateToken(user.id, 'verify_email', '2d')
  return `${process.env.FRONTEND_URL}/verify-email?token=${token}`
}


export function generateResetPasswordLink(user: User) {
  const token = generateToken(user.id, 'reset_password', '2d')
  return `${process.env.FRONTEND_URL}/sign-in/forgot-password/reset?token=${token}`
}

export function verifyToken(token: string, action: Token['action']) {
  const payload = jwt.verify(token, JWT_SECRET) as Token

  if (payload.action !== action) {
    throw new Error('Invalid token action')
  }

  return payload
}
