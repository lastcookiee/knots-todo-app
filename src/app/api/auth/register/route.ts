// API Route: User Registration
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { RegisterData, ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: RegisterData = await request.json()
    const { email, name, password, confirmPassword } = body

    // Validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email, password, and confirm password are required',
      }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Passwords do not match',
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Password must be at least 6 characters long',
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Please enter a valid email address',
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User with this email already exists',
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password in response
      },
    })

    // Generate JWT token
    const token = generateToken(user)

    // Return success response
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user,
        token,
      },
      message: 'User registered successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}