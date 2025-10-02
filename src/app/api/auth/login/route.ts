// API Route: User Login
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { LoginData, ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: LoginData = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user)

    // Return user data (without password) and token
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: 'Login successful',
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}