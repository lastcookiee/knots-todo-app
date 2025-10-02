// Type definitions for our application

// User type based on Prisma model
export interface User {
  id: string
  email: string
  name?: string | null
  createdAt: Date
  updatedAt: Date
}

// Todo type based on Prisma model  
export interface Todo {
  id: string
  title: string
  description?: string | null
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Authentication related types
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  name?: string
  password: string
  confirmPassword: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Todo creation/update types
export interface CreateTodoData {
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export interface UpdateTodoData {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}