// API Route: Get Current User Profile
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authorization token required',
      }, { status: 401 })
    }

    // Verify token and get user info
    const { userId } = verifyToken(token)

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password
      },
    })

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found',
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user },
    }, { status: 200 })

  } catch (error) {
    console.error('Profile error:', error)
    
    // Handle specific JWT errors
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid or expired token',
      }, { status: 401 })
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}