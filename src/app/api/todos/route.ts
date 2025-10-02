// API Route: Todo CRUD Operations
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { CreateTodoData, ApiResponse } from '@/types'

// Helper function to authenticate user
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    throw new Error('Authorization token required')
  }

  const { userId } = verifyToken(token)
  return userId
}

// GET: Fetch all todos for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateUser(request)

    // Get URL search params for filtering
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')
    const priority = searchParams.get('priority')

    // Build where clause for filtering
    const where: any = { userId }
    
    if (completed !== null) {
      where.completed = completed === 'true'
    }
    
    if (priority) {
      where.priority = priority.toUpperCase()
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [
        { completed: 'asc' }, // Incomplete todos first
        { createdAt: 'desc' }, // Newest first
      ],
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { todos },
    }, { status: 200 })

  } catch (error) {
    console.error('Get todos error:', error)
    
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

// POST: Create new todo
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateUser(request)
    const body: CreateTodoData = await request.json()
    const { title, description, priority } = body

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Todo title is required',
      }, { status: 400 })
    }

    if (title.length > 200) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Todo title must be less than 200 characters',
      }, { status: 400 })
    }

    // Create todo
    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'MEDIUM',
        userId,
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { todo },
      message: 'Todo created successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Create todo error:', error)
    
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