// API Route: Individual Todo Operations (Update, Delete)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { UpdateTodoData, ApiResponse } from '@/types'

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

// GET: Fetch single todo by ID
export async function GET(
  request: NextRequest,  
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await authenticateUser(request)
    const { id } = await params

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own todos
      },
    })

    if (!todo) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Todo not found',
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { todo },
    }, { status: 200 })

  } catch (error) {
    console.error('Get todo error:', error)
    
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

// PUT: Update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await authenticateUser(request)
    const { id } = await params
    const body: UpdateTodoData = await request.json()
    const { title, description, completed, priority } = body

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTodo) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Todo not found',
      }, { status: 404 })
    }

    // Validation
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Todo title cannot be empty',
        }, { status: 400 })
      }

      if (title.length > 200) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Todo title must be less than 200 characters',
        }, { status: 400 })
      }
    }

    // Update todo
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { todo: updatedTodo },
      message: 'Todo updated successfully',
    }, { status: 200 })

  } catch (error) {
    console.error('Update todo error:', error)
    
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

// DELETE: Delete todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await authenticateUser(request)
    const { id } = await params

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTodo) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Todo not found',
      }, { status: 404 })
    }

    // Delete todo
    await prisma.todo.delete({
      where: { id },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Todo deleted successfully',
    }, { status: 200 })

  } catch (error) {
    console.error('Delete todo error:', error)
    
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