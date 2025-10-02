// Main Dashboard Page
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { Navigation } from '@/components/Navigation'
import { AddTodoForm } from '@/components/AddTodoForm'
import { TodoItem } from '@/components/TodoItem'
import { Todo, CreateTodoData, ApiResponse } from '@/types'
import { useRouter } from 'next/navigation'

const DashboardPage: React.FC = () => {
  const { token, user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [error, setError] = useState('')

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setTodos(data.data.todos)
      } else {
        setError(data.error || 'Failed to fetch todos')
      }
    } catch (error) {
      console.error('Fetch todos error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Add new todo
  const handleAddTodo = async (todoData: CreateTodoData) => {
    setIsAddingTodo(true)
    setError('')

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setTodos(prev => [data.data.todo, ...prev])
      } else {
        setError(data.error || 'Failed to add todo')
      }
    } catch (error) {
      console.error('Add todo error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsAddingTodo(false)
    }
  }

  // Update todo
  const handleUpdateTodo = async (todoId: string, updates: Partial<Todo>) => {
    setError('')

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setTodos(prev => 
          prev.map(todo => 
            todo.id === todoId ? { ...todo, ...data.data.todo } : todo
          )
        )
      } else {
        setError(data.error || 'Failed to update todo')
      }
    } catch (error) {
      console.error('Update todo error:', error)
      setError('Network error. Please try again.')
    }
  }

  // Delete todo
  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return
    }

    setError('')

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setTodos(prev => prev.filter(todo => todo.id !== todoId))
      } else {
        setError(data.error || 'Failed to delete todo')
      }
    } catch (error) {
      console.error('Delete todo error:', error)
      setError('Network error. Please try again.')
    }
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })

  // Stats
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const activeTodos = totalTodos - completedTodos

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [authLoading, user, router])

  // Fetch todos on component mount
  useEffect(() => {
    if (token) {
      fetchTodos()
    }
  }, [token])

  // Show loading screen while checking auth or loading todos
  if (authLoading || !user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {authLoading ? 'Checking authentication...' : 'Loading your todos...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Todos</h1>
          <p className="text-gray-600">Stay organized and get things done!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
            <div className="text-gray-600">Total Todos</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{activeTodos}</div>
            <div className="text-gray-600">Active Todos</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <AddTodoForm onAdd={handleAddTodo} isLoading={isAddingTodo} />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({totalTodos})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Active ({activeTodos})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Completed ({completedTodos})
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'completed' 
                  ? 'No completed todos yet' 
                  : filter === 'active' 
                  ? 'No active todos' 
                  : 'No todos yet'
                }
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Add your first todo to get started!' 
                  : `Switch to "All" to see your other todos.`
                }
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage