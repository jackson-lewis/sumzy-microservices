import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

interface AuthRequest extends Request {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'

export default function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    res.status(401).send({ message: 'Authorization header missing' })
    return
  }

  const token = authHeader.split(' ')[1]
  
  if (!token) {
    res.status(401).send({ message: 'Token missing' })
    return
  }

  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload
    console.log({ decoded })

    req.headers['x-user-id'] = decoded.userId
    next()
  } catch (error) {
    res.status(403).send({ message: 'Invalid or expired token' })
  }
}