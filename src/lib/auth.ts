// Authentication utilities for password hashing and JWT tokens
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@/types'

// Hash password before storing in database
export async function hashPassword(password: string): Promise<string> {
  // Salt rounds: higher = more secure but slower
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password during login
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token for authenticated users
export function generateToken(user: Pick<User, 'id' | 'email'>): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: '7d', // Token expires in 7 days
    }
  )
}

// Verify and decode JWT token
export function verifyToken(token: string): { userId: string; email: string } {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }

  try {
    const decoded = jwt.verify(token, secret) as any
    return {
      userId: decoded.userId,
      email: decoded.email,
    }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}